import * as mockDataEngine from '../../engines/mockDataEngine';

// Mock GSMA SGP.22-style activation string (LPA:1$smdp-address$matching-id) - not a real SM-DP+ call, see SimTypeStep on not fabricating an eSIM
// provisioning API. Random per issuance so the QR code is distinct each time.
function generateActivationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let matchingId = '';
  for (let i = 0; i < 16; i++) matchingId += chars[Math.floor(Math.random() * chars.length)];
  return `LPA:1$smdp.vodafone.qa$${matchingId}`;
}

/**
 * Selects an eSIM: a profile with a new activation code. It takes its ICCID from the eSIM stock (a stocked, unassigned "Printed eSIM"), never one in
 * `usedIccids` (another SIM of the same order); with none in stock it stays unknown, shown as "-". The one definition every eSIM selection uses.
 */
export async function issueEsimProfile(usedIccids: readonly string[] = []): Promise<{ iccid?: string; activationCode: string }> {
  await new Promise((r) => setTimeout(r, 500));
  const stock = await mockDataEngine.list<{ iccid: string; type?: string; stockStatus: string; prePaired?: boolean }>('sims').catch(() => []);
  const profile = stock.find((x) => x.type === 'Printed eSIM' && x.stockStatus === 'Available' && !x.prePaired && !usedIccids.includes(x.iccid));
  return { iccid: profile?.iccid, activationCode: generateActivationCode() };
}
