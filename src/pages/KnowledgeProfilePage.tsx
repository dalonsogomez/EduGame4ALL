import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  Award,
  Clock,
  Activity,
  Eye,
  BookOpen,
  Users,
  BarChart3,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { getRecommendedPracticeAreas, predictPerformance } from '../utils/knowledgeTracker';
import { GameType, Difficulty } from '../types';

export function KnowledgeProfilePage() {
  const { setCurrentPage, user, gameSessions } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<GameType | 'all'>('all');

  if (!user || !user.knowledgeProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-gray-900 mb-2">Perfil de Conocimiento No Disponible</h2>
          <p className="text-gray-600 mb-4">Completa algunos juegos para generar tu perfil.</p>
          <Button onClick={() => setCurrentPage('games')}>
            Ir a Juegos
          </Button>
        </Card>
      </div>
    );
  }

  const profile = user.knowledgeProfile;
  const { urgent, recommended, maintenance } = getRecommendedPracticeAreas(profile);

  const filteredSkills = selectedCategory === 'all' 
    ? profile.skills 
    : profile.skills.filter(s => s.category === selectedCategory);

  const categoryIcons: Record<GameType, any> = {
    vocabulary: BookOpen,
    culture: Users,
    'soft-skills': Activity
  };

  const getMasteryColor = (level: number) => {
    if (level >= 75) return 'text-green-600';
    if (level >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMasteryBg = (level: number) => {
    if (level >= 75) return 'bg-green-100 border-green-300';
    if (level >= 40) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getLearningStyleInfo = () => {
    const styles: Record<string, { icon: string; description: string }> = {
      visual: { icon: '👁️', description: 'Aprendes mejor con imágenes y diagramas' },
      auditory: { icon: '👂', description: 'Aprendes mejor escuchando y hablando' },
      kinesthetic: { icon: '🤲', description: 'Aprendes mejor practicando y haciendo' },
      mixed: { icon: '🎨', description: 'Combinas diferentes estilos de aprendizaje' }
    };
    return styles[profile.preferredLearningStyle] || styles.mixed;
  };

  const predictions = [
    { type: 'vocabulary' as GameType, difficulty: 'intermediate' as Difficulty },
    { type: 'culture' as GameType, difficulty: 'intermediate' as Difficulty },
    { type: 'soft-skills' as GameType, difficulty: 'intermediate' as Difficulty }
  ].map(({ type, difficulty }) => ({
    type,
    difficulty,
    score: predictPerformance(profile, type, difficulty)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
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
            <div className="flex-1">
              <h1 className="text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Perfil de Conocimiento Adaptativo
              </h1>
              <p className="text-gray-600 text-sm">
                Sistema de seguimiento inteligente de tu aprendizaje
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Velocidad de Aprendizaje</p>
                <p className="text-2xl text-gray-900">{(profile.learningVelocity * 100).toFixed(0)}%</p>
              </div>
            </div>
            <Progress value={profile.learningVelocity * 100} className="h-2" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasa de Retención</p>
                <p className="text-2xl text-gray-900">{(profile.retentionRate * 100).toFixed(0)}%</p>
              </div>
            </div>
            <Progress value={profile.retentionRate * 100} className="h-2" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interacciones</p>
                <p className="text-2xl text-gray-900">{profile.totalInteractions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estilo de Aprendizaje</p>
                <p className="text-sm text-gray-900 flex items-center gap-1">
                  {getLearningStyleInfo().icon} {profile.preferredLearningStyle}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{getLearningStyleInfo().description}</p>
          </Card>
        </div>

        {/* Tabs de Contenido */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          {/* Tab: Habilidades */}
          <TabsContent value="skills" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Mapa de Habilidades
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                  >
                    Todas
                  </Button>
                  {(['vocabulary', 'culture', 'soft-skills'] as GameType[]).map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat === 'vocabulary' ? 'Vocabulario' : cat === 'culture' ? 'Cultura' : 'Soft Skills'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSkills.map(skill => {
                  const Icon = categoryIcons[skill.category];
                  return (
                    <div
                      key={skill.skillId}
                      className={`p-4 rounded-lg border-2 ${getMasteryBg(skill.currentLevel)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-900">{skill.skillName}</p>
                            <p className="text-xs text-gray-600 capitalize">{skill.category}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getMasteryColor(skill.currentLevel)}>
                          {skill.estimatedMastery}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Nivel Actual</span>
                            <span className={`${getMasteryColor(skill.currentLevel)}`}>
                              {skill.currentLevel.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={skill.currentLevel} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Confianza</span>
                            <span className="text-gray-900">
                              {(skill.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={skill.confidence * 100} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {skill.practiceCount} prácticas
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.floor((Date.now() - new Date(skill.lastPracticed).getTime()) / (1000 * 60 * 60 * 24))} días
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Análisis */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fortalezas */}
              <Card className="p-6">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-green-600" />
                  Fortalezas
                </h3>
                {profile.strengths.length > 0 ? (
                  <div className="space-y-3">
                    {profile.strengths.map(strengthId => {
                      const skill = profile.skills.find(s => s.skillId === strengthId);
                      if (!skill) return null;
                      return (
                        <div key={strengthId} className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-900">{skill.skillName}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Nivel: {skill.currentLevel.toFixed(0)}% • Confianza: {(skill.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sigue practicando para desarrollar fortalezas.</p>
                )}
              </Card>

              {/* Debilidades */}
              <Card className="p-6">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Áreas de Mejora
                </h3>
                {profile.weaknesses.length > 0 ? (
                  <div className="space-y-3">
                    {profile.weaknesses.map(weaknessId => {
                      const skill = profile.skills.find(s => s.skillId === weaknessId);
                      if (!skill) return null;
                      return (
                        <div key={weaknessId} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-gray-900">{skill.skillName}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Nivel: {skill.currentLevel.toFixed(0)}% • Necesita práctica
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">¡Excelente! No hay áreas críticas de mejora.</p>
                )}
              </Card>

              {/* Maestría por Categoría */}
              <Card className="p-6 md:col-span-2">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Maestría por Categoría
                </h3>
                <div className="space-y-4">
                  {Object.entries(profile.masteryLevels).map(([category, level]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900 capitalize">
                          {category === 'vocabulary' ? 'Vocabulario' : 
                           category === 'culture' ? 'Cultura' : 
                           'Habilidades Blandas'}
                        </span>
                        <span className="text-sm text-gray-600">{level.toFixed(0)}%</span>
                      </div>
                      <Progress value={level} className="h-3" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Predicciones */}
          <TabsContent value="predictions" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-blue-600" />
                Predicciones de Rendimiento
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Basándome en tu perfil de conocimiento, estas son las predicciones de tu rendimiento en nivel intermedio:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.map(pred => {
                  const Icon = categoryIcons[pred.type];
                  const color = pred.score >= 75 ? 'green' : pred.score >= 50 ? 'blue' : 'orange';
                  return (
                    <div key={pred.type} className={`p-6 rounded-lg border-2 bg-${color}-50 border-${color}-200`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                        <p className="text-sm text-gray-900 capitalize">
                          {pred.type === 'vocabulary' ? 'Vocabulario' : 
                           pred.type === 'culture' ? 'Cultura' : 
                           'Soft Skills'}
                        </p>
                      </div>
                      <p className={`text-4xl text-${color}-600 mb-2`}>{pred.score.toFixed(0)}%</p>
                      <p className="text-xs text-gray-600">Rendimiento esperado</p>
                      <Progress value={pred.score} className="h-2 mt-3" />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <strong>Interpretación:</strong>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Estas predicciones se basan en tu historial de rendimiento, velocidad de aprendizaje, 
                  tasa de retención y niveles actuales de habilidad. El sistema se adapta continuamente 
                  con cada nueva sesión que completas.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Recomendaciones */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Urgente */}
              <Card className="p-6">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Urgente
                </h3>
                {urgent.length > 0 ? (
                  <div className="space-y-3">
                    {urgent.map(skill => (
                      <div key={skill.skillId} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-900">{skill.skillName}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Nivel: {skill.currentLevel.toFixed(0)}%
                        </p>
                        <Button size="sm" className="w-full mt-2 bg-red-600 hover:bg-red-700">
                          Practicar Ahora
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay áreas urgentes. ¡Buen trabajo!</p>
                )}
              </Card>

              {/* Recomendado */}
              <Card className="p-6">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  Recomendado
                </h3>
                {recommended.length > 0 ? (
                  <div className="space-y-3">
                    {recommended.slice(0, 3).map(skill => (
                      <div key={skill.skillId} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-900">{skill.skillName}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Nivel: {skill.currentLevel.toFixed(0)}%
                        </p>
                        <Button size="sm" variant="outline" className="w-full mt-2">
                          Practicar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sigue practicando regularmente.</p>
                )}
              </Card>

              {/* Mantenimiento */}
              <Card className="p-6">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-green-600" />
                  Mantenimiento
                </h3>
                {maintenance.length > 0 ? (
                  <div className="space-y-3">
                    {maintenance.slice(0, 3).map(skill => (
                      <div key={skill.skillId} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-900">{skill.skillName}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Nivel: {skill.currentLevel.toFixed(0)}%
                        </p>
                        <Button size="sm" variant="outline" className="w-full mt-2">
                          Revisar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Desarrolla más habilidades primero.</p>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
