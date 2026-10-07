import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  AlertTriangle,
  Stethoscope,
  Info,
  User,
  Heart,
  HelpCircle,
} from 'lucide-react';
import api from '../api/client.js';
import { ChatMessage } from '../types/index.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What happens during the second trimester?',
    'What should I discuss at my prenatal appointment?',
    'Which doctor should I consult?',
    'What are safe exercises during pregnancy?',
    'What foods should I avoid while pregnant?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await api.getChatHistory();
        if (history && history.length > 0) {
          const latestSession = history[0];
          setCurrentSessionId(latestSession.id);
          setMessages(latestSession.messages || []);
        } else {
          // Initial greeting message
          setMessages([
            {
              id: 'welcome',
              chatSessionId: 'default',
              role: 'ASSISTANT',
              content:
                "Hello! 👋 I am your PregnaCare AI Companion. I'm here to provide evidence-based educational pregnancy information, explain developmental milestones, and help you prepare questions for your healthcare provider.\n\nHow can I support your pregnancy journey today?",
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (err: any) {
        console.error('Failed to load chat history', err);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    setInputMessage('');

    // Append user message optimistically
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      chatSessionId: currentSessionId || 'default',
      role: 'USER',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage({
        message: textToSend,
        sessionId: currentSessionId,
      });

      if (response?.sessionId) {
        setCurrentSessionId(response.sessionId);
      }

      if (response?.message) {
        setMessages((prev) => [...prev, response.message]);
      }
    } catch (err: any) {
      setError(
        err.message ||
          'The AI assistant is temporarily unavailable. Please try again later or consult a qualified healthcare professional.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (currentSessionId) {
      try {
        await api.deleteChatSession(currentSessionId);
      } catch (e) {
        // ignore
      }
    }
    setCurrentSessionId(undefined);
    setMessages([
      {
        id: 'new-session',
        chatSessionId: 'default',
        role: 'ASSISTANT',
        content:
          "Conversation cleared. How can I help with your pregnancy planning or educational questions today?",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)] animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-t-3xl border border-b-0 border-rosewater-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rosewater-500 to-rosewater-600 flex items-center justify-center text-white shadow-md shadow-rosewater-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800">PregnaCare AI Assistant</h1>
            <p className="text-[11px] text-slate-400 font-medium">
              General pregnancy education and planning support
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="px-4 py-2 bg-rosewater-50/70 border-x border-rosewater-100 text-[11px] text-rosewater-800 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-rosewater-600 shrink-0" />
        <span>
          PregnaCare AI provides educational and organizational support. It does not diagnose or replace clinical medical advice.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#faf9f8] border-x border-rosewater-100 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'USER';
          const isAlert = msg.isSafetyAlert;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-slate-700 text-white'
                    : isAlert
                    ? 'bg-rose-600 text-white'
                    : 'bg-rosewater-500 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : isAlert ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] sm:max-w-xl space-y-1.5`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-rosewater-600 text-white rounded-tr-none'
                      : isAlert
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 font-medium rounded-tl-none'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Recommended Specialty or Concern Badge */}
                {!isUser && msg.recommendedDoctorSpecialty && (
                  <div className="flex items-center gap-2 pl-2 text-[10px] text-slate-400 font-semibold">
                    <Stethoscope className="w-3 h-3 text-rosewater-600" />
                    <span>Recommended Specialty: {msg.recommendedDoctorSpecialty}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-rosewater-500 text-white flex items-center justify-center text-xs shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rosewater-400 animate-ping" />
              <span>PregnaCare AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      {messages.length <= 3 && !isLoading && (
        <div className="bg-white px-4 py-2.5 border-x border-rosewater-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-rosewater-700 bg-rosewater-50 hover:bg-rosewater-100 px-3 py-1 rounded-full whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-b-3xl border border-t-0 border-rosewater-100 shadow-soft">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about pregnancy stages, symptoms, nutrition, or questions for your doctor..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-3 rounded-2xl bg-rosewater-600 hover:bg-rosewater-700 text-white shadow-md shadow-rosewater-600/25 transition active:scale-95 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
