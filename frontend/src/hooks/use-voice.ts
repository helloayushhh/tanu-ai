import { useState, useEffect, useCallback, useRef } from 'react';

// Extend window object for webkit Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;  // Keep listening even after pauses
    recognition.interimResults = true;  // Show live transcription
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    // Longer timeout for stable recognition
    (recognition as any).abortOnError = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      retryCountRef.current = 0;
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Use final transcript, fallback to interim if available
      const result = (finalTranscript || interimTranscript).trim();
      if (result) {
        setTranscript(result);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      
      const errorMessages: Record<string, string> = {
        'network': 'Network error: Check internet connection',
        'no-speech': 'No sound detected - speak clearly and try again',
        'audio-capture': 'Microphone not found - check browser permissions',
        'service-not-allowed': 'Speech service blocked - check settings',
        'bad-grammar': 'Grammar error - try rephrasing',
        'aborted': 'Mic stopped',
      };

      const friendlyError = errorMessages[event.error] || `Error: ${event.error}`;
      setError(friendlyError);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    setTranscript('');
    setError(null);
    retryCountRef.current = 0;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start listening", e);
        setError("Could not start microphone");
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition", e);
      }
    }
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript: () => setTranscript('')
  };
}
