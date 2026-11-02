import type { ReactNode } from 'react';

/** The "Key Information" box shown before the CAF is signed: the terms the customer is agreeing to. */
export function KeyInformationPanel({ items }: { items: ReactNode[] }) {
  return (
    <div className="card card-surface p-4">
      <h3 className="title title-md font-semibold mb-2">Key Information</h3>
      <ul className="list-disc list-inside space-y-1 text-secondary">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
