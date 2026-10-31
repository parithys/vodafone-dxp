import { lazy, Suspense } from 'react';
import { Spinner } from './components/primitives/Spinner';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './modules/Dashboard';
import { ModuleScreenList } from './modules/ModuleScreenList';
import { ScreenRouteResolver } from './modules/ScreenRouteResolver';
import { NotFound } from './modules/NotFound';
import { NewConnectionWizard } from './modules/new-connection/NewConnectionWizard';
import { LeadListView } from './modules/lead-management/LeadListView';
import { CustomerOrBusiness360 } from './workspace/customer360/CustomerOrBusiness360';
import { WorkspaceNotYetBuilt } from './modules/WorkspaceNotYetBuilt';
import { RequireFeature } from './navigation/RequireFeature';

const LEGACY_PREPAID_PATHS = [
  '/mobile-prepaid/new-prepaid-tablet-step-1-contact-id-capture',
  '/mobile-prepaid/new-prepaid-tablet-step-3-number-selection',
  '/mobile-prepaid/new-prepaid-tablet-step-4-sim-serial',
];

// Route-level code splitting: the workspaces and journeys load on first visit rather than in the initial bundle.
// (Dashboard, the not-found screens and the screen registry stay eager - they are needed on first paint or by every route.)
const CustomerSearchPage = lazy(() => import('./workspace/customer-search/CustomerSearchPage').then((m) => ({ default: m.CustomerSearchPage })));
const BillingAccountPage = lazy(() => import('./workspace/customer360/BillingAccountPage').then((m) => ({ default: m.BillingAccountPage })));
const SalesWorkspace = lazy(() => import('./workspace/sales/SalesWorkspace').then((m) => ({ default: m.SalesWorkspace })));
const SupportWorkspace = lazy(() => import('./workspace/support/SupportWorkspace').then((m) => ({ default: m.SupportWorkspace })));
const BillFormatterWorkspace = lazy(() => import('./workspace/bill-formatter/BillFormatterWorkspace').then((m) => ({ default: m.BillFormatterWorkspace })));
const OrdersWorkspace = lazy(() => import('./workspace/orders/OrdersWorkspace').then((m) => ({ default: m.OrdersWorkspace })));
const AdministrationWorkspace = lazy(() => import('./workspace/administration/AdministrationWorkspace').then((m) => ({ default: m.AdministrationWorkspace })));
const AgentProfileWorkspace = lazy(() => import('./workspace/profile/AgentProfileWorkspace').then((m) => ({ default: m.AgentProfileWorkspace })));
const ChangePostpaidPlanWizard = lazy(() => import('./modules/mobile-service-changes/wizards').then((m) => ({ default: m.ChangePostpaidPlanWizard })));
const ChangePrepaidPackWizard = lazy(() => import('./modules/mobile-service-changes/wizards').then((m) => ({ default: m.ChangePrepaidPackWizard })));
const AddAddonWizard = lazy(() => import('./modules/mobile-service-changes/wizards').then((m) => ({ default: m.AddAddonWizard })));
const TaskListView = lazy(() => import('./workspace/tasks/TaskListView').then((m) => ({ default: m.TaskListView })));
const TaskDetailView = lazy(() => import('./workspace/tasks/TaskDetailView').then((m) => ({ default: m.TaskDetailView })));
const QnomyTicketHistory = lazy(() => import('./workspace/tickets/QnomyTicketHistory').then((m) => ({ default: m.QnomyTicketHistory })));
const ProductLinePage = lazy(() => import('./modules/product-lines/ProductLinePage').then((m) => ({ default: m.ProductLinePage })));
const TicketApprovalQueue = lazy(() => import('./modules/trouble-ticketing-complaints/screens/TicketApprovalQueue').then((m) => ({ default: m.TicketApprovalQueue })));
const TicketApprovalReview = lazy(() => import('./modules/trouble-ticketing-complaints/screens/TicketApprovalReview').then((m) => ({ default: m.TicketApprovalReview })));

import './modules/registerAllScreens';

// Generated from config/routes.json's module list (16) + config/routes.json's
// 213 individual screen paths, per folder-structure.md's "Route generation" note.
// A single dynamic `/:moduleSlug` route (not one static route per module) so
// useParams() actually receives moduleSlug - react-router v6 ranks
// `/:moduleSlug/:screenSlug` as more specific automatically, so route order
// here doesn't matter.
export function AppRouter() {
  return (
    <Suspense fallback={<div className="p-8"><Spinner size={24} label="Loading" /></div>}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* Customer -> Product -> Action redesign: new customer-centric routes,
          added alongside the legacy module routes below (not replacing
          them) - every existing screen stays reachable at its current URL. */}
      <Route path="/customer-search" element={<CustomerSearchPage />} />
      {/* Nav manifest destinations (navManifest.ts). Without these, /products,
          /operations fell through to `/:moduleSlug` and
          rendered the bare string "Module not found." - they are nav
          destinations, not module slugs. `/leads` needs no new UI: it renders
          the already-built LeadListView that SalesWorkspace uses. */}
      <Route path="/leads" element={<LeadListView scope="all" />} />
      <Route path="/operations" element={<WorkspaceNotYetBuilt navKey="operations" />} />
      {/* Product lines: the line root stacks every category the role can
          reach, a category route shows just that section. Same component -
          they are the same content at different scope. */}
      <Route path="/new-connections" element={<ProductLinePage lineKey="new-connections" />} />
      <Route path="/mobile" element={<ProductLinePage lineKey="mobile" />} />
      {/* The New Connection journeys are guarded by their grant like the journeys below: a typed or bookmarked URL is refused like the menu. */}
      <Route path="/mobile/start-connection" element={<RequireFeature featureKey="postpaid.new-postpaid-wizard"><NewConnectionWizard flow="new" /></RequireFeature>} />
      <Route path="/mobile/start-connection/existing/:customerId" element={<RequireFeature featureKey="postpaid.new-postpaid-wizard"><NewConnectionWizard flow="existing" /></RequireFeature>} />
      {/* Plans & Numbers journeys on an existing line (journeys of the Mobile Services line; the menu leads here). Guarded by their grant: a typed or bookmarked URL is refused like the menu. */}
      <Route path="/mobile/change-postpaid-plan" element={<RequireFeature featureKey="mobile.change-postpaid-plan"><ChangePostpaidPlanWizard /></RequireFeature>} />
      <Route path="/mobile/change-prepaid-pack" element={<RequireFeature featureKey="mobile.change-prepaid-pack"><ChangePrepaidPackWizard /></RequireFeature>} />
      <Route path="/mobile/add-addon" element={<RequireFeature featureKey="mobile.add-addon"><AddAddonWizard /></RequireFeature>} />
      <Route path="/mobile/:category" element={<ProductLinePage lineKey="mobile" />} />
      <Route path="/fibre-home/start-connection/existing/:customerId" element={<RequireFeature featureKey="fixedline.new-fixed-line-wizard"><NewConnectionWizard flow="existing" journey="home" /></RequireFeature>} />
      <Route path="/fibre-home" element={<ProductLinePage lineKey="fibre-home" />} />
      <Route path="/fibre-home/:category" element={<ProductLinePage lineKey="fibre-home" />} />
      <Route path="/customer/:customerId" element={<CustomerOrBusiness360 />} />
      <Route path="/billing-account/:billingProfileId" element={<BillingAccountPage />} />
      <Route path="/sales" element={<SalesWorkspace />} />
      <Route path="/support" element={<SupportWorkspace />} />
      {/* Screen 16 (Approval Queue & Ticket Review) - no SCR- id, same
          workspace-style direct routing as /support/orders/LoginPage above:
          routes.json is a closed SCR-001-SCR-213 catalogue with no free
          slot for a screen with zero source evidence. */}
      <Route path="/trouble-ticketing-complaints/approval-queue" element={<TicketApprovalQueue />} />
      <Route path="/trouble-ticketing-complaints/approval-review" element={<TicketApprovalReview />} />
      <Route path="/orders" element={<OrdersWorkspace />} />
      <Route path="/bill-formatter" element={<BillFormatterWorkspace />} />
      <Route path="/administration" element={<RequireFeature featureKey="workspace.admin-role-access-viewer"><AdministrationWorkspace /></RequireFeature>} />
      <Route path="/profile" element={<AgentProfileWorkspace />} />
      <Route path="/tasks" element={<TaskListView />} />
      <Route path="/tasks/:taskId" element={<TaskDetailView />} />
      {/* Reached from the "Customers Served" pill (PersonaSwitcher.tsx), the
          same family as /tasks and /profile above - a personal-activity page
          with no product-module home, not a registered SCR screen. */}
      <Route path="/ticket-history" element={<QnomyTicketHistory />} />
      {/* Legacy: the 213-screen catalogue, kept mounted for direct-link
          access and internal QA (ModuleScreenList's Built/Not-built view) -
          no longer linked from the primary sidebar. */}
      {/* New Prepaid was catalogued as three "Tablet" step screens; it is one journey for web and tablet now. */}
      {LEGACY_PREPAID_PATHS.map((path) => (
        <Route key={path} path={path} element={<Navigate to="/mobile-prepaid/new-prepaid" replace />} />
      ))}
      <Route path="/:moduleSlug" element={<ModuleScreenList />} />
      <Route path="/:moduleSlug/:screenSlug" element={<ScreenRouteResolver />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}
