
import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Car, Users, BarChart3, Settings } from 'lucide-react';
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

const mockCars = [
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
    status: 'Disponível'
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
    status: 'Vendido'
  }
];

const Admin = () => {
  const [cars, setCars] = useState(mockCars);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    year: '',
    mileage: '',
    fuel: '',
    transmission: '',
    brand: '',
    category: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCar = () => {
    const newCar = {
      id: Date.now(),
      ...formData,
      price: parseInt(formData.price),
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      status: 'Disponível'
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
      description: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteCar = (id: number) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const stats = [
    {
      title: 'Total de Carros',
      value: cars.length,
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      title: 'Carros Disponíveis',
      value: cars.filter(car => car.status === 'Disponível').length,
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      title: 'Carros Vendidos',
      value: cars.filter(car => car.status === 'Vendido').length,
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Valor Total',
      value: `R$ ${cars.reduce((sum, car) => sum + car.price, 0).toLocaleString()}`,
      icon: BarChart3,
      color: 'bg-orange-500'
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cars">Gerenciar Carros</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
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
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {car.status}
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
