import { deals, tasks, invoices, campaigns, employees, openPositionsCount } from './data';

export type HealthStatus = 'green' | 'amber' | 'red';

export function formatMoney(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

export function getSalesStatus() {
  const activeDeals = deals.filter(d => d.stage === 'pipeline');
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const closedWonThisWeek = deals.filter(d => d.stage === 'won').length;

  let status: HealthStatus = 'green';
  let summary = 'Deals pipeline is on track';

  if (activeDeals.length < 2 || pipelineValue < 8000000) {
    status = 'red';
    summary = 'Critical: Active pipeline is too low';
  } else if (activeDeals.length < 4 || pipelineValue < 15000000) {
    status = 'amber';
    summary = 'Attention: Pipeline value is below monthly quota';
  }

  return {
    name: 'Sales',
    status,
    summary,
    metrics: [
      { label: 'Active Deals', value: activeDeals.length },
      { label: 'Pipeline Value', value: formatMoney(pipelineValue) },
      { label: 'Closed Won', value: closedWonThisWeek }
    ],
    raw: { activeDealsCount: activeDeals.length, pipelineValue, closedWonThisWeek }
  };
}

export function getOperationsStatus() {
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const activeStaffCount = 4;

  let status: HealthStatus = 'green';
  let summary = 'All field operations and maintenance are on time';

  if (overdueCount > 2) {
    status = 'red';
    summary = `${overdueCount} overdue tasks need immediate reassignment`;
  } else if (overdueCount > 0) {
    status = 'amber';
    summary = `${overdueCount} task is currently overdue`;
  }

  return {
    name: 'Operations',
    status,
    summary,
    metrics: [
      { label: 'Tasks Overdue', value: overdueCount },
      { label: 'Completed Today', value: completedCount },
      { label: 'Active Team', value: activeStaffCount }
    ],
    raw: { overdueCount, completedCount, activeStaffCount }
  };
}

export function getFinanceStatus() {
  const pending = invoices.filter(i => i.status === 'pending');
  const pendingValue = pending.reduce((sum, inv) => sum + inv.amount, 0);
  const revenuePercent = 82;

  let status: HealthStatus = 'green';
  let summary = 'Collections and cash flow are healthy';

  if (revenuePercent < 60 || pending.length > 5) {
    status = 'red';
    summary = 'Revenue is critically below target';
  } else if (revenuePercent < 80 || pending.length >= 3) {
    status = 'amber';
    summary = `${pending.length} pending invoices awaiting approval`;
  }

  return {
    name: 'Finance',
    status,
    summary,
    metrics: [
      { label: 'Revenue vs Target', value: `${revenuePercent}%` },
      { label: 'Pending Invoices', value: pending.length },
      { label: 'Pending Value', value: formatMoney(pendingValue) }
    ],
    raw: { revenuePercent, pendingCount: pending.length, pendingValue }
  };
}

export function getMarketingStatus() {
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const leadsGenerated = activeCampaigns.reduce((sum, c) => sum + c.leadsThisWeek, 0);
  const topSource = 'Google Search';

  let status: HealthStatus = 'green';
  let summary = 'Strong inbound customer lead volume';

  if (activeCampaigns.length === 0 || leadsGenerated < 40) {
    status = 'red';
    summary = 'Lead flow has critically dropped';
  } else if (activeCampaigns.length < 3 || leadsGenerated < 80) {
    status = 'amber';
    summary = 'Lead volume is moderate; some ad channels paused';
  }

  return {
    name: 'Marketing',
    status,
    summary,
    metrics: [
      { label: 'Active Campaigns', value: activeCampaigns.length },
      { label: 'Leads This Week', value: leadsGenerated },
      { label: 'Top Lead Source', value: topSource }
    ],
    raw: { activeCampaignsCount: activeCampaigns.length, leadsGenerated, topSource }
  };
}

export function getHRStatus() {
  const totalHeadcount = employees.length;
  const presentCount = employees.filter(e => e.present).length;
  const attendancePercent = Math.round((presentCount / totalHeadcount) * 100);

  let status: HealthStatus = 'green';
  let summary = `Team attendance is high at ${attendancePercent}%`;

  if (attendancePercent < 80 || openPositionsCount > 5) {
    status = 'red';
    summary = 'Staffing shortage is impacting daily operations';
  } else if (attendancePercent < 90 || openPositionsCount > 3) {
    status = 'amber';
    summary = 'Open roles and leaves need attention';
  }

  return {
    name: 'HR',
    status,
    summary,
    metrics: [
      { label: 'Total Headcount', value: totalHeadcount },
      { label: 'Open Positions', value: openPositionsCount },
      { label: 'Attendance Today', value: `${attendancePercent}%` }
    ],
    raw: { totalHeadcount, openPositionsCount, attendancePercent }
  };
}
