import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useApp } from '../context/AppContext';
import { Confetti } from '../components/Confetti';
import { vocabularyQuestions, cultureQuestions, softSkillsQuestions } from '../data/mockData';
import { GameType, Difficulty, Question, GameSession } from '../types';
import { 
  detectEmotion, 
  analyzeMistakePatterns, 
  suggestNextDifficulty, 
  generateAIFeedback,
  calculateXP 
} from '../utils/aiSimulation';
import { ArrowLeft, CheckCircle, XCircle, Clock, Brain } from 'lucide-react';

interface GamePlayPageProps {
  gameType: GameType;
  difficulty: Difficulty;
}

export function GamePlayPage({ gameType, difficulty }: GamePlayPageProps) {
  const { user, addGameSession, updateUserXP, setCurrentPage, gameSessions, unlockAchievement } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [gameComplete, setGameComplete] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Get questions based on game type and difficulty
  const allQuestions = {
    vocabulary: vocabularyQuestions,
    culture: cultureQuestions,
    'soft-skills': softSkillsQuestions
  };

  const questions = allQuestions[gameType].filter(q => q.difficulty === difficulty);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Actualizar el array de respuestas con la nueva respuesta
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    // Track time per question
    const questionTime = (Date.now() - questionStartTime) / 1000;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Asegurarnos de que todas las respuestas estén incluidas
    // El array 'answers' debe tener todas las respuestas ya que setAnswers es asíncrono
    // pero se llamó en handleAnswer antes de llegar aquí
    const allAnswers = [...answers];
    
    // Calcular respuestas correctas
    const correctAnswers = allAnswers.filter((ans, idx) => ans === questions[idx]?.correctAnswer).length;
    
    // AI Analysis
    const emotion = detectEmotion(correctAnswers, questions.length, timeSpent);
    const mistakePatterns = analyzeMistakePatterns(questions, allAnswers);
    const nextDifficulty = suggestNextDifficulty(difficulty, correctAnswers / questions.length, gameSessions);
    const xpEarned = calculateXP(correctAnswers, questions.length, difficulty, timeSpent);
    
    // Create game session with additional tracking
    const performanceScore = (correctAnswers / questions.length) * 100;
    const skillsImpacted = questions
      .filter(q => q.skillsTested && q.skillsTested.length > 0)
      .flatMap(q => q.skillsTested || [])
      .filter((skill, index, self) => self.indexOf(skill) === index); // unique

    const session: GameSession = {
      id: `session_${Date.now()}`,
      userId: user!.id,
      gameType,
      difficulty,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      mistakesPattern: mistakePatterns,
      emotionDetected: emotion,
      xpEarned,
      completedAt: new Date().toISOString(),
      skillsImpacted: skillsImpacted.length > 0 ? skillsImpacted : [gameType],
      performanceScore
    };

    // Primero añadir la sesión (esto actualizará el perfil de conocimiento)
    addGameSession(session);
    
    // Luego actualizar el XP del usuario
    updateUserXP(xpEarned);

    // Generate AI feedback con la sesión incluida
    const feedback = {
      ...generateAIFeedback(session, emotion, nextDifficulty, mistakePatterns),
      session // Incluir la sesión completa en el feedback
    };
    setAiFeedback(feedback);

    // Check for achievements
    if (correctAnswers === questions.length) {
      unlockAchievement('perfect_score');
      setShowConfetti(true);
    }
    if (gameSessions.length === 0) {
      unlockAchievement('first_game');
    }

    setGameComplete(true);
  };

  if (!user) return null;

  if (gameComplete && aiFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <Confetti active={showConfetti} duration={5000} />
        <div className="container mx-auto max-w-2xl py-8">
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">¡Juego Completado!</h2>
              <p className="text-gray-600">Has ganado {aiFeedback.confidence >= 0.8 ? '⭐⭐⭐' : aiFeedback.confidence >= 0.6 ? '⭐⭐' : '⭐'}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center bg-blue-50">
                <p className="text-2xl text-blue-600 mb-1">{aiFeedback.session?.correctAnswers || answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length}/{questions.length}</p>
                <p className="text-gray-600">Correctas</p>
              </Card>
              <Card className="p-4 text-center bg-yellow-50">
                <p className="text-2xl text-yellow-600 mb-1">+{aiFeedback.session?.xpEarned || 0}</p>
                <p className="text-gray-600">XP Ganado</p>
              </Card>
              <Card className="p-4 text-center bg-purple-50">
                <p className="text-2xl text-purple-600 mb-1">{Math.floor((Date.now() - startTime) / 1000)}s</p>
                <p className="text-gray-600">Tiempo</p>
              </Card>
            </div>

            {/* AI Feedback */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <h3 className="text-gray-900">Análisis de IA</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Estado emocional detectado:</p>
                  <p className="text-gray-900">{aiFeedback.emotion === 'happy' ? '😊 Feliz' : aiFeedback.emotion === 'frustrated' ? '😤 Frustrado' : aiFeedback.emotion === 'confused' ? '🤔 Confundido' : aiFeedback.emotion === 'motivated' ? '🚀 Motivado' : '😐 Neutral'}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Mensaje personalizado:</p>
                  <p className="text-gray-900">{aiFeedback.message}</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p className="text-gray-900 mb-2">{aiFeedback.encouragement}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Dificultad recomendada:</p>
                  <p className="text-gray-900">
                    {aiFeedback.suggestedDifficulty === 'beginner' ? 'Principiante' : 
                     aiFeedback.suggestedDifficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Próximos pasos:</p>
                  <ul className="space-y-2">
                    {aiFeedback.nextSteps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">→</span>
                        <span className="text-gray-900">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentPage('games')}
                variant="outline"
                className="flex-1"
              >
                Volver a Juegos
              </Button>
              <Button
                onClick={() => setCurrentPage('dashboard')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Ir al Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage('games')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Salir
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
        </div>

        <Card className="p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
              <span className="text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-8">
            {currentQuestion.context && (
              <p className="text-blue-600 mb-2">📍 {currentQuestion.context}</p>
            )}
            <h2 className="text-gray-900 mb-6">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const showCorrect = showFeedback && isCorrectAnswer;
                const showWrong = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      showCorrect ? 'border-green-500 bg-green-50' :
                      showWrong ? 'border-red-500 bg-red-50' :
                      isSelected ? 'border-blue-500 bg-blue-50' :
                      'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                      <span className={`flex-1 ${
                        showCorrect ? 'text-green-900' :
                        showWrong ? 'text-red-900' :
                        'text-gray-900'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`mb-2 ${isCorrect ? 'text-green-900' : 'text-yellow-900'}`}>
                {isCorrect ? '✅ ¡Correcto!' : '💡 Explicación:'}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
