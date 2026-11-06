import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';
import { REFRESH_ALT } from '../../assets/icons';

/** The Refresh action in the step's title row: reads the number inventory again. The portal's step card carries the same one. */
export function RefreshNumbersButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" compact onClick={onClick}>
      <Icon path={REFRESH_ALT} className="size-4 " />
      Refresh
    </Button>
  );
}
