import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { GameCard } from '../components/GameCard';
import { useApp } from '../context/AppContext';
import { GameType, Difficulty } from '../types';
import { Globe, Heart, Users, ArrowLeft, Filter } from 'lucide-react';

export function GamesPage() {
  const { setCurrentPage, user } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<GameType | 'all'>('all');

  const games = [
    {
      type: 'vocabulary' as GameType,
      title: 'Vocabulario Cotidiano',
      description: 'Aprende palabras y frases esenciales para el día a día',
      difficulty: 'beginner' as Difficulty,
      estimatedTime: 10,
      xpReward: 50,
      icon: <Globe className="w-7 h-7 text-white" />,
      color: 'bg-blue-500'
    },
    {
      type: 'vocabulary' as GameType,
      title: 'Conversaciones en el Supermercado',
      description: 'Practica situaciones reales de compras',
      difficulty: 'intermediate' as Difficulty,
      estimatedTime: 15,
      xpReward: 75,
      icon: <Globe className="w-7 h-7 text-white" />,
      color: 'bg-blue-500'
    },
    {
      type: 'vocabulary' as GameType,
      title: 'Entrevistas de Trabajo',
      description: 'Domina el vocabulario profesional',
      difficulty: 'advanced' as Difficulty,
      estimatedTime: 20,
      xpReward: 100,
      icon: <Globe className="w-7 h-7 text-white" />,
      color: 'bg-blue-500'
    },
    {
      type: 'culture' as GameType,
      title: 'Costumbres Locales',
      description: 'Aprende sobre tradiciones y normas sociales',
      difficulty: 'beginner' as Difficulty,
      estimatedTime: 10,
      xpReward: 50,
      icon: <Heart className="w-7 h-7 text-white" />,
      color: 'bg-purple-500'
    },
    {
      type: 'culture' as GameType,
      title: 'Etiqueta Social',
      description: 'Comprende las reglas no escritas de la sociedad',
      difficulty: 'intermediate' as Difficulty,
      estimatedTime: 15,
      xpReward: 75,
      icon: <Heart className="w-7 h-7 text-white" />,
      color: 'bg-purple-500'
    },
    {
      type: 'culture' as GameType,
      title: 'Festividades y Celebraciones',
      description: 'Conoce las celebraciones importantes del país',
      difficulty: 'advanced' as Difficulty,
      estimatedTime: 15,
      xpReward: 100,
      icon: <Heart className="w-7 h-7 text-white" />,
      color: 'bg-purple-500'
    },
    {
      type: 'soft-skills' as GameType,
      title: 'Comunicación Básica',
      description: 'Desarrolla habilidades de comunicación efectiva',
      difficulty: 'beginner' as Difficulty,
      estimatedTime: 10,
      xpReward: 50,
      icon: <Users className="w-7 h-7 text-white" />,
      color: 'bg-pink-500'
    },
    {
      type: 'soft-skills' as GameType,
      title: 'Trabajo en Equipo',
      description: 'Aprende a colaborar eficientemente',
      difficulty: 'intermediate' as Difficulty,
      estimatedTime: 15,
      xpReward: 75,
      icon: <Users className="w-7 h-7 text-white" />,
      color: 'bg-pink-500'
    },
    {
      type: 'soft-skills' as GameType,
      title: 'Liderazgo y Gestión',
      description: 'Desarrolla habilidades de liderazgo',
      difficulty: 'advanced' as Difficulty,
      estimatedTime: 20,
      xpReward: 100,
      icon: <Users className="w-7 h-7 text-white" />,
      color: 'bg-pink-500'
    }
  ];

  const filteredGames = games.filter(game => {
    if (selectedDifficulty !== 'all' && game.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && game.type !== selectedType) return false;
    return true;
  });

  const handlePlayGame = (gameType: GameType, difficulty: Difficulty) => {
    // Navigate to game play page with parameters
    setCurrentPage(`play-${gameType}-${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-gray-900">Centro de Juegos</h1>
              <p className="text-gray-600">Elige un juego para comenzar a aprender</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Filtros</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 mb-2 block">Tipo de Juego</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as GameType | 'all')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos los tipos</option>
                <option value="vocabulary">Vocabulario</option>
                <option value="culture">Cultura</option>
                <option value="soft-skills">Habilidades Blandas</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 mb-2 block">Dificultad</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todas las dificultades</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
          </div>
        </Card>

        {/* AI Recommendation */}
        {user?.profile && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Recomendación Personalizada de IA</h3>
                <p className="text-gray-700 mb-3">
                  Basado en tu nivel actual (<strong>{user.profile.currentLanguageLevel}</strong>), 
                  te recomendamos comenzar con juegos de nivel{' '}
                  <strong>{user.profile.currentLanguageLevel === 'beginner' ? 'principiante' : 
                    user.profile.currentLanguageLevel === 'intermediate' ? 'intermedio' : 'avanzado'}</strong>{' '}
                  en el área de <strong>{user.profile.preferredTopics[0]}</strong>.
                </p>
                <Button
                  onClick={() => {
                    setSelectedDifficulty(user.profile!.currentLanguageLevel);
                    setSelectedType('vocabulary');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Aplicar Recomendación
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <GameCard
              key={index}
              {...game}
              onPlay={() => handlePlayGame(game.type, game.difficulty)}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No se encontraron juegos con los filtros seleccionados</p>
            <Button
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedType('all');
              }}
              variant="outline"
            >
              Limpiar Filtros
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
