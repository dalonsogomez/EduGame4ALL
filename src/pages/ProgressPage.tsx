import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useApp } from '../context/AppContext';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { ArrowLeft, TrendingUp, Award, Target, Brain, BarChart3 } from 'lucide-react';

export function ProgressPage() {
  const { user, gameSessions, achievements, setCurrentPage } = useApp();

  if (!user) return null;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  // Calculate stats
  const totalGames = gameSessions.length;
  const avgAccuracy = gameSessions.length > 0
    ? gameSessions.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions), 0) / gameSessions.length
    : 0;

  const emotionCounts = gameSessions.reduce((acc, session) => {
    acc[session.emotionDetected] = (acc[session.emotionDetected] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gameTypeStats = gameSessions.reduce((acc, session) => {
    acc[session.gameType] = (acc[session.gameType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emotionLabels: Record<string, string> = {
    happy: '😊 Feliz',
    frustrated: '😤 Frustrado',
    confused: '🤔 Confundido',
    motivated: '🚀 Motivado',
    neutral: '😐 Neutral'
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
              <h1 className="text-gray-900">Mi Progreso</h1>
              <p className="text-gray-600">Análisis detallado de tu aprendizaje</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Overall Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-gray-900">Estadísticas Generales</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-2">Juegos Completados</p>
                  <p className="text-gray-900">{totalGames}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Precisión Promedio</p>
                  <p className="text-gray-900">{(avgAccuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">XP Total</p>
                  <p className="text-gray-900">{user.xp}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Nivel Actual</p>
                  <p className="text-gray-900">{user.level}</p>
                </div>
              </div>
            </Card>

            {/* Emotion Analysis */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-purple-600" />
                <h2 className="text-gray-900">Análisis Emocional</h2>
              </div>

              {Object.keys(emotionCounts).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(emotionCounts).map(([emotion, count]) => {
                    const percentage = (count / totalGames) * 100;
                    return (
                      <div key={emotion}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">{emotionLabels[emotion]}</span>
                          <span className="text-gray-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Completa algunos juegos para ver tu análisis emocional
                </p>
              )}
            </Card>

            {/* Game Type Distribution */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-green-600" />
                <h2 className="text-gray-900">Actividad por Módulo</h2>
              </div>

              {Object.keys(gameTypeStats).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(gameTypeStats).map(([type, count]) => {
                    const percentage = (count / totalGames) * 100;
                    const labels: Record<string, string> = {
                      vocabulary: '📚 Vocabulario',
                      culture: '🌍 Cultura',
                      'soft-skills': '🤝 Habilidades Blandas'
                    };
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700">{labels[type]}</span>
                          <span className="text-gray-600">{count} juegos ({percentage.toFixed(0)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Juega para ver tu actividad por módulo
                </p>
              )}
            </Card>

            {/* AI Insights */}
            {user.profile && gameSessions.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <h3 className="text-gray-900">Insights de IA</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-gray-900 mb-1">📈 Evolución</p>
                    <p className="text-gray-700">
                      {avgAccuracy >= 0.8 
                        ? 'Tu rendimiento es excelente. Considera incrementar la dificultad para seguir desafiándote.'
                        : avgAccuracy >= 0.6
                        ? 'Estás progresando bien. Mantén la práctica constante para consolidar tus conocimientos.'
                        : 'Necesitas más práctica. No te desanimes, cada sesión te hace mejorar.'}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-gray-900 mb-1">🎯 Recomendación</p>
                    <p className="text-gray-700">
                      Enfócate en {user.profile.preferredTopics[0]} con nivel{' '}
                      {user.profile.currentLanguageLevel === 'beginner' ? 'principiante' :
                       user.profile.currentLanguageLevel === 'intermediate' ? 'intermedio' : 'avanzado'}.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-gray-900">Nivel {user.level}</h3>
              </div>
              <div className="mb-4">
                <Progress value={(user.xp % 100)} className="h-3" />
                <p className="text-gray-600 text-center mt-2">
                  {user.xp % 100}/100 XP al siguiente nivel
                </p>
              </div>
              <Button onClick={() => setCurrentPage('games')} className="w-full bg-blue-600 hover:bg-blue-700">
                Ganar más XP
              </Button>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
                <h3 className="text-gray-900">Logros</h3>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-gray-600">Desbloqueados: {unlockedAchievements.length}/{achievements.length}</p>
                
                {unlockedAchievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="text-gray-900">{achievement.title}</p>
                        <p className="text-gray-600 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {unlockedAchievements.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Completa juegos para desbloquear logros
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-600 mb-2">Próximos logros:</p>
                {lockedAchievements.slice(0, 2).map(achievement => (
                  <div key={achievement.id} className="p-3 bg-gray-50 rounded-lg mb-2 opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl grayscale">{achievement.icon}</span>
                      <div>
                        <p className="text-gray-900">{achievement.title}</p>
                        <p className="text-gray-600 text-sm">{achievement.xpRequired} XP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Streak */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="text-center">
                <div className="text-5xl mb-3">🔥</div>
                <h3 className="text-gray-900 mb-2">{user.streak} Días</h3>
                <p className="text-gray-600 mb-4">Racha Actual</p>
                <Button onClick={() => setCurrentPage('games')} className="w-full bg-orange-500 hover:bg-orange-600">
                  Mantener Racha
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-8">
          <h2 className="text-gray-900 mb-6">🏆 Clasificación Global</h2>
          <LeaderboardCard currentUserRank={15} currentUserXP={user.xp} />
        </div>
      </div>
    </div>
  );
}
