import { User } from '@/components/extensions/auth-email/useAuth';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProfileSectionProps {
  user: User;
  onLogout: () => Promise<void>;
}

export default function ProfileSection({ user, onLogout }: ProfileSectionProps) {
  const username = user.email.split('@')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-xl font-semibold">Профиль</h2>
      </div>

      <div className="p-6">
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{user.name || 'Пользователь'}</h2>
              <p className="text-muted-foreground mb-4">@{username}</p>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              <Button variant="outline">
                <Icon name="Edit2" size={16} className="mr-2" />
                Редактировать профиль
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">342</div>
              <div className="text-sm text-muted-foreground">Посты</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1.2K</div>
              <div className="text-sm text-muted-foreground">Подписчики</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">486</div>
              <div className="text-sm text-muted-foreground">Подписки</div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Users" size={20} className="text-primary" />
              <h3 className="font-semibold">Друзья</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Управляйте списком друзей
            </p>
          </Card>

          <Card className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Bookmark" size={20} className="text-primary" />
              <h3 className="font-semibold">Сохранённое</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Сохранённые посты и контент
            </p>
          </Card>

          <Card className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Settings" size={20} className="text-primary" />
              <h3 className="font-semibold">Настройки</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Приватность и безопасность
            </p>
          </Card>

          <Card className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Bell" size={20} className="text-primary" />
              <h3 className="font-semibold">Уведомления</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Настройки уведомлений
            </p>
          </Card>
        </div>

        <Card className="mt-6 p-4 border-destructive/50">
          <h3 className="font-semibold mb-2 text-destructive">Опасная зона</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Действия, которые необратимо изменят ваш аккаунт
          </p>
          <Button variant="destructive" onClick={onLogout}>
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти из аккаунта
          </Button>
        </Card>
      </div>
    </div>
  );
}
