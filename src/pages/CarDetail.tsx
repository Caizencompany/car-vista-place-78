
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Fuel,
  Calendar,
  Gauge,
  Cog,
  Car as CarIcon,
  Heart,
  Share2,
} from 'lucide-react';
import { WhatsappIcon } from '@/components/WhatsappIcon';
import { Car, AdditionalFeature } from '@/types/car';

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
    ownership_type: 'Próprio',
    purchase_cost: 400000,
    purchase_date: '2023-01-15',
    sale_date: null,
    description: 'O BMW X5 M50i combina o design de um SUV de luxo com o desempenho de um carro esportivo. Com um motor V8 biturbo de 4.4 litros gerando 530 cavalos de potência, o X5 M50i oferece aceleração impressionante e uma experiência de condução dinâmica. O interior espaçoso e repleto de tecnologia proporciona conforto excepcional para todos os ocupantes.',
    additionalFeatures: [
      { id: 1, name: 'Teto Solar Panorâmico', price: 8000, selected: false },
      { id: 2, name: 'Sistema de Som Harman Kardon', price: 5500, selected: false },
      { id: 3, name: 'Pacote de Assistência ao Motorista', price: 7000, selected: false },
      { id: 4, name: 'Rodas de Liga Leve 22"', price: 6000, selected: false },
      { id: 5, name: 'Pacote Interior de Couro Nappa', price: 9000, selected: false }
    ],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
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
    ownership_type: 'Consignado',
    purchase_cost: 350000,
    purchase_date: '2023-01-10',
    sale_date: '2023-05-20',
    description: 'O Mercedes-AMG C43 oferece um equilíbrio perfeito entre luxo e desempenho. Com um motor de 4 cilindros turbo de 2.0 litros capaz de gerar 402 cavalos de potência, o C43 proporciona aceleração impressionante e agilidade nas curvas. O interior sofisticado e tecnológico, combinado com o design esportivo AMG, cria uma experiência de direção verdadeiramente premium.',
    additionalFeatures: [
      { id: 1, name: 'Pacote AMG Night', price: 5000, selected: false },
      { id: 2, name: 'Sistema de Som Burmester', price: 6500, selected: false },
      { id: 3, name: 'Head-up Display', price: 4800, selected: false },
      { id: 4, name: 'Teto Solar Panorâmico', price: 7000, selected: false }
    ],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  }
];

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<AdditionalFeature[]>([]);
  const [carImages, setCarImages] = useState<string[]>([]);

  useEffect(() => {
    const foundCar = mockCars.find(c => c.id === Number(id));
    
    if (foundCar) {
      setCar(foundCar);
      setTotalPrice(foundCar.price);
      
      // Configurar imagens do carro (pode ser um array ou uma única imagem)
      if (foundCar.images && foundCar.images.length > 0) {
        setCarImages(foundCar.images);
      } else if (foundCar.image) {
        setCarImages([foundCar.image]);
      } else {
        setCarImages(['/placeholder.svg']);
      }
      
      if (foundCar.additionalFeatures) {
        const initialSelected = foundCar.additionalFeatures.filter(feature => feature.selected);
        setSelectedFeatures(initialSelected);
      }
    }
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando detalhes do veículo...</p>
      </div>
    );
  }
  
  // Don't show detail page for sold cars
  if (car.status === 'Vendido') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Veículo Indisponível</h1>
          <p className="text-xl text-gray-600 mb-8">Este veículo não está mais disponível para visualização.</p>
          <Link to="/catalog">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFeatureToggle = (featureId: number) => {
    if (!car.additionalFeatures) return;
    
    const updatedFeatures = car.additionalFeatures.map(feature => {
      if (feature.id === featureId) {
        return { ...feature, selected: !feature.selected };
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
    const selectedFeatures = updatedFeatures.filter(feature => feature.selected);
    const featuresTotal = selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
    
    setTotalPrice(car.price + featuresTotal);
    setSelectedFeatures(selectedFeatures);
  };

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

  const createWhatsAppLink = () => {
    let message = `Olá! Estou interessado no veículo ${car.name} (ID: ${car.id}) no valor de ${formatPrice(car.price)}.`;
    
    if (selectedFeatures.length > 0) {
      message += '\n\nOpcionais selecionados:';
      selectedFeatures.forEach(feature => {
        message += `\n- ${feature.name}: ${formatPrice(feature.price)}`;
      });
      message += `\n\nValor total: ${formatPrice(totalPrice)}`;
    }
    
    return `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link to="/catalog" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar ao Catálogo
        </Link>

        {/* Car Details */}
        <Card className="overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-gray-900">{car.name}</CardTitle>
            <CardDescription className="text-gray-600">
              {car.year} • {formatMileage(car.mileage)} • {car.fuel}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:order-2">
                <img
                  src={carImages[activeImageIndex]}
                  alt={car.name}
                  className="w-full h-full object-cover rounded-lg aspect-video"
                />
              </div>
              <div className="md:order-1">
                <div className="grid grid-cols-3 gap-2">
                  {carImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${activeImageIndex === index ? 'ring-2 ring-blue-500' : 'hover:opacity-75 transition-opacity'}`}
                    >
                      <img
                        src={image}
                        alt={`${car.name} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price and Description */}
            <div className="md:flex md:items-start md:justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                  {formatPrice(totalPrice)}
                </h2>
                {car.description && <p className="text-gray-700">{car.description}</p>}
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-green-600 hover:bg-green-700 flex items-center justify-center">
                  <WhatsappIcon className="h-4 w-4 mr-2" />
                  <a href={createWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    Entrar em Contato
                  </a>
                </Button>
              </div>
            </div>

            {/* Car Details */}
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Gauge className="h-4 w-4" />
                <span>{formatMileage(car.mileage)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Fuel className="h-4 w-4" />
                <span>{car.fuel}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CarIcon className="h-4 w-4" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Cog className="h-4 w-4" />
                <span>{car.brand}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Cog className="h-4 w-4" />
                <span>{car.category}</span>
              </div>
            </div>

            {/* Additional Features */}
            {car.additionalFeatures && car.additionalFeatures.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Opcionais</h4>
                  <p className="text-gray-600">Selecione os opcionais desejados:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {car.additionalFeatures.map(feature => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={feature.selected}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="text-sm font-medium text-gray-900"
                      >
                        {feature.name} (+{formatPrice(feature.price)})
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between p-6">
            <div className="flex space-x-3">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                ID do veículo: {car.id}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CarDetail;
