import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import StatisticsCards from '@/components/order-management/StatisticsCards';
import DeliveryCalendar, { Delivery } from '@/components/order-management/DeliveryCalendar';
import OrdersTable from '@/components/order-management/OrdersTable';
import OrderDetailsDialog, { Order } from '@/components/order-management/OrderDetailsDialog';

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

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setMinAmount('');
    setMaxAmount('');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

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

        <StatisticsCards 
          activeOrders={activeOrders}
          awaitingConfirmation={awaitingConfirmation}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DeliveryCalendar deliveries={deliveries} />

          <OrdersTable
            orders={filteredOrders}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            maxAmount={maxAmount}
            setMaxAmount={setMaxAmount}
            onResetFilters={handleResetFilters}
            onViewOrder={handleViewOrder}
          />
        </div>

        <OrderDetailsDialog
          isOpen={isOrderDetailsOpen}
          onOpenChange={setIsOrderDetailsOpen}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default Index;
