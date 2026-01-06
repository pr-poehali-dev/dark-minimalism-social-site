import { useState, useRef } from 'react';
import { User } from '@/components/extensions/auth-email/useAuth';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessagesSectionProps {
  user: User;
}

interface Conversation {
  id: number;
  user: {
    name: string;
    username: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: number;
  senderId: number;
  content?: string;
  type: 'text' | 'image' | 'audio' | 'voice' | 'location';
  mediaUrl?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
}

const mockConversations: Conversation[] = [
  { id: 1, user: { name: 'Анна Смирнова', username: 'anna_dev' }, lastMessage: 'Привет! Как дела?', timestamp: '10 мин назад', unread: 2 },
  { id: 2, user: { name: 'Максим Петров', username: 'max_code' }, lastMessage: 'Спасибо за помощь!', timestamp: '1ч назад', unread: 0 },
];

export default function MessagesSection({ user }: MessagesSectionProps) {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, senderId: 2, content: 'Привет! Как дела?', type: 'text', timestamp: '10:30' },
    { id: 2, senderId: user.id, content: 'Привет! Всё отлично, спасибо!', type: 'text', timestamp: '10:32' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: messages.length + 1,
      senderId: user.id,
      content: newMessage,
      type: 'text',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleFileAttach = (type: 'image' | 'audio') => {
    const msg: Message = {
      id: messages.length + 1,
      senderId: user.id,
      content: type === 'image' ? '📷 Изображение' : '🎵 Аудио',
      type,
      mediaUrl: '#',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
  };

  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const msg: Message = {
        id: messages.length + 1,
        senderId: user.id,
        content: '📍 Геопозиция',
        type: 'location',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, msg]);
    });
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        const msg: Message = {
          id: messages.length + 1,
          senderId: user.id,
          content: '🎤 Голосовое сообщение',
          type: 'voice',
          mediaUrl: '#',
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Сообщения</h2>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv.id)}
              className={`w-full p-4 border-b border-border hover:bg-secondary/30 transition-colors text-left ${
                selectedConv === conv.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-muted text-foreground">
                    {conv.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold truncate">{conv.user.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-muted text-foreground">
                    {conversations.find(c => c.id === selectedConv)?.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {conversations.find(c => c.id === selectedConv)?.user.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{conversations.find(c => c.id === selectedConv)?.user.username}
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.senderId === user.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {msg.type === 'text' && <p>{msg.content}</p>}
                      {msg.type === 'image' && (
                        <div>
                          <Icon name="Image" size={20} className="mb-1" />
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      )}
                      {msg.type === 'audio' && (
                        <div className="flex items-center gap-2">
                          <Icon name="Music" size={20} />
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      )}
                      {msg.type === 'voice' && (
                        <div className="flex items-center gap-2">
                          <Icon name="Mic" size={20} />
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      )}
                      {msg.type === 'location' && (
                        <div>
                          <Icon name="MapPin" size={20} className="mb-1" />
                          <p className="text-sm">{msg.content}</p>
                          {msg.latitude && msg.longitude && (
                            <p className="text-xs opacity-80 mt-1">
                              {msg.latitude.toFixed(4)}, {msg.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="Paperclip" size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleFileAttach('image')}
                      >
                        <Icon name="Image" size={18} className="mr-2" />
                        Изображение
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleFileAttach('audio')}
                      >
                        <Icon name="Music" size={18} className="mr-2" />
                        Музыка
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={sendLocation}
                      >
                        <Icon name="MapPin" size={18} className="mr-2" />
                        Геопозиция
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Input
                  placeholder="Сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceRecording}
                  className={isRecording ? 'text-red-500' : ''}
                >
                  <Icon name={isRecording ? 'Circle' : 'Mic'} size={20} />
                </Button>

                <Button onClick={sendMessage} size="icon">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Выберите диалог
          </div>
        )}
      </div>
    </div>
  );
}
