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
import { AdditionalFeature } from '@/types/car';
import { useCars } from '@/contexts/CarContext';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCarById } = useCars();
  const [car, setCar] = useState(id ? getCarById(parseInt(id)) : undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(car?.images ? 0 : 0);
  const [totalPrice, setTotalPrice] = useState(car?.price || 0);
  const [selectedFeatures, setSelectedFeatures] = useState<AdditionalFeature[]>([]);
  const [carImages, setCarImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const foundCar = getCarById(parseInt(id));
      
      if (foundCar) {
        setCar(foundCar);
        setTotalPrice(foundCar.price);
        
        // Configure car images (can be an array or a single image)
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
    }
  }, [id, getCarById]);

  useEffect(() => {
    if (car) {
      setTotalPrice(car.price);
      if (car.additionalFeatures) {
        const selected = car.additionalFeatures.filter(f => f.selected);
        setSelectedFeatures(selected);
        const featuresTotal = selected.reduce((sum, feature) => sum + feature.price, 0);
        setTotalPrice(car.price + featuresTotal);
      }
    }
  }, [car]);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando detalhes do veículo...</p>
      </div>
    );
  }
  
  // Only show cars with status "Disponível"
  if (car.status !== 'Disponível') {
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
    
    setCar({
      ...car,
      additionalFeatures: updatedFeatures
    });
    
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
