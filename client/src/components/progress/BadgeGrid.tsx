import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeType } from '@/types';
import { Lock, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

interface BadgeGridProps {
  badges: BadgeType[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone':
        return 'from-yellow-400 to-orange-500';
      case 'streak':
        return 'from-red-400 to-pink-500';
      case 'mastery':
        return 'from-blue-400 to-purple-500';
      case 'social':
        return 'from-green-400 to-teal-500';
      case 'special':
        return 'from-purple-400 to-indigo-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <Card
          key={badge._id}
          className={`relative overflow-hidden transition-all hover:shadow-lg ${
            badge.isEarned ? 'border-2 border-yellow-300' : 'opacity-60'
          }`}
        >
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <div
                className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getCategoryColor(
                  badge.category
                )} flex items-center justify-center text-4xl ${!badge.isEarned && 'grayscale'}`}
              >
                {badge.isEarned ? badge.icon : <Lock className="h-8 w-8 text-white" />}
              </div>
              {badge.isEarned && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-semibold text-sm line-clamp-1">{badge.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
            </div>

            {badge.isEarned && badge.earnedAt && (
              <p className="text-xs text-center text-green-600">
                Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
              </p>
            )}

            {!badge.isEarned && badge.progress !== undefined && badge.total !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">
                    {badge.progress}/{badge.total}
                  </span>
                </div>
                <Progress value={(badge.progress / badge.total) * 100} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}