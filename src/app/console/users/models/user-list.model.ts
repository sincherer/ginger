import { UserProfile } from '../../../core/models/user.model';
import { Company } from '../../models/company.model';

export interface UserListItem extends UserProfile {
  company?: Pick<Company, 'id' | 'name'>;
  last_login?: Date;
}

export interface InvitationListItem {
  id: string;
  email: string;
  company_id: string;
  company?: Pick<Company, 'id' | 'name'>;
  role_id: string;
  created_at: Date;
  status: string;
  expires_at: Date;
}
