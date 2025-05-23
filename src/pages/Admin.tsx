import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Car, Users, BarChart3, Settings, DollarSign, ShoppingCart, Archive, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Car, AdditionalFeature } from '@/types/car';

// Mock data for financial dashboard
const financialData = {
  monthlySales: [
    { name: 'Jan', value: 2 },
    { name: 'Fev', value: 3 },
    { name: 'Mar', value: 1 },
    { name: 'Abr', value: 4 },
    { name: 'Mai', value: 2 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 3 },
    { name: 'Ago', value: 2 },
    { name: 'Set', value: 4 },
    { name: 'Out', value: 1 },
    { name: 'Nov', value: 3 },
    { name: 'Dez', value: 6 },
  ],
  carStatus: [
    { name: 'Disponíveis', value: 12, color: '#60a5fa' },
    { name: 'Vendidos', value: 18, color: '#34d399' },
    { name: 'Consignados', value: 8, color: '#a78bfa' },
  ],
  revenue: {
    total: 7850000,
    salesTotal: 6200000,
    consignmentCommissions: 350000,
    additionalServices: 1300000,
  },
  costs: {
    total: 4950000,
    inventory: 4650000,
    operations: 300000,
  },
  recentTransactions: [
    { id: 1, car: 'BMW X5 M50i', type: 'Venda', amount: 490000, date: '2023-11-15', customer: 'João Silva' },
    { id: 2, car: 'Mercedes GLE 450', type: 'Venda', amount: 430000, date: '2023-11-10', customer: 'Maria Souza' },
    { id: 3, car: 'Audi Q7', type: 'Consignado', amount: 95000, date: '2023-11-05', customer: 'Carlos Oliveira' },
    { id: 4, car: 'Porsche Cayenne', type: 'Compra', amount: -310000, date: '2023-11-01', customer: 'Fornecedor' },
    { id: 5, car: 'BMW M3', type: 'Venda', amount: 450000, date: '2023-10-28', customer: 'Pedro Santos' },
  ]
};

// Updated mockCars with ownership_type
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
  }
];

// Mock data for additional features
const mockAdditionalFeatures: AdditionalFeature[] = [
  { id: 1, name: 'Teto Solar', price: 8000, selected: false },
  { id: 2, name: 'Bancos de Couro', price: 5000, selected: false },
  { id: 3, name: 'Sistema de Som Premium', price: 7500, selected: false },
  { id: 4, name: 'Rodas de Liga Leve 20"', price: 6000, selected: false },
  { id: 5, name: 'Assistente de Estacionamento', price: 4500, selected: false }
};

interface FormData {
  name: string;
  price: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  brand: string;
  category: string;
  description: string;
  status: 'Disponível' | 'Vendido' | 'Consignado';
  ownership_type: 'Próprio' | 'Consignado';
  purchase_cost: string;
  purchase_date: string;
  additionalFeatures: AdditionalFeature[];
}

interface FeatureFormData {
  name: string;
  price: string;
}

const Admin = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [additionalFeatures, setAdditionalFeatures] = useState<AdditionalFeature[]>(mockAdditionalFeatures);
  const [isAddFeatureDialogOpen, setIsAddFeatureDialogOpen] = useState(false);
  const [featureFormData, setFeatureFormData] = useState<FeatureFormData>({
    name: '',
    price: ''
  });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    year: '',
    mileage: '',
    fuel: '',
    transmission: '',
    brand: '',
    category: '',
    description: '',
    status: 'Disponível',
    ownership_type: 'Próprio',
    purchase_cost: '',
    purchase_date: '',
    additionalFeatures: []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureInputChange = (field: string, value: string) => {
    setFeatureFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCar = () => {
    const newCar: Car = {
      id: Date.now(),
      ...formData,
      price: parseInt(formData.price) || 0,
      year: parseInt(formData.year) || 0,
      mileage: parseInt(formData.mileage) || 0,
      purchase_cost: parseInt(formData.purchase_cost) || 0,
      sale_date: null
    };
    
    setCars(prev => [...prev, newCar]);
    setFormData({
      name: '',
      price: '',
      year: '',
      mileage: '',
      fuel: '',
      transmission: '',
      brand: '',
      category: '',
      description: '',
      status: 'Disponível',
      ownership_type: 'Próprio',
      purchase_cost: '',
      purchase_date: '',
      additionalFeatures: []
    });
    setIsAddDialogOpen(false);
  };

  const handleAddFeature = () => {
    const newFeature: AdditionalFeature = {
      id: Date.now(),
      name: featureFormData.name,
      price: parseInt(featureFormData.price) || 0,
      selected: false
    };
    
    setAdditionalFeatures(prev => [...prev, newFeature]);
    setFeatureFormData({
      name: '',
      price: ''
    });
    setIsAddFeatureDialogOpen(false);
  };

  const handleDeleteCar = (id: number) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const handleDeleteFeature = (id: number) => {
    setAdditionalFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  // Calculate statistics based on cars data
  const calculateStats = () => {
    const availableCars = cars.filter(car => car.status === 'Disponível').length;
    const soldCars = cars.filter(car => car.status === 'Vendido').length;
    const consignedCars = cars.filter(car => car.ownership_type === 'Consignado').length;
    const ownCars = cars.filter(car => car.ownership_type === 'Próprio').length;
    const totalValue = cars.reduce((sum, car) => sum + car.price, 0);
    const consignmentValue = cars
      .filter(car => car.ownership_type === 'Consignado')
      .reduce((sum, car) => sum + car.price, 0);

    return [
      {
        title: 'Total de Carros',
        value: cars.length,
        icon: Car,
        color: 'bg-blue-500'
      },
      {
        title: 'Carros Disponíveis',
        value: availableCars,
        icon: Eye,
        color: 'bg-green-500'
      },
      {
        title: 'Carros Vendidos',
        value: soldCars,
        icon: ShoppingCart,
        color: 'bg-purple-500'
      },
      {
        title: 'Valor Total',
        value: `R$ ${totalValue.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-orange-500'
      },
      {
        title: 'Carros Próprios',
        value: ownCars,
        icon: Car,
        color: 'bg-indigo-500'
      },
      {
        title: 'Carros Consignados',
        value: consignedCars,
        icon: Archive,
        color: 'bg-amber-500'
      },
      {
        title: 'Valor Consignado',
        value: `R$ ${consignmentValue.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-emerald-500'
      }
    ];
  };

  const stats = calculateStats();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Calculate financial data by ownership
  const financialByOwnership = {
    ownCarsRevenue: cars
      .filter(car => car.ownership_type === 'Próprio' && car.status === 'Vendido')
      .reduce((sum, car) => sum + car.price, 0),
    consignmentRevenue: cars
      .filter(car => car.ownership_type === 'Consignado' && car.status === 'Vendido')
      .reduce((sum, car) => sum + car.price * 0.05, 0), // Assuming 5% commission
  };

  // Prepare data for ownership type visualization
  const ownershipData = [
    { 
      name: 'Próprio', 
      value: cars.filter(car => car.ownership_type === 'Próprio').length,
      color: '#60a5fa' 
    },
    { 
      name: 'Consignado', 
      value: cars.filter(car => car.ownership_type === 'Consignado').length,
      color: '#a78bfa' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Painel Administrativo</h1>
          <p className="text-xl text-gray-600">Gerencie seu estoque de veículos</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cars">Gerenciar Carros</TabsTrigger>
            <TabsTrigger value="features">Opcionais</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.slice(0, 4).map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Novo carro adicionado</p>
                      <p className="text-sm text-gray-600">BMW X5 M50i foi adicionado ao estoque</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Preço atualizado</p>
                      <p className="text-sm text-gray-600">Mercedes-AMG C43 teve o preço ajustado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cars Tab */}
          <TabsContent value="cars" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Carros</h2>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Carro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Carro</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Carro</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Ex: BMW X5 M50i"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca</Label>
                      <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BMW">BMW</SelectItem>
                          <SelectItem value="Mercedes">Mercedes</SelectItem>
                          <SelectItem value="Audi">Audi</SelectItem>
                          <SelectItem value="Porsche">Porsche</SelectItem>
                          <SelectItem value="Tesla">Tesla</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Added ownership_type field */}
                    <div className="space-y-2">
                      <Label htmlFor="ownership_type">Tipo de Propriedade</Label>
                      <Select 
                        value={formData.ownership_type} 
                        onValueChange={(value: 'Próprio' | 'Consignado') => handleInputChange('ownership_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Próprio">Próprio</SelectItem>
                          <SelectItem value="Consignado">Consignado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="485000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Ano</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Quilometragem</Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        placeholder="12000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel">Combustível</Label>
                      <Select value={formData.fuel} onValueChange={(value) => handleInputChange('fuel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o combustível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gasolina">Gasolina</SelectItem>
                          <SelectItem value="Etanol">Etanol</SelectItem>
                          <SelectItem value="Flex">Flex</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Elétrico">Elétrico</SelectItem>
                          <SelectItem value="Híbrido">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmissão</Label>
                      <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a transmissão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="Automático">Automático</SelectItem>
                          <SelectItem value="CVT">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Hatch">Hatch</SelectItem>
                          <SelectItem value="Esportivo">Esportivo</SelectItem>
                          <SelectItem value="Wagon">Wagon</SelectItem>
                          <SelectItem value="Pickup">Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: 'Disponível' | 'Vendido' | 'Consignado') => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Disponível">Disponível</SelectItem>
                          <SelectItem value="Vendido">Vendido</SelectItem>
                          <SelectItem value="Consignado">Consignado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purchase_cost">Custo de Aquisição (R$)</Label>
                      <Input
                        id="purchase_cost"
                        type="number"
                        value={formData.purchase_cost}
                        onChange={(e) => handleInputChange('purchase_cost', e.target.value)}
                        placeholder="400000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purchase_date">Data de Aquisição</Label>
                      <Input
                        id="purchase_date"
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descrição detalhada do veículo..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddCar} className="bg-blue-600 hover:bg-blue-700">
                      Adicionar Carro
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Propriedade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell className="font-medium">{car.name}</TableCell>
                        <TableCell>{car.brand}</TableCell>
                        <TableCell>R$ {car.price.toLocaleString()}</TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            car.status === 'Disponível' 
                              ? 'bg-green-100 text-green-800' 
                              : car.status === 'Vendido'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {car.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            car.ownership_type === 'Próprio' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {car.ownership_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCar(car.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Additional Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Opcionais</h2>
              
              <Dialog open={isAddFeatureDialogOpen} onOpenChange={setIsAddFeatureDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Opcional
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Opcional</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="feature-name">Nome do Opcional</Label>
                      <Input
                        id="feature-name"
                        value={featureFormData.name}
                        onChange={(e) => handleFeatureInputChange('name', e.target.value)}
                        placeholder="Ex: Teto Solar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feature-price">Preço (R$)</Label>
                      <Input
                        id="feature-price"
                        type="number"
                        value={featureFormData.price}
                        onChange={(e) => handleFeatureInputChange('price', e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddFeatureDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddFeature} className="bg-blue-600 hover:bg-blue-700">
                      Adicionar Opcional
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {additionalFeatures.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>{formatCurrency(feature.price)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteFeature(feature.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updated Financial Dashboard Tab with ownership data */}
          <TabsContent value="financial" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h2>
              <p className="text-gray-500">Acompanhe o desempenho financeiro de sua concessionária</p>
            </div>

            {/* Financial Summary Cards with ownership type data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Total</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(financialData.revenue.total)}</p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Carros Vendidos</p>
                      <p className="text-3xl font-bold text-gray-900">{financialData.carStatus[1].value}</p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-full">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Carros Consignados</p>
                      <p className="text-3xl font-bold text-gray-900">{financialData.carStatus[2].value}</p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-full">
                      <Archive className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lucro Estimado</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(financialData.revenue.total - financialData.costs.total)}</p>
                    </div>
                    <div className="bg-orange-500 p-3 rounded-full">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section with ownership visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialData.monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} carros`, 'Vendas']}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Carros Vendidos" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Propriedade</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ownershipData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {ownershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} carros`, 'Quantidade']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown with ownership type data */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento de Receita por Tipo de Propriedade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Veículos Próprios</p>
                    <p className="text-2xl font-bold">{formatCurrency(financialByOwnership.ownCarsRevenue)}</p>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-indigo-500 rounded-full" 
                        style={{ width: `${(financialByOwnership.ownCarsRevenue / (financialByOwnership.ownCarsRevenue + financialByOwnership.consignmentRevenue) * 100) || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Comissões Consignados</p>
                    <p className="text-2xl font-bold">{formatCurrency(financialByOwnership.consignmentRevenue)}</p>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-amber-500 rounded-full" 
                        style={{ width: `${(financialByOwnership.consignmentRevenue / (financialByOwnership.ownCarsRevenue + financialByOwnership.consignmentRevenue) * 100) || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cliente/Fornecedor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.car}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'Venda' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.type === 'Compra'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className={`text-right font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" defaultValue="AutoPremium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email de Contato</Label>
                    <Input id="contact-email" defaultValue="contato@autopremium.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" defaultValue="Av. Paulista, 1000 - São Paulo" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Empresa</Label>
                  <Textarea 
                    id="description" 
                    defaultValue="Sua concessionária de confiança com os melhores veículos premium do mercado."
                    rows={3}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
