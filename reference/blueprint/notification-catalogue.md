# Notification Framework (Phase 24)

Success/error/warning messages, toasts, alerts, and confirmation dialogues, with trigger conditions — sourced from `data/SMS Templates.xlsx` (read directly: Automatic/Lead-Automated/Other-Automated sheets, 39 template rows across languages), 79 verbatim in-app error messages captured in `field-inventory.md`, and the confirmation-dialogue patterns in `reusable-patterns.md`.

---

## 1. SMS Notifications (customer-facing, evidenced in `data/SMS Templates.xlsx`)

This workbook also has a **1,236-row 'Manual SMS Templates' sheet** (agent-triggered, ad-hoc) — far too large to catalogue individually here; it exists as a resource for an actual implementation to import directly rather than transcribe. The 39 rows below are the *automatic* (system-triggered) templates, which matter more for front-end simulation since they fire on a state transition rather than agent discretion.

### 1.1 Automatic SMS Templates (trouble-ticket / request-triggered)

**NOTIF-001: 5G Outdoor TT** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=Fixed_QA, Area=Fixed - Installation, Sub Area=New Activation
- **Message:** _(template body not populated in source workbook for the English variant — Arabic/other-language row may exist)_
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `5G Outdoor TT`

**NOTIF-002: Automatic TON SMS** `Explicit` · confidence: `high`
- **Trigger:** TT Source=System, Category=Request, Area=Account Management, Sub Area=Transfer of Number
- **Message (English):** "We have received your request for ‘Transfer of ownership’ Your request number is [Service Request.SR Number] . Thank You.    قد استلمنا طلبك لنقل الملكية. رقم الطلب الخاص بك هو  [Service Request.SR Number]. شكرا لكم"
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `Automatic TON SMS`

**NOTIF-003: BC Change Request** `Explicit` · confidence: `high`
- **Trigger:** TT Source=System, Category=Requests, Area=Billing Request, Sub Area=Other
- **Message (English):** "Your request to change your bill cycle has been submitted successfully. It will be processed within 72 hours. We will keep you updated on the progress of your request. Thank you for choosing Vodafone."
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `BC Change Request`

**NOTIF-004: DEFAULT TT SMS TEMPLATE** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=None, Area=None, Sub Area=None
- **Message (English):** "We have received your complaint, and your tracking number is [Service Request.SR Number]. You can easily track your complaint status and check updates through My Vodafone App or our chatbot https://mva.qa/chatbot/deeplink/MOD_CHATBOT?labeeb=TrackComplaints.  لقد استلمنا شكواك، ورقم التتبع هو [Service Request.SR Number]. يمكنك بسهولة متابعة حالة الشكوى والتحقق من التحديثات من خلال تطبيق My Vodafone  أو عبر المحادثة الآلية  https://mva.qa/chatbot/deeplink/MOD_CHATBOT?labeeb=TrackComplaints."
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `DEFAULT TT SMS TEMPLATE`

**NOTIF-005: DEFAULT TT SMS TEMPLATE_ReOpen** `Explicit` · confidence: `high`
- **Trigger:** TT Source=None, Category=None, Area=None, Sub Area=None
- **Message (English):** "We have re-opened your complaint for further investigation. Your complaint tracking number is [Service Request.SR Number]. You can now track your complaint through MyVodafone App (www.mva.qa/deeplink/TROUBLE_TICKETS). Thank You. لقد قمنا باعادة فتح شكواك لاعادة التحقق. الرقم الجديد لتتبع الشكوى هو [Service Request.SR Number]. يمكنك الاطلاع على أخر مستجدات الشكوى عن طريق تطبيق فودافون www.mva.qa/deeplink/TROUBLE_TICKETS. شكرا لك"
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `DEFAULT TT SMS TEMPLATE_ReOpen`

**NOTIF-006: Disconnection** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=Requests, Area=Account Management, Sub Area=Disconnection
- **Message (English):** "Your request to discontinue your postpaid plan has been received. Our team will contact you within 3 working days.  Please ensure any outstanding bills are settled to avoid rejection of your request. Any renewal charges incurred during this period will be adjusted.  Track your request via My Vodafone App: https://mva.qa/deeplink/COMPLAINTS  For faster assistance, call 40051126 (9 AM – 10 PM).  Ticket Number: [Service Request.SR Number] Vodafone Number: [Service Request.Serial Number]  لقد استلمنا طلبكم لإلغاء الباقة الشهرية، وسيتم التواصل معكم خلال 3 أيام عمل.  يرجى سداد أي فواتير مستحقة لتجنب رفض الطلب. سيتم تعديل أي رسوم تجديد تُحتسب خلال هذه الفترة.  يمكنكم متابعة الطلب عبر تطبيق MyVodafone: https://mva.qa/deeplink/COMPLAINTS  للمساعدة السريعة يرجى الاتصال على 40051126 (من 9 صباحًا إلى 10 مساءً)."
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `Disconnection`

**NOTIF-007: Migration to Prepay** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=Requests, Area=Account Management, Sub Area=Migration to Prepay
- **Message (English):** "Your request to migrate your number to prepaid has been successfully received. Our team will contact you within 3 working days. Please ensure all outstanding bills are cleared and the QAR 100 migration fee is paid to avoid rejection of your request. Any renewal charges applied during this period will be adjusted accordingly.  Track your request via My Vodafone App: https://mva.qa/deeplink/COMPLAINTS  For faster assistance, call 40051126 (9 AM – 10 PM).  Ticket Number: [Service Request.SR Number] Vodafone Number: [Service Request.Serial Number]  تم استلام طلبكم لتحويل رقمكم إلى باقة مسبقة الدفع. سيتواصل معكم فريقنا خلال 3 أيام عمل.  يرجى سداد أي فواتير مستحقة ودفع رسوم التحويل البالغة 100 ر.قلتجنب رفض طلبك. سيتم تعديل أي رسوم تجديد تُحتسب خلال هذه الفترة.  يمكنكم متابعة الطلب عبر تطبيق MyVodafone: https://mva.qa/deeplink/COMPLAINTS  للمساعدة السريعة يرجى الاتصال على 40051126 (من 9 صباحًا إلى 10 مساءً)."
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `Migration to Prepay`

**NOTIF-008: Plan Downgrade** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=Requests, Area=Account Management, Sub Area=Plan Downgrade
- **Message (English):** "Your request to downgrade your postpaid plan has been received. Our team will contact you within 3 working days. Please ensure all outstanding bills are paid as soon as possible to avoid rejection of your request. Any charges generated due to plan renewal during this period will be waived. You can track your request anytime via My Vodafone App.https://mva.qa/deeplink/COMPLAINTS  Ticket Number: [Service Request.SR Number] Vodafone Number: [Service Request.Serial Number]  لقد تلقينا طلبك لتخفيض باقة الاشتراك الشهري الخاصة بك، وسيقوم فريقنا بالتواصل معك خلال ثلاثة أيام عمل. نرجو منك سداد أي فواتير مستحقة في أقرب وقت لتجنب رفض الطلب. يرجى الملاحظة بأنه سيتم إلغاء أي رسوم ناتجة عن تجديد الباقة خلال هذه الفترة. يمكنك متابعة حالة طلبك من خلال تطبيق My Vodafone. https://mva.qa/deeplink/COMPLAINTS"
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `Plan Downgrade`

**NOTIF-009: Refund Request** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=Requests, Area=Refunds, Sub Area=Duplicate Payments
- **Message (English):** "Your refund request for refund has been received and validation is in progress. We will keep you updated on the progress of the request.  Ticket Number: [Service Request.SR Number] Vodafone Number: [Service Request.Serial Number]  تم استلام طلبك لاسترداد المبلغ وجارٍ التحقق منه. سنبقيك على اطلاع بمستجدات طلبك. رقم الطلب: [Service Request.SR Number] رقم فودافون:  [Service Request.Serial Number]"
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `Refund Request`

**NOTIF-010: Retention** `Explicit` · confidence: `high`
- **Trigger:** TT Source=Customer, Category=Requests, Area=Account Management, Sub Area=Retention
- **Message (English):** "Your request to discontinue your postpaid plan has been received. Our team will contact you within 3 working days.  Please ensure any outstanding bills are settled to avoid rejection of your request. Any renewal charges incurred during this period will be adjusted.  Track your request via My Vodafone App: https://mva.qa/deeplink/COMPLAINTS  For faster assistance, call 40051126 (9 AM – 10 PM).  Ticket Number: [Service Request.SR Number] Vodafone Number: [Service Request.Serial Number]  لقد استلمنا طلبكم لإلغاء الباقة الشهرية، وسيتم التواصل معكم خلال 3 أيام عمل.  يرجى سداد أي فواتير مستحقة لتجنب رفض الطلب. سيتم تعديل أي رسوم تجديد تُحتسب خلال هذه الفترة.  يمكنكم متابعة الطلب عبر تطبيق MyVodafone: https://mva.qa/deeplink/COMPLAINTS  للمساعدة السريعة يرجى الاتصال على 40051126 (من 9 صباحًا إلى 10 مساءً)."
- **Source:** `data/SMS Templates.xlsx` → Automatic SMS Templates sheet, row keyword `Retention`

### 1.2 Lead Automated SMS Templates (callback confirmation)

**NOTIF-011: CallBack SMS FNP** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = FNP, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS FNP`

**NOTIF-012: CallBack SMS Home** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = Home, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS Home`

**NOTIF-013: CallBack SMS MNP** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = MNP, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS MNP`

**NOTIF-014: CallBack SMS PU** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = Plan upgrades, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS PU`

**NOTIF-015: CallBack SMS Postpaid** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = Postpaid, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS Postpaid`

**NOTIF-016: CallBack SMS Pre2Post** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = Pre to Post, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS Pre2Post`

**NOTIF-017: CallBack SMS Prepaid** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = Prepaid, Template Type = FrontLine
- **Message (English):** "Thank you for contacting Vodafone and expressing your interest in [Service Needed].We will be reaching out to you on [Follow up Date].If you need any assistance in the meantime, feel free to call us anytime at 111.Warm regards, Team Vodafone"
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `CallBack SMS Prepaid`

**NOTIF-018: Downgrade Unreachable** `Explicit` · confidence: `high`
- **Trigger:** Lead created for Service Needed = Postpaid, Template Type = FrontLine
- **Message (English):** "Dear Customer, we tried reaching you regarding your downgrade request. We have an exclusive Vodafone offer that may better suit your needs. Please call us on 40051126 to speak with one of our advisors."
- **Source:** `data/SMS Templates.xlsx` → Lead Automated SMS Templates sheet, row keyword `Downgrade Unreachable`

### 1.3 Other Automated SMS Templates (plan/service change confirmations)

**NOTIF-019: PLAN CALC TEMPLATE_ADDON** `Explicit` · confidence: `high`
- **Trigger:** Service Type=None, Template Type=None
- **Message (English, truncated):** "Thanks for choosing Vodafone. If you activate/have activated your add-on today, here are some important info about your service:  Monthly Bill Cycle: $BillCycle$ Partial Add-on charge: QR$proratedamount$ Advance Add-on charge next month: QR$advancerental$ Upcoming additional charge to existing bill:..."
- **Source:** `data/SMS Templates.xlsx` → Other Automated SMS Templates sheet, row keyword `PLAN CALC TEMPLATE_ADDON`

**NOTIF-020: PLAN CALC TEMPLATE_PLAN** `Explicit` · confidence: `high`
- **Trigger:** Service Type=None, Template Type=None
- **Message (English, truncated):** "Thanks for choosing Vodafone. If you activate/have activated your plan today, here are some important info about your service:  Monthly Bill Cycle: $BillCycle$ Partial Plan charge: QR$proratedamount$ Advance Plan charge next month: QR$advancerental$ Approximate Upcoming bill: QR$firstbill$  This bil..."
- **Source:** `data/SMS Templates.xlsx` → Other Automated SMS Templates sheet, row keyword `PLAN CALC TEMPLATE_PLAN`

**NOTIF-021: PLAN CALC TEMPLATE_PLAN_ADDON** `Explicit` · confidence: `high`
- **Trigger:** Service Type=None, Template Type=None
- **Message (English, truncated):** "Thanks for choosing Vodafone. If you activate/have activated your plan/add-on today, here are some important info about your service:  Monthly Bill Cycle: $BillCycle$ Partial Plan/Add-on charge: QR$proratedamount$ Advance Plan/Add-on charge next month: QR$advancerental$ Approximate Upcoming bill: QR..."
- **Source:** `data/SMS Templates.xlsx` → Other Automated SMS Templates sheet, row keyword `PLAN CALC TEMPLATE_PLAN_ADDON`

**NOTIF-022: PLAN CALC TEMPLATE_PLAN_ADDON_DISCOUNT** `Explicit` · confidence: `high`
- **Trigger:** Service Type=None, Template Type=None
- **Message (English, truncated):** "Thanks for choosing Vodafone. If you activate/have activated your plan and add-on today, here are some important info about your service:  Monthly Bill Cycle: $BillCycle$ Partial Plan/Add-on charge: QR$proratedamount$ Advance Plan/Add-on charge next month: QR$advancerental$ Discount applied: $sDisco..."
- **Source:** `data/SMS Templates.xlsx` → Other Automated SMS Templates sheet, row keyword `PLAN CALC TEMPLATE_PLAN_ADDON_DISCOUNT`

**NOTIF-023: PLAN CALC TEMPLATE_PLAN_DISCOUNT** `Explicit` · confidence: `high`
- **Trigger:** Service Type=None, Template Type=None
- **Message (English, truncated):** "Thanks for choosing Vodafone. If you activate/have activated your plan today, here are some important info about your service:  Monthly Bill Cycle: $BillCycle$ Partial Plan charge: QR$proratedamount$ Advance Plan charge next month: QR$advancerental$ Discount applied: $sDiscountper$$sDiscountQR$ Appr..."
- **Source:** `data/SMS Templates.xlsx` → Other Automated SMS Templates sheet, row keyword `PLAN CALC TEMPLATE_PLAN_DISCOUNT`

**NOTIF-024: VFQA_SALES_REJECTION_TASK** `Explicit` · confidence: `high`
- **Trigger:** Service Type=None, Template Type=None
- **Message (English, truncated):** "Fixed Line Order Update The below Fixed Line order has been set to Pending due to a Sales Rejection Task. Please review the order details and take the required action: • Service ID: [Order Entry - Orders.VFQA MSISDN] • Order Number: [Order Entry - Orders.Order Number] • KID: [Order Entry - Orders.VF..."
- **Source:** `data/SMS Templates.xlsx` → Other Automated SMS Templates sheet, row keyword `VFQA_SALES_REJECTION_TASK`

## 2. In-App Error/Warning Messages (verbatim, from `field-inventory.md`)

970 fields were catalogued; 79 carry a verbatim error message evidenced in a source document. All are inline field-level banners/tooltips, not toasts. Representative sample (full list is `field-inventory.md`, filter for populated `error_message`):

- **FLD-212** (Contact record (create/update) - CRM — Email): "Email format entered is incorrect..."
- **FLD-214** (Contact record (create/update) - CRM — ID Number): "Please enter a valid 11-digit ID number"
- **FLD-218** (Contact record (create/update) - CRM — Alternate/Cellular Phone #): "Enter a Cellular Phone# that starts with '974'"
- **FLD-223** (Contact record (create) - CRM authorization — Safwa Contact creation authorization flag): "You are not authorized to create Safwa Contact"
- **FLD-224** (Contact record (create) - CRM authorization — Qatari Contact creation authorization flag): "You are not authorized to create Qatari Contact"
- **FLD-289** (New Fixed Line – Book Appointment confirm dialog — Appointment booking confirm (cannot-cancel warning)): "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."
- **FLD-290** (New Fixed Line – Appointment fetched / booking success — Appointment Number / Technician ID / Appointment ID (success result)): "Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242. (Fulfilment); Appointment ID is 121379 (Cross Sales)"
- **FLD-292** (New Fixed Line – Activity/completion step — Comments / Order completion dialog): "Fixed Line completed successfully. Order Number:- '1-29793912388' (Cross Sales); Order Number:- '1-26921279847' (Fulfilment)"
- **FLD-301** (Fulfilment – Fixed Line IPTV popup — Tick box for different billing email / Billing Email): "IDM Created Successfully"
- **FLD-306** (Tablet Combo Box Normal Activation – Prepatched device detection dialog — Activation type choice (Instant/Normal)): "We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?"
- **FLD-312** (New Fixed Line Tablet – Number Selection Step — Free/Available number selection): "SUCCESS:Reservation Token:15332434(SBL-EXL-00151) / SUCCESS:Reservation Token:15332436(SBL-EXL-00151)"
- **FLD-314** (New Fixed Line Tablet – Booking Confirmation Dialogs — Booking cancel warning / booking success message): "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment; "Appointment has been successfully booked...Appointment ID is 14241" / "...Appointment ID is 14243""
- **FLD-319** (New Fixed Line Tablet – Order Completion Dialog — Order completion message): ""Fixed Line completed successfully. Order Number:- '1-29795175561'" / "...'1-29795232313'""
- **FLD-325** (Tablet Non Combo Box Normal Activation – Contact warning — Customer already refused service warning): "Customer already refused the service."
- **FLD-331** (Tablet Non Combo Box Normal Activation – Order Correction resubmit confirmation — Resubmission confirmation message): "Your activation request is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval"
- **FLD-332** (Tablet Non Combo Box Normal Activation – Approve Order modal — Approve Order confirmation checkbox/comment): "By clicking submit, I agree that I have verified all the documents and details to proceed with submission."
- **FLD-352** (New Fixed Line Tablet - Step 1 Contact profile fields — Alt. phone #): "This is a notification contact. Please enter a local mobile number."
- **FLD-367** (New Fixed Line Tablet - Step 5 Number Selection — Number Reserve confirmation): "SUCCESS:Reservation Token:15332433(SBL-EXL-00151)"
- **FLD-370** (Order Approval - Approve Order modal — Approve Order Comments): "By clicking submit,I agree that I have verified all the documents and details to proceed with submission"
- **FLD-378** (New Fixed Line Tablet - Step 6 Book Appointment submit — Appointment cancel warning): "WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment"

_59 more in `field-inventory.md`._

## 3. Confirmation Dialogues (from `reusable-patterns.md`)

Modal confirmation patterns evidenced across screens (not simple toasts — these block progression pending explicit user acknowledgment):

- **Order Approval** (Pattern 5): Approve requires a verification-acknowledgment statement + Comments; Reject requires a multi-select Reason dropdown + Comments, optionally triggering an SMS.
- **CAF/Contract Signature** (Pattern 6): "Please Sign" modal with Clear Signature / Done.
- **Number Reservation** (Pattern 10): native browser alert "SUCCESS: Reservation Token:...(SBL-EXL-...)" — evidenced as a native `alert()`, not a styled toast, in the legacy system; a modernized DXP should replace this with a styled toast carrying the same trigger condition and message content.
- **Attachment Gating** (Pattern 12): inline red banner blocking Continue until a mandatory file is uploaded.

## 4. Toast/Alert taxonomy for implementation (Assumed — UI-severity mapping)

The corpus evidences message *content* and *trigger conditions* extensively (above) but not a formal severity/UI-treatment taxonomy (e.g. which messages are toasts vs. banners vs. modals is often just "a dialog" or "a banner" in the source screenshots, not a documented design system). The following mapping is a reasonable **Assumed** default, not evidenced:

| UI treatment | When to use | Example from this catalogue |
|---|---|---|
| Inline field error | Field-level validation failure, non-blocking to the rest of the form | FLD-212 Email format error |
| Blocking banner (top of step) | Step-level validation failure (missing mandatory field/attachment) preventing Continue | "Please select Supplementary Form before continuing." |
| Toast (auto-dismiss) | Successful background action (e.g. draft saved, SMS sent) | Order/Lead SMS confirmations (§1) |
| Modal (requires acknowledgment) | Order approval/rejection, contract signature, irreversible actions | Order Approval, CAF Signature (§3) |
| Native browser alert | **Legacy-only** — evidenced in the current Siebel/Open UI system; do not carry forward into the new DXP (replace with styled toast/modal per the row above) | Number reservation confirmation; all FWA negative-scenario errors in `exception-catalogue.md` |
