import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { mockCharacters } from "@/data/mockData";
import { Send, Heart, Share, MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const [searchParams] = useSearchParams();
  const characterId = searchParams.get('character');
  const character = mockCharacters.find(c => c.id === characterId) || mockCharacters[0];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${character.name}. I'm so excited to chat with you! What would you like to talk about today?`,
      isUser: false,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more about that.",
        "I love hearing your thoughts on this topic!",
        "You have such a unique perspective. What made you think of that?",
        "That reminds me of something I've been pondering lately...",
        "I'm curious to know what you think about this situation.",
        "Your creativity always amazes me! What else comes to mind?",
        "I appreciate you sharing that with me. How does that make you feel?",
        "That's a fascinating way to look at things. I hadn't considered that angle."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <Header 
        title={character.name}
        showBack 
        showStats={false}
      />
      
      {/* Character Info Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={character.image} 
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm">{character.name}</h2>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6 rounded-full overflow-hidden">
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{character.name}</span>
                  </div>
                )}
                
                <Card className={`p-3 transition-smooth ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-primary to-accent text-white ml-4' 
                    : 'card-premium mr-4'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </Card>
                
                <p className="text-xs text-muted-foreground mt-1 px-3">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <Card className="card-premium p-3 mr-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 max-w-md mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-muted/50 border-border/50 focus:border-primary/50"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="premium"
            size="sm"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}