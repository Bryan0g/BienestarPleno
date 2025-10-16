import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Clock,
  MoreHorizontal,
  Flag
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  votes: number;
  comments: number;
  timeAgo: string;
  image?: string;
  tags: string[];
}

interface PostCardProps {
  post: Post;
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onComment: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  isBookmarked?: boolean;
  onReport?: (postId: string) => void;
  isAuthenticated?: boolean;
  onAuthPrompt?: (action: string) => void;
}

export function PostCard({ post, onVote, onComment, onBookmark, isBookmarked = false, onReport, isAuthenticated = false, onAuthPrompt }: PostCardProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleVote = (direction: 'up' | 'down') => {
    if (!isAuthenticated) {
      onAuthPrompt?.(`${direction === 'up' ? 'dar me gusta' : 'dar no me gusta'} a este post`);
      return;
    }
    
    if (userVote === direction) {
      setUserVote(null);
    } else {
      setUserVote(direction);
    }
    onVote(post.id, direction);
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      onAuthPrompt?.('guardar este post');
      return;
    }
    
    setBookmarked(!bookmarked);
    onBookmark?.(post.id);
  };

  const handleShare = () => {
    if (!isAuthenticated) {
      onAuthPrompt?.('compartir este post');
      return;
    }
    
    // Aquí se implementaría la funcionalidad de compartir
    console.log('Sharing post:', post.id);
  };

  const handleComment = () => {
    onComment(post.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Meditación': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Ejercicio': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Terapia': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Técnicas': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Respiración': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Mindfulness': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author}</span>
                <Badge className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.timeAgo}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="p-2"
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-blue-600' : ''}`} />
            </Button>

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => onReport?.(post.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Reportar publicación
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
          
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">{post.content}</p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={`p-2 ${userVote === 'up' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' : ''}`}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="mx-2 font-medium">{post.votes}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={`p-2 ${userVote === 'down' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : ''}`}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-4 w-4" />
                {post.comments}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}