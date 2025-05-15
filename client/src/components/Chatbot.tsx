import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { Send, Maximize2, Minimize2, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { trackEvent } from "@/lib/analytics";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const Chatbot = () => {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownAutomatically, setHasShownAutomatically] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open chat after 10 seconds
  useEffect(() => {
    if (!hasShownAutomatically) {
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
              ? "Hi there! 👋 Can I help you with your web development project today? I'd be happy to tell you about our services."
              : "Hallo daar! 👋 Kan ik je vandaag helpen met je webontwikkelingsproject? Ik vertel je graag meer over onze diensten.",
            timestamp: new Date()
          };
          
          setMessages([initialQuestion]);
          setIsTyping(false);
        }, 1000);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasShownAutomatically, isEnglish]);

  // Show welcome message when chat is first opened manually
  useEffect(() => {
    if (isOpen && messages.length === 0 && hasShownAutomatically === false) {
      const welcomeMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot" as const,
        text: isEnglish 
          ? "Hi there! 👋 I'm your virtual assistant. How can I help you today?"
          : "Hallo daar! 👋 Ik ben je virtuele assistent. Hoe kan ik je vandaag helpen?",
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
    trackEvent('chat_closed', 'engagement', 'chatbot');
  };

  const handleSendMessage = () => {
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

    // Simple response logic based on keywords
    let botResponse = "";
    const lowerCaseMessage = message.toLowerCase();

    // Determine response based on language and message content
    if (isEnglish) {
      if (lowerCaseMessage.includes("pricing") || lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("price")) {
        botResponse = "Our pricing depends on the project scope and requirements. Would you like to schedule a consultation to discuss your project in detail?";
      } else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("talk to human") || lowerCaseMessage.includes("support")) {
        botResponse = "You can reach our team via the contact form on our website or by sending an email to info@digitaalatelier.com. Would you like me to direct you to our contact page?";
      } else if (lowerCaseMessage.includes("service") || lowerCaseMessage.includes("offer")) {
        botResponse = "We offer web development, application building, UI/UX design, and digital marketing services. Which service are you interested in learning more about?";
      } else if (lowerCaseMessage.includes("portfolio") || lowerCaseMessage.includes("example") || lowerCaseMessage.includes("previous work")) {
        botResponse = "You can view our portfolio of previous projects on our website. Would you like me to direct you to our portfolio section?";
      } else if (lowerCaseMessage.includes("time") || lowerCaseMessage.includes("deadline") || lowerCaseMessage.includes("duration")) {
        botResponse = "Project timelines vary based on complexity. Simple websites typically take 3-4 weeks, while larger projects might take 8-12 weeks. Would you like to discuss your specific project timeline?";
      } else {
        botResponse = "Thanks for your message! To better assist you, would you prefer to discuss your project with our team directly? I can help you get in touch with them.";
      }
    } else {
      // Dutch responses
      if (lowerCaseMessage.includes("prijs") || lowerCaseMessage.includes("kosten") || lowerCaseMessage.includes("tarief")) {
        botResponse = "Onze prijzen zijn afhankelijk van de projectomvang en vereisten. Wilt u een consultatie inplannen om uw project in detail te bespreken?";
      } else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("praat met mens") || lowerCaseMessage.includes("support")) {
        botResponse = "U kunt ons team bereiken via het contactformulier op onze website of door een e-mail te sturen naar info@digitaalatelier.com. Wilt u dat ik u naar onze contactpagina verwijs?";
      } else if (lowerCaseMessage.includes("dienst") || lowerCaseMessage.includes("aanbod")) {
        botResponse = "Wij bieden webontwikkeling, applicatiebouw, UI/UX-ontwerp en digitale marketingdiensten aan. Over welke dienst wilt u meer weten?";
      } else if (lowerCaseMessage.includes("portfolio") || lowerCaseMessage.includes("voorbeeld") || lowerCaseMessage.includes("eerder werk")) {
        botResponse = "U kunt ons portfolio van eerdere projecten bekijken op onze website. Wilt u dat ik u naar ons portfolio-gedeelte verwijs?";
      } else if (lowerCaseMessage.includes("tijd") || lowerCaseMessage.includes("deadline") || lowerCaseMessage.includes("duur")) {
        botResponse = "Projecttijdlijnen variëren op basis van complexiteit. Eenvoudige websites duren meestal 3-4 weken, terwijl grotere projecten 8-12 weken kunnen duren. Wilt u uw specifieke projecttijdlijn bespreken?";
      } else {
        botResponse = "Bedankt voor uw bericht! Om u beter te helpen, wilt u liever uw project rechtstreeks met ons team bespreken? Ik kan u helpen om contact met hen op te nemen.";
      }
    }

    // Simulate bot typing with delay
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
          <Bot size={24} />
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
            className="fixed bottom-20 right-5 w-full sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-30 border border-neutral-200"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {/* Chat Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="bg-white/20 h-8 w-8">
                  <Bot size={18} />
                </Avatar>
                <h3 className="font-semibold">
                  {isEnglish ? "Digital Assistant" : "Digitale Assistent"}
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
                  className="p-4 h-96 overflow-y-auto flex flex-col gap-3 bg-neutral-50"
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
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white shadow-sm border border-neutral-200 rounded-tl-none"
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
                      <div className="bg-white shadow-sm border border-neutral-200 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
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