import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardEntry } from '@/types';
import { Trophy, ArrowRight } from 'lucide-react';

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
  onViewFull: () => void;
}

export function LeaderboardWidget({ entries, onViewFull }: LeaderboardWidgetProps) {
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            This Week's Top Learners
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewFull}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                entry.isCurrentUser ? 'bg-purple-50 border-2 border-purple-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-[60px]">
                <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
                {getMedalEmoji(entry.rank) && <span className="text-xl">{getMedalEmoji(entry.rank)}</span>}
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {entry.username}
                  {entry.isCurrentUser && <span className="text-purple-600 ml-2">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground">{entry.country}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-purple-600">{entry.xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}