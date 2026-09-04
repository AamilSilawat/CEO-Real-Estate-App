export interface Deal {
  id: string;
  propertyTitle: string;
  clientName: string;
  dealValue: number;
  stage: 'pipeline' | 'won' | 'lost';
  agentName: string;
}

export interface Task {
  id: string;
  title: string;
  propertyLocation: string;
  status: 'overdue' | 'in_progress' | 'completed';
  assignedTo: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'approved';
  category: string;
}

export interface Campaign {
  id: string;
  title: string;
  channel: string;
  status: 'active' | 'paused';
  leadsThisWeek: number;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  role: string;
  leaveType: string;
  days: number;
  status: 'pending' | 'approved';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  present: boolean;
}

export let deals: Deal[] = [
  { id: '1', propertyTitle: 'Grand View Penthouse (Unit 42A)', clientName: 'Sovereign Capital', dealValue: 4850000, stage: 'pipeline', agentName: 'Victoria Hayes' },
  { id: '2', propertyTitle: 'Marina Bay Commercial Plaza', clientName: 'Nexus Tech Global', dealValue: 8200000, stage: 'pipeline', agentName: 'James Montgomery' },
  { id: '3', propertyTitle: 'Oakridge Luxury Villa 7', clientName: 'Dr. Arthur Vance', dealValue: 2450000, stage: 'pipeline', agentName: 'Victoria Hayes' },
  { id: '4', propertyTitle: 'Highland Modern Villa', clientName: 'Evelyn St. Clair', dealValue: 3100000, stage: 'won', agentName: 'Sophie Turner' },
  { id: '5', propertyTitle: 'Downtown Skyline Tower (Fl 18)', clientName: 'Apex Health Systems', dealValue: 5600000, stage: 'pipeline', agentName: 'James Montgomery' },
  { id: '6', propertyTitle: 'Sunset Blvd Retail Strip', clientName: 'Kona Artisan Roasters', dealValue: 1200000, stage: 'lost', agentName: 'Sophie Turner' },
  { id: '7', propertyTitle: 'Bel Air Heritage Estate', clientName: 'Al-Mansoor Trust', dealValue: 12500000, stage: 'pipeline', agentName: 'Victoria Hayes' }
];

export let teamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Lead Inspector' },
  { id: '2', name: 'Marcus Vance', role: 'Operations Manager' },
  { id: '3', name: 'Elena Rostova', role: 'Facilities Specialist' },
  { id: '4', name: 'David Chen', role: 'Safety Officer' },
  { id: '5', name: 'Rachel Adams', role: 'Logistics Coordinator' }
];

export let tasks: Task[] = [
  { id: '1', title: 'Finalize Structural Inspection', propertyLocation: 'Marina Bay Plaza', status: 'overdue', assignedTo: 'Sarah Jenkins' },
  { id: '2', title: 'Resolve HVAC Noise Issue', propertyLocation: 'Grand View Tower', status: 'overdue', assignedTo: 'Marcus Vance' },
  { id: '3', title: 'Emergency Fire Sprinkler Test', propertyLocation: 'Oakridge Estates', status: 'overdue', assignedTo: 'David Chen' },
  { id: '4', title: 'Elevator Modernization Sign-off', propertyLocation: 'Downtown Skyline', status: 'in_progress', assignedTo: 'Elena Rostova' },
  { id: '5', title: 'Landscaping & Curb Appeal Refresh', propertyLocation: 'Bel Air Estate', status: 'completed', assignedTo: 'Rachel Adams' }
];

export let invoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2026-001', clientName: 'Apex Health Systems', amount: 168000, status: 'pending', category: 'Commission' },
  { id: '2', invoiceNumber: 'INV-2026-002', clientName: 'TechVision LLC', amount: 84500, status: 'pending', category: 'Commercial Lease' },
  { id: '3', invoiceNumber: 'INV-2026-003', clientName: 'Sovereign Capital', amount: 145500, status: 'pending', category: 'Commission' },
  { id: '4', invoiceNumber: 'INV-2026-004', clientName: 'Bel Air Estates HOA', amount: 42000, status: 'approved', category: 'Management' }
];

export let campaigns: Campaign[] = [
  { id: '1', title: 'Ultra-Luxury Penthouses GeoAds', channel: 'Meta Ads', status: 'active', leadsThisWeek: 34 },
  { id: '2', title: 'Commercial Plaza Executive Search', channel: 'Google Search', status: 'active', leadsThisWeek: 48 },
  { id: '3', title: 'Suburban Villas Showcase', channel: 'Zillow Featured', status: 'active', leadsThisWeek: 26 },
  { id: '4', title: 'Private Vineyard Feature', channel: 'Magazine Ads', status: 'paused', leadsThisWeek: 4 }
];

export let employees: Employee[] = [
  { id: '1', name: 'Victoria Hayes', role: 'VP Sales', present: true },
  { id: '2', name: 'James Montgomery', role: 'Commercial Broker', present: true },
  { id: '3', name: 'Sophie Turner', role: 'Residential Broker', present: true },
  { id: '4', name: 'Sarah Jenkins', role: 'Lead Inspector', present: true },
  { id: '5', name: 'Marcus Vance', role: 'Operations Manager', present: true },
  { id: '6', name: 'Elena Rostova', role: 'Facilities Specialist', present: true },
  { id: '7', name: 'David Chen', role: 'Safety Officer', present: false },
  { id: '8', name: 'Claire Dubois', role: 'Finance Controller', present: true },
  { id: '9', name: 'Maya Lin', role: 'Marketing Lead', present: true },
  { id: '10', name: 'Hannah Wright', role: 'HR Head', present: true }
];

export let leaveRequests: LeaveRequest[] = [
  { id: '1', employeeName: 'David Chen', role: 'Safety Officer', leaveType: 'Annual', days: 5, status: 'pending' },
  { id: '2', employeeName: 'Sophie Turner', role: 'Residential Broker', leaveType: 'Personal', days: 2, status: 'pending' },
  { id: '3', employeeName: 'Maya Lin', role: 'Marketing Lead', leaveType: 'Sick', days: 1, status: 'approved' }
];

export let openPositionsCount = 3;
