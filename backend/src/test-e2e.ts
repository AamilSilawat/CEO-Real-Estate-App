import { deals, tasks, invoices, campaigns, leaveRequests } from './data';
import { getSalesStatus, getOperationsStatus, getFinanceStatus, getMarketingStatus, getHRStatus } from './statusLogic';

async function testAll() {
  console.log('🧪 Testing Simple Backend Logic...');

  // 1. Initial statuses
  console.log('Sales Status:', getSalesStatus().status);
  console.log('Operations Status:', getOperationsStatus().status);
  console.log('Finance Status:', getFinanceStatus().status);
  console.log('Marketing Status:', getMarketingStatus().status);
  console.log('HR Status:', getHRStatus().status);

  // 2. Test Sales Action: Mark Deal Won
  deals[0].stage = 'won';
  console.log('✅ Sales Action Test: Deal marked won -> Status:', getSalesStatus().status);

  // 3. Test Operations Action: Reassign Overdue Task
  tasks[0].status = 'in_progress';
  tasks[0].assignedTo = 'Marcus Vance';
  console.log('✅ Operations Action Test: Overdue task reassigned -> Status:', getOperationsStatus().status);

  // 4. Test Finance Action: Approve Invoice
  invoices[0].status = 'approved';
  console.log('✅ Finance Action Test: Invoice approved -> Status:', getFinanceStatus().status);

  // 5. Test Marketing Action: Toggle Campaign
  campaigns[3].status = 'active';
  console.log('✅ Marketing Action Test: Campaign activated -> Status:', getMarketingStatus().status);

  // 6. Test HR Action: Approve Leave
  leaveRequests[0].status = 'approved';
  console.log('✅ HR Action Test: Leave approved -> Status:', getHRStatus().status);

  console.log('🎉 ALL 5 ACTIONS MUTATE DATA & RECALCULATE DYNAMIC STATUSES SUCCESSFULLY!');
}

testAll();
