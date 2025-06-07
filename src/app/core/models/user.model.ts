export interface UserProfile {
  id: string;
  auth_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  company_id?: string;
}
