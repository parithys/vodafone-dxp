import { formatDateTime } from '../../../lib/format';
import { EmptyState } from '../../../components/primitives/EmptyState';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { Input } from '../../../components/primitives/Input';
import type { Activity } from './ticketDetailModel';

interface Props {
  activities: Activity[];
  closeActivity: (index: number) => void;
  activityText: string;
  setActivityText: (v: string) => void;
  addManualActivity: () => void;
}

export function TicketActivitiesTab({ activities, closeActivity, activityText, setActivityText, addManualActivity }: Props) {
  return (
      <div className="space-y-3">
        {activities.length === 0 && <EmptyState compact message="No activities logged yet." />}
        {activities.map((a, i) => (
          <div key={i} className="row-between row-rule pb-2">
            <div>
              <span className="body-text">{a.description}</span>
              <span className="block caption-muted">{a.type} · {a.createdBy} · {formatDateTime(a.createdAt)}</span>
            </div>
            {a.open ? (
              <Button variant="secondary" compact onClick={() => closeActivity(i)}>Close</Button>
            ) : (
              <Badge variant="filled-neutral">Closed</Badge>
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Input aria-label="Log a manual activity" placeholder="Log a manual activity…" value={activityText} onChange={(e) => setActivityText(e.target.value)} className="flex-1" />
          <Button variant="secondary" onClick={addManualActivity} disabled={!activityText.trim()}>Add</Button>
        </div>
      </div>
  );
}
