import type { AgentProfile } from '../stores/authStore';
import { getPersona } from './configEngine';
import * as mockDataEngine from './mockDataEngine';

interface UserAgentRecord {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
}

// No real login/session directory exists in the mock data - the seeded
// users-agents.json records stand in for "who's signed in". Each persona names
// its own identity via `identityUserId`, so this is a deterministic 1:1 lookup.
//
// It replaced a keyword match against the persona's name/type, which existed
// only because there were 3 seeded identities for 66 personas and so had to
// guess. That guess collapsed every "manager"/"approver" persona onto one
// record (Rachel Thompson) - documented at the time as an accepted quirk, but
// really a symptom of the undersized directory. With one identity per role it
// would have silently merged five distinct roles and broken the per-agent task
// scoping that reads the same directory, so both the matcher and the quirk are
// gone.
//
// Shared by LoginPage (initial sign-in) and PersonaSwitcher (switching role
// from the profile menu) so the displayed identity always matches the active
// persona in both places.
export async function pickProfileForRole(personaId: string): Promise<AgentProfile> {
  const agents = await mockDataEngine.list<UserAgentRecord>('users-agents');
  const persona = getPersona(personaId);
  const match = agents.find((a) => a.userId === persona?.identityUserId);
  // A role with no agent identity is an error, not a reason to sign the user in as whoever is first in the directory.
  if (!match) throw new Error(`No agent identity is configured for role ${personaId}.`);
  return { userId: match.userId, name: `${match.firstName} ${match.lastName}`, jobTitle: match.jobTitle, team: match.team };
}
