import { useState } from 'react';
import { User } from '@/components/extensions/auth-email/useAuth';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FeedProps {
  user: User;
}

interface Post {
  id: number;
  author: {
    id: number;
    name: string;
    username: string;
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
    author: { id: 2, name: 'Анна Смирнова', username: 'anna_dev' },
    content: 'Только что закончила работу над новым проектом! Невероятно горжусь результатом 🚀',
    tags: ['веб-разработка', 'проект', 'дизайн'],
    likes: 124,
    comments: 18,
    timestamp: '2ч назад',
    liked: false
  },
  {
    id: 2,
    author: { id: 3, name: 'Максим Петров', username: 'max_code' },
    content: 'Кто-нибудь работал с новым API? Поделитесь опытом, пожалуйста',
    tags: ['программирование', 'api', 'помощь'],
    likes: 67,
    comments: 24,
    timestamp: '4ч назад',
    liked: true
  }
];

export default function Feed({ user }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const createPost = () => {
    if (!newPostContent.trim()) return;

    const tags = newPostTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const newPost: Post = {
      id: posts.length + 1,
      author: {
        id: user.id,
        name: user.name || 'Пользователь',
        username: user.email.split('@')[0]
      },
      content: newPostContent,
      tags,
      likes: 0,
      comments: 0,
      timestamp: 'только что',
      liked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostTags('');
    setShowCreatePost(false);
  };

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-xl font-semibold">Лента</h2>
      </div>

      <div className="p-4 border-b border-border">
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogTrigger asChild>
            <div className="flex gap-3 cursor-pointer">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Что нового?" 
                className="flex-1 bg-secondary border-0 cursor-pointer"
                readOnly
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать пост</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="О чём думаете?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-32"
              />
              <Input
                placeholder="Теги через запятую (дизайн, код, мысли)"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
              />
              <Button onClick={createPost} className="w-full">
                <Icon name="Send" size={18} className="mr-2" />
                Опубликовать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {selectedTag ? `Нет постов с тегом #${selectedTag}` : 'Нет постов'}
          </div>
        ) : (
          filteredPosts.map(post => (
            <article key={post.id} className="p-4 border-b border-border hover:bg-secondary/30 transition-colors">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-muted text-foreground">
                    {post.author.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{post.author.name}</span>
                    <span className="text-muted-foreground text-sm">@{post.author.username}</span>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                  </div>

                  <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>

                  {post.tags.length > 0 && (
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
                  )}

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
          ))
        )}
      </div>
    </div>
  );
}
