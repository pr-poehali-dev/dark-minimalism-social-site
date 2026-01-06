import { useState } from 'react';
import { User } from '@/components/extensions/auth-email/useAuth';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchSectionProps {
  user: User;
}

interface UserResult {
  id: number;
  name: string;
  username: string;
  bio: string;
  isFriend: boolean;
  friendRequestSent: boolean;
}

interface ChannelResult {
  id: number;
  name: string;
  description: string;
  members: number;
  isMember: boolean;
}

const mockUsers: UserResult[] = [
  { id: 2, name: 'Анна Смирнова', username: 'anna_dev', bio: 'Frontend разработчик', isFriend: false, friendRequestSent: false },
  { id: 3, name: 'Максим Петров', username: 'max_code', bio: 'Backend разработчик', isFriend: true, friendRequestSent: false },
];

const mockChannels: ChannelResult[] = [
  { id: 1, name: 'Веб-разработка', description: 'Обсуждаем всё о веб-технологиях', members: 1243, isMember: false },
  { id: 2, name: 'Дизайн', description: 'UI/UX и визуальный дизайн', members: 987, isMember: true },
];

export default function SearchSection({ user }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [channels, setChannels] = useState(mockChannels);

  const addFriend = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, friendRequestSent: true } : u
    ));
  };

  const joinChannel = (channelId: number) => {
    setChannels(channels.map(c => 
      c.id === channelId ? { ...c, isMember: true, members: c.members + 1 } : c
    ));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-xl font-semibold mb-4">Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Найти людей или каналы..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="users" className="p-4">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="users">Люди</TabsTrigger>
          <TabsTrigger value="channels">Каналы</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-3 mt-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Пользователи не найдены
            </div>
          ) : (
            filteredUsers.map(searchUser => (
              <Card key={searchUser.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-muted text-foreground">
                      {searchUser.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{searchUser.name}</div>
                    <div className="text-sm text-muted-foreground">@{searchUser.username}</div>
                    {searchUser.bio && (
                      <div className="text-sm text-muted-foreground mt-1">{searchUser.bio}</div>
                    )}
                  </div>
                  {searchUser.isFriend ? (
                    <Button variant="outline" disabled>
                      <Icon name="Check" size={16} className="mr-2" />
                      Друзья
                    </Button>
                  ) : searchUser.friendRequestSent ? (
                    <Button variant="outline" disabled>
                      Запрос отправлен
                    </Button>
                  ) : (
                    <Button onClick={() => addFriend(searchUser.id)}>
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Добавить
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="channels" className="space-y-3 mt-4">
          {filteredChannels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Каналы не найдены
            </div>
          ) : (
            filteredChannels.map(channel => (
              <Card key={channel.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{channel.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{channel.description}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {channel.members.toLocaleString('ru-RU')} участников
                    </div>
                  </div>
                  {channel.isMember ? (
                    <Button variant="outline" disabled>
                      <Icon name="Check" size={16} className="mr-2" />
                      Участник
                    </Button>
                  ) : (
                    <Button onClick={() => joinChannel(channel.id)}>
                      Вступить
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
