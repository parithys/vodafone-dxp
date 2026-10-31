import { useEffect, useState } from 'react';
import { Button } from '../../components/primitives/Button';

/**
 * "Customise Add-ons", beside Edit Discount once a plan is chosen. Continue from the plan page goes straight on to Number Selection (the add-ons
 * page is passed over); this button is the way to the add-ons page. It sets `customiseAddons`, which makes the add-ons step stop Continue, and
 * moves on once the journey has seen the flag - `goNext` reads the values of the render it belongs to, so it must not be called in the same tick.
 * A pre-bundled plan already includes its extras and accepts none, so it has no button.
 */
export function CustomiseAddonsAction({
  productId,
  preBundled,
  setCustomise,
  goNext,
}: {
  productId: string | undefined;
  preBundled: boolean;
  setCustomise: () => void;
  goNext: () => void;
}) {
  const [going, setGoing] = useState(false);
  useEffect(() => {
    if (!going) return;
    setGoing(false);
    goNext();
    // goNext is recreated each render; `going` is what bounds this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [going]);
  if (!productId || preBundled) return null;
  return (
    <Button
      variant="secondary"
      onClick={() => {
        setCustomise();
        setGoing(true);
      }}
    >
      Customise Add-ons
    </Button>
  );
}
