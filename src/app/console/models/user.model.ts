import { Role } from '../../core/models/role.model';

export interface ConsoleUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'console_admin';
  companyId: string;
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInvitation {
  id: string;
  email: string;
  companyId: string;
  roleId: string;
  invitedBy: string; // User ID who sent the invitation
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
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