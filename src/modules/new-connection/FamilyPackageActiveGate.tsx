import { useEffect, useState } from 'react';
import { AddConnectionModal } from '../../capabilities';
import type { FamilyRole } from '../../engines/familyPackage';
import { familyModalSeen, markFamilyModalSeen } from './familyGateSession';

/**
 * A Family Plan was chosen for a customer who already has an active Family Package. Choosing the plan's card opens the package (what it holds, what is free) in a
 * dialog - by itself only the first time in the session (see familyGateSession). The agent continues by adding a connection to that package instead:
 * "Add To This Package" puts the chosen connection type in the draft, so the journey carries on as a line added to the existing package.
 *
 * Cancelling or closing the dialog leaves the order held, and ONLY THEN is the message said (here, on this page: nowhere else in the journey shows it). It is plain
 * text; "active Family Package" is the link that brings the dialog back. After the dialog has already opened once in the session, the page opens with the message.
 */
export function FamilyPackageActiveGate({ customerId, onAdd }: { customerId: string; onAdd: (familyLine: { packageId: string; role?: FamilyRole }) => void }) {
  const [open, setOpen] = useState(() => !familyModalSeen(customerId));
  useEffect(() => {
    if (open) markFamilyModalSeen(customerId);
  }, [open, customerId]);
  return (
    <>
      {!open && (
        <p role="alert" className="notice-danger pad-row mb-6">
          This customer already has an{' '}
          <button type="button" className="link focus-ring" onClick={() => setOpen(true)}>
            active Family Package
          </button>
          . Further Family Lines can be added to the existing package from Customer 360.
        </p>
      )}
      <AddConnectionModal open={open} alreadyActive onClose={() => setOpen(false)} customerId={customerId} onStart={onAdd} />
    </>
  );
}
