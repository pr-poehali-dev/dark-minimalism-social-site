import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => Promise<void>;
}

export default function Sidebar({ activeSection, onSectionChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'feed', label: 'Лента', icon: 'Home' },
    { id: 'search', label: 'Поиск', icon: 'Search' },
    { id: 'channels', label: 'Каналы', icon: 'Users' },
    { id: 'messages', label: 'Сообщения', icon: 'MessageCircle' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
  ];

  return (
    <aside className="w-64 border-r border-border fixed h-screen flex flex-col p-4 bg-background">
      <button 
        onClick={() => onSectionChange('feed')}
        className="mb-8 px-2 text-left hover:opacity-80 transition-opacity"
      >
        <h1 className="text-2xl font-bold text-primary">Социум</h1>
      </button>

      <nav className="flex-1 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all hover:bg-secondary ${
              activeSection === item.id ? 'bg-secondary text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name={item.icon as any} size={22} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <Button 
        variant="ghost" 
        className="w-full mt-4 justify-start text-muted-foreground hover:text-foreground" 
        onClick={onLogout}
      >
        <Icon name="LogOut" size={20} className="mr-2" />
        Выйти
      </Button>
    </aside>
  );
}
