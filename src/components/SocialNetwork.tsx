import { useState } from 'react';
import { User } from '@/components/extensions/auth-email/useAuth';
import Feed from '@/components/social/Feed';
import SearchSection from '@/components/social/SearchSection';
import MessagesSection from '@/components/social/MessagesSection';
import ProfileSection from '@/components/social/ProfileSection';
import ChannelsSection from '@/components/social/ChannelsSection';
import Sidebar from '@/components/social/Sidebar';

interface SocialNetworkProps {
  user: User;
  onLogout: () => Promise<void>;
}

export default function SocialNetwork({ user, onLogout }: SocialNetworkProps) {
  const [activeSection, setActiveSection] = useState<string>('feed');

  const renderSection = () => {
    switch (activeSection) {
      case 'feed':
        return <Feed user={user} />;
      case 'search':
        return <SearchSection user={user} />;
      case 'messages':
        return <MessagesSection user={user} />;
      case 'profile':
        return <ProfileSection user={user} onLogout={onLogout} />;
      case 'channels':
        return <ChannelsSection user={user} />;
      default:
        return <Feed user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      <main className="ml-64 flex-1">
        {renderSection()}
      </main>
    </div>
  );
}
