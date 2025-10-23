import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Gift } from 'lucide-react';

interface QuickStatsProps {
  totalXP: number;
  level: number;
  gamesThisWeek: number;
  rewardsEarned: number;
}

export function QuickStats({ totalXP, level, gamesThisWeek, rewardsEarned }: QuickStatsProps) {
  const stats = [
    {
      icon: Trophy,
      label: 'Total XP',
      value: totalXP.toLocaleString(),
      subtext: `Level ${level}`,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Target,
      label: 'Games This Week',
      value: gamesThisWeek,
      subtext: 'Keep it up!',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Gift,
      label: 'Rewards Earned',
      value: rewardsEarned,
      subtext: 'Redeem now',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}