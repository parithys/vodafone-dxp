import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { appPath } from '../../../lib/basePath';

// ---- Customer view as a pop-up window --------------------------------------------------
// "Customer view" opens THIS journey in a second window (?mirror=1) that follows the agent's
// screen: the agent window broadcasts its draft (current step and every value) over a
// BroadcastChannel, and the pop-up shows the step content only, read-only, with none of the
// agent's chrome. Prototype scope: one browser, one-way (the customer cannot type or sign in
// the pop-up; the signature is still captured in the agent window).
/** Agent window side: opening/closing the pop-up and the state the button reflects. */
export function useCustomerViewShare(sharedStepKey: string | undefined) {
  const location = useLocation();
  const [popupBlocked, setPopupBlocked] = useState(false);
  const popupRef = useRef<Window | null>(null);
  // Toggle: open the pop-up (button shows active), or close it again from the same button.
  const [viewOpen, setViewOpen] = useState(false);
  // Spoken by the polite live region below whenever sharing starts or stops.
  const [shareAnnouncement, setShareAnnouncement] = useState('');
  const stopCustomerView = () => {
    popupRef.current?.close();
    popupRef.current = null;
    setViewOpen(false);
    setShareAnnouncement('Customer view stopped');
  };
  const toggleCustomerView = () => {
    if (viewOpen) {
      stopCustomerView();
      return;
    }
    const url = `${appPath(location.pathname)}?mirror=1`;
    const w = window.open(url, 'vfq-customer-view', 'popup=yes,width=1100,height=820');
    popupRef.current = w;
    setPopupBlocked(!w);
    setViewOpen(Boolean(w));
    if (w) setShareAnnouncement('Now showing to customer');
  };
  // The customer view can also be closed from its own window: return the button to its default state.
  useEffect(() => {
    if (!viewOpen) return;
    const t = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        popupRef.current = null;
        setViewOpen(false);
        setShareAnnouncement('Customer view stopped');
      }
    }, 500);
    return () => clearInterval(t);
  }, [viewOpen]);
  // Sharing is for ONE screen: moving to another step stops it and clears the customer's window,
  // so nothing from the next screen is ever shown without the agent choosing to share it.
  useEffect(() => {
    if (viewOpen) stopCustomerView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedStepKey]);
  // Leaving the journey closes the customer view with it - and so does anything that ends the page:
  // closing the tab, a reload, or signing out (which reloads, see resetApplicationState).
  useEffect(() => {
    const closeCustomerWindow = () => popupRef.current?.close();
    window.addEventListener('pagehide', closeCustomerWindow);
    return () => {
      window.removeEventListener('pagehide', closeCustomerWindow);
      popupRef.current?.close();
    };
  }, []);
  return { popupBlocked, viewOpen, shareAnnouncement, toggleCustomerView };
}
