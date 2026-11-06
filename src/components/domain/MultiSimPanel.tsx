import { useEffect, useRef, useState } from 'react';
import { Button } from '../primitives/Button';
import { SimSerialScanner } from './SimSerialScanner';
import { issueEsimProfile } from './esimProfile';
import type { SimTypeValue } from './SimTypeStep';
import type { DeviceType } from '../../lib/deviceType';

interface MultiSimPanelProps {
  /** How many Multi-SIMs the order provisions. */
  count: number;
  /** The SIMs provisioned so far, in the order they were added. */
  value: SimTypeValue[];
  onChange: (value: SimTypeValue[]) => void;
  device?: DeviceType;
  /** The order will be held for approval, so an eSIM's QR code is released on approval rather than on submission. */
  approvalRequired?: boolean;
  /** Serials of the order's other SIMs (the primary's): a Multi-SIM cannot take one. */
  otherSerials?: readonly string[];
  /** ICCIDs of the order's other eSIMs (the primary's). */
  otherIccids?: readonly string[];
}

/**
 * ONE panel for all of an order's Multi-SIMs: a single barcode field that takes SIM after SIM, a single Select eSIM action, and, under the field or the button it came from, each SIM
 * provisioned so far as its own entry (SIM Type, SIM Serial Number, a Remove) - as wide as the primary SIM's read-back. Physical and eSIM entries share the same count: the panel is full
 * once `count` SIMs are in, and removing one makes room for another. The physical path is the primary SIM's own scanner, so validation against stock,
 * the scan and the typed entry behave exactly as they do there; a validated serial becomes an entry and the field clears for the next one.
 */
export function MultiSimPanel({ count, value, onChange, device, approvalRequired = false, otherSerials = [], otherIccids = [] }: MultiSimPanelProps) {
  const [draft, setDraft] = useState('');
  const [issuing, setIssuing] = useState(false);
  // The list as of now: the scanner's validation can finish after a re-render, so additions read the latest rather than the closure.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  });
  const full = value.length >= count;
  const serials = [...otherSerials, ...value.map((s) => s.simSerial).filter((x): x is string => Boolean(x))];
  const iccids = [...otherIccids, ...value.map((s) => s.simIccid).filter((x): x is string => Boolean(x))];

  const add = (entry: SimTypeValue) => {
    if (latest.current.length >= count) return;
    // The same serial twice (a typed entry validated by both the re-read and the blur) is one SIM.
    if (entry.simSerial && latest.current.some((s) => s.simSerial === entry.simSerial)) return;
    const next = [...latest.current, entry];
    latest.current = next;
    onChange(next);
  };
  const remove = (index: number) => onChange(latest.current.filter((_, i) => i !== index));

  const selectEsim = async () => {
    if (full || issuing) return;
    setIssuing(true);
    const profile = await issueEsimProfile(iccids);
    setIssuing(false);
    add({ simType: 'eSIM', esimIssued: true, esimActivationCode: profile.activationCode, simIccid: profile.iccid });
  };

  // Each SIM is an entry under the column it was added from - physical under the barcode field, eSIM under Select eSIM - the width of the primary SIM's own read-back.
  const entries = (kind: 'Physical' | 'eSIM') => {
    const mine = value.map((sim, i) => ({ sim, i })).filter(({ sim }) => (sim.simType === 'eSIM') === (kind === 'eSIM'));
    return (
      mine.length > 0 && (
        <ul className="stack gap-3" aria-label={`Provisioned ${kind} Multi-SIMs`}>
          {mine.map(({ sim, i }) => (
            <li key={`${sim.simSerial ?? sim.simIccid ?? 'esim'}-${i}`} className="stack gap-2">
              <div className="actions-end">
                <Button variant="tertiary" compact onClick={() => remove(i)} aria-label={`Remove Multi-SIM ${i + 1}`}>
                  Remove
                </Button>
              </div>
              <dl className="notice-success notice-body-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-fg">SIM Type</dt>
                  <dd className="text-fg font-medium">{kind === 'eSIM' ? 'eSIM' : sim.simKind ?? 'Physical'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-fg">SIM Serial Number</dt>
                  {/* An eSIM has no printed serial: its ICCID stands in, as it does for the primary SIM. */}
                  <dd className="text-fg font-medium">{(kind === 'eSIM' ? sim.simIccid : sim.simSerial) ?? '-'}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <div className="stack gap-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-1.5rem)/2)),1fr))] gap-6">
        <div className="space-y-3">
          <h4 className="value-text">Physical SIM</h4>
          <SimSerialScanner
            value={draft}
            device={device}
            autoFocus={false}
            excludeSerials={serials}
            disabled={full}
            onChange={(serial, valid, details) => {
              if (valid && details) {
                add({ simType: 'Physical', simSerial: serial, simValid: true, simIccid: details.iccid, simStockStatus: details.stockStatus, simKind: details.simKind });
                setDraft('');
              } else setDraft(serial);
            }}
          />
          {entries('Physical')}
        </div>
        <div className="space-y-3">
          <h4 className="value-text">eSIM</h4>
          <Button variant="primary" onClick={selectEsim} disabled={full || issuing}>
            {issuing ? 'Selecting eSIM…' : 'Select eSIM'}
          </Button>
          <p className="caption-muted">The eSIM QR code will be generated only after successful payment and order {approvalRequired ? 'approval' : 'submission'}.</p>
          {entries('eSIM')}
        </div>
      </div>
    </div>
  );
}
