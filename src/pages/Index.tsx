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

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'awaiting_confirmation';

interface Order {
  id: string;
  supplier: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  status: OrderStatus;
  items: number;
}

interface Delivery {
  id: string;
  orderId: string;
  date: Date;
  time: string;
  supplier: string;
  items: number;
  address: string;
  phone: string;
  notes?: string;
}

const mockDeliveries: Delivery[] = [
  { id: 'DEL-001', orderId: '#ORD-2024-003', date: new Date('2024-02-15'), time: '10:00', supplier: 'ООО "Поставщик-1"', items: 5, address: 'г. Москва, ул. Ленина, д. 15, кв. 42', phone: '+7 (999) 123-45-67', notes: 'Домофон 42К, звонить за час' },
  { id: 'DEL-002', orderId: '#ORD-2024-005', date: new Date('2024-02-18'), time: '14:30', supplier: 'ИП Иванов', items: 7, address: 'г. Санкт-Петербург, пр. Невский, д. 88', phone: '+7 (999) 234-56-78' },
  { id: 'DEL-003', orderId: '#ORD-2024-002', date: new Date('2024-02-20'), time: '09:00', supplier: 'ООО "Торговый Дом"', items: 2, address: 'г. Казань, ул. Пушкина, д. 7, офис 301', phone: '+7 (999) 345-67-89', notes: 'Офисное здание, пропуск на ресепшн' },
  { id: 'DEL-004', orderId: '#ORD-2024-008', date: new Date('2024-02-22'), time: '16:00', supplier: 'ООО "Поставщик-1"', items: 3, address: 'г. Екатеринбург, ул. Малышева, д. 33', phone: '+7 (999) 456-78-90' },
];

const mockOrders: Order[] = [
  { id: '#ORD-2024-001', supplier: 'ООО "Поставщик-1"', orderDate: '2024-02-11', deliveryDate: '2024-02-18', amount: 45800, status: 'completed', items: 3 },
  { id: '#ORD-2024-002', supplier: 'ООО "Торговый Дом"', orderDate: '2024-02-11', deliveryDate: '2024-02-20', amount: 23500, status: 'processing', items: 2 },
  { id: '#ORD-2024-003', supplier: 'ООО "Поставщик-1"', orderDate: '2024-02-10', deliveryDate: '2024-02-15', amount: 67200, status: 'awaiting_confirmation', items: 5 },
  { id: '#ORD-2024-004', supplier: 'ИП Иванов', orderDate: '2024-02-10', deliveryDate: '2024-02-17', amount: 12900, status: 'completed', items: 1 },
  { id: '#ORD-2024-005', supplier: 'ИП Иванов', orderDate: '2024-02-09', deliveryDate: '2024-02-18', amount: 89300, status: 'processing', items: 7 },
  { id: '#ORD-2024-006', supplier: 'ООО "Поставщик-2"', orderDate: '2024-02-09', deliveryDate: '2024-02-16', amount: 34600, status: 'cancelled', items: 2 },
  { id: '#ORD-2024-007', supplier: 'ООО "Торговый Дом"', orderDate: '2024-02-08', deliveryDate: '2024-02-14', amount: 56700, status: 'completed', items: 4 },
  { id: '#ORD-2024-008', supplier: 'ООО "Поставщик-1"', orderDate: '2024-02-08', deliveryDate: '2024-02-22', amount: 41200, status: 'awaiting_confirmation', items: 3 },
];

const statusConfig = {
  awaiting_confirmation: { label: 'Ожидает подтверждения', color: 'bg-gradient-orange text-white', icon: 'Clock' },
  processing: { label: 'Активный', color: 'bg-gradient-blue text-white', icon: 'RefreshCw' },
  completed: { label: 'Завершён', color: 'bg-green-500 text-white', icon: 'CheckCircle' },
  cancelled: { label: 'Отменён', color: 'bg-gray-400 text-white', icon: 'XCircle' },
  pending: { label: 'Ожидает', color: 'bg-yellow-500 text-white', icon: 'Clock' },
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
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
    const matchesSearch = order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinAmount = !minAmount || order.amount >= parseInt(minAmount);
    const matchesMaxAmount = !maxAmount || order.amount <= parseInt(maxAmount);
    
    return matchesStatus && matchesSearch && matchesMinAmount && matchesMaxAmount;
  });

  const activeOrders = orders.filter(o => o.status === 'processing').length;
  const awaitingConfirmation = orders.filter(o => o.status === 'awaiting_confirmation').length;

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-in">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-gradient-blue/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Активные заказы</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-blue to-gradient-purple">
                <Icon name="RefreshCw" className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-blue">{activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">В процессе обработки</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-gradient-orange/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ожидают подтверждения</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-orange to-amber-500">
                <Icon name="Clock" className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-orange">{awaitingConfirmation}</div>
              <p className="text-xs text-muted-foreground mt-1">Требуется подтверждение поставщика</p>
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
                    className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{delivery.supplier}</p>
                      <p className="font-bold text-gradient-purple">{delivery.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} • {delivery.time}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{delivery.orderId}</p>
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
                    placeholder="Поиск по поставщику или ID..."
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
                    <SelectItem value="awaiting_confirmation">Ожидает подтверждения</SelectItem>
                    <SelectItem value="processing">Активный</SelectItem>
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
                    <TableHead className="font-bold">Номер заказа</TableHead>
                    <TableHead className="font-bold">Поставщик</TableHead>
                    <TableHead className="font-bold">Дата заказа</TableHead>
                    <TableHead className="font-bold">Дата поставки</TableHead>
                    <TableHead className="font-bold">Сумма заказа</TableHead>
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
                        <TableCell className="font-medium">{order.supplier}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>{new Date(order.deliveryDate).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell className="font-bold">{order.amount.toLocaleString('ru-RU')} ₽</TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[order.status].color} flex items-center gap-1 w-fit`}>
                            <Icon name={statusConfig[order.status].icon} size={14} />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-gradient-purple/10"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderDetailsOpen(true);
                            }}
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
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

        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="FileText" className="text-gradient-purple" size={24} />
                Детали заказа на покупку
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Номер заказа</p>
                    <p className="font-mono font-bold text-lg">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Статус</p>
                    <Badge className={`${statusConfig[selectedOrder.status].color} flex items-center gap-1 w-fit`}>
                      <Icon name={statusConfig[selectedOrder.status].icon} size={14} />
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Icon name="Building2" size={20} className="text-gradient-purple" />
                      Информация о поставщике
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icon name="User" className="text-muted-foreground mt-1" size={18} />
                        <div>
                          <p className="text-xs text-muted-foreground">Поставщик</p>
                          <p className="font-semibold">{selectedOrder.supplier}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Phone" className="text-muted-foreground mt-1" size={18} />
                        <div>
                          <p className="text-xs text-muted-foreground">Контактный телефон</p>
                          <p className="font-medium">+7 (999) 111-22-33</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Mail" className="text-muted-foreground mt-1" size={18} />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">supplier@example.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Icon name="Calendar" size={20} className="text-gradient-blue" />
                      Даты и сроки
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icon name="CalendarCheck" className="text-muted-foreground mt-1" size={18} />
                        <div>
                          <p className="text-xs text-muted-foreground">Дата заказа</p>
                          <p className="font-semibold">{new Date(selectedOrder.orderDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Truck" className="text-muted-foreground mt-1" size={18} />
                        <div>
                          <p className="text-xs text-muted-foreground">Дата поставки</p>
                          <p className="font-semibold text-gradient-purple">{new Date(selectedOrder.deliveryDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Clock" className="text-muted-foreground mt-1" size={18} />
                        <div>
                          <p className="text-xs text-muted-foreground">Осталось дней</p>
                          <p className="font-semibold">{Math.ceil((new Date(selectedOrder.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дн.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg border-2 border-gradient-purple/20">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Icon name="Package" size={20} className="text-gradient-orange" />
                    Состав заказа
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Количество позиций</span>
                      <Badge variant="outline" className="font-bold">{selectedOrder.items} шт</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <span className="font-semibold text-lg">Общая сумма заказа</span>
                      <span className="font-bold text-2xl text-gradient-purple">{selectedOrder.amount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-gradient-purple to-gradient-magenta">
                    <Icon name="Download" className="mr-2" size={16} />
                    Скачать заказ
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="Printer" className="mr-2" size={16} />
                    Печать
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="Edit" className="mr-2" size={16} />
                    Редактировать
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;