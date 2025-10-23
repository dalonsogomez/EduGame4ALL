import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Game } from '@/types';
import { Clock, Star, Play, Lock } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'language':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'culture':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'softSkills':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'language':
        return 'Language';
      case 'culture':
        return 'Culture';
      case 'softSkills':
        return 'Soft Skills';
      default:
        return category;
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all ${game.isLocked ? 'opacity-60' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <Badge className={getCategoryColor(game.category)}>{getCategoryLabel(game.category)}</Badge>
        </div>
        {game.isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-full p-3">
              <Lock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{game.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{game.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < game.difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{game.duration} min</span>
          </div>
          <div className="font-semibold text-purple-600">+{game.xpReward} XP</div>
        </div>

        {game.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{game.progress}%</span>
            </div>
            <Progress value={game.progress} className="h-1" />
          </div>
        )}

        <Button onClick={() => onPlay(game._id)} className="w-full" disabled={game.isLocked}>
          {game.isLocked ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Play Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}