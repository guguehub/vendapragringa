export interface ICreateUserAddress {
  user_id: string;
  street: string;
  number?: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  country_code?: string; // Ex: '+55'
  area_code?: string;    // Ex: '11'
  phone_number?: string; // Ex: '999999999'
  is_default?: boolean;
}
