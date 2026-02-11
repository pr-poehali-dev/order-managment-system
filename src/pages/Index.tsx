import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: OrderStatus;
  items: number;
}

interface Delivery {
  id: string;
  orderId: string;
  date: Date;
  customer: string;
  items: number;
  address: string;
  phone: string;
  notes?: string;
}

const mockDeliveries: Delivery[] = [
  { id: 'DEL-001', orderId: '#ORD-2024-003', date: new Date('2024-02-15'), customer: 'Елена Сидорова', items: 5, address: 'г. Москва, ул. Ленина, д. 15, кв. 42', phone: '+7 (999) 123-45-67', notes: 'Домофон 42К, звонить за час' },
  { id: 'DEL-002', orderId: '#ORD-2024-005', date: new Date('2024-02-18'), customer: 'Ольга Смирнова', items: 7, address: 'г. Санкт-Петербург, пр. Невский, д. 88', phone: '+7 (999) 234-56-78' },
  { id: 'DEL-003', orderId: '#ORD-2024-002', date: new Date('2024-02-20'), customer: 'Дмитрий Петров', items: 2, address: 'г. Казань, ул. Пушкина, д. 7, офис 301', phone: '+7 (999) 345-67-89', notes: 'Офисное здание, пропуск на ресепшн' },
  { id: 'DEL-004', orderId: '#ORD-2024-008', date: new Date('2024-02-22'), customer: 'Игорь Лебедев', items: 3, address: 'г. Екатеринбург, ул. Малышева, д. 33', phone: '+7 (999) 456-78-90' },
];

const mockOrders: Order[] = [
  { id: '#ORD-2024-001', customer: 'Анна Иванова', date: '2024-02-11', amount: 45800, status: 'completed', items: 3 },
  { id: '#ORD-2024-002', customer: 'Дмитрий Петров', date: '2024-02-11', amount: 23500, status: 'processing', items: 2 },
  { id: '#ORD-2024-003', customer: 'Елена Сидорова', date: '2024-02-10', amount: 67200, status: 'pending', items: 5 },
  { id: '#ORD-2024-004', customer: 'Михаил Козлов', date: '2024-02-10', amount: 12900, status: 'completed', items: 1 },
  { id: '#ORD-2024-005', customer: 'Ольга Смирнова', date: '2024-02-09', amount: 89300, status: 'processing', items: 7 },
  { id: '#ORD-2024-006', customer: 'Сергей Волков', date: '2024-02-09', amount: 34600, status: 'cancelled', items: 2 },
  { id: '#ORD-2024-007', customer: 'Наталья Морозова', date: '2024-02-08', amount: 56700, status: 'completed', items: 4 },
  { id: '#ORD-2024-008', customer: 'Игорь Лебедев', date: '2024-02-08', amount: 41200, status: 'pending', items: 3 },
];

const statusConfig = {
  pending: { label: 'Ожидает', color: 'bg-gradient-orange text-white', icon: 'Clock' },
  processing: { label: 'В обработке', color: 'bg-gradient-blue text-white', icon: 'RefreshCw' },
  completed: { label: 'Завершён', color: 'bg-green-500 text-white', icon: 'CheckCircle' },
  cancelled: { label: 'Отменён', color: 'bg-gray-400 text-white', icon: 'XCircle' },
};

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const delivery = deliveries.find(d => 
        d.date.toDateString() === date.toDateString()
      );
      if (delivery) {
        setSelectedDelivery(delivery);
        setIsDeliveryDialogOpen(true);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinAmount = !minAmount || order.amount >= parseInt(minAmount);
    const matchesMaxAmount = !maxAmount || order.amount <= parseInt(maxAmount);
    
    return matchesStatus && matchesSearch && matchesMinAmount && matchesMaxAmount;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => 
    order.status !== 'cancelled' ? sum + order.amount : sum, 0
  );
  const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
  const averageCheck = filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0;
  const totalOrders = filteredOrders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gradient-purple via-gradient-magenta to-gradient-blue bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-muted-foreground mt-2">Управление заказами в реальном времени</p>
          </div>
          <Button className="bg-gradient-to-r from-gradient-purple to-gradient-magenta hover:opacity-90 transition-all hover:scale-105">
            <Icon name="Plus" className="mr-2" size={18} />
            Новый заказ
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-scale-in">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-gradient-purple/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ближайшая поставка</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-purple to-gradient-magenta">
                <Icon name="Truck" className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-gradient-purple to-gradient-magenta bg-clip-text text-transparent">
                15 фев
              </div>
              <p className="text-xs text-muted-foreground mt-1">Через 4 дня • Заказ #ORD-2024-003</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-gradient-blue/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-blue to-gradient-purple">
                <Icon name="ShoppingCart" className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-blue">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Активных: {totalOrders - filteredOrders.filter(o => o.status === 'cancelled').length}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Завершено</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Icon name="CheckCircle" className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}% от общего числа</p>
            </CardContent>
          </Card>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="animate-fade-in shadow-xl border-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Icon name="Calendar" className="text-gradient-purple" size={24} />
                Календарь поставок
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-lg border"
                modifiers={{
                  delivery: deliveries.map(d => d.date)
                }}
                modifiersStyles={{
                  delivery: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Предстоящие поставки:</p>
                {deliveries.slice(0, 3).map((delivery) => (
                  <div 
                    key={delivery.id} 
                    onClick={() => {
                      setSelectedDelivery(delivery);
                      setIsDeliveryDialogOpen(true);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{delivery.customer}</p>
                      <p className="text-xs text-muted-foreground">{delivery.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gradient-purple">{delivery.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-xs text-muted-foreground">{delivery.items} шт</p>
                    </div>
                  </div>
                ))}
              </div>

              <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Icon name="Truck" className="text-gradient-purple" size={24} />
                      Детали поставки
                    </DialogTitle>
                  </DialogHeader>
                  {selectedDelivery && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Дата доставки</p>
                            <p className="font-bold text-lg text-gradient-purple">
                              {selectedDelivery.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Номер заказа</p>
                            <p className="font-mono font-semibold">{selectedDelivery.orderId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Icon name="User" className="text-muted-foreground mt-1" size={18} />
                          <div>
                            <p className="text-xs text-muted-foreground">Клиент</p>
                            <p className="font-semibold">{selectedDelivery.customer}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Icon name="MapPin" className="text-muted-foreground mt-1" size={18} />
                          <div>
                            <p className="text-xs text-muted-foreground">Адрес доставки</p>
                            <p className="font-medium">{selectedDelivery.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Icon name="Phone" className="text-muted-foreground mt-1" size={18} />
                          <div>
                            <p className="text-xs text-muted-foreground">Телефон</p>
                            <p className="font-medium">{selectedDelivery.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Icon name="Package" className="text-muted-foreground mt-1" size={18} />
                          <div>
                            <p className="text-xs text-muted-foreground">Количество товаров</p>
                            <p className="font-semibold">{selectedDelivery.items} шт</p>
                          </div>
                        </div>

                        {selectedDelivery.notes && (
                          <div className="flex items-start gap-3">
                            <Icon name="FileText" className="text-muted-foreground mt-1" size={18} />
                            <div>
                              <p className="text-xs text-muted-foreground">Примечания</p>
                              <p className="font-medium text-sm">{selectedDelivery.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1 bg-gradient-to-r from-gradient-purple to-gradient-magenta">
                          <Icon name="Navigation" className="mr-2" size={16} />
                          Маршрут
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Icon name="Phone" className="mr-2" size={16} />
                          Позвонить
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

        <Card className="lg:col-span-2 animate-slide-in shadow-xl border-2">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold">Все заказы</CardTitle>
              <div className="flex flex-col md:flex-row gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Поиск по клиенту или ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="completed">Завершён</SelectItem>
                    <SelectItem value="cancelled">Отменён</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Мин. сумма"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-[140px]"
                />
                <Input
                  type="number"
                  placeholder="Макс. сумма"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-[140px]"
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchQuery('');
                    setMinAmount('');
                    setMaxAmount('');
                  }}
                >
                  <Icon name="RotateCcw" className="mr-2" size={16} />
                  Сбросить
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <TableHead className="font-bold">ID заказа</TableHead>
                    <TableHead className="font-bold">Клиент</TableHead>
                    <TableHead className="font-bold">Дата</TableHead>
                    <TableHead className="font-bold">Товаров</TableHead>
                    <TableHead className="font-bold">Сумма</TableHead>
                    <TableHead className="font-bold">Статус</TableHead>
                    <TableHead className="font-bold text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <Icon name="Search" className="mx-auto mb-2" size={32} />
                        <p>Заказы не найдены</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono font-semibold">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold">
                            {order.items} шт
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">{order.amount.toLocaleString('ru-RU')} ₽</TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[order.status].color} flex items-center gap-1 w-fit`}>
                            <Icon name={statusConfig[order.status].icon} size={14} />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="hover:bg-gradient-purple/10">
                              <Icon name="Eye" size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-gradient-blue/10">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;