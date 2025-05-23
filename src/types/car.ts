
// Se este arquivo existe, você precisa atualizar o tipo BuyerInfo para adicionar o campo profit.
// Como eu não tenho acesso ao conteúdo completo deste arquivo, vou adicionar o que imagino que seja necessário.
// Se o arquivo tiver uma estrutura diferente, você precisará ajustar esta implementação.

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
  profit?: number; // Novo campo para armazenar o lucro
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
  additionalFeatures?: AdditionalFeature[];
  buyerInfo?: BuyerInfo;
  ownerInfo?: OwnerInfo;
  featured?: boolean;
  rating?: number;
}
