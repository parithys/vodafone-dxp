import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { DataTable } from '../../../components/primitives/DataTable';
import { formatAmountAny } from '../../../lib/format';

/**
 * customer360-fields.json's Assets topic is per-line (MSISDN Status, Plan
 * Name, activation dates, …), not per-customer - a customer with 4 lines
 * can't be represented by one flat "Plan Name: X" row. This resolves the
 * topic's fields against ONE specific service where possible.
 *
 * Only services built from the `installedAssets` join in
 * customerServicesEngine.ts (generic broadband/mobile lines carrying a real
 * serviceId/installedAssetId) match cleanly - verified against this corpus:
 * the customer's own primary mobile line (`ref` = their phone number) and
 * GigaHome/IPTV subscriptions (`ref` = their own subscription ids) have NO
 * matching installedAssets row or order at all, so most per-line fields are
 * genuinely unavailable for them, not a resolver bug. `service === undefined`
 * resolves only the account-level shared fields (balance, usage, DOI) that
 * this corpus doesn't split by individual line.
 */
export function buildAssetsFieldResolver(service: CustomerService | undefined, data: Customer360Data) {
  const asset = service
    ? data.installedAssets.find((ia) => ia.serviceId === service.ref || ia.installedAssetId === service.ref)
    : undefined;
  const order = service ? data.orders.find((o) => o.msisdn === service.ref) : undefined;
  const planId = asset ? data.assetPlanIds[String(asset.installedAssetId)] : undefined;
  const addon = planId ? data.addonsDiscounts.find((ad) => ad.planId === planId) : undefined;
  const balance = data.inPlatformBalances[0];
  const usage = data.serviceUsage[0];
  const doi = data.deviceInstallments[0];
  const digital = data.digitalEngagement[0];

  return (details: string): React.ReactNode | undefined => {
    switch (details) {
      case 'MSISDN Status (Active, Suspended, Barred)':
        return (asset?.status as string | undefined) ?? (service ? data.accounts[0]?.status : undefined);
      case 'Plan Name':
        return (asset?.productServiceName as string | undefined) ?? (service?.label);
      case 'MSISDN Activation Date':
      case 'Postpaid Activation Date':
        return asset?.postpaidActivationDate as string | undefined;
      case 'Plan Activation Date':
        return asset?.effectiveFrom as string | undefined;
      case 'Sim serial':
        return order?.simSerial as string | undefined;
      case 'Pending Discounts':
        return addon && addon.category === 'Discount' && addon.isLockedReadOnly === false ? String(addon.name) : undefined;
      case 'Active Add-on':
        return addon && addon.category !== 'Discount' ? String(addon.name) : undefined;
      case 'Active Discount':
        return addon && addon.category === 'Discount' ? String(addon.name) : undefined;
      case 'Existing Discounts Expiry Date':
        return addon?.durationMonths !== null && addon?.durationMonths !== undefined
          ? `${String(addon.durationMonths)} month(s) from activation`
          : undefined;
      case 'Current Balance (Data,Voice, Text, Primary Balance)':
        return balance
          ? `Data ${String(balance.dataBalanceGB ?? '-')} GB · Voice ${String(balance.voiceBalanceMinutes ?? '-')} min · SMS ${String(balance.smsBalanceCount ?? '-')} · Main ${formatAmountAny(String(balance.mainBalanceQAR ?? '-'))} QAR`
          : undefined;
      case 'Usage Behaviour (High Data, High Roaming, High Local Call, High International Calls)':
        return usage
          ? `Data ${String(usage.currentDataUsageGB ?? '-')} GB · Voice ${String(usage.currentVoiceUsageMinutes ?? '-')} min this period`
          : undefined;
      case '10 Recent Usages (Data, Calls, Text, OOB)':
        return data.callDetailRecords.length > 0 ? `${Math.min(10, data.callDetailRecords.length)} most recent` : undefined;
      case 'DOI Handset Type':
        return doi?.deviceName as string | undefined;
      case 'DOI Price':
        return doi?.devicePriceQar !== undefined ? `${formatAmountAny(String(doi.devicePriceQar))} QAR` : undefined;
      case 'DOI Remaining Amount': {
        if (!doi) return undefined;
        const price = Number(doi.devicePriceQar ?? 0);
        const down = Number(doi.downPaymentQar ?? 0);
        return `${formatAmountAny(Math.max(0, price - down))} QAR`;
      }
      case 'DOI Tennure':
        return doi?.installmentMonths !== undefined ? `${String(doi.installmentMonths)} months` : undefined;
      case 'Last Recharge Amount':
        return digital?.lastRechargeAmountQar != null ? `${formatAmountAny(String(digital.lastRechargeAmountQar))} QAR on ${String(digital.lastRechargeAt ?? '').slice(0, 10)}` : undefined;
      case 'Last Recharge Type':
        return digital?.lastRechargeType as string | undefined;
      case 'App Recent/Last Login (Date & Time)':
        return digital?.appLastLoginAt as string | undefined;
      case 'App Active User (Y/N)':
        return digital ? (digital.appActiveUser ? 'Yes' : 'No') : undefined;
      case 'App Digital Adoption %':
        return digital?.appDigitalAdoptionPct != null ? `${String(digital.appDigitalAdoptionPct)}%` : undefined;
      case 'App Version':
        return digital?.appVersion as string | undefined;
      default:
        return undefined;
    }
  };
}

/** Detail views for Assets fields that are real-time tiles with a table behind them (opened inline on click). */
export function assetsRichFields(data: Customer360Data): Record<string, React.ReactNode> {
  return {
    '10 Recent Usages (Data, Calls, Text, OOB)': (
      <DataTable
        rows={[...data.callDetailRecords].sort((a, b) => String(b.callDate ?? '').localeCompare(String(a.callDate ?? ''))).slice(0, 10)}
        rowKey={(r) => String(r.cdrId)}
        emptyMessage="No recent usage on file for this customer."
        columns={[
          { key: 'callDate', header: 'Date' },
          { key: 'callType', header: 'Type' },
          { key: 'destination', header: 'Destination' },
          { key: 'durationSeconds', header: 'Duration (s)' },
          { key: 'chargeQAR', header: 'Charge (QAR)' },
        ]}
      />
    ),
    'Current Balance (Data,Voice, Text, Primary Balance)': (
      <DataTable
        rows={data.inPlatformBalances}
        rowKey={(r) => String(r.balanceId)}
        emptyMessage="No balance on file."
        columns={[
          { key: 'dataBalanceGB', header: 'Data (GB)' },
          { key: 'voiceBalanceMinutes', header: 'Voice (min)' },
          { key: 'smsBalanceCount', header: 'SMS' },
          { key: 'mainBalanceQAR', header: 'Main (QAR)' },
          { key: 'asOf', header: 'As of' },
        ]}
      />
    ),
    'Usage Behaviour (High Data, High Roaming, High Local Call, High International Calls)': (
      <DataTable
        rows={data.serviceUsage}
        rowKey={(r) => String(r.serviceUsageId)}
        emptyMessage="No usage on file."
        columns={[
          { key: 'period', header: 'Period' },
          { key: 'currentDataUsageGB', header: 'Data used (GB)' },
          { key: 'availableDataBalanceGB', header: 'Data left (GB)' },
          { key: 'currentVoiceUsageMinutes', header: 'Voice (min)' },
          { key: 'currentSpendQAR', header: 'Spend (QAR)' },
        ]}
      />
    ),
  };
}
