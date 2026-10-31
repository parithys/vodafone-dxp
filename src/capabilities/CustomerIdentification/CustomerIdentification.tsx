import { GuidedContactStep } from '../../components/patterns/GuidedContactStep';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { IdLookupStep } from '../../components/patterns/IdLookupStep';
import type { IdLookupValue } from '../../components/patterns/idLookupModel';
import type { QidType } from '../../components/domain/QidInput';

/**
 * CUSTOMER IDENTIFICATION - the one application-wide capability for identifying a customer by ID: the agent
 * selects an ID type, scans the document, the capture is sent to MOI for validation, and the validated Identity
 * Details come back, shown in the same card, with the same MOI-validated treatment, in every journey.
 *
 * Journeys mount THIS component and say what their context needs; none of them composes the parts itself.
 *
 *   collectContact  false (default): identify only - ID type, scan, MOI, Identity Details.
 *                   true: also collect the contact details that ride with identification (email, alternate
 *                   phone, preferred language) beneath the Identity Details.
 *
 * The parts it is made of (IdLookupStep, GuidedContactStep, IdentityDetailsCard, MoiResultPanel, useIdLookup,
 * IdScannerPanel) are implementation detail. Add behaviour here, not in a journey.
 */

interface CommonProps {
  /** Which ID types are offered; omitted means all four. */
  allowedIdTypes?: QidType[];
  unavailableIdTypes?: QidType[];
  unavailableIdTypesHint?: string;
  /** Scan first, detecting the type automatically. */
  autoDetectIdType?: boolean;
  /** Typed entry from the start (a keyboard device); the scanner follows as the alternative. */
  manualEntry?: boolean;
  /** Offer to create a new customer when no registry knows the ID (QID, Passport, Diplomatic ID). Default true; off for a journey that acts on a known customer. */
  allowNewCustomer?: boolean;
  /** Scan, then the agent verifies number and expiry against the document, then Fetch (MOI). */
  verifyThenFetch?: boolean;
  /** Handle whoever the scanned ID belongs to as a genuine new customer. */
  asNewCustomer?: boolean;
  /** Identify someone other than the customer on screen (e.g. the actual user of a line): nothing is bound to the context customer. */
  unbound?: boolean;
  /** Demo reader: present this customer's own document and card, without binding the lookup to them. */
  scanAsCustomerId?: string;
  /** Journey opened for a known customer (Customer 360): the customer is this one, whatever ID the scan returned. */
  asCustomerId?: string;
}

export type CustomerIdentificationProps =
  | (CommonProps & {
      collectContact: true;
      value: GuidedContactValue;
      onChange: (value: GuidedContactValue) => void;
      /** Fixed Line evidences a "Get IPTV?" field at this step; other journeys do not. */
      showIptvToggle?: boolean;
    })
  | (CommonProps & {
      collectContact?: false;
      value?: IdLookupValue;
      onChange: (value: IdLookupValue) => void;
    });

export function CustomerIdentification(props: CustomerIdentificationProps) {
  // The capability's one behaviour: the agent verifies the number and expiry against the document, then Fetch (MOI). Every journey gets it
  // unless it says otherwise.
  if (props.collectContact) {
    const { collectContact: _collectContact, verifyThenFetch = true, ...rest } = props;
    return <GuidedContactStep {...rest} verifyThenFetch={verifyThenFetch} />;
  }
  const { collectContact: _collectContact, verifyThenFetch = true, ...rest } = props;
  return <IdLookupStep {...rest} verifyThenFetch={verifyThenFetch} />;
}
