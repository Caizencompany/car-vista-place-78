import { useState, useEffect, useCallback } from 'react';
import { Filter, Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import Navbar from '@/components/Navbar';
import CarCard from '@/components/CarCard';
import { useNavigate } from 'react-router-dom';
import { useCars } from '@/contexts/CarContext';

const Catalog = () => {
  const navigate = useNavigate();
  const { getAvailableCars } = useCars();
  
  const [availableCars, setAvailableCars] = useState(getAvailableCars());
  const [filteredCars, setFilteredCars] = useState(availableCars);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  // Get latest available cars when component mounts or when cars change
  useEffect(() => {
    setAvailableCars(getAvailableCars());
  }, [getAvailableCars]);

  // Compute unique values for filters
  const brands = [...new Set(availableCars.map(car => car.brand))];
  const categories = [...new Set(availableCars.map(car => car.category))];
  const fuels = [...new Set(availableCars.map(car => car.fuel))];
  const transmissions = [...new Set(availableCars.map(car => car.transmission))];

  const applyFilters = useCallback(() => {
    let filtered = availableCars;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchLower) ||
        car.brand.toLowerCase().includes(searchLower) ||
        car.category.toLowerCase().includes(searchLower) ||
        car.fuel.toLowerCase().includes(searchLower) ||
        String(car.year).includes(searchLower)
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(car => car.category === selectedCategory);
    }

    // Fuel filter
    if (selectedFuel) {
      filtered = filtered.filter(car => car.fuel === selectedFuel);
    }

    // Transmission filter
    if (selectedTransmission) {
      filtered = filtered.filter(car => car.transmission === selectedTransmission);
    }

    // Price range filter
    filtered = filtered.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    // Year range filter
    filtered = filtered.filter(car => 
      car.year >= yearRange[0] && car.year <= yearRange[1]
    );

    // Sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'year-new':
            return b.year - a.year;
          case 'year-old':
            return a.year - b.year;
          case 'mileage-low':
            return a.mileage - b.mileage;
          case 'mileage-high':
            return b.mileage - a.mileage;
          default:
            return 0;
        }
      });
    }

    setFilteredCars(filtered);
  }, [searchTerm, selectedBrand, selectedCategory, selectedFuel, selectedTransmission, priceRange, yearRange, sortBy, availableCars]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setPriceRange([0, 1500000]);
    setYearRange([2020, 2024]);
    setSortBy('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCarSelect = (carId: number) => {
    setShowSearchDialog(false);
    navigate(`/car/${carId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catálogo de Veículos</h1>
          <p className="text-xl text-gray-600">Encontre o carro perfeito para você</p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar por marca, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchDialog(true)}
                className="pl-12 h-12"
              />
            </div>
            
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
                  {availableCars
                    .filter(car => 
                      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      String(car.year).includes(searchTerm)
                    )
                    .slice(0, 10)
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
                          onSelect={() => {
                            setSelectedBrand(brand);
                            setShowSearchDialog(false);
                          }}
                        >
                          <span>{brand}</span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </CommandList>
            </CommandDialog>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Filtros
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Menor Preço</SelectItem>
                      <SelectItem value="price-high">Maior Preço</SelectItem>
                      <SelectItem value="year-new">Mais Novo</SelectItem>
                      <SelectItem value="year-old">Mais Antigo</SelectItem>
                      <SelectItem value="mileage-low">Menor KM</SelectItem>
                      <SelectItem value="mileage-high">Maior KM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Marca</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Combustível</label>
                  <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os combustíveis" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuels.map(fuel => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Faixa de Preço: R$ {priceRange[0].toLocaleString()} - R$ {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1500000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                </div>

                {/* Year Range */}
                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Ano: {yearRange[0]} - {yearRange[1]}
                  </label>
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    max={2024}
                    min={2015}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredCars.length} veículo(s) encontrado(s)
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCars.map(car => (
                  <Card key={car.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{car.name}</h3>
                        <p className="text-3xl font-bold text-blue-600 mb-4">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                          }).format(car.price)}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                          <div>Ano: {car.year}</div>
                          <div>KM: {car.mileage.toLocaleString()}</div>
                          <div>Combustível: {car.fuel}</div>
                          <div>Câmbio: {car.transmission}</div>
                        </div>
                        <div className="flex space-x-3">
                          <Button variant="outline" onClick={() => navigate(`/car/${car.id}`)}>Ver Detalhes</Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">Contatar</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum veículo encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros para encontrar mais resultados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
