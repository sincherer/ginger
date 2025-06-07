import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { Company, CompanySettings, BillingPlan, BillingStatus } from '../models/company.model';
import { ConsoleUser, UserInvitation, InvitationStatus, CompanyUser, UserSession } from '../models/user.model';
import { Feature, CompanyFeature, DEFAULT_FEATURES } from '../models/feature.model';
import { BillingCycle, BillingPlanDetails, BillingTransaction, DEFAULT_BILLING_PLANS } from '../models/billing.model';
import { Role, Permission } from '../../core/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  // Mock data storage
  private companies: Company[] = [];
  private users: ConsoleUser[] = [];
  private companyUsers: CompanyUser[] = [];
  private invitations: UserInvitation[] = [];
  private companyFeatures: CompanyFeature[] = [];
  private billingCycles: BillingCycle[] = [];
  private billingTransactions: BillingTransaction[] = [];
  private userSessions: UserSession[] = [];
  
  constructor() {
    // Initialize with a console admin user
    this.users.push({
      id: 'console-admin-1',
      username: 'console_admin',
      email: 'admin@gingererp.com',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'console_admin',
      companyId: 'system',
      active: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Company Management
  createCompany(company: Partial<Company>): Observable<Company> {
    const newCompany: Company = {
      id: uuidv4(),
      name: company.name || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      taxId: company.taxId || '',
      website: company.website || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
      logo: company.logo
    };

    this.companies.push(newCompany);
    return of(newCompany).pipe(delay(500));
  }

  getCompanies(): Observable<Company[]> {
    return of(this.companies).pipe(delay(500));
  }

  getCompanyById(id: string): Observable<Company> {
    const company = this.companies.find(c => c.id === id);
    if (company) {
      return of(company).pipe(delay(500));
    }
    return throwError(() => new Error('Company not found'));
  }

  updateCompany(id: string, updates: Partial<Company>): Observable<Company> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index !== -1) {
      const updatedCompany = {
        ...this.companies[index],
        ...updates,
        updatedAt: new Date()
      };
      this.companies[index] = updatedCompany;
      return of(updatedCompany).pipe(delay(500));
    }
    return throwError(() => new Error('Company not found'));
  }

  // User Management
  createUser(user: Partial<ConsoleUser>): Observable<ConsoleUser> {
    const newUser: ConsoleUser = {
      id: uuidv4(),
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'user',
      companyId: user.companyId || '',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  getUsers(): Observable<ConsoleUser[]> {
    return of(this.users).pipe(delay(500));
  }

  getUsersByCompany(companyId: string): Observable<ConsoleUser[]> {
    const companyUsers = this.users.filter(u => u.companyId === companyId);
    return of(companyUsers).pipe(delay(500));
  }

  getUserById(id: string): Observable<ConsoleUser> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return of(user).pipe(delay(500));
    }
    return throwError(() => new Error('User not found'));
  }

  updateUser(id: string, updates: Partial<ConsoleUser>): Observable<ConsoleUser> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      const updatedUser = {
        ...this.users[index],
        ...updates,
        updatedAt: new Date()
      };
      this.users[index] = updatedUser;
      return of(updatedUser).pipe(delay(500));
    }
    return throwError(() => new Error('User not found'));
  }

  // User Invitation
  inviteUser(invitation: Partial<UserInvitation>): Observable<UserInvitation> {
    const newInvitation: UserInvitation = {
      id: uuidv4(),
      email: invitation.email || '',
      companyId: invitation.companyId || '',
      roleId: invitation.roleId || '',
      invitedBy: invitation.invitedBy || '',
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      token: uuidv4()
    };

    this.invitations.push(newInvitation);
    return of(newInvitation).pipe(delay(500));
  }

  getInvitationsByCompany(companyId: string): Observable<UserInvitation[]> {
    const invitations = this.invitations.filter(i => i.companyId === companyId);
    return of(invitations).pipe(delay(500));
  }

  acceptInvitation(token: string): Observable<boolean> {
    const index = this.invitations.findIndex(i => i.token === token && i.status === InvitationStatus.PENDING);
    if (index !== -1) {
      this.invitations[index].status = InvitationStatus.ACCEPTED;
      return of(true).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid or expired invitation'));
  }

  // RBAC Management
  assignRoleToUser(userId: string, companyId: string, roleId: string): Observable<CompanyUser> {
    // Check if user already has a role in this company
    const existingIndex = this.companyUsers.findIndex(cu => cu.userId === userId && cu.companyId === companyId);
    
    if (existingIndex !== -1) {
      // Update existing role
      const updatedCompanyUser = {
        ...this.companyUsers[existingIndex],
        roleId
      };
      this.companyUsers[existingIndex] = updatedCompanyUser;
      return of(updatedCompanyUser).pipe(delay(500));
    } else {
      // Create new company user entry
      const newCompanyUser: CompanyUser = {
        userId,
        companyId,
        roleId,
        active: true,
        joinedAt: new Date()
      };
      this.companyUsers.push(newCompanyUser);
      return of(newCompanyUser).pipe(delay(500));
    }
  }

  getUserRoleInCompany(userId: string, companyId: string): Observable<CompanyUser | null> {
    const companyUser = this.companyUsers.find(cu => cu.userId === userId && cu.companyId === companyId);
    return of(companyUser || null).pipe(delay(500));
  }

  // Feature Management
  getAvailableFeatures(): Observable<Feature[]> {
    return of(DEFAULT_FEATURES).pipe(delay(500));
  }

  getCompanyFeatures(companyId: string): Observable<CompanyFeature[]> {
    const features = this.companyFeatures.filter(cf => cf.companyId === companyId);
    return of(features).pipe(delay(500));
  }

  toggleFeature(companyId: string, featureId: string, enabled: boolean): Observable<CompanyFeature> {
    const index = this.companyFeatures.findIndex(cf => cf.companyId === companyId && cf.featureId === featureId);
    
    if (index !== -1) {
      // Update existing feature
      const updatedFeature = {
        ...this.companyFeatures[index],
        enabled
      };
      this.companyFeatures[index] = updatedFeature;
      return of(updatedFeature).pipe(delay(500));
    } else {
      // Create new feature entry
      const newFeature: CompanyFeature = {
        companyId,
        featureId,
        enabled
      };
      this.companyFeatures.push(newFeature);
      return of(newFeature).pipe(delay(500));
    }
  }

  // Billing Management
  getBillingPlans(): Observable<BillingPlanDetails[]> {
    return of(DEFAULT_BILLING_PLANS).pipe(delay(500));
  }

  getCompanyBillingCycle(companyId: string): Observable<BillingCycle | null> {
    const billingCycle = this.billingCycles.find(bc => bc.companyId === companyId);
    return of(billingCycle || null).pipe(delay(500));
  }

  createBillingCycle(billingCycle: Partial<BillingCycle>): Observable<BillingCycle> {
    const newBillingCycle: BillingCycle = {
      id: uuidv4(),
      companyId: billingCycle.companyId || '',
      plan: billingCycle.plan || BillingPlan.FREE,
      status: billingCycle.status || BillingStatus.ACTIVE,
      startDate: billingCycle.startDate || new Date(),
      endDate: billingCycle.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      renewalDate: billingCycle.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      price: billingCycle.price || 0,
      currency: billingCycle.currency || 'USD',
      interval: billingCycle.interval || 'monthly',
      autoRenew: billingCycle.autoRenew || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.billingCycles.push(newBillingCycle);
    return of(newBillingCycle).pipe(delay(500));
  }

  updateBillingCycle(id: string, updates: Partial<BillingCycle>): Observable<BillingCycle> {
    const index = this.billingCycles.findIndex(bc => bc.id === id);
    if (index !== -1) {
      const updatedBillingCycle = {
        ...this.billingCycles[index],
        ...updates,
        updatedAt: new Date()
      };
      this.billingCycles[index] = updatedBillingCycle;
      return of(updatedBillingCycle).pipe(delay(500));
    }
    return throwError(() => new Error('Billing cycle not found'));
  }

  // User Impersonation
  createImpersonationSession(adminUserId: string, targetUserId: string, companyId: string): Observable<UserSession> {
    // Verify admin has permission to impersonate
    const admin = this.users.find(u => u.id === adminUserId && (u.role === 'console_admin' || u.role === 'admin'));
    if (!admin) {
      return throwError(() => new Error('Unauthorized: Only admins can impersonate users'));
    }

    // Verify target user exists and belongs to the specified company
    const targetUser = this.users.find(u => u.id === targetUserId && u.companyId === companyId);
    if (!targetUser) {
      return throwError(() => new Error('Target user not found or does not belong to the specified company'));
    }

    const session: UserSession = {
      userId: targetUserId,
      companyId,
      originalUserId: adminUserId,
      token: uuidv4(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      ipAddress: '127.0.0.1', // Mock IP address
      userAgent: 'Console App' // Mock user agent
    };

    this.userSessions.push(session);
    return of(session).pipe(delay(500));
  }

  endImpersonationSession(token: string): Observable<boolean> {
    const index = this.userSessions.findIndex(s => s.token === token && s.originalUserId !== undefined);
    if (index !== -1) {
      this.userSessions.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return throwError(() => new Error('Session not found'));
  }
}