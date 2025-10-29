/**
 * Voice Recorder Component
 * Records audio from microphone and sends to AI services for transcription
 */

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { transcribeAudio } from '../api/ai';

interface VoiceRecorderProps {
  onTranscription: (text: string, language: string) => void;
  language?: string;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  language,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        
        // Process recording
        await processRecording();
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create audio blob
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      // Send to AI service for transcription
      const result = await transcribeAudio(audioBlob, language);
      
      if (result.transcription) {
        onTranscription(result.transcription, result.detected_language);
      } else {
        setError('No se pudo transcribir el audio. Por favor, intenta de nuevo.');
      }
      
    } catch (err) {
      console.error('Error processing recording:', err);
      setError('Error al procesar la grabación. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
      chunksRef.current = [];
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {!isRecording && !isProcessing && (
            <Button
              onClick={startRecording}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mic className="mr-2 h-4 w-4" />
              Grabar Audio
            </Button>
          )}
          
          {isRecording && (
            <Button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 animate-pulse"
            >
              <Square className="mr-2 h-4 w-4" />
              Detener Grabación
            </Button>
          )}
          
          {isProcessing && (
            <Button disabled className="bg-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Grabando...</span>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};
