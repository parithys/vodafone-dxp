import { ActivityCommentsStep } from '../../components/patterns/ActivityCommentsStep';
import { Select } from '../../components/primitives/Select';

/**
 * ACTIVITY COMMENTS - the one application-wide capability that closes a journey: the agent's note on the actions
 * performed, logged as an account activity for other advisors, and - where the journey records how the customer
 * came in - the channel.
 *
 * Journeys mount THIS component (usually through activityStep in wizard/wizardSteps); none of them mounts
 * ActivityCommentsStep or lays out the channel picker itself.
 *
 *   channel   when given, the channel the interaction came through is chosen above the comments.
 */
export interface ActivityCommentsProps {
  value: string;
  onChange: (value: string) => void;
  channel?: { value: string; onChange: (value: string) => void; options: string[] };
}

export function ActivityComments({ value, onChange, channel }: ActivityCommentsProps) {
  if (!channel) return <ActivityCommentsStep value={value} onChange={onChange} />;
  return (
    <div className="space-y-4">
      <Select
        label="Channel"
        value={channel.value}
        onChange={(e) => channel.onChange(e.target.value)}
        options={channel.options.map((c) => ({ value: c, label: c }))}
      />
      <ActivityCommentsStep value={value} onChange={onChange} />
    </div>
  );
}
