import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GameType, Difficulty } from '../types';
import { Clock, Star, Target } from 'lucide-react';

interface GameCardProps {
  type: GameType;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: number;
  xpReward: number;
  icon: React.ReactNode;
  color: string;
  onPlay: () => void;
}

export function GameCard({
  type,
  title,
  description,
  difficulty,
  estimatedTime,
  xpReward,
  icon,
  color,
  onPlay
}: GameCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={difficultyColors[difficulty]}>
          {difficultyLabels[difficulty]}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {estimatedTime} min
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          +{xpReward} XP
        </Badge>
      </div>

      <Button onClick={onPlay} className={`w-full ${color.replace('bg-', 'bg-').split('-')[0]}-600`}>
        <Target className="w-4 h-4 mr-2" />
        Jugar Ahora
      </Button>
    </Card>
  );
}
