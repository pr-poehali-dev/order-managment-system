import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Order, statusConfig } from './OrderDetailsDialog';

interface OrdersTableProps {
  orders: Order[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  minAmount: string;
  setMinAmount: (value: string) => void;
  maxAmount: string;
  setMaxAmount: (value: string) => void;
  onResetFilters: () => void;
  onViewOrder: (order: Order) => void;
}

const OrdersTable = ({
  orders,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  onResetFilters,
  onViewOrder,
}: OrdersTableProps) => {
  return (
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
            <Button variant="outline" onClick={onResetFilters}>
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
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Icon name="Search" className="mx-auto mb-2" size={32} />
                    <p>Заказы не найдены</p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
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
                        onClick={() => onViewOrder(order)}
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
  );
};

export default OrdersTable;
