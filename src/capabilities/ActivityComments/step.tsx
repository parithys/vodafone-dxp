import { ACTIVITY_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { ActivityComments } from './ActivityComments';

/**
 * Activity: the agent's comments, stored under `comments`. Required by default; `required: false` for journeys where
 * the note is optional. `channels` adds the channel picker (stored under `channel`) above the comments.
 */
export function activityStep(opts: { required?: boolean; channels?: string[] } = {}): WizardStep {
  const { required = true, channels } = opts;
  return {
    key: 'activity',
    label: ACTIVITY_LABEL,
    render: ({ values, setValue }) => (
      <ActivityComments
        value={(values.comments as string) ?? ''}
        onChange={(v) => setValue('comments', v)}
        channel={
          channels
            ? { value: (values.channel as string) ?? channels[0], onChange: (c) => setValue('channel', c), options: channels }
            : undefined
 }
      />
    ),
    ...(required ? { isValid: (values) => Boolean((values.comments as string)?.trim()) } : {}),
 };
}
