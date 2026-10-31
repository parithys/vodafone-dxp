import { PageHeader } from '../../components/patterns/PageHeader';

// The Bill Formatter workspace: a dedicated page reached from the left navigation. Empty for now - only the page title section.
export function BillFormatterWorkspace() {
  return (
    <div className="p-8">
      <PageHeader title={<>Bill Formatter</>} />
    </div>
  );
}
