import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../../../components/primitives/Input';
import { Button } from '../../../components/primitives/Button';
import { NewSimSwapWizard } from './NewSimSwapWizard';
import { useEnterToSubmit } from '../../../hooks/useEnterToSubmit';
import { PageHeader } from '../../../components/patterns/PageHeader';

// SCR-195: Global Search - UJ-090: "Click Global Search icon -> Enter MSISDN
// and click Go -> Click SIM Swap option." The SIM Swap wizard itself has no
// separate evidenced screenId, so it's rendered inline here once "SIM Swap"
// is clicked, matching the single-screen flow described in the journey.
export function GlobalSearchScreen() {
  // Opened from a customer's line (Customer 360 actions): the number arrives prefilled and already searched.
  const prefill = useSearchParams()[0].get('msisdn') ?? '';
  const [msisdn, setMsisdn] = useState(prefill);
  const [searched, setSearched] = useState(Boolean(prefill));
  const [swapping, setSwapping] = useState(false);

  const handleKeyDown = useEnterToSubmit(Boolean(msisdn), () => setSearched(true));

  if (swapping) {
    return (
      <div className="min-h-full flex flex-col">
        <NewSimSwapWizard msisdn={msisdn} onDone={() => setSwapping(false)} />
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <PageHeader title={<>Global Search</>} description={<>Search for a customer by MSISDN.</>} />
      <div className="flex gap-2" onKeyDown={handleKeyDown}>
        <Input aria-label="Enter MSISDN" inputMode="tel" placeholder="Enter MSISDN" value={msisdn} onChange={(e) => { setMsisdn(e.target.value); setSearched(false); }} />
        <Button variant="primary" onClick={() => setSearched(true)} disabled={!msisdn}>
          Go
        </Button>
      </div>
      {searched && msisdn && (
        <div className="mt-6 card p-4">
          <p className="text-fg font-medium mb-3">{msisdn}</p>
          <Button variant="primary" onClick={() => setSwapping(true)}>
            SIM Swap
          </Button>
        </div>
      )}
    </div>
  );
}
