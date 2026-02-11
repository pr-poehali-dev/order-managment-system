import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Supplier {
  id: string;
  name: string;
  deliveryDays: Date[]; // График поставок
}

interface InventoryData {
  lastInventoryDate: string;
  items: {
    buns: number;
    patties: number;
    tomatoes: number;
    cucumbers: number;
    fries: number;
    cola: number;
  };
}

export interface OrderData {
  supplier: string;
  deliveryDates: Date[];
  nextDeliveryDate: Date | undefined;
  nextDeliveryTime: string;
  needs: {
    buns: number;
    patties: number;
    tomatoes: number;
    cucumbers: number;
    fries: number;
    cola: number;
  };
  inventoryDate: string;
}

interface CreateOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (orderData: OrderData) => void;
}

const mockSuppliers: Supplier[] = [
  { 
    id: 'SUP-001', 
    name: 'ООО "Поставщик-1"',
    deliveryDays: [
      new Date('2024-02-15'),
      new Date('2024-02-18'),
      new Date('2024-02-22'),
      new Date('2024-02-25'),
      new Date('2024-03-01')
    ]
  },
  { 
    id: 'SUP-002', 
    name: 'ИП Иванов',
    deliveryDays: [
      new Date('2024-02-14'),
      new Date('2024-02-17'),
      new Date('2024-02-21'),
      new Date('2024-02-24'),
      new Date('2024-02-28')
    ]
  },
  { 
    id: 'SUP-003', 
    name: 'ООО "Торговый Дом"',
    deliveryDays: [
      new Date('2024-02-16'),
      new Date('2024-02-20'),
      new Date('2024-02-23'),
      new Date('2024-02-27'),
      new Date('2024-03-02')
    ]
  },
];

const mockInventory: InventoryData = {
  lastInventoryDate: '2024-02-10',
  items: {
    buns: 500,
    patties: 450,
    tomatoes: 200,
    cucumbers: 180,
    fries: 300,
    cola: 250
  }
};

const CreateOrderDialog = ({ isOpen, onOpenChange, onCreateOrder }: CreateOrderDialogProps) => {
  const [step, setStep] = useState<'inventory' | 'supplier' | 'calendar'>('inventory');
  const [useExistingInventory, setUseExistingInventory] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedDeliveryDates, setSelectedDeliveryDates] = useState<Date[]>([]);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<Date | undefined>();
  const [nextDeliveryTime, setNextDeliveryTime] = useState<string>('10:00');
  const [calculatedNeeds, setCalculatedNeeds] = useState<OrderData['needs'] | null>(null);

  const handleConfirmInventory = () => {
    if (useExistingInventory) {
      setStep('supplier');
    } else {
      // Логика загрузки файла ЛИ КРУ
      alert('Функция загрузки файла будет реализована');
    }
  };

  const handleSelectSupplier = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplier || null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !selectedSupplier) return;
    
    // Проверяем, есть ли эта дата в графике поставок
    const isDeliveryDay = selectedSupplier.deliveryDays.some(
      d => d.toDateString() === date.toDateString()
    );
    
    if (isDeliveryDay) {
      // Добавляем или удаляем дату из выбранных
      setSelectedDeliveryDates(prev => {
        const exists = prev.some(d => d.toDateString() === date.toDateString());
        if (exists) {
          return prev.filter(d => d.toDateString() !== date.toDateString());
        } else {
          return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
        }
      });
    }
  };

  const handleCalculateNeeds = () => {
    if (selectedDeliveryDates.length === 0 || !nextDeliveryDate) {
      alert('Выберите даты поставок и дату следующей поставки');
      return;
    }

    // Простой расчет потребностей (в реальности будет сложнее)
    const daysToNextDelivery = Math.ceil(
      (nextDeliveryDate.getTime() - selectedDeliveryDates[selectedDeliveryDates.length - 1].getTime()) / (1000 * 60 * 60 * 24)
    );

    const dailyConsumption = {
      buns: 50,
      patties: 45,
      tomatoes: 20,
      cucumbers: 18,
      fries: 30,
      cola: 25
    };

    const needs = {
      buns: Math.max(0, dailyConsumption.buns * daysToNextDelivery - mockInventory.items.buns),
      patties: Math.max(0, dailyConsumption.patties * daysToNextDelivery - mockInventory.items.patties),
      tomatoes: Math.max(0, dailyConsumption.tomatoes * daysToNextDelivery - mockInventory.items.tomatoes),
      cucumbers: Math.max(0, dailyConsumption.cucumbers * daysToNextDelivery - mockInventory.items.cucumbers),
      fries: Math.max(0, dailyConsumption.fries * daysToNextDelivery - mockInventory.items.fries),
      cola: Math.max(0, dailyConsumption.cola * daysToNextDelivery - mockInventory.items.cola)
    };

    setCalculatedNeeds(needs);
  };

  const handleCreateOrder = () => {
    if (!calculatedNeeds || !selectedSupplier) return;

    const orderData = {
      supplier: selectedSupplier.name,
      deliveryDates: selectedDeliveryDates,
      nextDeliveryDate,
      nextDeliveryTime,
      needs: calculatedNeeds,
      inventoryDate: mockInventory.lastInventoryDate
    };

    onCreateOrder(orderData);
    // Сброс состояния
    setStep('inventory');
    setSelectedSupplier(null);
    setSelectedDeliveryDates([]);
    setNextDeliveryDate(undefined);
    setCalculatedNeeds(null);
    onOpenChange(false);
  };

  const resetDialog = () => {
    setStep('inventory');
    setUseExistingInventory(true);
    setSelectedSupplier(null);
    setSelectedDeliveryDates([]);
    setNextDeliveryDate(undefined);
    setNextDeliveryTime('10:00');
    setCalculatedNeeds(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetDialog();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="ShoppingCart" className="text-gradient-purple" size={24} />
            Создание нового заказа на покупку
          </DialogTitle>
        </DialogHeader>

        {/* Шаг 1: Проверка инвентаризации */}
        {step === 'inventory' && (
          <div className="space-y-6">
            <Card className="border-2 border-gradient-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon name="AlertCircle" className="text-gradient-orange" size={20} />
                  Данные инвентаризации
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    При создании заказа будут использоваться данные последней инвентаризации:
                  </p>
                  <p className="text-2xl font-bold text-gradient-orange">
                    {new Date(mockInventory.lastInventoryDate).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Булочки</p>
                    <p className="text-xl font-bold">{mockInventory.items.buns} шт</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Котлеты</p>
                    <p className="text-xl font-bold">{mockInventory.items.patties} шт</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Помидоры</p>
                    <p className="text-xl font-bold">{mockInventory.items.tomatoes} кг</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Огурцы</p>
                    <p className="text-xl font-bold">{mockInventory.items.cucumbers} кг</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Картошка фри</p>
                    <p className="text-xl font-bold">{mockInventory.items.fries} кг</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Кока-кола</p>
                    <p className="text-xl font-bold">{mockInventory.items.cola} л</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-gradient-purple to-gradient-magenta"
                    onClick={() => {
                      setUseExistingInventory(true);
                      handleConfirmInventory();
                    }}
                  >
                    <Icon name="CheckCircle" className="mr-2" size={18} />
                    Использовать эти данные
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setUseExistingInventory(false);
                      handleConfirmInventory();
                    }}
                  >
                    <Icon name="Upload" className="mr-2" size={18} />
                    Загрузить файл ЛИ КРУ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Шаг 2: Выбор поставщика */}
        {step === 'supplier' && (
          <div className="space-y-6">
            <Card className="border-2 border-gradient-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon name="Building2" className="text-gradient-blue" size={20} />
                  Выбор поставщика
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleSelectSupplier} value={selectedSupplier?.id}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите поставщика" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedSupplier && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Выбранный поставщик:</p>
                    <p className="text-lg font-bold text-gradient-blue">{selectedSupplier.name}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      График поставок: {selectedSupplier.deliveryDays.length} доступных дат
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('inventory')}>
                    <Icon name="ArrowLeft" className="mr-2" size={18} />
                    Назад
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-gradient-purple to-gradient-magenta"
                    onClick={() => setStep('calendar')}
                    disabled={!selectedSupplier}
                  >
                    Продолжить
                    <Icon name="ArrowRight" className="ml-2" size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Шаг 3: Календарь поставок */}
        {step === 'calendar' && selectedSupplier && (
          <div className="space-y-6">
            <Card className="border-2 border-gradient-purple/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg">
                    <Icon name="Calendar" className="text-gradient-purple" size={20} />
                    График поставок: {selectedSupplier.name}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep('supplier')}>
                    <Icon name="Edit" size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Выбор дат заказа */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-gradient-purple to-gradient-magenta text-white">
                        Шаг 1
                      </Badge>
                      <p className="text-sm font-semibold">Выберите даты поставок для заказа</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg mb-3">
                      <p className="text-xs text-muted-foreground">
                        <Icon name="Info" className="inline mr-1" size={12} />
                        Фиолетовым выделены даты из графика поставок. Оранжевым — выбранные даты для заказа.
                      </p>
                    </div>
                    <Calendar
                      mode="single"
                      onSelect={handleDateSelect}
                      className="rounded-lg border"
                      modifiers={{
                        deliveryDay: selectedSupplier.deliveryDays,
                        selected: selectedDeliveryDates
                      }}
                      modifiersStyles={{
                        deliveryDay: {
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'white',
                          fontWeight: 'bold'
                        },
                        selected: {
                          backgroundColor: '#F97316',
                          color: 'white',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    {selectedDeliveryDates.length > 0 && (
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Выбранные даты:</p>
                        <div className="space-y-1">
                          {selectedDeliveryDates.map(date => (
                            <div key={date.toISOString()} className="flex items-center gap-2">
                              <Icon name="CheckCircle" className="text-gradient-orange" size={14} />
                              <span className="text-sm font-medium">
                                {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Выбор даты следующей поставки */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-gradient-blue to-cyan-500 text-white">
                        Шаг 2
                      </Badge>
                      <p className="text-sm font-semibold">Выберите дату и время следующей поставки</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      До этого момента должно хватить товаров из заказа.<br />
                      <strong>Обычно это следующая по расписанию поставка.</strong>
                    </p>
                    <Calendar
                      mode="single"
                      selected={nextDeliveryDate}
                      onSelect={setNextDeliveryDate}
                      className="rounded-lg border"
                      modifiers={{
                        availableDay: selectedSupplier.deliveryDays
                      }}
                      modifiersStyles={{
                        availableDay: {
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'white',
                          fontWeight: 'bold'
                        }
                      }}
                      disabled={(date) => {
                        if (selectedDeliveryDates.length === 0) return true;
                        const lastSelected = selectedDeliveryDates[selectedDeliveryDates.length - 1];
                        return date <= lastSelected;
                      }}
                    />
                    {nextDeliveryDate && (
                      <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                          <Icon name="Clock" className="text-gradient-blue" size={18} />
                          <Input
                            type="time"
                            value={nextDeliveryTime}
                            onChange={(e) => setNextDeliveryTime(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Следующая поставка:</p>
                          <p className="text-lg font-bold text-gradient-blue">
                            {nextDeliveryDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в {nextDeliveryTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Расчет потребностей */}
                {selectedDeliveryDates.length > 0 && nextDeliveryDate && (
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-gradient-purple to-gradient-magenta"
                      onClick={handleCalculateNeeds}
                    >
                      <Icon name="Calculator" className="mr-2" size={18} />
                      Рассчитать потребности
                    </Button>

                    {calculatedNeeds && (
                      <Card className="border-2 border-gradient-purple/20">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Icon name="Package" className="text-gradient-orange" size={20} />
                            Расчетные потребности в товарах
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Булочки</p>
                              <p className="text-2xl font-bold text-gradient-purple">{calculatedNeeds.buns}</p>
                              <p className="text-xs text-muted-foreground">штук</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Котлеты</p>
                              <p className="text-2xl font-bold text-gradient-purple">{calculatedNeeds.patties}</p>
                              <p className="text-xs text-muted-foreground">штук</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Помидоры</p>
                              <p className="text-2xl font-bold text-gradient-purple">{calculatedNeeds.tomatoes}</p>
                              <p className="text-xs text-muted-foreground">кг</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Огурцы</p>
                              <p className="text-2xl font-bold text-gradient-purple">{calculatedNeeds.cucumbers}</p>
                              <p className="text-xs text-muted-foreground">кг</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Картошка фри</p>
                              <p className="text-2xl font-bold text-gradient-purple">{calculatedNeeds.fries}</p>
                              <p className="text-xs text-muted-foreground">кг</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Кока-кола</p>
                              <p className="text-2xl font-bold text-gradient-purple">{calculatedNeeds.cola}</p>
                              <p className="text-xs text-muted-foreground">литров</p>
                            </div>
                          </div>

                          <Button 
                            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                            onClick={handleCreateOrder}
                          >
                            <Icon name="CheckCircle" className="mr-2" size={18} />
                            Создать заказ
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('supplier')}>
                    <Icon name="ArrowLeft" className="mr-2" size={18} />
                    Назад
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;