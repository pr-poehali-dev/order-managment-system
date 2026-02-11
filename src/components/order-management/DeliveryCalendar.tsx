import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

export interface Delivery {
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

interface DeliveryCalendarProps {
  deliveries: Delivery[];
}

const DeliveryCalendar = ({ deliveries }: DeliveryCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

  return (
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
                      <p className="text-xs text-muted-foreground">Поставщик</p>
                      <p className="font-semibold">{selectedDelivery.supplier}</p>
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
  );
};

export default DeliveryCalendar;
