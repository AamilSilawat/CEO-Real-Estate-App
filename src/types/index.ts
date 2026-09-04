export type HealthStatus = 'green' | 'amber' | 'red';

export interface User {
  name: string;
  role: string;
  email: string;
}

export interface MetricItem {
  label: string;
  value: string | number;
}

export interface DepartmentSummary {
  id: 'sales' | 'operations' | 'finance' | 'marketing' | 'hr';
  name: string;
  status: HealthStatus;
  summary: string;
  metrics: MetricItem[];
}

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

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Sales: undefined;
  Operations: undefined;
  Finance: undefined;
  Marketing: undefined;
  HR: undefined;
};
