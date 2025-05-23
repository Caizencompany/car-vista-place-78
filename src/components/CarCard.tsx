
import { Heart, Star, Fuel, Calendar, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Car {
  id: number;
  name: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  image: string;
  featured?: boolean;
  rating?: number;
}

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-0 shadow-lg">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {car.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Destaque
          </div>
        )}
        
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>

        {car.rating && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{car.rating}</span>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {car.name}
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(car.price)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            Ver Detalhes
          </Button>
          <Link to={`/car/${car.id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Contatar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
