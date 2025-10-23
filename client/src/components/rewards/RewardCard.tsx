import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reward } from '@/types';
import { Gift, Clock } from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  userXP: number;
  onRedeem: (rewardId: string) => void;
}

export function RewardCard({ reward, userXP, onRedeem }: RewardCardProps) {
  const canAfford = userXP >= reward.cost;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'coupon':
        return 'Coupon';
      case 'digital':
        return 'Digital';
      case 'content':
        return 'Content';
      case 'donation':
        return 'Donation';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coupon':
        return 'bg-blue-100 text-blue-700';
      case 'digital':
        return 'bg-purple-100 text-purple-700';
      case 'content':
        return 'bg-green-100 text-green-700';
      case 'donation':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 overflow-hidden">
        <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className={getCategoryColor(reward.category)}>{getCategoryLabel(reward.category)}</Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1">{reward.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{reward.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gift className="h-4 w-4" />
            <span>{reward.available} available</span>
          </div>
          {reward.expirationDays && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{reward.expirationDays}d validity</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-purple-600">{reward.cost} XP</span>
            {!canAfford && <span className="text-xs text-red-600">Need {reward.cost - userXP} more XP</span>}
          </div>
          <Button onClick={() => onRedeem(reward._id)} className="w-full" disabled={!canAfford || reward.available === 0}>
            {reward.available === 0 ? 'Out of Stock' : canAfford ? 'Redeem Now' : 'Not Enough XP'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}