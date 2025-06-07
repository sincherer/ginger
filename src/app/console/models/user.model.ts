import { Role } from '../../core/models/role.model';

export interface ConsoleUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user' | 'console_admin';
  company_id: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserInvitation {
  id: string;
  email: string;
  company_id: string;
  role_id: string;
  invited_by: string; // User ID who sent the invitation
  status: InvitationStatus;
  expires_at: Date;
  created_at: Date;
  token: string;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface CompanyUser {
  userId: string;
  companyId: string;
  roleId: string;
  active: boolean;
  joinedAt: Date;
  customPermissions?: string[];
}

export interface UserSession {
  userId: string;
  companyId: string;
  originalUserId?: string; // For admin impersonation
  token: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}