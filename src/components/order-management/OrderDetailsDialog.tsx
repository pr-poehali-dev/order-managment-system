import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'awaiting_confirmation';

export interface Order {
  id: string;
  supplier: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  status: OrderStatus;
  items: number;
}

export const statusConfig = {
  awaiting_confirmation: { label: 'Ожидает подтверждения', color: 'bg-gradient-orange text-white', icon: 'Clock' },
  processing: { label: 'Активный', color: 'bg-gradient-blue text-white', icon: 'RefreshCw' },
  completed: { label: 'Завершён', color: 'bg-green-500 text-white', icon: 'CheckCircle' },
  cancelled: { label: 'Отменён', color: 'bg-gray-400 text-white', icon: 'XCircle' },
  pending: { label: 'Ожидает', color: 'bg-yellow-500 text-white', icon: 'Clock' },
};

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const OrderDetailsDialog = ({ isOpen, onOpenChange, order }: OrderDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="FileText" className="text-gradient-purple" size={24} />
            Детали заказа на покупку
          </DialogTitle>
        </DialogHeader>
        {order && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Номер заказа</p>
                <p className="font-mono font-bold text-lg">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Статус</p>
                <Badge className={`${statusConfig[order.status].color} flex items-center gap-1 w-fit`}>
                  <Icon name={statusConfig[order.status].icon} size={14} />
                  {statusConfig[order.status].label}
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
                      <p className="font-semibold">{order.supplier}</p>
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
                      <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Truck" className="text-muted-foreground mt-1" size={18} />
                    <div>
                      <p className="text-xs text-muted-foreground">Дата поставки</p>
                      <p className="font-semibold text-gradient-purple">{new Date(order.deliveryDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" className="text-muted-foreground mt-1" size={18} />
                    <div>
                      <p className="text-xs text-muted-foreground">Осталось дней</p>
                      <p className="font-semibold">{Math.ceil((new Date(order.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дн.</p>
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
                  <Badge variant="outline" className="font-bold">{order.items} шт</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <span className="font-semibold text-lg">Общая сумма заказа</span>
                  <span className="font-bold text-2xl text-gradient-purple">{order.amount.toLocaleString('ru-RU')} ₽</span>
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
  );
};

export default OrderDetailsDialog;
