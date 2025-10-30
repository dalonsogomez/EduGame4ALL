import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Difficulty } from '../types';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export function OnboardingPage() {
  const { user, setUser, setCurrentPage } = useApp();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    currentLanguageLevel: 'beginner' as Difficulty,
    culturalKnowledge: 'beginner' as Difficulty,
    communicationSkills: 'beginner' as Difficulty,
    personalSituation: '',
    learningGoals: [] as string[],
    preferredTopics: [] as string[]
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const goalOptions = [
    'Aprender el idioma local',
    'Conseguir empleo',
    'Integración cultural',
    'Mejorar comunicación',
    'Hacer amigos',
    'Educación formal'
  ];

  const topicOptions = [
    'Vocabulario cotidiano',
    'Vocabulario laboral',
    'Cultura local',
    'Habilidades de comunicación',
    'Trabajo en equipo',
    'Resolución de conflictos'
  ];

  const situationOptions = [
    'Refugiado aprendiendo el idioma',
    'Estudiante buscando mejorar habilidades',
    'Padre/madre buscando recursos para familia',
    'Profesional buscando empleo',
    'Joven desarrollando habilidades sociales',
    'Otro'
  ];

  const handleGoalToggle = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setProfile(prev => ({
      ...prev,
      preferredTopics: prev.preferredTopics.includes(topic)
        ? prev.preferredTopics.filter(t => t !== topic)
        : [...prev.preferredTopics, topic]
    }));
  };

  const handleComplete = () => {
    if (user) {
      setUser({
        ...user,
        profileCompleted: true,
        profile: profile
      });
    }
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">Configuración Inicial</h2>
            <p className="text-gray-600 mb-4">
              Ayúdanos a personalizar tu experiencia de aprendizaje
            </p>
            <Progress value={progress} className="h-2" />
            <p className="text-gray-500 mt-2">Paso {step} de {totalSteps}</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">¿Cuál es tu situación actual?</h3>
                <div className="space-y-2">
                  {situationOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setProfile({ ...profile, personalSituation: option })}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        profile.personalSituation === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {profile.personalSituation === option && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!profile.personalSituation}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Evalúa tu nivel actual</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Nivel de Idioma</Label>
                    <select
                      value={profile.currentLanguageLevel}
                      onChange={(e) => setProfile({ ...profile, currentLanguageLevel: e.target.value as Difficulty })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">Principiante - Palabras básicas</option>
                      <option value="intermediate">Intermedio - Conversaciones simples</option>
                      <option value="advanced">Avanzado - Fluidez conversacional</option>
                    </select>
                  </div>

                  <div>
                    <Label>Conocimiento Cultural</Label>
                    <select
                      value={profile.culturalKnowledge}
                      onChange={(e) => setProfile({ ...profile, culturalKnowledge: e.target.value as Difficulty })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">Principiante - Nuevo en el país</option>
                      <option value="intermediate">Intermedio - Conozco algunas costumbres</option>
                      <option value="advanced">Avanzado - Bien integrado</option>
                    </select>
                  </div>

                  <div>
                    <Label>Habilidades de Comunicación</Label>
                    <select
                      value={profile.communicationSkills}
                      onChange={(e) => setProfile({ ...profile, communicationSkills: e.target.value as Difficulty })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">Principiante - Me cuesta expresarme</option>
                      <option value="intermediate">Intermedio - Me comunico adecuadamente</option>
                      <option value="advanced">Avanzado - Gran facilidad de comunicación</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Atrás
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">¿Cuáles son tus objetivos?</h3>
                <p className="text-gray-600 mb-4">Selecciona todos los que apliquen</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map(goal => (
                    <button
                      key={goal}
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-3 text-center rounded-lg border-2 transition-all ${
                        profile.learningGoals.includes(goal)
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={profile.learningGoals.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">¿Qué temas te interesan más?</h3>
                <p className="text-gray-600 mb-4">Selecciona al menos 2 temas</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {topicOptions.map(topic => (
                    <button
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`p-3 text-center rounded-lg border-2 transition-all ${
                        profile.preferredTopics.includes(topic)
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={profile.preferredTopics.length < 2}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Completar Configuración
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
