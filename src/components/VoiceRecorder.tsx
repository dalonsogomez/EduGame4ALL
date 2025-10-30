import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mic, Square, Play, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete?: (transcript: string) => void;
  onAnalysisComplete?: (emotion: string, confidence: number) => void;
}

export function VoiceRecorder({ onRecordingComplete, onAnalysisComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setHasRecording(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    
    // Simular procesamiento
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Simular transcripción
      const simulatedTranscripts = [
        'Hola, estoy aprendiendo español',
        'Me gustaría practicar conversación',
        'Necesito ayuda con el vocabulario',
        '¿Cómo puedo mejorar mi pronunciación?'
      ];
      const transcript = simulatedTranscripts[Math.floor(Math.random() * simulatedTranscripts.length)];
      
      // Simular detección de emoción
      const emotions = [
        { emotion: 'motivated', confidence: 0.85 },
        { emotion: 'happy', confidence: 0.78 },
        { emotion: 'confused', confidence: 0.65 },
        { emotion: 'neutral', confidence: 0.72 }
      ];
      const detected = emotions[Math.floor(Math.random() * emotions.length)];
      
      if (onRecordingComplete) {
        onRecordingComplete(transcript);
      }
      if (onAnalysisComplete) {
        onAnalysisComplete(detected.emotion, detected.confidence);
      }
    }, 2000);
  };

  const playRecording = () => {
    // Simular reproducción
    alert('Reproduciendo grabación... (simulado)');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center">
        <h3 className="text-gray-900 mb-4">🎤 Grabación de Voz</h3>
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-900">{formatTime(recordingTime)}</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">Grabando...</p>
          </div>
        )}

        {/* Analyzing Indicator */}
        {isAnalyzing && (
          <div className="mb-4 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-gray-700">Analizando con IA...</p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isRecording && !hasRecording && (
            <Button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600"
            >
              <Mic className="w-5 h-5 mr-2" />
              Grabar
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              className="bg-gray-700 hover:bg-gray-800"
            >
              <Square className="w-5 h-5 mr-2" />
              Detener
            </Button>
          )}

          {hasRecording && !isAnalyzing && (
            <>
              <Button
                onClick={playRecording}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Reproducir
              </Button>
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                <Mic className="w-5 h-5 mr-2" />
                Grabar de nuevo
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <p className="text-gray-500 text-sm mt-4 text-center max-w-sm">
          {isRecording 
            ? 'Habla claramente en el idioma que estás aprendiendo'
            : 'Presiona "Grabar" y practica tu pronunciación. La IA analizará tu voz.'}
        </p>
      </div>
    </Card>
  );
}
