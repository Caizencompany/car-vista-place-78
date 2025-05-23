
export type CarStatus = 'Disponível' | 'Vendido' | 'Consignado';
export type OwnershipType = 'Próprio' | 'Consignado';

export interface AdditionalFeature {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

export interface BuyerInfo {
  name: string;
  document: string;
  paymentMethod: string;
  saleDate: string;
  salePrice: number;
  commission?: number;
  profit?: number; // Campo para armazenar o lucro
}

export interface OwnerInfo {
  name: string;
  document: string;
  phone?: string;
  email?: string;
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
  status: CarStatus;
  ownership_type: OwnershipType;
  purchase_cost: number;
  purchase_date: string;
  sale_date: string | null;
  image?: string;
  images?: string[]; // Array de imagens do carro
  videoUrl?: string; // URL do vídeo do carro
  description?: string; // Descrição do veículo
  additionalFeatures?: AdditionalFeature[];
  buyerInfo?: BuyerInfo;
  ownerInfo?: OwnerInfo;
  featured?: boolean;
  rating?: number;
}
