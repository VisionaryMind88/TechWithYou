import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation } from "wouter";
import { Send, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { trackEvent } from "@/lib/analytics";
import { generateAIResponse } from "@/lib/openai-service";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const Chatbot = () => {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownAutomatically, setHasShownAutomatically] = useState(false);
  const [hasBeenClosedByUser, setHasBeenClosedByUser] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Verberg chatbot op dashboard, admin en project pagina's
  const shouldHideChatbot = location.startsWith('/dashboard') || 
                           location.startsWith('/admin') || 
                           location.startsWith('/project/');
                           
  // Als we op een pagina zijn waar de chatbot verborgen moet zijn, toon hem dan niet
  if (shouldHideChatbot) {
    return null;
  }
                          
  // Auto-open chat after 10 seconds (only if it hasn't been closed by user)
  useEffect(() => {
    if (!hasShownAutomatically && !hasBeenClosedByUser) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShownAutomatically(true);
        
        // After opening, automatically show an engaging question
        setIsTyping(true);
        
        setTimeout(() => {
          const initialQuestion = {
            id: `bot-${Date.now()}`,
            sender: "bot" as const,
            text: isEnglish 
              ? "Hi there! 👋 I'm Dalia, your personal assistant. Can I help you with your web development project today? I'd be happy to tell you about our services."
              : "Hallo daar! 👋 Ik ben Dalia, je persoonlijke assistent. Kan ik je vandaag helpen met je webontwikkelingsproject? Ik vertel je graag meer over onze diensten.",
            timestamp: new Date()
          };
          
          setMessages([initialQuestion]);
          setIsTyping(false);
        }, 1000);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasShownAutomatically, hasBeenClosedByUser, isEnglish]);

  // Show welcome message when chat is first opened manually
  useEffect(() => {
    if (isOpen && messages.length === 0 && hasShownAutomatically === false) {
      const welcomeMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot" as const,
        text: isEnglish 
          ? "Hi there! 👋 I'm Dalia, your personal assistant. How can I help you today?"
          : "Hallo daar! 👋 Ik ben Dalia, je persoonlijke assistent. Hoe kan ik je vandaag helpen?",
        timestamp: new Date()
      };
      
      setIsTyping(true);
      
      // Simulate typing
      setTimeout(() => {
        setMessages([welcomeMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, isEnglish, messages.length, hasShownAutomatically]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Track chat interactions
  useEffect(() => {
    if (isOpen) {
      trackEvent('chat_opened', 'engagement', 'chatbot');
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      if (isMinimized) {
        setIsMinimized(false);
      } else {
        setIsMinimized(true);
      }
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setHasBeenClosedByUser(true); // User closed the chat, don't show it again automatically
    trackEvent('chat_closed', 'engagement', 'chatbot');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Track this message
    trackEvent('message_sent', 'engagement', 'chatbot');

    // Bereid de chatgeschiedenis voor in het formaat dat de AI-service verwacht
    const chatHistory = messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));

    try {
      // Gebruik de AI-service om een antwoord te genereren
      const aiResponse = await generateAIResponse(message, chatHistory);
      
      // Voeg het antwoord toe na een korte vertraging om typegedrag te simuleren
      setTimeout(() => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: aiResponse,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Fallback antwoord in geval van een fout
      setTimeout(() => {
        const fallbackMessage = isEnglish
          ? "I'm sorry, I'm having trouble processing your request right now. Could you try again later or contact our team directly?"
          : "Het spijt me, ik heb momenteel moeite met het verwerken van je verzoek. Kun je het later nog eens proberen of direct contact opnemen met ons team?";
        
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: fallbackMessage,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat Button */}
      <div className="fixed right-5 bottom-5 z-30">
        <Button
          onClick={toggleChat}
          className={`rounded-full w-14 h-14 shadow-lg ${
            isOpen ? "bg-neutral-800" : "bg-primary"
          } hover:bg-primary/90 text-white p-3`}
          aria-label={isOpen ? "Minimize chat" : "Open chat"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </Button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={
              isMinimized
                ? { opacity: 1, y: 0, scale: 0.9, height: "60px" }
                : { opacity: 1, y: 0, scale: 1, height: "auto" }
            }
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 w-full sm:w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-30 border border-neutral-100"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-3 flex justify-between items-center rounded-t-xl">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://randomuser.me/api/portraits/women/65.jpg" alt="Dalia" />
                  <AvatarFallback className="bg-white/20">DA</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">
                  Dalia
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-7 w-7 rounded-full text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeChat}
                  className="h-7 w-7 rounded-full text-white hover:bg-white/20"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Hide chat body when minimized */}
            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div 
                  className="p-4 h-72 overflow-y-auto flex flex-col gap-3 bg-gradient-to-b from-white to-neutral-50"
                  aria-live="polite"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-none shadow-md"
                            : "bg-white shadow-sm border border-neutral-100 rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender === "user" ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white shadow-sm border border-neutral-100 p-2.5 rounded-2xl rounded-tl-none max-w-[80%]">
                        <div className="flex gap-1.5 px-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-80 animate-bounce"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-60 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-40 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-neutral-200 bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isEnglish ? "Type your message..." : "Type je bericht..."}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-primary/90 text-white"
                      disabled={!message.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};