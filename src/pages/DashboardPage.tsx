import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/StatsCard';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { TutorialTooltip } from '../components/TutorialTooltip';
import {
  Trophy,
  Target,
  Flame,
  Star,
  BookOpen,
  Globe,
  Users,
  TrendingUp,
  Award,
  Gift,
  Newspaper,
  LogOut,
  MessageCircle,
  Zap
} from 'lucide-react';

export function DashboardPage() {
  const { 
    user, 
    achievements, 
    setCurrentPage, 
    gameSessions,
    agentActions,
    agentInsights,
    dismissAction,
    dismissInsight
  } = useApp();
  const [showTutorial, setShowTutorial] = useState(false);

  if (!user) return null;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextLevel = user.level * 100;
  const progressToNextLevel = ((user.xp % 100) / 100) * 100;

  // Tutorial steps
  const tutorialSteps = [
    {
      target: 'stats',
      title: '¡Bienvenido a EduGame4ALL!',
      content: 'Aquí puedes ver tu progreso en tiempo real: nivel, XP, racha diaria y logros desbloqueados.'
    },
    {
      target: 'modules',
      title: 'Módulos de Aprendizaje',
      content: 'Tenemos 3 módulos: Idiomas, Cultura y Habilidades Blandas. Cada uno adaptado a tu nivel.'
    },
    {
      target: 'ai-chat',
      title: 'Tutor de IA',
      content: 'Chatea con tu tutor personal de IA para obtener recomendaciones y resolver dudas en cualquier momento.'
    },
    {
      target: 'rewards',
      title: 'Sistema de Recompensas',
      content: 'Gana XP jugando y canjéalo por cupones reales de supermercados, transporte y más.'
    }
  ];

  const quickActions = [
    { icon: BookOpen, label: 'Juegos', color: 'bg-blue-500', page: 'games' },
    { icon: MessageCircle, label: 'Chat IA', color: 'bg-purple-500', page: 'ai-chat' },
    { icon: TrendingUp, label: 'Mi Progreso', color: 'bg-green-500', page: 'progress' },
    { icon: Gift, label: 'Recompensas', color: 'bg-yellow-500', page: 'rewards' },
    { icon: Newspaper, label: 'Recursos', color: 'bg-orange-500', page: 'resources' }
  ];

  // Top 2 acciones proactivas del agente
  const topActions = agentActions.slice(0, 2);
  const topInsights = agentInsights.filter(i => !i.dismissed).slice(0, 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Tutorial */}
      <TutorialTooltip
        steps={tutorialSteps}
        showTutorial={showTutorial}
        onComplete={() => setShowTutorial(false)}
        onSkip={() => setShowTutorial(false)}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">¡Hola, {user.name}! 👋</h1>
              <p className="text-gray-600">Bienvenido de vuelta a tu aprendizaje</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Tutorial
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage('landing')}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Acciones Proactivas del Agente IA */}
        {topActions.length > 0 && (
          <div className="mb-6 space-y-3">
            {topActions.map(action => (
              <Card key={action.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <h3 className="text-gray-900">🤖 Recomendación IA: {action.title}</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{action.description}</p>
                    <p className="text-gray-500 text-xs italic">💭 {action.reasoning}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (action.type === 'recommend_game') setCurrentPage('games');
                        dismissAction(action.id);
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Ejecutar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => dismissAction(action.id)}>
                      Descartar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Insights del Agente */}
        {topInsights.length > 0 && (
          <div className="mb-6">
            {topInsights.map(insight => (
              <Card key={insight.id} className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm flex items-center gap-2">
                      {insight.type === 'celebration' ? '🎉' : insight.type === 'warning' ? '⚠️' : '💡'}
                      <strong>Insight IA:</strong> {insight.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Confianza: {(insight.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => dismissInsight(insight.id)}>
                    ✕
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Nivel"
            value={user.level}
            icon={Trophy}
            color="bg-blue-500"
            subtitle={`${user.xp % 100}/100 XP al siguiente`}
          />
          <StatsCard
            title="XP Total"
            value={user.xp}
            icon={Star}
            color="bg-yellow-500"
            trend={{ value: '+15%', isPositive: true }}
          />
          <StatsCard
            title="Racha"
            value={`${user.streak} días`}
            icon={Flame}
            color="bg-orange-500"
            subtitle="¡Mantén el ritmo!"
          />
          <StatsCard
            title="Logros"
            value={`${unlockedAchievements.length}/${achievements.length}`}
            icon={Award}
            color="bg-purple-500"
            subtitle={`${achievements.length - unlockedAchievements.length} por desbloquear`}
          />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Progress to Next Level */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900">Progreso al Nivel {user.level + 1}</h3>
                  <p className="text-gray-600">{user.xp % 100}/{nextLevel % 100} XP</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <Progress value={progressToNextLevel} className="h-3" />
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Accesos Rápidos</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => setCurrentPage(action.page)}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md hover:-translate-y-1 text-left"
                    >
                      <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-900">{action.label}</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Learning Modules */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Módulos de Aprendizaje</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentPage('games')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    <div className="text-left">
                      <p>Aprendizaje de Idiomas</p>
                      <p className="text-blue-100 text-sm">Vocabulario y conversación</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => setCurrentPage('games')}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    <div className="text-left">
                      <p>Integración Cultural</p>
                      <p className="text-purple-100 text-sm">Costumbres y normas sociales</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => setCurrentPage('games')}
                  className="w-full p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <div className="text-left">
                      <p>Habilidades Blandas</p>
                      <p className="text-pink-100 text-sm">Comunicación y trabajo en equipo</p>
                    </div>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Agent Quick Access */}
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6" />
                <h3>Agente de IA Avanzado</h3>
              </div>
              <p className="mb-4 text-white/90">
                Análisis proactivo, planes personalizados y recomendaciones inteligentes 24/7
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => setCurrentPage('ai-chat')}
                  className="w-full bg-white text-purple-600 hover:bg-gray-100"
                >
                  Iniciar Chat con IA
                </Button>
                {user.knowledgeProfile && (
                  <Button
                    onClick={() => setCurrentPage('knowledge-profile')}
                    variant="outline"
                    className="w-full bg-transparent border-white text-white hover:bg-white/10"
                  >
                    Ver Perfil de Conocimiento
                  </Button>
                )}
              </div>
            </Card>
            {/* Daily Streak */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-6 h-6 text-orange-500" />
                <h3 className="text-gray-900">Racha Diaria</h3>
              </div>
              <p className="text-gray-900 mb-2">{user.streak} días consecutivos</p>
              <p className="text-gray-600 mb-4">¡Mantén el ritmo! Completa una actividad hoy para continuar tu racha.</p>
              <Button onClick={() => setCurrentPage('games')} className="w-full bg-orange-500 hover:bg-orange-600">
                Continuar Racha
              </Button>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-gray-900">Logros Recientes</h3>
              </div>
              <div className="space-y-3">
                {unlockedAchievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="text-gray-900">{achievement.title}</p>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                ))}
                {unlockedAchievements.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Completa actividades para desbloquear logros
                  </p>
                )}
              </div>
              {unlockedAchievements.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage('progress')}
                  className="w-full mt-4"
                >
                  Ver Todos los Logros
                </Button>
              )}
            </Card>

            {/* Personalized Recommendation */}
            {user.profile && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <h3 className="text-gray-900 mb-2">💡 Recomendación IA</h3>
                <p className="text-gray-700 mb-4">
                  Basado en tu nivel de <strong>{user.profile.currentLanguageLevel}</strong> en idiomas,
                  te recomendamos practicar ejercicios de vocabulario contextual.
                </p>
                <Button onClick={() => setCurrentPage('games')} className="w-full bg-blue-600 hover:bg-blue-700">
                  Comenzar Ejercicio
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
