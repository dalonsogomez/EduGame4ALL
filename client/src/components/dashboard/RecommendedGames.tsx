import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types';
import { Clock, Star, Play } from 'lucide-react';

interface RecommendedGamesProps {
  games: Game[];
  onPlayGame: (gameId: string) => void;
}

export function RecommendedGames({ games, onPlayGame }: RecommendedGamesProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'language':
        return 'bg-blue-100 text-blue-700';
      case 'culture':
        return 'bg-green-100 text-green-700';
      case 'softSkills':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <p className="text-sm text-muted-foreground">Based on your progress and learning style</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Card key={game._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 overflow-hidden">
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className={getCategoryColor(game.category)}>{getCategoryLabel(game.category)}</Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{game.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{game.difficulty}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{game.duration} min</span>
                  </div>
                  <div className="font-semibold text-purple-600">+{game.xpReward} XP</div>
                </div>

                <Button onClick={() => onPlayGame(game._id)} className="w-full" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}