
import { createContext, useContext, useState, ReactNode } from 'react';
import { Car } from '@/types/car';

// Initial mock cars data
const initialCars: Car[] = [
  {
    id: 1,
    name: 'BMW X5 M50i',
    price: 485000,
    year: 2023,
    mileage: 12000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    image: '/placeholder.svg',
    featured: true,
    rating: 4.9,
    brand: 'BMW',
    category: 'SUV',
    status: 'Disponível' as const,
    ownership_type: 'Próprio' as const,
    purchase_cost: 420000,
    purchase_date: '2023-01-15',
    sale_date: null
  },
  {
    id: 2,
    name: 'Mercedes-AMG C43',
    price: 420000,
    year: 2023,
    mileage: 8500,
    fuel: 'Gasolina',
    transmission: 'Automático',
    image: '/placeholder.svg',
    featured: true,
    rating: 4.8,
    brand: 'Mercedes',
    category: 'Sedan',
    status: 'Disponível' as const,
    ownership_type: 'Próprio' as const,
    purchase_cost: 360000,
    purchase_date: '2023-02-10',
    sale_date: null
  },
  {
    id: 3,
    name: 'Audi RS6 Avant',
    price: 680000,
    year: 2024,
    mileage: 2100,
    fuel: 'Gasolina',
    transmission: 'Automático',
    image: '/placeholder.svg',
    featured: true,
    rating: 5.0,
    brand: 'Audi',
    category: 'Wagon',
    status: 'Disponível' as const,
    ownership_type: 'Próprio' as const,
    purchase_cost: 590000,
    purchase_date: '2024-01-05',
    sale_date: null
  },
  {
    id: 4,
    name: 'Porsche 911 Turbo S',
    price: 1200000,
    year: 2024,
    mileage: 500,
    fuel: 'Gasolina',
    transmission: 'Automático',
    image: '/placeholder.svg',
    brand: 'Porsche',
    category: 'Esportivo',
    status: 'Disponível' as const,
    ownership_type: 'Próprio' as const,
    purchase_cost: 1050000,
    purchase_date: '2024-02-20',
    sale_date: null
  },
  {
    id: 5,
    name: 'Tesla Model S',
    price: 650000,
    year: 2023,
    mileage: 15000,
    fuel: 'Elétrico',
    transmission: 'Automático',
    image: '/placeholder.svg',
    brand: 'Tesla',
    category: 'Sedan',
    status: 'Disponível' as const,
    ownership_type: 'Próprio' as const,
    purchase_cost: 580000,
    purchase_date: '2023-08-12',
    sale_date: null
  },
  {
    id: 6,
    name: 'Range Rover Evoque',
    price: 320000,
    year: 2022,
    mileage: 25000,
    fuel: 'Gasolina',
    transmission: 'Automático',
    image: '/placeholder.svg',
    brand: 'Land Rover',
    category: 'SUV',
    status: 'Disponível' as const,
    ownership_type: 'Próprio' as const,
    purchase_cost: 280000,
    purchase_date: '2022-11-05',
    sale_date: null
  }
];

interface CarContextType {
  cars: Car[];
  addCar: (car: Car) => void;
  updateCar: (car: Car) => void;
  deleteCar: (id: number) => void;
  getCarById: (id: number) => Car | undefined;
  getAvailableCars: () => Car[];
  getFeaturedCars: () => Car[];
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<Car[]>(initialCars);

  // Add a new car
  const addCar = (car: Car) => {
    // Generate a new ID based on the highest existing ID + 1
    const newId = Math.max(0, ...cars.map(c => c.id)) + 1;
    const newCar = { ...car, id: newId };
    setCars(prev => [...prev, newCar]);
  };

  // Update an existing car
  const updateCar = (car: Car) => {
    setCars(prev => prev.map(c => c.id === car.id ? car : c));
  };

  // Delete a car
  const deleteCar = (id: number) => {
    setCars(prev => prev.filter(c => c.id !== id));
  };

  // Get a car by ID
  const getCarById = (id: number) => {
    return cars.find(car => car.id === id);
  };

  // Get only available cars
  const getAvailableCars = () => {
    return cars.filter(car => car.status === 'Disponível');
  };

  // Get featured cars that are available
  const getFeaturedCars = () => {
    return cars.filter(car => car.featured && car.status === 'Disponível');
  };

  return (
    <CarContext.Provider value={{ 
      cars, 
      addCar, 
      updateCar, 
      deleteCar, 
      getCarById,
      getAvailableCars,
      getFeaturedCars
    }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};
