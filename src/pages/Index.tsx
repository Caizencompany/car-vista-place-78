import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, ArrowRight, Car, Users, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import CarCard from '@/components/CarCard';
import Navbar from '@/components/Navbar';

// Filter to only include available cars
const featuredCars = [
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
    status: 'Disponível' as 'Disponível',
    ownership_type: 'Próprio' as 'Próprio',
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
    status: 'Disponível' as 'Disponível',
    ownership_type: 'Próprio' as 'Próprio',
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
    status: 'Disponível' as 'Disponível',
    ownership_type: 'Próprio' as 'Próprio',
    purchase_cost: 590000,
    purchase_date: '2024-01-05',
    sale_date: null
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  
  // Combine all car brands and models for search suggestions
  const brands = ['BMW', 'Mercedes', 'Audi', 'Porsche', 'Tesla', 'Land Rover'];
  const models = featuredCars.map(car => ({
    id: car.id,
    name: car.name,
    brand: car.brand,
    year: car.year
  }));
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCarSelect = (carId: number) => {
    setShowSearchDialog(false);
    navigate(`/car/${carId}`);
  };
  
  const handleBrandSelect = (brand: string) => {
    setShowSearchDialog(false);
    navigate(`/catalog?search=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Encontre o Carro dos Seus Sonhos
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-300 leading-relaxed">
              Descubra nossa seleção premium de veículos com a melhor experiência de compra
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Digite marca, modelo ou ano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchDialog(true)}
                  className="pl-12 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-300"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white">
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </form>

            {/* Command Dialog para pesquisa avançada */}
            <CommandDialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
              <CommandInput 
                placeholder="Buscar veículos..." 
                value={searchTerm}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                <CommandEmpty>Nenhum veículo encontrado.</CommandEmpty>
                <CommandGroup heading="Veículos">
                  {models
                    .filter(car => 
                      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      String(car.year).includes(searchTerm)
                    )
                    .map(car => (
                      <CommandItem 
                        key={car.id}
                        onSelect={() => handleCarSelect(car.id)}
                        className="flex justify-between"
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{car.brand}</span>
                          <span className="font-medium">{car.name}</span>
                        </div>
                        <span className="text-gray-500">{car.year}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
                {searchTerm.length > 0 && (
                  <CommandGroup heading="Marcas">
                    {brands
                      .filter(brand => 
                        brand.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(brand => (
                        <CommandItem 
                          key={brand}
                          onSelect={() => handleBrandSelect(brand)}
                        >
                          <span>{brand}</span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </CommandList>
            </CommandDialog>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {['BMW', 'Mercedes', 'Audi', 'Porsche'].map((brand) => (
                <Link 
                  key={brand} 
                  to={`/catalog?search=${encodeURIComponent(brand)}`}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Carros Disponíveis</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2.5k+</h3>
              <p className="text-gray-600">Clientes Felizes</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Garantia</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Carros em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa seleção premium dos melhores veículos disponíveis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="group">
                Ver Todos os Carros
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Pronto para Encontrar Seu Próximo Carro?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato conosco e deixe nossos especialistas te ajudarem a encontrar o veículo perfeito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" variant="secondary" className="px-8">
                Explorar Catálogo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-600">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">AutoPremium</h3>
          <p className="text-gray-400 mb-6">Sua concessionária de confiança desde 2008</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <span>© 2024 AutoPremium. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
