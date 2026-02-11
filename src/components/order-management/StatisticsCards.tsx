import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StatisticsCardsProps {
  activeOrders: number;
  awaitingConfirmation: number;
}

const StatisticsCards = ({ activeOrders, awaitingConfirmation }: StatisticsCardsProps) => {
  return (
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
  );
};

export default StatisticsCards;
