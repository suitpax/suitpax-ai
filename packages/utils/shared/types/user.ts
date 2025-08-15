// User-related types and interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserPreferences;
  company?: Company;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  level: number; // 1 = admin, 2 = manager, 3 = user
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  travel: {
    preferredAirlines: string[];
    seatPreference: 'aisle' | 'window' | 'middle';
    mealPreference: string;
    loyaltyPrograms: Array<{
      airline: string;
      number: string;
    }>;
  };
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  address?: Address;
  settings: CompanySettings;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CompanySettings {
  travelPolicy: TravelPolicy;
  expensePolicy: ExpensePolicy;
  approvalWorkflow: ApprovalWorkflow;
}

export interface TravelPolicy {
  maxFlightCost: number;
  maxHotelCost: number;
  allowedBookingWindow: number; // days in advance
  requiresApproval: boolean;
  allowedCarriers: string[];
  preferredSuppliers: string[];
}

export interface ExpensePolicy {
  maxExpenseAmount: number;
  requiresReceipt: boolean;
  categories: ExpenseCategory[];
  autoApprovalLimit: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  maxAmount?: number;
  requiresJustification: boolean;
}

export interface ApprovalWorkflow {
  levels: ApprovalLevel[];
  autoApprovalRules: AutoApprovalRule[];
}

export interface ApprovalLevel {
  level: number;
  approverRole: string;
  maxAmount?: number;
  isRequired: boolean;
}

export interface AutoApprovalRule {
  condition: string;
  maxAmount: number;
  categories?: string[];
}

// Authentication types
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}