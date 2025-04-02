
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, X, MessageSquare, Volume2 } from "lucide-react";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your Diani Beach assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate assistant response (in a real app, this would call an API)
    setTimeout(() => {
      const assistantMessage: Message = {
        content: "Thanks for your message! This is a placeholder response. In the full version, I would provide you with personalized recommendations about Diani Beach.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const toggleSpeechRecognition = () => {
    // This is a placeholder for the Web Speech API implementation
    setIsListening(!isListening);
    
    // In a real implementation, this would use the Web Speech API
    if (!isListening) {
      alert("Voice input would be activated here using the Web Speech API");
      // After speech recognition, would set the input and potentially auto-send
      setTimeout(() => {
        setIsListening(false);
      }, 2000);
    }
  };

  const speakResponse = (text: string) => {
    // This is a placeholder for ElevenLabs TTS implementation
    alert(`This would speak the text: "${text}" using ElevenLabs API`);
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 p-0 bg-coral hover:bg-coral-dark transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full sm:w-96 h-[600px] max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-ocean to-ocean-light p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-display font-bold">Diani Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.sender === 'user' 
                      ? 'bg-coral-light text-gray-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender === 'assistant' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-1 rounded-full" 
                        onClick={() => speakResponse(message.content)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask me anything about Diani..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 resize-none h-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
                  onClick={toggleSpeechRecognition}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="rounded-full bg-ocean hover:bg-ocean-dark"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
