export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
  website?: string;
  registration_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  logo?: string;
}

export interface CompanyResponse {
  data: Company[];
}
