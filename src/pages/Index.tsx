import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Post {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: 'Анна Смирнова',
      username: '@anna_dev',
      avatar: 'AS'
    },
    content: 'Только что закончила работу над новым проектом! Невероятно горжусь результатом 🚀',
    tags: ['веб-разработка', 'проект', 'дизайн'],
    likes: 124,
    comments: 18,
    timestamp: '2ч назад',
    liked: false
  },
  {
    id: 2,
    author: {
      name: 'Максим Петров',
      username: '@max_code',
      avatar: 'МП'
    },
    content: 'Кто-нибудь работал с новым API? Поделитесь опытом, пожалуйста',
    tags: ['программирование', 'api', 'помощь'],
    likes: 67,
    comments: 24,
    timestamp: '4ч назад',
    liked: true
  },
  {
    id: 3,
    author: {
      name: 'Елена Волкова',
      username: '@elena_design',
      avatar: 'ЕВ'
    },
    content: 'Минимализм в дизайне — это искусство убрать всё лишнее и оставить только важное ✨',
    tags: ['дизайн', 'минимализм', 'ux'],
    likes: 203,
    comments: 31,
    timestamp: '6ч назад',
    liked: false
  }
];

const trendingTags = [
  { tag: 'веб-разработка', count: 1243 },
  { tag: 'дизайн', count: 987 },
  { tag: 'программирование', count: 876 },
  { tag: 'минимализм', count: 654 },
  { tag: 'ux', count: 543 }
];

export default function Index() {
  const [activeSection, setActiveSection] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border fixed h-screen flex flex-col p-4">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-primary">Социум</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'feed', label: 'Лента', icon: 'Home' },
            { id: 'search', label: 'Поиск', icon: 'Search' },
            { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
            { id: 'messages', label: 'Сообщения', icon: 'MessageCircle' },
            { id: 'profile', label: 'Профиль', icon: 'User' },
            { id: 'settings', label: 'Настройки', icon: 'Settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all hover:bg-secondary ${
                activeSection === item.id ? 'bg-secondary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={22} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <Button className="w-full mt-4" size="lg">
          <Icon name="Plus" size={20} className="mr-2" />
          Создать пост
        </Button>
      </aside>

      <main className="ml-64 flex-1 flex">
        <div className="flex-1 max-w-2xl border-r border-border">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
            <h2 className="text-xl font-semibold">Лента</h2>
          </div>

          <div className="p-4 border-b border-border">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">ВЫ</AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Что нового?" 
                className="flex-1 bg-secondary border-0 focus-visible:ring-primary"
              />
            </div>
          </div>

          {selectedTag && (
            <div className="p-4 bg-secondary/50 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Hash" size={18} className="text-primary" />
                <span className="font-medium">{selectedTag}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          )}

          <div>
            {filteredPosts.map(post => (
              <article key={post.id} className="p-4 border-b border-border hover:bg-secondary/30 transition-colors">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-muted text-foreground">
                      {post.author.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{post.author.name}</span>
                      <span className="text-muted-foreground text-sm">{post.author.username}</span>
                      <span className="text-muted-foreground text-sm">·</span>
                      <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                    </div>

                    <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors"
                          onClick={() => setSelectedTag(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-muted-foreground">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 hover:text-red-500 transition-colors group ${
                          post.liked ? 'text-red-500' : ''
                        }`}
                      >
                        <Icon 
                          name="Heart" 
                          size={18} 
                          className={post.liked ? 'fill-current' : 'group-hover:scale-110 transition-transform'}
                        />
                        <span className="text-sm">{post.likes}</span>
                      </button>

                      <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                        <Icon name="MessageCircle" size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{post.comments}</span>
                      </button>

                      <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                        <Icon name="Share2" size={18} className="group-hover:scale-110 transition-transform" />
                      </button>

                      <button className="ml-auto flex items-center gap-2 hover:text-primary transition-colors">
                        <Icon name="Bookmark" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="w-80 p-4 space-y-4">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">ВЫ</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Ваш профиль</h3>
                <p className="text-muted-foreground text-sm">@your_username</p>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-primary">342</div>
                <div className="text-xs text-muted-foreground">Посты</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1.2K</div>
                <div className="text-xs text-muted-foreground">Подписчики</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">486</div>
                <div className="text-xs text-muted-foreground">Подписки</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Тренды</h3>
              <Icon name="TrendingUp" size={18} className="text-primary" />
            </div>

            <div className="space-y-3">
              {trendingTags.map((item, index) => (
                <button
                  key={item.tag}
                  onClick={() => setSelectedTag(item.tag)}
                  className="w-full text-left p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">#{index + 1} · Тренд</span>
                  </div>
                  <div className="font-semibold text-foreground">#{item.tag}</div>
                  <div className="text-xs text-muted-foreground">{item.count.toLocaleString('ru-RU')} постов</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <h3 className="font-semibold mb-3">Рекомендуемые теги</h3>
            <div className="flex flex-wrap gap-2">
              {['react', 'typescript', 'css', 'backend', 'frontend', 'ai'].map(tag => (
                <Badge 
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
