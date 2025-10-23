import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameCard } from '@/components/games/GameCard';
import { getGames } from '@/api/games';
import { Game } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Loader2, Gamepad2 } from 'lucide-react';

export function Games() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, activeCategory, difficulty]);

  const loadGames = async () => {
    try {
      setLoading(true);
      console.log('Loading games...');
      const response = await getGames();
      setGames(response.games);
      console.log('Games loaded:', response.games.length);
    } catch (error: any) {
      console.error('Error loading games:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load games',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = games;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((game) => game.category === activeCategory);
    }

    if (difficulty !== 'all') {
      filtered = filtered.filter((game) => game.difficulty === parseInt(difficulty));
    }

    setFilteredGames(filtered);
  };

  const handlePlayGame = (gameId: string) => {
    console.log('Playing game:', gameId);
    navigate(`/games/${gameId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-purple-600" />
            Game Center
          </h1>
          <p className="text-muted-foreground mt-1">Choose a game to start learning</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Games</CardTitle>
            <div className="flex gap-3">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Beginner</SelectItem>
                  <SelectItem value="2">Easy</SelectItem>
                  <SelectItem value="3">Intermediate</SelectItem>
                  <SelectItem value="4">Advanced</SelectItem>
                  <SelectItem value="5">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="language">Language</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="softSkills">Soft Skills</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {filteredGames.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No games found matching your filters</p>
                  <Button variant="outline" onClick={() => { setActiveCategory('all'); setDifficulty('all'); }} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard key={game._id} game={game} onPlay={handlePlayGame} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}