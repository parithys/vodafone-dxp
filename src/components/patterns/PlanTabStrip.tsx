import { TabStrip } from '../primitives/TabStrip';
import type { PlanGroupKey, TabKey } from './postpaidPlanModel';

interface PlanTabStripProps {
  planGroupTabs: { key: PlanGroupKey; label: string }[];
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

/** The Offers / Plans switch: the shared horizontal tab strip bound to the plan groups (it switches the content shown). */
export function PlanTabStrip({ planGroupTabs, activeTab, setActiveTab }: PlanTabStripProps) {
  return <TabStrip items={planGroupTabs} active={activeTab as PlanGroupKey} onChange={setActiveTab} label="Plan Groups" />;
}
