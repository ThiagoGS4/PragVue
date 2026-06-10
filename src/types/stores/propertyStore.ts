export interface IGetPropertiesResponse{
  nickname: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  formatted_address: string;
  google_place_id: string;
  latitude: number;
  longitude: number;
  property_type: 'PUBLICO' | 'PRIVADO';
  is_active: number;
  created_at: string;
  customer: Customer;
}

interface Customer {
  id: number;
  name: string;
}