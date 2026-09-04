import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  deals,
  tasks,
  teamMembers,
  invoices,
  campaigns,
  leaveRequests,
  employees,
  openPositionsCount
} from './data';
import {
  getSalesStatus,
  getOperationsStatus,
  getFinanceStatus,
  getMarketingStatus,
  getHRStatus
} from './statusLogic';

const router = Router();
const JWT_SECRET = 'secret123';

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Please provide a valid Bearer token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
}

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === 'ceo@realestate.com' && password === 'admin123') {
    const token = jwt.sign({ email, role: 'CEO' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      token,
      user: { name: 'Aamil Silawat', role: 'CEO', email: 'ceo@realestate.com' }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Use email: ceo@realestate.com and password: admin123'
  });
});

router.get('/dashboard', requireAuth, (req: Request, res: Response) => {
  const departments = [
    { id: 'sales', ...getSalesStatus() },
    { id: 'operations', ...getOperationsStatus() },
    { id: 'finance', ...getFinanceStatus() },
    { id: 'marketing', ...getMarketingStatus() },
    { id: 'hr', ...getHRStatus() }
  ];

  const greenCount = departments.filter(d => d.status === 'green').length;
  const amberCount = departments.filter(d => d.status === 'amber').length;
  const redCount = departments.filter(d => d.status === 'red').length;

  res.json({
    success: true,
    data: {
      departments,
      overallHealth: { greenCount, amberCount, redCount }
    }
  });
});

router.get('/sales', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    deals,
    metrics: getSalesStatus()
  });
});

router.patch('/sales/deals/:id/status', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const deal = deals.find(d => d.id === id);
  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal not found' });
  }

  deal.stage = status;
  res.json({
    success: true,
    message: `Deal marked as ${status.toUpperCase()}`,
    deal,
    updatedMetrics: getSalesStatus()
  });
});

router.get('/operations', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    tasks,
    teamMembers,
    metrics: getOperationsStatus()
  });
});

router.patch('/operations/tasks/:id/reassign', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  task.assignedTo = assignedTo;
  task.status = 'in_progress';

  res.json({
    success: true,
    message: `Task reassigned to ${assignedTo}`,
    task,
    updatedMetrics: getOperationsStatus()
  });
});

router.get('/finance', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    invoices,
    metrics: getFinanceStatus()
  });
});

router.patch('/finance/invoices/:id/approve', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;

  const invoice = invoices.find(i => i.id === id);
  if (!invoice) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  invoice.status = 'approved';

  res.json({
    success: true,
    message: `Invoice ${invoice.invoiceNumber} approved`,
    invoice,
    updatedMetrics: getFinanceStatus()
  });
});

router.get('/marketing', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    campaigns,
    metrics: getMarketingStatus()
  });
});

router.patch('/marketing/campaigns/:id/status', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;

  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) {
    return res.status(404).json({ success: false, message: 'Campaign not found' });
  }

  campaign.status = campaign.status === 'active' ? 'paused' : 'active';

  res.json({
    success: true,
    message: `Campaign is now ${campaign.status.toUpperCase()}`,
    campaign,
    updatedMetrics: getMarketingStatus()
  });
});

router.get('/hr', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    leaveRequests,
    employees,
    openPositionsCount,
    metrics: getHRStatus()
  });
});

router.patch('/hr/leave-requests/:id/approve', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;

  const request = leaveRequests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Leave request not found' });
  }

  request.status = 'approved';

  res.json({
    success: true,
    message: `Leave request for ${request.employeeName} approved`,
    leaveRequest: request,
    updatedMetrics: getHRStatus()
  });
});

export default router;
