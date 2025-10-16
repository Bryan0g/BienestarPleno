import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { 
  MessageCircle, 
  ArrowUp, 
  ArrowDown, 
  Send,
  Clock,
  Heart
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timeAgo: string;
  votes: number;
  replies?: Comment[];
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  comments: Comment[];
  isAuthenticated: boolean;
  onAddComment?: (content: string) => void;
  onVoteComment?: (commentId: string, direction: 'up' | 'down') => void;
  onOpenLogin?: () => void;
}

export function CommentsModal({ 
  isOpen, 
  onClose, 
  postTitle, 
  comments,
  isAuthenticated,
  onAddComment,
  onVoteComment,
  onOpenLogin
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});

  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      onOpenLogin?.();
      return;
    }
    
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment("");
    }
  };

  const handleVoteComment = (commentId: string, direction: 'up' | 'down') => {
    if (!isAuthenticated) {
      onOpenLogin?.();
      return;
    }

    const currentVote = userVotes[commentId];
    if (currentVote === direction) {
      // Remove vote
      const newVotes = { ...userVotes };
      delete newVotes[commentId];
      setUserVotes(newVotes);
    } else {
      // Add or change vote
      setUserVotes(prev => ({ ...prev, [commentId]: direction }));
    }
    
    onVoteComment?.(commentId, direction);
  };

  const CommentCard = ({ comment }: { comment: Comment }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.authorAvatar} />
            <AvatarFallback>{comment.author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {comment.timeAgo}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{comment.content}</p>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteComment(comment.id, 'up')}
                  className={`p-1 h-auto ${userVotes[comment.id] === 'up' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' : ''}`}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <span className="text-xs font-medium">{comment.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteComment(comment.id, 'down')}
                  className={`p-1 h-auto ${userVotes[comment.id] === 'down' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : ''}`}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="text-xs">
                  <Heart className="h-3 w-3 mr-1" />
                  Responder
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentarios
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {postTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Comentarios existentes */}
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No hay comentarios aún</p>
                <p className="text-sm text-muted-foreground">¡Sé el primero en comentar!</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Área para nuevo comentario */}
        <div className="space-y-3">
          {isAuthenticated ? (
            <>
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Sé respetuoso y constructivo en tus comentarios
                </p>
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Comentar
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Inicia sesión para participar en la conversación
              </p>
              <Button onClick={onOpenLogin} size="sm">
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}