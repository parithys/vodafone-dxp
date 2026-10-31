import { SignatureCapture } from './SignatureCapture';
import { Badge } from '../primitives/Badge';

export interface SimSwapFormValue {
  signatureDataUrl?: string;
}

interface SimSwapFormStepProps {
  value: SimSwapFormValue;
  onChange: (value: SimSwapFormValue) => void;
}

// UJ-090 (tablet variant): "Sign Contract -> capture signature -> Done ->
// SIM Swap Request Form attached." Only one document type is evidenced here
// (unlike CAF's 3 or MNP's 2 form-type options), so no Select dropdown -
// just the attach-and-sign shape shared with DonorAttachmentStep/CafSignatureCapture.
export function SimSwapFormStep({ value, onChange }: SimSwapFormStepProps) {

  return (
    <div className="space-y-4">
      <div className="card p-4 card-surface">
        <p className="text-fg text-[length:var(--fs-body)] font-medium">SIM Swap Request Form</p>
        <p className="text-fg-2 text-[length:var(--fs-caption)] mt-1">
          By signing below, the subscriber authorizes the SIM Swap request on this account.
        </p>
        {value.signatureDataUrl ? (
          <div className="mt-3 flex items-center gap-3">
            <Badge variant="success">Signed</Badge>
            <img src={value.signatureDataUrl} alt="Signature" className="h-10 border border-border-soft rounded-[var(--radius-sm)]" />
          </div>
        ) : (
          <SignatureCapture onSave={(dataUrl) => onChange({ ...value, signatureDataUrl: dataUrl })} />
        )}
      </div>

    </div>
  );
}
