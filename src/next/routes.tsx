'use client';
// The screens behind the Next route files in app/. Each is the application's own screen or wrapper, wired exactly as src/router.tsx
// wires it (same component, same props, same feature guard): a Next route file adds a URL, never behaviour.
import { lazy } from 'react';
import { Dashboard } from '../modules/Dashboard';
import { AppRouter } from '../router';
import { RequireFeature } from '../navigation/RequireFeature';
import { CustomerOrBusiness360 } from '../workspace/customer360/CustomerOrBusiness360';

const CustomerSearchPage = lazy(() => import('../workspace/customer-search/CustomerSearchPage').then((m) => ({ default: m.CustomerSearchPage })));
const ProductLinePage = lazy(() => import('../modules/product-lines/ProductLinePage').then((m) => ({ default: m.ProductLinePage })));
const ChangePostpaidPlanWizard = lazy(() => import('../modules/mobile-service-changes/wizards').then((m) => ({ default: m.ChangePostpaidPlanWizard })));

export const DashboardRoute = () => <Dashboard />;
export const CustomerSearchRoute = () => <CustomerSearchPage />;
export const CustomerRoute = () => <CustomerOrBusiness360 />;
export const MobileLineRoute = () => <ProductLinePage lineKey="mobile" />;
export const ChangePostpaidPlanRoute = () => (
  <RequireFeature featureKey="mobile.change-postpaid-plan">
    <ChangePostpaidPlanWizard />
  </RequireFeature>
);
export const LegacyRoute = () => <AppRouter />;
