# Persona Matrix (Final Deliverable #7)

A simple Persona × Module cross-tab, complementing the detailed screen/action-level `rbac-matrix.md`. Cell values summarize the *strongest* evidenced permission level for that persona within that module (F=Full, A=Approve/Reject, E=Edit, C=Create, ~=Conditional, V=View, X=Restricted-No-Access, blank=no RBAC evidence for that persona in that module — see the caveat below).

**Important caveat, carried from `rbac-matrix.md`:** a blank cell means *no evidence*, not *no access*. Of 66 personas: 61 have at least one RBAC entry, but only 95 of the 145 total RBAC entries carry a `screen_id` that resolves to a module (see `rbac-matrix.md`'s method note) — so only 30 personas appear in the module cross-tab below. The other 31 personas-with-RBAC-evidence are listed separately (their access is real, just not module-attributable), and 5 personas have zero RBAC evidence at all. Do not read a blank row/column as "this persona has zero access to this module."

---

| Persona | Lead Managemen | Mobile Postpai | Mobile Prepaid | Pre-to-Post Mi | MNP | Fixed Line | FWA | Enterprise | Billing & Adju | Order Manageme | Identity & Cus | SIM & Number M | Trouble Ticket | Access | CAF | Platform Gover |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PERSONA-001 Retail/Sales Agent (Frontlin | ~ | ~ |  | C | C | C | C |  |  | V | V |  |  |  | V |  |
| PERSONA-002 Account Manager |  |  |  |  |  |  |  |  |  | A |  |  |  |  |  |  |
| PERSONA-004 Fulfilment Agent / Fulfilmen |  |  |  |  | C | C |  | C |  |  |  |  |  |  |  |  |
| PERSONA-005 Back Office Fulfilment Agent | E |  |  |  |  | C | V |  |  |  |  |  |  |  |  |  |
| PERSONA-007 Business Finance |  |  |  |  |  | A |  |  |  |  |  |  |  |  |  |  |
| PERSONA-012 EBU Operations |  |  |  |  |  |  |  |  |  | C |  |  |  |  |  |  |
| PERSONA-015 Customer (Consumer/Enterpris |  |  |  | ~ | C |  | ~ |  |  | ~ |  | ~ |  |  |  |  |
| PERSONA-016 Donor Operator (Ooredoo/QTEL |  |  |  |  | A |  |  |  |  |  |  |  |  |  |  |  |
| PERSONA-017 Manager/Approver (Delegation |  |  |  |  |  |  |  | A |  |  |  |  |  |  |  |  |
| PERSONA-018 Presenter (Enterprise Knowle |  |  |  |  |  | V |  |  |  |  |  |  |  |  |  |  |
| PERSONA-019 Manager (Approver/Bypass/Sys |  | F |  |  |  |  |  |  |  |  |  |  |  |  | F |  |
| PERSONA-022 Retention Agent / Retention  |  |  |  |  |  |  |  |  |  | A |  |  | A |  |  |  |
| PERSONA-025 Field Technician / Field Eng |  |  |  |  |  | C | C |  |  |  |  |  |  |  |  |  |
| PERSONA-041 Team Manager / Approver / Ma | E |  |  |  |  | F |  |  |  | F |  |  |  | F |  |  |
| PERSONA-042 Retention Team (FDO Disconne |  |  |  |  |  |  |  |  |  | F |  |  |  |  |  |  |
| PERSONA-043 Retail Agent (Lead Owner, re |  |  |  |  |  |  |  |  |  | E |  |  |  | V |  |  |
| PERSONA-044 Back Office / Admin (broad o | F |  |  |  |  |  |  |  |  | F |  |  |  |  |  |  |
| PERSONA-046 Dispatcher/Back-Office WFM U |  |  |  |  |  | E | C |  |  |  |  |  |  |  |  |  |
| PERSONA-047 CSR / Desktop Agent (Vanilla |  | E |  |  |  |  | E |  |  |  |  |  |  |  |  |  |
| PERSONA-048 Fulfillment Team (ECR Detail |  |  |  |  |  | X |  |  |  |  |  |  |  |  |  |  |
| PERSONA-049 System Administrator (Produc |  | E |  |  |  |  |  |  |  |  |  |  |  |  | V |  |
| PERSONA-050 System user SADMIN (backend/ |  |  |  | F |  |  |  |  |  |  |  |  |  |  |  |  |
| PERSONA-051 Channel Manager |  |  |  |  |  |  |  |  |  | A |  |  |  |  |  |  |
| PERSONA-052 Offshore Retailer / Channel  | X |  |  |  |  |  |  |  |  | X |  |  |  | X |  |  |
| PERSONA-058 Agent viewing Open UI Deskto | ~ | ~ |  |  |  | V | V |  |  |  |  |  |  |  |  |  |
| PERSONA-059 Complaints Team (Mobile and  |  |  |  |  |  |  |  |  |  |  |  |  | E |  |  |  |
| PERSONA-063 Agent (in DXP) |  |  |  |  | F |  |  |  |  |  |  |  |  |  |  |  |
| PERSONA-064 Assisted Care Agent |  |  |  |  | V |  |  |  |  |  |  |  |  |  |  |  |
| PERSONA-065 MNP Team |  |  |  |  |  |  |  |  |  |  |  |  | A |  |  |  |
| PERSONA-066 FL Agents (Front Line Agents |  |  |  |  |  |  |  |  |  |  |  |  | E |  |  |  |

**Legend:** F=Full, A=Approve/Reject, E=Edit, C=Create, ~=Conditional, V=View, X=Restricted-No-Access, blank=no RBAC evidence
**Module key:** Lead Managemen=Lead Management, Mobile Postpai=Mobile Postpaid, Mobile Prepaid=Mobile Prepaid, Pre-to-Post Mi=Pre-to-Post Migration, MNP=MNP / FNP Porting, Fixed Line=Fixed Line / Fibre, FWA=FWA / 5G Home, Enterprise=Enterprise / IoT / B2B, Billing & Adju=Billing & Adjustments, Order Manageme=Order Management, Identity & Cus=Identity & Customer Management, SIM & Number M=SIM & Number Management, Trouble Ticket=Trouble Ticketing & Complaints, Access=Access, Roles & Approval Governance, CAF=CAF, Attachments & Forms, Platform Gover=Platform Governance & Architecture

---

## Personas with RBAC evidence that didn't resolve to a module (31 of 66)

These personas DO have RBAC entries in `rbac-matrix.md` — the entries just didn't carry a resolvable `screen_id` (the synthesis agent left it blank when no confident screen match existed, per `rbac-matrix.md`'s method note), so they can't be placed in the module cross-tab above. Consult `rbac-matrix.md` directly for their actual evidenced access — do not read their absence from the matrix as "no access."

- **PERSONA-003: Account Manager / Channel Partner (External enterprise)**
- **PERSONA-006: Credit Control / Collection & Credit Control**
- **PERSONA-008: IT Operations**
- **PERSONA-009: Chooser**
- **PERSONA-010: Payment Support Contact**
- **PERSONA-011: Technical Contact**
- **PERSONA-014: Business Care**
- **PERSONA-020: Billing Team / Billing Role**
- **PERSONA-021: Collection/Credit Control Team (Manual Suspension via Taurus)**
- **PERSONA-023: CDM Team / Customer Data Management**
- **PERSONA-024: Supervisor**
- **PERSONA-026: Rollout Team**
- **PERSONA-027: Sales Team (Win-back)**
- **PERSONA-028: Managing Queue / CDM / BOQ / QATQ (routing queues)**
- **PERSONA-029: MOI (Ministry of Interior, external system/authority)**
- **PERSONA-030: Store Agent (TON)**
- **PERSONA-031: Business Analyst (Rana)**
- **PERSONA-032: Solution/Financial Architect (Marishi)**
- **PERSONA-033: Retail Agent (Retail Operations Stakeholder - Giri)**
- **PERSONA-034: Authorized Officer**
- **PERSONA-035: Credit Control / Billing Stakeholder (Anwar Mishra)**
- **PERSONA-036: Security Stakeholder (Ali)**
- **PERSONA-037: Qatar Visa Center (QVC) Staff**
- **PERSONA-038: Offshore Airport Staff / Third-Party Partner (Offshore Prepaid Activation)**
- **PERSONA-039: Fulfilment Manager Sign-off (Fixed & Mobile Fulfilment and Technical Support)**
- **PERSONA-040: GTM & Channel Operations**
- **PERSONA-056: Network Team**
- **PERSONA-057: Business/Strategy Team**
- **PERSONA-060: Back Office (generic activity channel)**
- **PERSONA-061: Product Team**
- **PERSONA-062: Solution Architect / Business Owner / IT Owner / Track Lead / Test Manager / Delivery Manager (Governance)**

---

## Personas with zero RBAC evidence at all (5 of 66)

Matches `gap-analysis.md` §3 exactly — reproduced here for completeness of this matrix:

- **PERSONA-013: EBU PM (Project Manager)**
- **PERSONA-045: DSA / Store / Field Engineer (sales channel attribution)**
- **PERSONA-053: Customer Care / Telesales & Retention / Complaints / Direct Sales / Mass Market / Mini Store / Retail & Franchise agents (role families)**
- **PERSONA-054: Sales / Fulfilment (VFID-KID mapping team)**
- **PERSONA-055: Field Survey Team**
