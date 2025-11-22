import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export function ChatCompanion() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);

      if (data && data.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          user_id: user.id,
          message: "Hello! I'm your wellness companion. I'm here to support you on your journey to better health and wellbeing. How are you feeling today?",
          role: 'assistant',
          sentiment: null,
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
      return "I hear that you're feeling stressed. Remember, taking regular breaks can significantly reduce stress levels. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, and exhale for 8. Would you like me to guide you through a quick relaxation exercise?";
    }

    if (lowerMessage.includes('tired') || lowerMessage.includes('fatigue')) {
      return "Feeling tired is your body's way of asking for care. Have you taken a break recently? A quick 2-minute walk or some stretching can help boost your energy. Also, make sure you're staying hydrated!";
    }

    if (lowerMessage.includes('pain') || lowerMessage.includes('hurts') || lowerMessage.includes('ache')) {
      return "I'm sorry you're experiencing discomfort. Regular stretching can help prevent and reduce pain from prolonged sitting. Check out our stretch library for targeted exercises. If pain persists, please consult a healthcare professional.";
    }

    if (lowerMessage.includes('motivation') || lowerMessage.includes('give up')) {
      return "You're doing great by being here! Building healthy habits takes time. Remember, every small step counts. Your streak shows your commitment. Keep going, and celebrate your progress along the way!";
    }

    if (lowerMessage.includes('break') || lowerMessage.includes('remind')) {
      return "Your break reminders are set based on your preferences. Regular breaks every 45-60 minutes are scientifically proven to improve focus and prevent burnout. Would you like to adjust your break frequency in settings?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need support or encouragement. Keep taking care of yourself!";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I'm here to support your wellness journey! I can help you with stress management tips, motivation, break reminders, stretching advice, and general wellness guidance. What would you like to talk about?";
    }

    const responses = [
      "That's interesting! How can I support you with your wellness goals today?",
      "I'm here to help. Taking care of your health is so important. What's on your mind?",
      "Thank you for sharing. Remember to take regular breaks and stay mindful of your posture. Is there anything specific you'd like to discuss?",
      "Your wellbeing matters! Have you completed any stretches today? Regular movement is key to staying healthy.",
      "I appreciate you checking in. How has your day been going? Remember to stay hydrated and take breaks!",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const { error: userError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          role: 'user',
        });

      if (userError) throw userError;

      const assistantResponse = generateResponse(userMessage);

      const { error: assistantError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: assistantResponse,
          role: 'assistant',
        });

      if (assistantError) throw assistantError;

      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-280px)] flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Wellness Companion</h3>
            <p className="text-sm text-gray-500">Always here to support you</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.message}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
