import { useState } from 'react';
import { User } from '@/components/extensions/auth-email/useAuth';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ChannelsSectionProps {
  user: User;
}

interface Channel {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  members: number;
  roles: ChannelRole[];
}

interface ChannelRole {
  id: number;
  name: string;
  level: number;
}

interface ChannelMember {
  id: number;
  name: string;
  username: string;
  roleId: number;
}

const defaultRoles: ChannelRole[] = [
  { id: 1, name: 'Новичок', level: 0 },
  { id: 2, name: 'Участник', level: 1 },
  { id: 3, name: 'Модератор', level: 2 },
  { id: 4, name: 'Администратор', level: 3 },
];

const mockChannels: Channel[] = [
  { id: 1, name: 'Веб-разработка', description: 'Обсуждаем всё о веб-технологиях', creatorId: 1, members: 1243, roles: defaultRoles },
  { id: 2, name: 'Дизайн', description: 'UI/UX и визуальный дизайн', creatorId: 2, members: 987, roles: defaultRoles },
];

const mockMembers: ChannelMember[] = [
  { id: 2, name: 'Анна Смирнова', username: 'anna_dev', roleId: 2 },
  { id: 3, name: 'Максим Петров', username: 'max_code', roleId: 1 },
];

export default function ChannelsSection({ user }: ChannelsSectionProps) {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [members, setMembers] = useState<ChannelMember[]>(mockMembers);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [editingRole, setEditingRole] = useState<ChannelRole | null>(null);
  const [newRoleName, setNewRoleName] = useState('');

  const createChannel = () => {
    if (!newChannelName.trim()) return;

    const newChannel: Channel = {
      id: channels.length + 1,
      name: newChannelName,
      description: newChannelDesc,
      creatorId: user.id,
      members: 1,
      roles: [...defaultRoles]
    };

    setChannels([...channels, newChannel]);
    setNewChannelName('');
    setNewChannelDesc('');
    setShowCreateChannel(false);
  };

  const updateMemberRole = (memberId: number, newRoleId: number) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, roleId: newRoleId } : m
    ));
  };

  const updateRoleName = (roleId: number, newName: string) => {
    if (!selectedChannel) return;

    const updatedRoles = selectedChannel.roles.map(r =>
      r.id === roleId ? { ...r, name: newName } : r
    );

    setChannels(channels.map(c =>
      c.id === selectedChannel.id ? { ...c, roles: updatedRoles } : c
    ));

    setSelectedChannel({ ...selectedChannel, roles: updatedRoles });
    setEditingRole(null);
    setNewRoleName('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Каналы</h2>
          <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={18} className="mr-2" />
                Создать канал
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новый канал</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Название канала"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
                <Textarea
                  placeholder="Описание канала"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                />
                <Button onClick={createChannel} className="w-full">
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        {!selectedChannel ? (
          <div className="grid gap-4 md:grid-cols-2">
            {channels.map(channel => (
              <Card 
                key={channel.id} 
                className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-lg">{channel.name}</h3>
                      {channel.creatorId === user.id && (
                        <Badge variant="secondary">Владелец</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {channel.members.toLocaleString('ru-RU')} участников
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => setSelectedChannel(null)}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад к каналам
            </Button>

            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon name="Users" size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedChannel.name}</h2>
                  <p className="text-muted-foreground mb-4">{selectedChannel.description}</p>
                  <div className="text-sm text-muted-foreground">
                    {selectedChannel.members.toLocaleString('ru-RU')} участников
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Users" size={20} />
                  Участники
                </h3>
                <div className="space-y-3">
                  {members.map(member => {
                    const memberRole = selectedChannel.roles.find(r => r.id === member.roleId);
                    const isCreator = selectedChannel.creatorId === user.id;

                    return (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-muted text-foreground">
                            {member.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{member.name}</div>
                          <div className="text-sm text-muted-foreground">@{member.username}</div>
                        </div>
                        {isCreator && member.id !== user.id ? (
                          <select
                            value={member.roleId}
                            onChange={(e) => updateMemberRole(member.id, parseInt(e.target.value))}
                            className="text-sm bg-secondary border border-border rounded px-2 py-1"
                          >
                            {selectedChannel.roles.map(role => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Badge variant="outline">{memberRole?.name}</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Shield" size={20} />
                  Роли
                </h3>
                <div className="space-y-3">
                  {selectedChannel.roles.map(role => (
                    <div key={role.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary/50">
                      {editingRole?.id === role.id ? (
                        <Input
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          onBlur={() => updateRoleName(role.id, newRoleName)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateRoleName(role.id, newRoleName);
                            }
                          }}
                          autoFocus
                          className="h-8"
                        />
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Badge variant={role.level === 3 ? 'default' : 'secondary'}>
                              Уровень {role.level}
                            </Badge>
                            <span className="font-medium">{role.name}</span>
                          </div>
                          {selectedChannel.creatorId === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingRole(role);
                                setNewRoleName(role.name);
                              }}
                            >
                              <Icon name="Edit2" size={14} />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {selectedChannel.creatorId === user.id && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Нажмите на иконку редактирования, чтобы изменить название роли
                  </p>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
