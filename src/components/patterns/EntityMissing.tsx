import { Link } from 'react-router-dom';

/**
 * What a detail screen shows when its record is not on screen: still loading, or genuinely not found. The two are never
 * confused (a reload or deep link used to flash "not found" while the list was still arriving), and a not-found screen
 * always offers a way back.
 */
export function EntityMissing({
  what,
  loading,
  error,
  onRetry,
  backTo,
  backLabel,
}: {
  what: string;
  loading: boolean;
  /** The load itself failed - distinct from "not found", and offers a retry. */
  error?: boolean;
  onRetry?: () => void;
  backTo: string;
  backLabel: string;
}) {
  if (error) {
    return (
      <div className="p-8 space-y-3" role="alert">
        <p className="text-fg">We could not load this {what} just now.</p>
        <div className="flex items-center gap-4">
          {onRetry && (
            <button type="button" onClick={onRetry} className="text-link font-medium hover:underline">
              Try Again
            </button>
          )}
          <Link to={backTo} className="text-link font-medium hover:underline">
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="p-8 text-fg-2" role="status">
        Loading {what}…
      </div>
    );
  }
  return (
    <div className="p-8 space-y-3">
      <p className="text-fg">We could not find this {what}. It may have been removed, or the link is out of date.</p>
      <Link to={backTo} className="text-link font-medium hover:underline">
        {backLabel}
      </Link>
    </div>
  );
}
