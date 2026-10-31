import { useEffect, useRef } from 'react';
import { useWorkflowStore } from '../../../stores/workflowStore';

/** Both ends of the customer-view BroadcastChannel; returns the pop-up's channel ref (for sending edits back). */
export function useMirrorChannel(allowCustomerView: boolean | undefined, isMirror: boolean, wizardId: string) {
  const setFieldValue = useWorkflowStore((s) => s.setFieldValue);
  const hydrateDraft = useWorkflowStore((s) => s.hydrateDraft);
  const channelName = `vfq-mirror-${wizardId}`;
  // Agent window: send the draft whenever it changes, and answer a newly opened pop-up.
  useEffect(() => {
    if (!allowCustomerView || isMirror) return;
    const ch = new BroadcastChannel(channelName);
    const send = () => ch.postMessage({ type: 'draft', draft: useWorkflowStore.getState().getDraft(wizardId) });
    ch.onmessage = (e) => {
      if (e.data?.type === 'hello') send();
      // The customer's pop-up edited a field (the signature step): apply it here.
      else if (e.data?.type === 'set') setFieldValue(wizardId, e.data.field, e.data.value);
    };
    send();
    const unsub = useWorkflowStore.subscribe(send);
    return () => {
      unsub();
      ch.close();
    };
  }, [allowCustomerView, isMirror, channelName, wizardId, setFieldValue]);
  // Pop-up window: follow the agent's draft.
  const mirrorCh = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (!isMirror) return;
    const ch = new BroadcastChannel(channelName);
    mirrorCh.current = ch;
    ch.onmessage = (e) => {
      if (e.data?.type === 'draft' && e.data.draft) hydrateDraft(wizardId, e.data.draft);
    };
    ch.postMessage({ type: 'hello' });
    return () => {
      ch.close();
      mirrorCh.current = null;
    };
  }, [isMirror, channelName, wizardId, hydrateDraft]);
  return mirrorCh;
}
