import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Send, 
  FileUp, 
  File as FileIcon, 
  FileImage, 
  FileText, 
  FileArchive, 
  Download,
  X as CloseIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { 
  sendChatMessage, 
  subscribeToChatMessages, 
  uploadChatAttachment, 
  ChatMessage as FirebaseChatMessage
} from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

// Define extended interface for chat messages
interface ChatMessage extends FirebaseChatMessage {
  id?: string;
}

interface ChatInterfaceProps {
  userId: number | null;
  username: string;
  isAdmin?: boolean;
  selectedClientId?: number;
  onClientSelect?: (clientId: number) => void;
}

export function ChatInterface({ 
  userId, 
  username, 
  isAdmin = false, 
  selectedClientId, 
  onClientSelect 
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useTranslation();
  const isEnglish = language === 'en';
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get all clients if admin
  const { data: clients = [] } = useQuery({
    queryKey: ['/api/admin/clients'],
    enabled: isAdmin,
  });

  // Chat room ID - gebruik een gepersonaliseerde chat room ID
  const roomId = isAdmin && selectedClientId 
    ? `admin_client_${selectedClientId}` 
    : isAdmin 
      ? "admin_general" 
      : `client_${userId}`;

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

  // Functie om bestandstype icoon te bepalen
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-5 w-5" />;
    } else if (mimeType.startsWith('text/')) {
      return <FileText className="h-5 w-5" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('compressed')) {
      return <FileArchive className="h-5 w-5" />;
    } else {
      return <FileIcon className="h-5 w-5" />;
    }
  };

  // Functie voor bestandsgrootte weergave
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Functie om bestand te selecteren
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check bestandsgrootte (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: isEnglish ? "File too large" : "Bestand te groot",
          description: isEnglish 
            ? "The file exceeds the maximum size of 5MB." 
            : "Het bestand overschrijdt de maximale grootte van 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Functie om bestand te wissen
  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Functie om geselecteerd bestand te uploaden
  const handleUploadFile = async (): Promise<{ url: string; type: string; name: string; size: number } | null> => {
    if (!selectedFile) return null;
    
    setIsUploading(true);
    try {
      const attachment = await uploadChatAttachment(
        selectedFile,
        roomId,
        userId
      );
      
      handleClearFile();
      return attachment;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: isEnglish ? "Upload Error" : "Upload Fout",
        description: isEnglish 
          ? "Failed to upload file. Please try again." 
          : "Het uploaden van het bestand is mislukt. Probeer het opnieuw.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
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
      let attachment = null;
      
      // Upload het bestand als er een is geselecteerd
      if (selectedFile) {
        attachment = await handleUploadFile();
        if (!attachment && !message.trim()) {
          setIsLoading(false);
          return;
        }
      }
      
      // Create message object
      const newMessage: ChatMessage = {
        userId,
        username,
        message: message.trim(),
        timestamp: Date.now(),
        ...(attachment && { attachment }),
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
      {/* Client selector voor admin gebruikers */}
      {isAdmin && (
        <div className="px-4 py-2 border-b">
          <Select
            value={selectedClientId?.toString() || ""}
            onValueChange={(value) => onClientSelect && onClientSelect(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isEnglish ? "Select a client" : "Selecteer een klant"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{isEnglish ? "Clients" : "Klanten"}</SelectLabel>
                {clients.map((client: any) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name || client.username}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      
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
                  {msg.message && <div>{msg.message}</div>}
                  
                  {/* Toon bijlage indien aanwezig */}
                  {msg.attachment && (
                    <div className="mt-2">
                      {msg.attachment.type.startsWith('image/') ? (
                        <div className="relative">
                          <img 
                            src={msg.attachment.url}
                            alt={msg.attachment.name}
                            className="max-w-full max-h-48 rounded-md object-contain"
                          />
                          <a 
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={msg.attachment.name}
                            className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded-full"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <Card className="p-2 flex items-center gap-2 hover:bg-accent/50 cursor-pointer" onClick={() => window.open(msg.attachment.url, '_blank')}>
                          {getFileIcon(msg.attachment.type)}
                          <div className="flex-1 overflow-hidden">
                            <div className="truncate text-sm font-medium">{msg.attachment.name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(msg.attachment.size)}</div>
                          </div>
                          <a 
                            href={msg.attachment.url}
                            download={msg.attachment.name}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Card>
                      )}
                    </div>
                  )}
                  
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
      
      {/* Bestand voorbeeldweergave */}
      {selectedFile && (
        <div className="px-4 pt-2">
          <Card className="p-2 flex items-center gap-2">
            {getFileIcon(selectedFile.type)}
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium">{selectedFile.name}</div>
              <div className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearFile} disabled={isLoading || isUploading}>
              <CloseIcon className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      )}
      
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
            disabled={isLoading || isUploading}
            className="flex-1"
          />
          
          {/* Bestand upload knop */}
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading}
          >
            <FileUp className="h-4 w-4" />
            <span className="sr-only">
              {isEnglish ? "Upload file" : "Bestand uploaden"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,application/x-zip-compressed"
            />
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading || isUploading || (!message.trim() && !selectedFile)}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                {isEnglish ? "Uploading..." : "Uploaden..."}
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="sr-only">
                  {isEnglish ? "Send" : "Versturen"}
                </span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}