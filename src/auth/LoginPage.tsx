import { useState } from 'react';
import { Icon } from '../components/primitives/Icon';
import { Tooltip } from '../components/primitives/Tooltip';
import { Button } from '../components/primitives/Button';
import { VodafoneMark } from '../components/primitives/VodafoneMark';
import { VodafoneWordmark } from '../components/primitives/VodafoneWordmark';
import { useAuthStore } from '../stores/authStore';
import { usePersonaStore } from '../stores/personaStore';
import { pickProfileForRole } from '../engines/agentProfileEngine';
import { useEnterToSubmit } from '../hooks/useEnterToSubmit';
import { useMinWidth } from '../hooks/useMinWidth';
import { detectDeviceType } from '../lib/deviceType';
import { DEMO_LOGIN_PASSWORD, resolveRoleFromStaffId } from './staffIdRoleMap';
import { ForgotPasswordFlow } from './ForgotPasswordFlow';
import { LoginAnnouncements } from './LoginAnnouncements';
import { appPath } from '../lib/basePath';
import { EYE, EYE_OFF, HELP_CIRCLE, ICONS_ARROW_RIGHT, ICONS_LOCK } from '../assets/icons';

const ICONS = {
  arrowRight: ICONS_ARROW_RIGHT,
  eye: EYE,
  eyeOff: EYE_OFF,
  helpCircle: HELP_CIRCLE,
  lock: ICONS_LOCK,
};



// The Vodafone logo: the supplied artwork (public/brand/vodafone-logo-big.svg) - the red speech-mark with the wordmark.
// It scales with its container, so it keeps its proportions at every width.
function VodafoneLogo() {
  return <img src={appPath('/brand/vodafone-logo-big.svg')} alt="Vodafone" className="login-logo" />;
}

// New auth gate - not evidenced in the source corpus (no SCR- id); implements
// the split-panel login mock supplied directly by the user. The "Sign in with
// SSO" action is fully mocked (no backend/IdP), consistent with every other
// simulated action in this app. Role is not user-selectable: it's derived
// from the entered Staff ID via staffIdRoleMap.ts, then carried through
// post-login the same way a manually picked persona used to be.
//
// Credential validation (Agent 360 BRSD JSM-01 / Annex_02 "Login Failed"
// state): an unrecognised Staff ID or wrong password now genuinely blocks
// sign-in with an inline error, instead of silently defaulting to a role.
// The password check is against a placeholder demo credential
// (DEMO_LOGIN_PASSWORD) - see staffIdRoleMap.ts for why.
//
// JSM-01 itself ("Reuse requirement TT-001-JSM-*") is a reuse-stub in the
// BRSD's own requirements register - it names no inline Acceptance Criteria
// and points at a source document (TT-001-JSM-*) that isn't present in this
// corpus, which the compliance audit flagged as making the requirement
// unverifiable as literally written, independent of whether login itself
// works. Since no code change can supply a missing external document, this
// comment records the concrete, testable behavior this screen actually
// implements, so a future audit has a real AC to check against rather than
// an unresolved stub:
//   1. An agent submits a Staff ID and a password (both required).
//   2. An unrecognised Staff ID is rejected with "Staff ID not recognised."
//      and sign-in does not proceed (handleSignIn, below).
//   3. A recognised Staff ID with the wrong password is rejected with
//      "Incorrect password." and sign-in does not proceed.
//   4. Only when both checks pass does the agent's persona/profile resolve
//      and signIn() fire, matching Annex_02's Login Initiated -> Login
//      Failed -> Login Initiated / Login Initiated -> Authenticated ->
//      Session Active state model.
// Closing this open item fully still requires either the actual TT-001-
// JSM-* text or a formal business sign-off that the above satisfies intent.
export function LoginPage() {
  const signIn = useAuthStore((s) => s.signIn);
  const setActivePersona = usePersonaStore((s) => s.setActivePersona);

  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);


  const handleSignIn = async () => {
    if (signingIn) return;
    setLoginError(null);

    if (!staffId.trim() || !password) {
      setLoginError('Enter your Staff ID and password.');
      return;
    }

    setSigningIn(true);
    const resolvedRole = resolveRoleFromStaffId(staffId);
    if (!resolvedRole) {
      setLoginError('Staff ID not recognised.');
      setSigningIn(false);
      return;
    }
    if (password !== DEMO_LOGIN_PASSWORD) {
      setLoginError('Incorrect password.');
      setSigningIn(false);
      return;
    }

    // The profile first, then the persona: a failed lookup must not leave a role written with no identity behind it.
    let profile;
    try {
      profile = await pickProfileForRole(resolvedRole.personaId);
    } catch (e) {
      console.error('Sign-in failed', e);
      setLoginError('This Staff ID has no agent identity configured.');
      setSigningIn(false);
      return;
    }
    setActivePersona(resolvedRole.personaId);

    // Land every sign-in on the Dashboard.
    //
    // <BrowserRouter> is mounted by App only once isAuthenticated flips, so it
    // reads window.location at that moment - whatever URL the browser happened
    // to be left on. Signing out at /mobile/service-management and back in therefore
    // dropped you straight back there, skipping the landing page entirely, and
    // could drop a role onto a destination its approach doesn't even include.
    //
    // This uses the History API rather than useNavigate deliberately: LoginPage
    // renders OUTSIDE the router (App returns it before <BrowserRouter>), so no
    // router hook is available here. Rewriting the URL before signIn() means the
    // router mounts already pointing at '/', so there is no visible redirect.
    const homePath = appPath('/');
    if (window.location.pathname !== homePath || window.location.search) {
      window.history.replaceState(null, '', homePath);
    }

    signIn(staffId, profile);
  };

  const handleFormKeyDown = useEnterToSubmit(!signingIn, handleSignIn);
  // The brand story is for the web layout only: a phone or tablet - by window width (below lg) or by touch hardware, which
  // keeps a landscape tablet out too - shows just the sign-in form.
  const showBrandPanel = useMinWidth(1024) && detectDeviceType() === 'web';

  // Layout follows the staff-portal design: the brand story on the left (about 60% of the width), the sign-in form on a
  // white panel on the right. Only the presentation differs from before - the handlers, validation, error display and
  // field ids are the same ones as above.
  return (
    <div className="login-shell">
      {/* Sign-in panel - ordered after the brand panel on md:+ (DOM order, and so tab order, is unchanged); takes the full width when the brand panel is not shown (phone, tablet). */}
      <div role="main" className={`login-brand-panel ${showBrandPanel ? 'md:w-[42%] lg:w-[38%]' : ''}`}>
        <div className="my-auto py-10 space-y-8">
          <div>
            <div className="row mb-6">
              <VodafoneMark className="size-10 shrink-0" />
              <VodafoneWordmark className="h-6 w-auto [&_path]:fill-[var(--on-dark)]" />
            </div>
            <p className="text-on-dark-2 font-semibold label-caps mb-3">Staff Portal</p>
            <h1 className="login-title mb-3">Welcome Back</h1>
            <p className="text-on-dark-2 text-[length:var(--fs-body-lg)]">Sign in to your Vodafone workspace.</p>
          </div>

          <div className="space-y-6" onKeyDown={handleFormKeyDown}>
            {loginError && (
              <div role="alert" className="login-alert">
                {loginError}
              </div>
            )}
            <div className="stack gap-2">
              <label htmlFor="staff-id" className="text-[length:var(--fs-body)] font-medium text-on-dark">Staff ID</label>
              <input
                id="staff-id"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="e.g. VFQ-12345"
                className="login-field login-input"
              />
            </div>

            <div className="stack gap-2">
              <label htmlFor="login-password" className="text-[length:var(--fs-body)] font-medium text-on-dark">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="login-field login-input pr-12"
                />
                <Tooltip content={showPassword ? 'Hide password' : 'Show password'} placement="top">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 center-y icon-button-on-dark"
                  >
                    <Icon path={showPassword ? ICONS.eyeOff : ICONS.eye} className="size-5 " />
                  </button>
                </Tooltip>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="self-end text-[length:var(--fs-body)] link-on-dark"
              >
                Forgot password?
              </button>
            </div>

            <Button variant="primary" onClick={handleSignIn} disabled={signingIn} className="w-full !py-4 text-[length:var(--fs-body-lg)]">
              {signingIn ? 'Signing in…' : 'Sign in'}
              {!signingIn && <Icon path={ICONS.arrowRight} className="size-5 " />}
            </Button>

            <div className="row-start text-on-dark-2 text-[length:var(--fs-body)]">
              <Icon path={ICONS.lock} className="icon-md mt-0.5" />
              <p>
                Authorised staff access only.
                <span className="block">All activity is monitored and logged.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative login-footer">
          <div className="relative">
            <span>Need help? </span>
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              className="link-on-dark"
            >
              Contact IT support
            </button>
            {helpOpen && (
              <div className="on-dark-popover">
                <p className="text-on-dark font-medium mb-1">Help &amp; support</p>
                <p className="text-on-dark-2 text-[length:var(--fs-body)]">
                  Contact the IT Service Desk at <span className="text-link">servicedesk@vodafone.qa</span> or extension 4100 for platform issues.
                </p>
              </div>
            )}
          </div>
          <span className="text-[length:var(--fs-caption)] text-on-dark-3">VFQ-DXP v3.4.1</span>
        </div>
      </div>

      {/* Brand panel - the Doha skyline photo (public/brand/login-bg.jpg, Hongbin on Unsplash, Unsplash License) under a
          navy scrim that is darkest where the headline and the update cards sit. Not rendered on a phone or tablet. */}
      {showBrandPanel && (
        <div className="login-stage">
          <img src={appPath('/brand/login-bg.jpg')} alt="" aria-hidden="true" className="cover-fill" />
          <div className="absolute inset-0 bg-[image:var(--login-scrim)]" />
          <header className="relative split-top gap-6">
            <VodafoneLogo />
          </header>

          <div className="relative mt-[12%] max-w-[85%]">
            <h2 className="login-heading">Together, we move Qatar forward.</h2>
            <p className="mt-3 login-lead">Your people. Your updates. Your day.</p>
          </div>

          <div className="relative mt-[6%] mb-auto">
            <LoginAnnouncements />
          </div>

          <p className="login-footnote">Vodafone Qatar W.L.L.</p>
        </div>
      )}

      <ForgotPasswordFlow open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} initialStaffId={staffId} />
    </div>
  );
}
