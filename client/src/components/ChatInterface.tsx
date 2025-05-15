import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { ChatMessage, sendChatMessage, subscribeToChatMessages } from "@/lib/firebase";

interface ChatInterfaceProps {
  userId: number | null;
  username: string;
}

export function ChatInterface({ userId, username }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { language } = useTranslation();
  const isEnglish = language === 'en';
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Chat room ID - for now using a fixed ID for all users
  // In a production app, you might want to create different rooms
  const roomId = "general";

  useEffect(() => {
    // Subscribe to messages from Firebase
    const unsubscribe = subscribeToChatMessages(roomId, (newMessages) => {
      setMessages(newMessages);
    });

    // Unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    // Scroll to bottom whenever messages update
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (!username) {
      toast({
        title: isEnglish ? "Error" : "Fout",
        description: isEnglish 
          ? "You must be logged in to send messages" 
          : "Je moet ingelogd zijn om berichten te versturen",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create message object
      const newMessage: ChatMessage = {
        userId,
        username,
        message: message.trim(),
        timestamp: Date.now(),
      };
      
      // Send message to Firebase
      await sendChatMessage(roomId, newMessage);
      
      // Clear input
      setMessage("");
      
      // Focus input field again
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: isEnglish ? "Error" : "Fout",
        description: isEnglish 
          ? "Failed to send message. Please try again." 
          : "Het versturen van het bericht is mislukt. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (username: string) => {
    // Simple hash function to get a consistent color for each username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to RGB
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, 'HH:mm', { locale: isEnglish ? enUS : nl });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              {isEnglish 
                ? "No messages yet. Start the conversation!" 
                : "Nog geen berichten. Begin het gesprek!"}
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-2 ${msg.userId === userId ? 'justify-end' : ''}`}
              >
                {msg.userId !== userId && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{ backgroundColor: getRandomColor(msg.username) }}>
                      {getInitials(msg.username)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`
                    max-w-[80%] rounded-lg px-3 py-2 
                    ${msg.userId === userId 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                    }
                  `}
                >
                  {msg.userId !== userId && (
                    <div className="font-medium text-xs mb-1">{msg.username}</div>
                  )}
                  <div>{msg.message}</div>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                
                {msg.userId === userId && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{ backgroundColor: getRandomColor(msg.username) }}>
                      {getInitials(msg.username)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4">
        <form 
          className="flex gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isEnglish ? "Type your message..." : "Typ je bericht..."}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">
              {isEnglish ? "Send" : "Versturen"}
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
}