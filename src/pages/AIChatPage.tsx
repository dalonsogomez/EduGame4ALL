import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { analyzeTextEmotion } from '../utils/aiSimulation';
import { getAgentChatResponse } from '../utils/aiAgent';
import { AgentAction, AgentInsight } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
  actions?: AgentAction[];
  insights?: AgentInsight[];
}

export function AIChatPage() {
  const { 
    setCurrentPage, 
    user, 
    gameSessions,
    agentActions,
    agentInsights,
    updateKnowledgeFromChatInteraction,
    dismissAction,
    dismissInsight
  } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `¡Hola ${user?.name || 'estudiante'}! 👋 Soy tu Agente de IA Avanzado.\n\nNo soy solo un chat: puedo analizar tu progreso, crear planes personalizados, detectar patrones, predecir tu rendimiento y tomar acciones proactivas para optimizar tu aprendizaje.\n\n🤖 **Mis capacidades:**\n• Análisis profundo de habilidades\n• Planes de estudio adaptativos\n• Predicción de rendimiento\n• Recomendaciones proactivas\n• Detección de áreas débiles\n• Ajuste automático de dificultad\n\n¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [activeActions, setActiveActions] = useState<AgentAction[]>([]);
  const [activeInsights, setActiveInsights] = useState<AgentInsight[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mostrar acciones e insights globales al inicio
  useEffect(() => {
    if (agentActions.length > 0 || agentInsights.length > 0) {
      const welcomeMessage: Message = {
        id: 'welcome-actions',
        role: 'assistant',
        content: `He analizado tu perfil y tengo ${agentActions.length} recomendaciones y ${agentInsights.length} insights para ti.`,
        timestamp: new Date(),
        actions: agentActions.slice(0, 3),
        insights: agentInsights.slice(0, 2)
      };
      
      // Solo añadir si no existe
      if (!messages.some(m => m.id === 'welcome-actions')) {
        setMessages(prev => [...prev, welcomeMessage]);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !user || !user.knowledgeProfile) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Analizar emoción del texto
    const emotionAnalysis = analyzeTextEmotion(inputValue);

    // Actualizar conocimiento basado en la interacción
    const topics = ['vocabulario', 'cultura', 'habilidades', 'soft skills', 'comunicación'];
    const mentionedTopic = topics.find(t => inputValue.toLowerCase().includes(t));
    if (mentionedTopic) {
      updateKnowledgeFromChatInteraction(mentionedTopic, emotionAnalysis.emotion);
    }

    // Simular tiempo de procesamiento de IA
    setTimeout(() => {
      const agentResponse = getAgentChatResponse(
        inputValue,
        user,
        user.knowledgeProfile!,
        gameSessions
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: agentResponse.message,
        timestamp: new Date(),
        emotion: emotionAnalysis.emotion,
        actions: agentResponse.actions,
        insights: agentResponse.insights
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const handleVoiceRecordingComplete = (transcript: string) => {
    setInputValue(transcript);
    setShowVoiceRecorder(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action: AgentAction) => {
    // Simular ejecución de acción
    const actionMessages: Record<string, string> = {
      recommend_game: `Perfecto! Voy a llevarte al juego recomendado: ${action.metadata.gameType} (${action.metadata.difficulty})`,
      suggest_resource: 'Abriendo el centro de recursos con contenido personalizado para ti...',
      create_study_plan: 'He creado tu plan de estudio personalizado. Lo encontrarás en tu dashboard.',
      adjust_difficulty: 'He ajustado la dificultad de tus próximos ejercicios basándome en tu rendimiento.',
      encourage_user: '¡Gracias! Tu motivación es clave para el éxito. ¡Sigamos adelante!',
      identify_weakness: 'He identificado áreas específicas para mejorar. Te enviaré ejercicios enfocados.',
      celebrate_achievement: '🎉 ¡Felicidades! Tu esfuerzo merece ser celebrado.',
      schedule_review: 'He programado una revisión de este tema. Te recordaré cuando sea el momento.'
    };

    const responseMessage: Message = {
      id: `action-response-${Date.now()}`,
      role: 'assistant',
      content: actionMessages[action.type] || 'Acción ejecutada correctamente.',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, responseMessage]);
    dismissAction(action.id);
  };

  const quickActions = [
    { icon: Brain, text: 'Analiza mi progreso', color: 'blue' },
    { icon: Target, text: 'Crea un plan para mí', color: 'purple' },
    { icon: TrendingUp, text: '¿Cómo me irá hoy?', color: 'green' },
    { icon: Zap, text: 'Recomiéndame un juego', color: 'orange' }
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'celebration': return '🎉';
      case 'warning': return '⚠️';
      case 'recommendation': return '💡';
      case 'pattern': return '📊';
      default: return '💡';
    }
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
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-white" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Brain className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-gray-900 flex items-center gap-2">
                  Agente IA Avanzado
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Proactivo
                  </Badge>
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-600 text-sm">Analizando tu progreso en tiempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 h-[calc(100vh-120px)] flex flex-col max-w-4xl">
        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden flex flex-col mb-4">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(message => (
              <div key={message.id}>
                <div
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Acciones del Agente */}
                {message.actions && message.actions.length > 0 && (
                  <div className="ml-11 mt-3 space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      Acciones recomendadas:
                    </p>
                    {message.actions.map(action => (
                      <div
                        key={action.id}
                        className={`p-3 rounded-lg border-2 ${getPriorityColor(action.priority)} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getPriorityIcon(action.priority)}
                              <p className="text-sm text-gray-900">{action.title}</p>
                            </div>
                            <p className="text-xs text-gray-600">{action.description}</p>
                            <p className="text-xs text-gray-500 mt-1 italic">
                              💭 {action.reasoning}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleActionClick(action)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            Ejecutar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Insights del Agente */}
                {message.insights && message.insights.filter(i => !i.dismissed).length > 0 && (
                  <div className="ml-11 mt-3 space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      Insights detectados:
                    </p>
                    {message.insights.filter(i => !i.dismissed).map(insight => (
                      <div
                        key={insight.id}
                        className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 flex items-center gap-2">
                              <span>{getInsightIcon(insight.type)}</span>
                              {insight.message}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Confianza: {(insight.confidence * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {insight.type}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissInsight(insight.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    <span className="text-gray-600">Analizando y procesando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-6 pb-4">
              <p className="text-gray-600 text-sm mb-3">¿Qué puedo hacer por ti?</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(action.text)}
                    className={`px-3 py-2 bg-${action.color}-50 text-${action.color}-700 rounded-lg text-sm hover:bg-${action.color}-100 transition-colors flex items-center gap-2`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Voice Recorder */}
        {showVoiceRecorder && (
          <div className="mb-4">
            <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
          </div>
        )}

        {/* Input Area */}
        <Card className="p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className="flex-shrink-0"
            >
              🎤
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta lo que quieras... El agente puede analizar, planificar y más"
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isThinking}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Agente IA con capacidades avanzadas de análisis y planificación
            </p>
            {user?.knowledgeProfile && (
              <Badge variant="outline" className="text-xs">
                {user.knowledgeProfile.totalInteractions} interacciones
              </Badge>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
