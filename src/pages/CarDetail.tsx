
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Check, 
  Car as CarIcon
} from 'lucide-react';
import { WhatsappIcon } from '@/components/WhatsappIcon';

// Define the proper type for AdditionalFeature
interface AdditionalFeature {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

// Define the proper type for Car with specific status values
interface Car {
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
  purchase_cost: number;
  purchase_date: string;
  sale_date: string | null;
  description: string;
  additionalFeatures: AdditionalFeature[];
  images: string[];
}

// Mock car data with additional features
const mockCars: Car[] = [
  {
    id: 1,
    name: 'BMW X5 M50i',
    price: 485000,
    year: 2023,
    mileage: 12000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    brand: 'BMW',
    category: 'SUV',
    status: 'Disponível',
    purchase_cost: 400000,
    purchase_date: '2023-01-15',
    sale_date: null,
    description: 'Luxuoso SUV com motor potente V8 de 530cv, acabamento premium em couro, sistema de entretenimento de última geração e pacote completo de segurança.',
    additionalFeatures: [
      { id: 1, name: 'Teto Solar Panorâmico', price: 12000, selected: false },
      { id: 2, name: 'Sistema de Som Premium', price: 8500, selected: false },
      { id: 3, name: 'Assistente de Estacionamento', price: 5000, selected: false },
      { id: 4, name: 'Interior em Couro Nappa', price: 9800, selected: false },
      { id: 5, name: 'Pacote Off-road', price: 15000, selected: false },
    ],
    images: [
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=1000',
      'https://images.unsplash.com/photo-1635769507876-8ad657c33fca?q=80&w=1000',
      'https://images.unsplash.com/photo-1583356322882-85559b472e6c?q=80&w=1000',
    ]
  },
  {
    id: 2,
    name: 'Mercedes-AMG C43',
    price: 420000,
    year: 2023,
    mileage: 8500,
    fuel: 'Gasolina',
    transmission: 'Automático',
    brand: 'Mercedes',
    category: 'Sedan',
    status: 'Vendido',
    purchase_cost: 350000,
    purchase_date: '2023-01-10',
    sale_date: '2023-05-20',
    description: 'Sedan esportivo de alto desempenho, com motor 2.0 turbo de 402cv, interior esportivo de luxo com detalhes AMG e tecnologia MBUX de última geração.',
    additionalFeatures: [
      { id: 1, name: 'Pacote Night', price: 7500, selected: false },
      { id: 2, name: 'Head-up Display', price: 6000, selected: false },
      { id: 3, name: 'Sistema Burmester 3D', price: 12000, selected: false },
      { id: 4, name: 'Bancos AMG Performance', price: 8500, selected: false },
    ],
    images: [
      'https://images.unsplash.com/photo-1563720223523-491fd7a975c4?q=80&w=1000',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
    ]
  },
];

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [selectedFeatures, setSelectedFeatures] = useState<AdditionalFeature[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // In a real application, fetch data from an API
    const foundCar = mockCars.find(c => c.id === Number(id));
    if (foundCar) {
      setCar(foundCar);
      setTotalPrice(foundCar.price);
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('pt-BR').format(mileage) + ' km';
  };

  const handleFeatureToggle = (featureId: number, checked: boolean) => {
    if (!car) return;
    
    const updatedFeatures = car.additionalFeatures.map(feature => {
      if (feature.id === featureId) {
        return { ...feature, selected: checked };
      }
      return feature;
    });
    
    // Create a properly typed updated car object
    const updatedCar: Car = {
      ...car,
      additionalFeatures: updatedFeatures
    };
    
    setCar(updatedCar);
    
    // Calculate total price including selected features
    const selectedFeaturesArr = updatedFeatures.filter(f => f.selected);
    setSelectedFeatures(selectedFeaturesArr);
    
    const featuresTotal = selectedFeaturesArr.reduce((sum, feature) => sum + feature.price, 0);
    setTotalPrice(car.price + featuresTotal);
  };

  const createWhatsAppLink = () => {
    if (!car) return '';
    
    const selectedFeaturesText = selectedFeatures.length > 0 
      ? `\nAdicionais selecionados: ${selectedFeatures.map(f => f.name).join(', ')}` 
      : '';
      
    const message = encodeURIComponent(
      `Olá! Estou interessado no veículo ${car.name} (ID: ${car.id}) no valor de ${formatPrice(totalPrice)}.${selectedFeaturesText}`
    );
    
    return `https://wa.me/5511999999999?text=${message}`;
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Veículo não encontrado</h2>
            <p className="mt-4">O veículo que você está procurando não está disponível.</p>
            <Link to="/catalog">
              <Button className="mt-6">Voltar para o catálogo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Link to="/catalog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Voltar ao catálogo</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative aspect-[16/9]">
                <img 
                  src={car.images[activeImage]} 
                  alt={car.name} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 right-4 space-x-2">
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                {car.status !== 'Disponível' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl font-bold uppercase transform rotate-12">
                      {car.status}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${index === activeImage ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}
                  >
                    <img 
                      src={image} 
                      alt={`${car.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Vehicle specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Especificações do Veículo</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Marca</span>
                    <span className="font-medium">{car.brand}</span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Ano</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{car.year}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Quilometragem</span>
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{formatMileage(car.mileage)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Combustível</span>
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{car.fuel}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Transmissão</span>
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Categoria</span>
                    <div className="flex items-center">
                      <CarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{car.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Car description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Sobre este veículo</h3>
                <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Right sidebar with pricing and actions */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">{car.name}</h2>
                <div className="flex items-center mt-1 mb-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    car.status === 'Disponível' 
                      ? 'bg-green-100 text-green-800' 
                      : car.status === 'Vendido'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {car.status}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Preço Base</div>
                  <div className="text-3xl font-bold text-gray-900">{formatPrice(car.price)}</div>
                </div>
                
                {/* Additional features */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Adicionais Disponíveis</h3>
                  
                  <div className="space-y-3">
                    {car.additionalFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id={`feature-${feature.id}`} 
                            checked={feature.selected}
                            onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked === true)}
                            disabled={car.status !== 'Disponível'}
                          />
                          <label 
                            htmlFor={`feature-${feature.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {feature.name}
                          </label>
                        </div>
                        <span className="text-sm font-medium">
                          {formatPrice(feature.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Total price */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Preço Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  {selectedFeatures.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      * Inclui {selectedFeatures.length} adicionais selecionados
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="space-y-3">
                  {car.status === 'Disponível' && (
                    <>
                      <a 
                        href={createWhatsAppLink()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full"
                      >
                        <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center">
                          <WhatsappIcon className="h-5 w-5 mr-2" />
                          Contatar via WhatsApp
                        </Button>
                      </a>
                      
                      <Button variant="outline" className="w-full">
                        Agendar Test Drive
                      </Button>
                    </>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Adicionar aos Favoritos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
