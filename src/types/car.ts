
export interface AdditionalFeature {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

export interface Car {
  id: number;
  name: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  brand: string;
  category: string;
  status: 'Disponível' | 'Vendido' | 'Consignado';
  ownership_type: 'Próprio' | 'Consignado';
  purchase_cost: number;
  purchase_date: string;
  sale_date: string | null;
  description?: string;
  additionalFeatures?: AdditionalFeature[];
  image?: string;
  images?: string[];
  featured?: boolean;
  rating?: number;
}
