import { Textarea } from '../primitives/Textarea';

interface ActivityCommentsStepProps {
  value: string;
  onChange: (value: string) => void;
}

// Pattern 13: Activity/Comments Finalization Step - terminal wizard step,
// free-text Comments submitted via "Save and Finish," logging an Account
// Activities record (SCR-085/134/162/181/184; FLD-355: "Please note down a
// comment regarding the actions performed - used by other advisors to better
// understand the customer's history.").
export function ActivityCommentsStep({ value, onChange }: ActivityCommentsStepProps) {
  return (
    <Textarea
      label="Comments"
      helperText="Please note down a comment regarding the actions performed."
      placeholder="Enter comments…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
