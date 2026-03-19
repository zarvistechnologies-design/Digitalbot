'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

export default function VoiceBot() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    // Initialize VAPI with your public key
    const vapiInstance = new Vapi('b8dd64f9-40ef-4be0-9683-4766906634d8');
    vapiRef.current = vapiInstance;

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsCallActive(true);
      setCallStatus('Call active');
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsCallActive(false);
      setIsSpeaking(false);
      setCallStatus('Call ended');
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('error', (error: { message: any; }) => {
      console.error('VAPI Error:', error);
      setCallStatus(`Error: ${error.message || 'Unknown error'}`);
    });

    vapiInstance.on('message', (message: any) => {
      console.log('VAPI Message:', message);
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    if (!vapiRef.current) {
      console.error('VAPI not initialized');
      return;
    }

    try {
      setCallStatus('Starting call...');
      
      // Request microphone permissions explicitly
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.error('Microphone permission denied:', err);
        setCallStatus('Microphone permission denied');
        return;
      }

      // Start with assistant ID
      await vapiRef.current.start('c6f95947-e630-41e0-895b-56edc3c395b3');
      
      console.log('Call started successfully');
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus(`Failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopCall = () => {
    if (!vapiRef.current) return;
    
    try {
      vapiRef.current.stop();
      setCallStatus('Stopping call...');
    } catch (error) {
      console.error('Error stopping call:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Voice Assistant
        </h1>

        <button
          onClick={isCallActive ? stopCall : startCall}
          className={`w-full px-8 py-4 rounded-full font-semibold text-white transition-all transform hover:scale-105 ${
            isCallActive
              ? 'bg-red-500 hover:bg-red-600 active:scale-95'
              : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
          }`}
        >
          {isCallActive ? '🔴 End Call' : '🎤 Start Voice Call'}
        </button>

        {callStatus && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-700">{callStatus}</p>
          </div>
        )}

        {isCallActive && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {isSpeaking ? 'Assistant is speaking...' : 'Listening...'}
              </span>
            </div>
            
            <div className="flex gap-2 mt-2">
              <div className={`w-2 h-8 bg-orange-400 rounded ${isSpeaking ? '' : 'animate-pulse'}`} style={{animationDelay: '0ms'}}></div>
              <div className={`w-2 h-12 bg-orange-500 rounded ${isSpeaking ? '' : 'animate-pulse'}`} style={{animationDelay: '150ms'}}></div>
              <div className={`w-2 h-10 bg-orange-400 rounded ${isSpeaking ? '' : 'animate-pulse'}`} style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Make sure to allow microphone access when prompted</p>
        </div>
      </div>
    </div>
  );
}
