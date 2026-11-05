import { useState } from 'react';
import { AddConnectionModal } from '../../capabilities';
import { Button } from '../../components/primitives/Button';
import type { FamilyRole } from '../../engines/familyPackage';

/**
 * A Family Plan was chosen for a customer who already has an active Family Package. The package is shown (what it holds, what is free and paid) in a dialog
 * that opens by itself, and the agent continues by adding a connection to that package instead; "Add To This Package" puts the chosen connection type in
 * the draft, so the journey carries on as a line added to the existing package. Closing the dialog leaves the order held, with a button to bring it back.
 */
export function FamilyPackageActiveGate({ customerId, onAdd }: { customerId: string; onAdd: (familyLine: { packageId: string; role: FamilyRole }) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="mb-6">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          View Family Package And Add A Connection
        </Button>
      </div>
      <AddConnectionModal open={open} alreadyActive onClose={() => setOpen(false)} customerId={customerId} onStart={onAdd} />
    </>
  );
}
