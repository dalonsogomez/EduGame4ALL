import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar?: string;
}

interface LeaderboardCardProps {
  currentUserRank?: number;
  currentUserXP?: number;
}

export function LeaderboardCard({ currentUserRank = 15, currentUserXP = 250 }: LeaderboardCardProps) {
  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'María González', xp: 2450, level: 25 },
    { rank: 2, name: 'Ahmed Hassan', xp: 2180, level: 22 },
    { rank: 3, name: 'John Smith', xp: 1920, level: 20 },
    { rank: 4, name: 'Li Wei', xp: 1750, level: 18 },
    { rank: 5, name: 'Sofia Rodríguez', xp: 1580, level: 16 },
    { rank: 6, name: 'Omar Al-Farsi', xp: 1420, level: 15 },
    { rank: 7, name: 'Emma Johnson', xp: 1280, level: 13 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-500" />;
      default:
        return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <h3 className="text-gray-900">Tabla de Clasificación</h3>
      </div>

      <div className="space-y-2 mb-6">
        {mockLeaderboard.map(entry => (
          <div
            key={entry.rank}
            className={`p-4 rounded-lg border-2 ${getRankColor(entry.rank)} transition-all hover:shadow-md`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[60px]">
                {getRankIcon(entry.rank)}
                <span className="text-gray-900">#{entry.rank}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-900">{entry.name}</p>
                <p className="text-gray-600 text-sm">Nivel {entry.level}</p>
              </div>
              
              <Badge className="bg-blue-100 text-blue-700">
                {entry.xp} XP
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Current User Position */}
      <div className="pt-4 border-t">
        <p className="text-gray-600 mb-3">Tu Posición</p>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[60px]">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">#{currentUserRank}</span>
            </div>
            
            <div className="flex-1">
              <p className="text-gray-900">Tú</p>
              <p className="text-gray-600 text-sm">Sigue jugando para subir</p>
            </div>
            
            <Badge className="bg-blue-600 text-white">
              {currentUserXP} XP
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-4 text-center">
        Se actualiza semanalmente
      </p>
    </Card>
  );
}
