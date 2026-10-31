# Platform Sitemap (Final Deliverable #3)

Every screen (213), organized Platform → Module (16) → Screen, with its route path (`reconstruction-package/config/routes.json`) and type. This is the full, unabbreviated listing — the Information Architecture diagram (`diagrams/information-architecture.png`) shows the same hierarchy summarized to the Module tier for visual legibility; this document is the literal complete sitemap.

**Total: 16 modules, 213 screens, 213 routes.**

---

## Lead Management (15 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-041] Cross Sales — Contact/QID entry | Screen | `/lead-management/cross-sales-contact-qid-entry` |
| [SCR-047] New Fixed Line wizard — Addon & Discount step | Wizard | `/lead-management/new-fixed-line-wizard-addon-discount-step` |
| [SCR-052] Sales Order detail — header and Line Items tab | Screen | `/lead-management/sales-order-detail-header-and-line-items-tab` |
| [SCR-071] Backend Sales Order Record (Siebel Order Entry) | Screen | `/lead-management/backend-sales-order-record-siebel-order-entry` |
| [SCR-112] Contact / Cross Sales Offers Screen (MNP) | Screen | `/lead-management/contact-cross-sales-offers-screen-mnp` |
| [SCR-143] My Created Leads view | Screen | `/lead-management/my-created-leads-view` |
| [SCR-146] Lead Owner reassignment picker | Modal | `/lead-management/lead-owner-reassignment-picker` |
| [SCR-147] All Leads across Org | Screen | `/lead-management/all-leads-across-org` |
| [SCR-148] Description edit popup | Modal | `/lead-management/description-edit-popup` |
| [SCR-150] Contact record - Leads sub-tab | Screen | `/lead-management/contact-record-leads-sub-tab` |
| [SCR-153] Cross Sales Offers step (Postpaid) | Wizard | `/lead-management/cross-sales-offers-step-postpaid` |
| [SCR-163] Sales Order detail (back-office, Postpaid) | Screen | `/lead-management/sales-order-detail-back-office-postpaid` |
| [SCR-175] Order header / Order detail screen (Pre-to-Post) | Screen | `/lead-management/order-header-order-detail-screen-pre-to-post` |
| [SCR-203] Asset Summary (CTI View) | Screen | `/lead-management/asset-summary-cti-view` |
| [SCR-204] Asset Detail Expanded View | Screen | `/lead-management/asset-detail-expanded-view` |

## Mobile Postpaid (22 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-026] DXP Product Catalog (target state) | Screen | `/mobile-postpaid/dxp-product-catalog-target-state` |
| [SCR-036] Checkout Screen (Retail New Postpaid) | Screen | `/mobile-postpaid/checkout-screen-retail-new-postpaid` |
| [SCR-095] Customer Portal — Billing Profile / Unbilled Usage / Surepay Bucket View | Screen | `/mobile-postpaid/customer-portal-billing-profile-unbilled-usage-surepay-bucke` |
| [SCR-108] Sales Order Record (Backend, Approved) | Screen | `/mobile-postpaid/sales-order-record-backend-approved` |
| [SCR-114] MNP Postpaid Plan Step / Promotion Detail Modal | Modal | `/mobile-postpaid/mnp-postpaid-plan-step-promotion-detail-modal` |
| [SCR-118] Product Promotions admin — Bill Limit Mapping / Spend Limit Mapping tab | Screen | `/mobile-postpaid/product-promotions-admin-bill-limit-mapping-spend-limit-mapp` |
| [SCR-132] Order Line Items / Line Item Attributes grid (MNP) | Screen | `/mobile-postpaid/order-line-items-line-item-attributes-grid-mnp` |
| [SCR-133] MNP wizard step: Addon & Discount | Wizard | `/mobile-postpaid/mnp-wizard-step-addon-discount` |
| [SCR-137] Account Summary | Screen | `/mobile-postpaid/account-summary` |
| [SCR-166] Bill Limit Mobile Plus — Customize detail panel | Modal | `/mobile-postpaid/bill-limit-mobile-plus-customize-detail-panel` |
| [SCR-167] Order Validation dialogs | Popup | `/mobile-postpaid/order-validation-dialogs` |
| [SCR-171] B2B2C override confirm dialog | Popup | `/mobile-postpaid/b2b2c-override-confirm-dialog` |
| [SCR-172] Promotion Upgrades picker (modal) | Modal | `/mobile-postpaid/promotion-upgrades-picker-modal` |
| [SCR-173] Sales Order Line Items screen (Pre-to-Post) | Screen | `/mobile-postpaid/sales-order-line-items-screen-pre-to-post` |
| [SCR-174] Product configurator (Bill Limit selection, Pre-to-Post) | Screen | `/mobile-postpaid/product-configurator-bill-limit-selection-pre-to-post` |
| [SCR-178] Sales Order record screen (Line Items, Pre-to-Post) | Screen | `/mobile-postpaid/sales-order-record-screen-line-items-pre-to-post` |
| [SCR-188] Step 2 Plan — Edit Credit Limit dropdown | Modal | `/mobile-postpaid/step-2-plan-edit-credit-limit-dropdown` |
| [SCR-189] Step 3 Addon & Discount (Pre-to-Post tablet) | Wizard | `/mobile-postpaid/step-3-addon-discount-pre-to-post-tablet` |
| [SCR-194] Sales Order — Line Items tab (New Prepaid) | Screen | `/mobile-postpaid/sales-order-line-items-tab-new-prepaid` |
| [SCR-205] Communications Modal / Real Time Balance | Modal | `/mobile-postpaid/communications-modal-real-time-balance` |
| [SCR-208] DXP Agent Portal Wireframes (13-step onboarding wizard) | Wizard | `/mobile-postpaid/dxp-agent-portal-wireframes-13-step-onboarding-wizard` |
| [SCR-209] Agent Desktop (Journey initiation) | Screen | `/mobile-postpaid/agent-desktop-journey-initiation` |

## Mobile Prepaid (0 screens)

| Screen | Type | Route |
|---|---|---|

## Pre-to-Post Migration (15 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-042] QID Offers grid | Screen | `/pre-to-post-migration/qid-offers-grid` |
| [SCR-075] Connection Details Popup | Popup | `/pre-to-post-migration/connection-details-popup` |
| [SCR-113] MNP Postpaid Billing Step | Wizard | `/pre-to-post-migration/mnp-postpaid-billing-step` |
| [SCR-125] MNP wizard step: Plan (plan selection grid) | Wizard | `/pre-to-post-migration/mnp-wizard-step-plan-plan-selection-grid` |
| [SCR-126] MNP wizard step: Donor Details | Wizard | `/pre-to-post-migration/mnp-wizard-step-donor-details` |
| [SCR-127] MNP wizard step: Donor Attachment | Wizard | `/pre-to-post-migration/mnp-wizard-step-donor-attachment` |
| [SCR-129] MNP wizard step: CAF | Wizard | `/pre-to-post-migration/mnp-wizard-step-caf` |
| [SCR-134] MNP wizard step: Activity (Comments) | Wizard | `/pre-to-post-migration/mnp-wizard-step-activity-comments` |
| [SCR-159] Product Catalog / Plan step (Postpaid wizard) | Wizard | `/pre-to-post-migration/product-catalog-plan-step-postpaid-wizard` |
| [SCR-164] Assets / Complex Assets view | Screen | `/pre-to-post-migration/assets-complex-assets-view` |
| [SCR-177] Postpaid - Contact wizard step (Pre-to-Post) | Wizard | `/pre-to-post-migration/postpaid-contact-wizard-step-pre-to-post` |
| [SCR-179] Migration Offer tab (Complex Asset List Applet) | Screen | `/pre-to-post-migration/migration-offer-tab-complex-asset-list-applet` |
| [SCR-180] Base Management wizard (Contact / Offer Summary / Activity) | Wizard | `/pre-to-post-migration/base-management-wizard-contact-offer-summary-activity` |
| [SCR-183] Bulk Jobs / Bulk Processing screen (TM Bulk Batch List Applet) | Dashboard | `/pre-to-post-migration/bulk-jobs-bulk-processing-screen-tm-bulk-batch-list-applet` |
| [SCR-191] New Prepaid Tablet — Step 3 Number Selection | Wizard | `/pre-to-post-migration/new-prepaid-tablet-step-3-number-selection` |

## MNP / FNP Porting (17 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-017] Siebel Order Creation Screen (MNP) | Screen | `/mnp-fnp-porting/siebel-order-creation-screen-mnp` |
| [SCR-019] CAF (Customer Application Form) tablet signature view | Screen | `/mnp-fnp-porting/caf-customer-application-form-tablet-signature-view` |
| [SCR-021] Customer 360 | Dashboard | `/mnp-fnp-porting/customer-360` |
| [SCR-069] Customer Application Form (CAF) Preview/Sign | Modal | `/mnp-fnp-porting/customer-application-form-caf-preview-sign` |
| [SCR-070] Signature Capture Pad | Modal | `/mnp-fnp-porting/signature-capture-pad` |
| [SCR-074] Attachment Viewer (Qatari ID/CAF/Supplementary Form) | Modal | `/mnp-fnp-porting/attachment-viewer-qatari-id-caf-supplementary-form` |
| [SCR-120] MNP Guided Process - Choose process | Wizard | `/mnp-fnp-porting/mnp-guided-process-choose-process` |
| [SCR-128] Mobile Number Portability Application Form (MNP contract) | Modal | `/mnp-fnp-porting/mobile-number-portability-application-form-mnp-contract` |
| [SCR-130] Vodafone Customer Application Form (CAF, MNP variant) | Modal | `/mnp-fnp-porting/vodafone-customer-application-form-caf-mnp-variant` |
| [SCR-131] Siebel Sales Order screen (MNP) | Screen | `/mnp-fnp-porting/siebel-sales-order-screen-mnp` |
| [SCR-135] Completion popup (MNP order confirmation) | Popup | `/mnp-fnp-porting/completion-popup-mnp-order-confirmation` |
| [SCR-136] Order Entry - header/detail view (MNP) | Screen | `/mnp-fnp-porting/order-entry-header-detail-view-mnp` |
| [SCR-152] Cross Sales Contact step (Postpaid) | Wizard | `/mnp-fnp-porting/cross-sales-contact-step-postpaid` |
| [SCR-168] Home / Guided Process 'Choose process' screen | Screen | `/mnp-fnp-porting/home-guided-process-choose-process-screen` |
| [SCR-169] CAF (Customer Application Form) document view (Postpaid HRN) | Screen | `/mnp-fnp-porting/caf-customer-application-form-document-view-postpaid-hrn` |
| [SCR-193] Prepaid Customer Application Form (unsigned) | Modal | `/mnp-fnp-porting/prepaid-customer-application-form-unsigned` |
| [SCR-212] Ticket Status on VF App | Screen | `/mnp-fnp-porting/ticket-status-on-vf-app` |

## Fixed Line / Fibre (49 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-006] Unbilled Usage Screen | Screen | `/fixed-line-fibre/unbilled-usage-screen` |
| [SCR-007] Account Creation Screen | Screen | `/fixed-line-fibre/account-creation-screen` |
| [SCR-008] EBU Number Portal | Page | `/fixed-line-fibre/ebu-number-portal` |
| [SCR-012] RFS/Feasibility Portal (Grafana) | Dashboard | `/fixed-line-fibre/rfs-feasibility-portal-grafana` |
| [SCR-013] Enterprise Process Knowledge Base Dashboard | Dashboard | `/fixed-line-fibre/enterprise-process-knowledge-base-dashboard` |
| [SCR-015] Enterprise Invoice (Excel) | Page | `/fixed-line-fibre/enterprise-invoice-excel` |
| [SCR-018] GigaHome & OSNtv Subscription Acceptance Form | Page | `/fixed-line-fibre/gigahome-osntv-subscription-acceptance-form` |
| [SCR-025] Device Installment Portal | Screen | `/fixed-line-fibre/device-installment-portal` |
| [SCR-027] Eligibility Web Portal (external) | Page | `/fixed-line-fibre/eligibility-web-portal-external` |
| [SCR-031] OpenGate Tablet Instant Activation Flow | Wizard | `/fixed-line-fibre/opengate-tablet-instant-activation-flow` |
| [SCR-032] CAP Signature Screen | Screen | `/fixed-line-fibre/cap-signature-screen` |
| [SCR-033] ZSP Entry Screen | Screen | `/fixed-line-fibre/zsp-entry-screen` |
| [SCR-034] Address / Service Point Search Screen (KID lookup) | Screen | `/fixed-line-fibre/address-service-point-search-screen-kid-lookup` |
| [SCR-038] Consumer Postpaid CAF (PCA001) Form | Screen | `/fixed-line-fibre/consumer-postpaid-caf-pca001-form` |
| [SCR-040] CRM Open UI Desktop Home Page | Screen | `/fixed-line-fibre/crm-open-ui-desktop-home-page` |
| [SCR-043] New Fixed Line wizard — Contact step | Wizard | `/fixed-line-fibre/new-fixed-line-wizard-contact-step` |
| [SCR-045] New Fixed Line wizard — Address step | Wizard | `/fixed-line-fibre/new-fixed-line-wizard-address-step` |
| [SCR-046] New Fixed Line wizard — Plan step | Wizard | `/fixed-line-fibre/new-fixed-line-wizard-plan-step` |
| [SCR-048] New Fixed Line wizard — Number Selection step | Wizard | `/fixed-line-fibre/new-fixed-line-wizard-number-selection-step` |
| [SCR-050] New Fixed Line wizard — CAF/Attachments step | Wizard | `/fixed-line-fibre/new-fixed-line-wizard-caf-attachments-step` |
| [SCR-053] Siebel Web Call Center Home page (tile grid) | Screen | `/fixed-line-fibre/siebel-web-call-center-home-page-tile-grid` |
| [SCR-056] New Fixed Line Tablet Home Dashboard | Dashboard | `/fixed-line-fibre/new-fixed-line-tablet-home-dashboard` |
| [SCR-057] Prepatched device detection dialog | Popup | `/fixed-line-fibre/prepatched-device-detection-dialog` |
| [SCR-058] CAF preview modal (with e-signature pad) | Modal | `/fixed-line-fibre/caf-preview-modal-with-e-signature-pad` |
| [SCR-064] Order Correction wizard | Wizard | `/fixed-line-fibre/order-correction-wizard` |
| [SCR-066] GigaHome Subscription Acceptance Form (bilingual paper/PDF form) | Screen | `/fixed-line-fibre/gigahome-subscription-acceptance-form-bilingual-paper-pdf-fo` |
| [SCR-068] Combo Box CPE Detection Dialog (Instant vs Normal Activation) | Modal | `/fixed-line-fibre/combo-box-cpe-detection-dialog-instant-vs-normal-activation` |
| [SCR-077] New FWA Tile / Home Screen | Screen | `/fixed-line-fibre/new-fwa-tile-home-screen` |
| [SCR-078] FWA Contact Step | Wizard | `/fixed-line-fibre/fwa-contact-step` |
| [SCR-079] Address Step (FWA) | Wizard | `/fixed-line-fibre/address-step-fwa` |
| [SCR-080] Plan Step (FWA) | Wizard | `/fixed-line-fibre/plan-step-fwa` |
| [SCR-082] Number Selection Step (FWA) | Wizard | `/fixed-line-fibre/number-selection-step-fwa` |
| [SCR-084] CAF Modal (FWA) | Modal | `/fixed-line-fibre/caf-modal-fwa` |
| [SCR-085] Activity Step (Comments) | Modal | `/fixed-line-fibre/activity-step-comments` |
| [SCR-092] OFS Activity Details / Start-End Activity | Screen | `/fixed-line-fibre/ofs-activity-details-start-end-activity` |
| [SCR-094] Installation Checklist Screen | Screen | `/fixed-line-fibre/installation-checklist-screen` |
| [SCR-100] CAF & Additional Attachments Step (FWA) | Wizard | `/fixed-line-fibre/caf-additional-attachments-step-fwa` |
| [SCR-107] Manager Home Screen (Test Manager) | Screen | `/fixed-line-fibre/manager-home-screen-test-manager` |
| [SCR-110] WFM Activity Details — Admin/Technician View | Screen | `/fixed-line-fibre/wfm-activity-details-admin-technician-view` |
| [SCR-121] MNP wizard step: Contact | Wizard | `/fixed-line-fibre/mnp-wizard-step-contact` |
| [SCR-140] New Lead Tablet - Create a Lead form | Wizard | `/fixed-line-fibre/new-lead-tablet-create-a-lead-form` |
| [SCR-149] CallBack Date/Time picker | Modal | `/fixed-line-fibre/callback-date-time-picker` |
| [SCR-170] CAF & Additional Attachments step (B2B2C) | Wizard | `/fixed-line-fibre/caf-additional-attachments-step-b2b2c` |
| [SCR-176] Home menu (app-icon grid, Pre-to-Post desktop) | Dashboard | `/fixed-line-fibre/home-menu-app-icon-grid-pre-to-post-desktop` |
| [SCR-181] Comments modal (Base Management) | Modal | `/fixed-line-fibre/comments-modal-base-management` |
| [SCR-190] New Prepaid Tablet — Step 1 Contact (ID capture) | Wizard | `/fixed-line-fibre/new-prepaid-tablet-step-1-contact-id-capture` |
| [SCR-192] New Prepaid Tablet — Step 4 SIM Serial | Wizard | `/fixed-line-fibre/new-prepaid-tablet-step-4-sim-serial` |
| [SCR-201] RFS Portal | Page | `/fixed-line-fibre/rfs-portal` |
| [SCR-206] Contact History Tab | Screen | `/fixed-line-fibre/contact-history-tab` |

## FWA / 5G Home (44 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-009] Bulk Activation Control Sheet (Excel Macro, Current State) | Page | `/fwa-5g-home/bulk-activation-control-sheet-excel-macro-current-state` |
| [SCR-028] Appointment booking / calendar selection screen | Screen | `/fwa-5g-home/appointment-booking-calendar-selection-screen` |
| [SCR-039] Consumer Prepaid CAF (PCA001) Form | Screen | `/fwa-5g-home/consumer-prepaid-caf-pca001-form` |
| [SCR-049] Book Appointment modal (Fixed Line) | Modal | `/fwa-5g-home/book-appointment-modal-fixed-line` |
| [SCR-051] Account Orders view (Account 360) | Screen | `/fwa-5g-home/account-orders-view-account-360` |
| [SCR-055] Responsibilities dialog | Modal | `/fwa-5g-home/responsibilities-dialog` |
| [SCR-067] New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion) | Wizard | `/fwa-5g-home/new-fixed-line-tablet-guided-journey-contact-address-plan-ad` |
| [SCR-072] Line Items Tab (Order) | Screen | `/fwa-5g-home/line-items-tab-order` |
| [SCR-073] Account Summary (Installed Assets and Orders) | Screen | `/fwa-5g-home/account-summary-installed-assets-and-orders` |
| [SCR-076] CAF Dropdown (Digital/Manual/Touch Screen) | Popup | `/fwa-5g-home/caf-dropdown-digital-manual-touch-screen` |
| [SCR-083] Book Appointment Step / Modal (FWA & WFM) | Wizard | `/fwa-5g-home/book-appointment-step-modal-fwa-wfm` |
| [SCR-086] Line Items > Appointments Sub-tab | Screen | `/fwa-5g-home/line-items-appointments-sub-tab` |
| [SCR-087] VFQ Inventory Loading Excel Tool | Screen | `/fwa-5g-home/vfq-inventory-loading-excel-tool` |
| [SCR-088] Resource Inventory Import / Field Service Import Add-in | Modal | `/fwa-5g-home/resource-inventory-import-field-service-import-add-in` |
| [SCR-089] Move Dialog (Technician Reassignment) | Modal | `/fwa-5g-home/move-dialog-technician-reassignment` |
| [SCR-090] Inventory Management — Non-Serialized Inventory Transfer | Screen | `/fwa-5g-home/inventory-management-non-serialized-inventory-transfer` |
| [SCR-091] OFS My Route (Technician) | Dashboard | `/fwa-5g-home/ofs-my-route-technician` |
| [SCR-093] Serial Number Check Screen (Dual Play) | Screen | `/fwa-5g-home/serial-number-check-screen-dual-play` |
| [SCR-096] Installed Assets Grid (Account 360, FWA) | Screen | `/fwa-5g-home/installed-assets-grid-account-360-fwa` |
| [SCR-097] FMS CPE Bundle Configuration / Modify Screen (Equipment tab) | Screen | `/fwa-5g-home/fms-cpe-bundle-configuration-modify-screen-equipment-tab` |
| [SCR-098] Order Line Items > Attributes Tab (Change Audit) | Screen | `/fwa-5g-home/order-line-items-attributes-tab-change-audit` |
| [SCR-099] SIM Serial Step (FWA, with validation) | Wizard | `/fwa-5g-home/sim-serial-step-fwa-with-validation` |
| [SCR-102] Sales Order Detail (More Info tab) | Screen | `/fwa-5g-home/sales-order-detail-more-info-tab` |
| [SCR-105] UIM Custom Object Summary | Screen | `/fwa-5g-home/uim-custom-object-summary` |
| [SCR-106] Order Entry (Backend Order Record) | Screen | `/fwa-5g-home/order-entry-backend-order-record` |
| [SCR-109] Book Appointment / Book Unscheduled Appointment Step | Wizard | `/fwa-5g-home/book-appointment-book-unscheduled-appointment-step` |
| [SCR-111] End Activity Form | Screen | `/fwa-5g-home/end-activity-form` |
| [SCR-115] Book Appointment (Home Move) | Wizard | `/fwa-5g-home/book-appointment-home-move` |
| [SCR-116] Home Move Checklist | Wizard | `/fwa-5g-home/home-move-checklist` |
| [SCR-122] MNP wizard step: Address | Wizard | `/fwa-5g-home/mnp-wizard-step-address` |
| [SCR-123] MNP wizard step: Billing | Wizard | `/fwa-5g-home/mnp-wizard-step-billing` |
| [SCR-124] MNP wizard step: SIM Serial | Wizard | `/fwa-5g-home/mnp-wizard-step-sim-serial` |
| [SCR-138] Mass Market Addons checklist modal | Modal | `/fwa-5g-home/mass-market-addons-checklist-modal` |
| [SCR-154] Postpaid Contact step (wizard) | Wizard | `/fwa-5g-home/postpaid-contact-step-wizard` |
| [SCR-155] Address step (Postpaid wizard) | Wizard | `/fwa-5g-home/address-step-postpaid-wizard` |
| [SCR-156] Billing step (Postpaid wizard) | Wizard | `/fwa-5g-home/billing-step-postpaid-wizard` |
| [SCR-157] Number Selection step (Postpaid wizard) | Wizard | `/fwa-5g-home/number-selection-step-postpaid-wizard` |
| [SCR-158] SIM Serial step (Postpaid wizard) | Wizard | `/fwa-5g-home/sim-serial-step-postpaid-wizard` |
| [SCR-160] Payment step (wizard) | Wizard | `/fwa-5g-home/payment-step-wizard` |
| [SCR-161] CAF/Attachments step (Postpaid wizard) | Wizard | `/fwa-5g-home/caf-attachments-step-postpaid-wizard` |
| [SCR-185] Account 360 View / Account Summary tile view | Dashboard | `/fwa-5g-home/account-360-view-account-summary-tile-view` |
| [SCR-187] Mobile Postpaid > Guided Process Choose process (tablet) | Wizard | `/fwa-5g-home/mobile-postpaid-guided-process-choose-process-tablet` |
| [SCR-202] Account Summary (Account 360, CTI View) | Screen | `/fwa-5g-home/account-summary-account-360-cti-view` |
| [SCR-207] Contact Portal | Page | `/fwa-5g-home/contact-portal` |

## Enterprise / IoT / B2B (6 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-001] Bulk Adjustment Portal (DXP, Target State) | Wizard | `/enterprise-iot-b2b/bulk-adjustment-portal-dxp-target-state` |
| [SCR-002] PowerApps Bulk Adjustment Portal (Current State) | Page | `/enterprise-iot-b2b/powerapps-bulk-adjustment-portal-current-state` |
| [SCR-010] DSP Bulk Activation Templates (Target State) | Wizard | `/enterprise-iot-b2b/dsp-bulk-activation-templates-target-state` |
| [SCR-014] Enterprise Invoice (PDF) | Page | `/enterprise-iot-b2b/enterprise-invoice-pdf` |
| [SCR-101] Account 360 View (FWA, created) | Screen | `/enterprise-iot-b2b/account-360-view-fwa-created` |
| [SCR-186] Billing Profile grid (account level) | Screen | `/enterprise-iot-b2b/billing-profile-grid-account-level` |

## Billing & Adjustments (3 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-003] Statement of Account (SOA) View | Page | `/billing-adjustments/statement-of-account-soa-view` |
| [SCR-005] Bill Simulation Screen | Modal | `/billing-adjustments/bill-simulation-screen` |
| [SCR-044] Fixed Line IPTV popup (billing email opt-in) | Modal | `/billing-adjustments/fixed-line-iptv-popup-billing-email-opt-in` |

## Order Management (15 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-011] MS Dynamics Discount Approval Hierarchy Screen | Screen | `/order-management/ms-dynamics-discount-approval-hierarchy-screen` |
| [SCR-023] Orders page | Page | `/order-management/orders-page` |
| [SCR-059] My Sales Orders / My Pending Approval Orders queue | Screen | `/order-management/my-sales-orders-my-pending-approval-orders-queue` |
| [SCR-060] TM SR Queue View — Order Activities Queue | Dashboard | `/order-management/tm-sr-queue-view-order-activities-queue` |
| [SCR-061] Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs) | Screen | `/order-management/order-approval-detail-attachments-order-details-activities-a` |
| [SCR-062] Reject Order modal | Modal | `/order-management/reject-order-modal` |
| [SCR-063] Approve Order modal | Modal | `/order-management/approve-order-modal` |
| [SCR-141] Lead Details View | Screen | `/order-management/lead-details-view` |
| [SCR-145] Reject Lead modal | Modal | `/order-management/reject-lead-modal` |
| [SCR-182] Submission confirmation modal | Modal | `/order-management/submission-confirmation-modal` |
| [SCR-184] Account Activities tab | Screen | `/order-management/account-activities-tab` |
| [SCR-197] Order Approval Queue / Order Activities Queue (Tablet) | Screen | `/order-management/order-approval-queue-order-activities-queue-tablet` |
| [SCR-198] All Sales Order screen (with All SIM Swap Orders / All Pending SIM Swap Orders filter) | Screen | `/order-management/all-sales-order-screen-with-all-sim-swap-orders-all-pending-` |
| [SCR-199] FDO requests tab (in account summary) | Screen | `/order-management/fdo-requests-tab-in-account-summary` |
| [SCR-200] FDO request view icon (homepage) | Screen | `/order-management/fdo-request-view-icon-homepage` |

## Identity & Customer Management (6 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-004] Bill Landing View | Page | `/identity-customer-management/bill-landing-view` |
| [SCR-022] Agent 360 / Asset summary | Screen | `/identity-customer-management/agent-360-asset-summary` |
| [SCR-030] Usage/balance view (agent) | Screen | `/identity-customer-management/usage-balance-view-agent` |
| [SCR-054] All Person Administration screen | Screen | `/identity-customer-management/all-person-administration-screen` |
| [SCR-119] Agent Home / App Launcher | Dashboard | `/identity-customer-management/agent-home-app-launcher` |
| [SCR-151] Passport to QID Update wizard | Wizard | `/identity-customer-management/passport-to-qid-update-wizard` |

## SIM & Number Management (7 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-024] Number Management Portal | Screen | `/sim-number-management/number-management-portal` |
| [SCR-035] TON (Transfer of Number) Wizard | Wizard | `/sim-number-management/ton-transfer-of-number-wizard` |
| [SCR-037] New Postpaid Connection Journey (single-scroll flow) | Wizard | `/sim-number-management/new-postpaid-connection-journey-single-scroll-flow` |
| [SCR-103] Catalog Tab | Screen | `/sim-number-management/catalog-tab` |
| [SCR-104] Numbers Tab (Order) | Screen | `/sim-number-management/numbers-tab-order` |
| [SCR-195] Global Search | Screen | `/sim-number-management/global-search` |
| [SCR-196] SIM Swap Queue / Order tasks tab | Screen | `/sim-number-management/sim-swap-queue-order-tasks-tab` |

## Trouble Ticketing & Complaints (5 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-016] Siebel Excel Export (Uncontrolled) | Screen | `/trouble-ticketing-complaints/siebel-excel-export-uncontrolled` |
| [SCR-029] Ticket detail screen (public notes / bell icon notifications) | Screen | `/trouble-ticketing-complaints/ticket-detail-screen-public-notes-bell-icon-notifications` |
| [SCR-210] Ticket Homepage | Page | `/trouble-ticketing-complaints/ticket-homepage` |
| [SCR-211] Tickets Dashboard | Dashboard | `/trouble-ticketing-complaints/tickets-dashboard` |
| [SCR-213] Open UI Tickets Fields (per-issue-type template) | Modal | `/trouble-ticketing-complaints/open-ui-tickets-fields-per-issue-type-template` |

## Access, Roles & Approval Governance (3 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-020] In-progress journeys list (agent login page) | Screen | `/access-roles-approval-governance/in-progress-journeys-list-agent-login-page` |
| [SCR-142] My Leads list | Screen | `/access-roles-approval-governance/my-leads-list` |
| [SCR-144] Manage Leads - My Team's Leads | Screen | `/access-roles-approval-governance/manage-leads-my-team-s-leads` |

## CAF, Attachments & Forms (5 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-081] Addon & Discount Step (FWA) | Wizard | `/caf-attachments-forms/addon-discount-step-fwa` |
| [SCR-117] Product Promotions admin — More Info tab | Screen | `/caf-attachments-forms/product-promotions-admin-more-info-tab` |
| [SCR-139] Prepaid Customer Application Form (CAF) | Modal | `/caf-attachments-forms/prepaid-customer-application-form-caf` |
| [SCR-162] Activity step (call disposition, Postpaid wizard) | Wizard | `/caf-attachments-forms/activity-step-call-disposition-postpaid-wizard` |
| [SCR-165] Complex Product Runtime Instantiation (customization screen) | Screen | `/caf-attachments-forms/complex-product-runtime-instantiation-customization-screen` |

## Platform Governance & Architecture (1 screens)

| Screen | Type | Route |
|---|---|---|
| [SCR-065] Oracle Enterprise Manager / Service Bus Message Detail screen | Screen | `/platform-governance-architecture/oracle-enterprise-manager-service-bus-message-detail-screen` |
