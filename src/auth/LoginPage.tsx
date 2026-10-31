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

const ICONS = {
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18 M10.6 10.6a3 3 0 0 0 4.2 4.2 M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9 M6.2 6.2A17.7 17.7 0 0 0 2 12s4 7 10 7c1.4 0 2.7-.3 3.8-.8',
  helpCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.2 9a2.8 2.8 0 1 1 3.9 2.6c-.9.4-1.4 1-1.4 2 M12 17h.01',
  lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
};



// The Vodafone logo: the supplied artwork (public/brand/vodafone-logo-big.svg) - the red speech-mark with the wordmark.
// It scales with its container, so it keeps its proportions at every width.
function VodafoneLogo() {
  return <img src={appPath('/brand/vodafone-logo-big.svg')} alt="Vodafone" className="block w-[28%] min-w-32 max-w-48 h-auto" />;
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
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-charcoal-panel">
      {/* Sign-in panel - ordered after the brand panel on md:+ (DOM order, and so tab order, is unchanged); takes the full width when the brand panel is not shown (phone, tablet). */}
      <div role="main" className={`w-full shrink-0 md:order-2 bg-charcoal-panel text-on-dark flex flex-col px-[8%] py-8 ${showBrandPanel ? 'md:w-[42%] lg:w-[38%]' : ''}`}>
        <div className="my-auto py-10 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <VodafoneMark className="w-10 h-10 shrink-0" />
              <VodafoneWordmark className="h-6 w-auto [&_path]:fill-[var(--on-dark)]" />
            </div>
            <p className="text-on-dark-2 font-semibold uppercase tracking-wide text-[length:var(--fs-caption-upper)] mb-3">Staff Portal</p>
            <h1 className="text-[length:var(--fs-h3)] font-bold leading-tight text-on-dark mb-3">Welcome Back</h1>
            <p className="text-on-dark-2 text-[length:var(--fs-body-lg)]">Sign in to your Vodafone workspace.</p>
          </div>

          <div className="space-y-6" onKeyDown={handleFormKeyDown}>
            {loginError && (
              <div role="alert" className="rounded-[var(--radius-sm)] border border-[var(--on-dark-danger-line)] bg-[var(--on-dark-danger-fill)] px-3 py-2.5 text-[length:var(--fs-caption)] text-on-dark">
                {loginError}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="staff-id" className="text-[length:var(--fs-body)] font-medium text-on-dark">Staff ID</label>
              <input
                id="staff-id"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="e.g. VFQ-12345"
                className="login-field w-full rounded-[var(--field-radius)] border border-on-dark-line-3 bg-on-dark-fill-1 px-4 py-3.5 text-on-dark text-[length:var(--fs-body)] placeholder:text-on-dark-3 hover:border-on-dark-3 focus:outline-none focus-visible:border-[var(--field-focus-border)] focus-visible:shadow-[var(--field-focus-ring)]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-[length:var(--fs-body)] font-medium text-on-dark">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="login-field w-full rounded-[var(--field-radius)] border border-on-dark-line-3 bg-on-dark-fill-1 px-4 py-3.5 pr-12 text-on-dark text-[length:var(--fs-body)] placeholder:text-on-dark-3 hover:border-on-dark-3 focus:outline-none focus-visible:border-[var(--field-focus-border)] focus-visible:shadow-[var(--field-focus-ring)]"
                />
                <Tooltip content={showPassword ? 'Hide password' : 'Show password'} placement="top">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center text-on-dark-2 hover:text-on-dark"
                  >
                    <Icon path={showPassword ? ICONS.eyeOff : ICONS.eye} className="w-5 h-5" />
                  </button>
                </Tooltip>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="self-end text-[length:var(--fs-body)] text-on-dark underline underline-offset-4 hover:opacity-80"
              >
                Forgot password?
              </button>
            </div>

            <Button variant="primary" onClick={handleSignIn} disabled={signingIn} className="w-full !py-4 text-[length:var(--fs-body-lg)]">
              {signingIn ? 'Signing in…' : 'Sign in'}
              {!signingIn && <Icon path={ICONS.arrowRight} className="w-5 h-5" />}
            </Button>

            <div className="flex items-start gap-3 text-on-dark-2 text-[length:var(--fs-body)]">
              <Icon path={ICONS.lock} className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                Authorised staff access only.
                <span className="block">All activity is monitored and logged.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[length:var(--fs-body)] text-on-dark-2">
          <div className="relative">
            <span>Need help? </span>
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              className="text-on-dark underline underline-offset-4 hover:opacity-80"
            >
              Contact IT support
            </button>
            {helpOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-64 rounded-[var(--radius-card)] border border-on-dark-line-3 bg-on-dark-fill-2 backdrop-blur shadow-raised z-[var(--z-popover)] p-4 text-on-dark">
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
        <div className="relative flex-1 px-[6%] py-8 flex flex-col text-on-dark md:order-1 overflow-hidden bg-[var(--login-bg)]">
          <img src={appPath('/brand/login-bg.jpg')} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[image:var(--login-scrim)]" />
          <header className="relative flex items-start justify-between gap-6">
            <VodafoneLogo />
          </header>

          <div className="relative mt-[12%] max-w-[85%]">
            <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1.15] text-on-dark">Together, we move Qatar forward.</h2>
            <p className="mt-3 text-[length:var(--fs-lead)] font-normal text-on-dark">Your people. Your updates. Your day.</p>
          </div>

          <div className="relative mt-[6%] mb-auto">
            <LoginAnnouncements />
          </div>

          <p className="relative pt-8 text-on-dark-2 text-[length:var(--fs-caption)]">Vodafone Qatar W.L.L.</p>
        </div>
      )}

      <ForgotPasswordFlow open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} initialStaffId={staffId} />
    </div>
  );
}
