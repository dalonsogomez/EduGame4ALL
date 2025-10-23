import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getGameById, submitGameSession } from '@/api/games';
import { Game, GameSession } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Loader2, ArrowLeft, Clock, Trophy, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

export function GamePlay() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [session, setSession] = useState<GameSession | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(10);

  const loadGame = useCallback(async () => {
    if (!gameId) return;
    
    try {
      setLoading(true);
      console.log('Loading game:', gameId);
      const response = await getGameById(gameId);
      setGame(response.game);
      console.log('Game loaded:', response.game.title);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error loading game:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load game',
        variant: 'destructive',
      });
      navigate('/games');
    } finally {
      setLoading(false);
    }
  }, [gameId, navigate, toast]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  const completeGame = useCallback(async () => {
    if (!gameId) return;
    
    try {
      console.log('Completing game with score:', score);
      setGameCompleted(true);

      const response = await submitGameSession(gameId, {
        score: score + 1,
        timeSpent: timeElapsed,
      });

      setSession(response.session);
      console.log('Game session submitted');

      toast({
        title: 'Game Completed!',
        description: `You earned ${response.session.xpEarned} XP!`,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error submitting game session:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit game session',
        variant: 'destructive',
      });
    }
  }, [gameId, score, timeElapsed, toast]);

  const handleStartGame = () => {
    console.log('Starting game');
    setGameStarted(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    console.log('Answer submitted:', isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      completeGame();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!game) {
    return null;
  }

  if (!gameStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <Button variant="ghost" onClick={() => navigate('/games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <Card className="overflow-hidden">
          <div className="relative h-64">
            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{game.title}</CardTitle>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700">+{game.xpReward} XP</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="text-2xl font-bold">{game.difficulty}/5</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{game.duration} min</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{totalQuestions}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Play</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Answer all questions to complete the game</li>
                <li>• Try to answer as quickly and accurately as possible</li>
                <li>• You'll receive personalized feedback at the end</li>
                <li>• Earn XP and unlock achievements!</li>
              </ul>
            </div>

            <Button onClick={handleStartGame} className="w-full" size="lg">
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameCompleted && session) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Game Completed!</CardTitle>
            <p className="text-muted-foreground">Great job on completing {game.title}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {session.score}/{totalQuestions}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-3xl font-bold">{formatTime(session.timeSpent)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">XP Earned</p>
                <p className="text-3xl font-bold text-purple-600">+{session.xpEarned}</p>
              </div>
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Personalized Message</p>
                  <p className="text-sm">{session.feedback.personalizedMessage}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Strengths
                  </p>
                  <ul className="text-sm space-y-1">
                    {session.feedback.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-orange-600 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Areas for Improvement
                  </p>
                  <ul className="text-sm space-y-1">
                    {session.feedback.improvements.map((improvement, index) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Tips</p>
                  <ul className="text-sm space-y-1">
                    {session.feedback.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-purple-600 mb-2">Recommended Next</p>
                  <ul className="text-sm space-y-1">
                    {session.feedback.nextRecommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/games')} variant="outline" className="flex-1">
                Back to Games
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/games')} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit Game
        </Button>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">{formatTime(timeElapsed)}</span>
          </div>
          <div className="font-semibold">
            Question {currentQuestion + 1}/{totalQuestions}
          </div>
        </div>
      </div>

      <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle>Sample Question {currentQuestion + 1}</CardTitle>
          <p className="text-muted-foreground">This is a demo question. Select the correct answer below.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => handleAnswer(index === 0)}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}