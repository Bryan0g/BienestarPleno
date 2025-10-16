import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { PostCard } from "./PostCard";
import { 
  User, 
  Settings, 
  Calendar,
  Mail,
  MapPin,
  Edit,
  Save,
  X,
  Lock,
  Globe,
  Bookmark,
  ArrowLeft,
  Share2,
  Eye,
  EyeOff
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
  isPrivate?: boolean;
  isShared?: boolean;
  originalAuthor?: string;
}

interface UserProfileProps {
  userEmail: string;
  onBack: () => void;
  userPosts: Post[];
  savedPosts: Post[];
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onComment: (postId: string) => void;
  onTogglePostPrivacy: (postId: string) => void;
  onToggleSavedPostPrivacy: (postId: string) => void;
  onReport?: (postId: string) => void;
}

interface UserInfo {
  name: string;
  email: string;
  bio: string;
  location: string;
  joinDate: string;
  avatar: string;
  postsCount: number;
  savedCount: number;
  karmaPoints: number;
}

export function UserProfile({ 
  userEmail, 
  onBack, 
  userPosts, 
  savedPosts, 
  onVote, 
  onComment,
  onTogglePostPrivacy,
  onToggleSavedPostPrivacy,
  onReport
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Información del usuario simulada
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: userEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
    email: userEmail,
    bio: "Apasionado por el bienestar mental y técnicas de manejo del estrés. Compartiendo mi experiencia para ayudar a otros en su camino hacia una vida más equilibrada.",
    location: "Madrid, España",
    joinDate: "Enero 2024",
    avatar: "",
    postsCount: userPosts.length,
    savedCount: savedPosts.length,
    karmaPoints: userPosts.reduce((total, post) => total + post.votes, 0)
  });

  const [editForm, setEditForm] = useState(userInfo);

  const handleSaveProfile = () => {
    setUserInfo(editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(userInfo);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  const publicPosts = userPosts.filter(post => !post.isPrivate);
  const privatePosts = userPosts.filter(post => post.isPrivate);
  const publicSavedPosts = savedPosts.filter(post => !post.isPrivate);
  const privateSavedPosts = savedPosts.filter(post => post.isPrivate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Feed
        </Button>
      </div>

      {/* Información del perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userInfo.avatar} />
                <AvatarFallback className="text-lg">
                  {getInitials(userInfo.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                {!isEditing ? (
                  <>
                    <h1 className="text-2xl font-semibold">{userInfo.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {userInfo.email}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {userInfo.location}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {userInfo.joinDate}
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Nombre"
                    />
                    <Input
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      placeholder="Ubicación"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!isEditing ? (
            <p className="text-muted-foreground">{userInfo.bio}</p>
          ) : (
            <Textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
              placeholder="Biografía"
              rows={3}
            />
          )}

          <Separator className="my-4" />

          {/* Estadísticas */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-semibold">{userInfo.postsCount}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{userInfo.savedCount}</p>
              <p className="text-sm text-muted-foreground">Guardados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{userInfo.karmaPoints}</p>
              <p className="text-sm text-muted-foreground">Karma</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido con tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mis Posts ({userInfo.postsCount})
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Guardados ({userInfo.savedCount})
          </TabsTrigger>
        </TabsList>

        {/* Tab de Posts del Usuario */}
        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mis Publicaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Públicos: {publicPosts.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    Privados: {privatePosts.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={post.isPrivate ? "secondary" : "outline"}>
                            {post.isPrivate ? (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Privado
                              </>
                            ) : (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Público
                              </>
                            )}
                          </Badge>
                          {post.isShared && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Share2 className="h-3 w-3" />
                              Compartido
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTogglePostPrivacy(post.id)}
                          className="flex items-center gap-2"
                        >
                          {post.isPrivate ? (
                            <>
                              <Eye className="h-4 w-4" />
                              Hacer público
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Hacer privado
                            </>
                          )}
                        </Button>
                      </div>
                      <PostCard
                        post={post}
                        onVote={onVote}
                        onComment={onComment}
                        onReport={onReport}
                        isAuthenticated={true}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No has creado ningún post aún</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Posts Guardados */}
        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Posts Guardados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Públicos: {publicSavedPosts.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    Privados: {privateSavedPosts.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {savedPosts.length > 0 ? (
                  savedPosts.map((post) => (
                    <div key={post.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={post.isPrivate ? "secondary" : "outline"}>
                            {post.isPrivate ? (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Guardado privado
                              </>
                            ) : (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Guardado público
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline">
                            <Bookmark className="h-3 w-3 mr-1" />
                            Guardado
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleSavedPostPrivacy(post.id)}
                          className="flex items-center gap-2"
                        >
                          {post.isPrivate ? (
                            <>
                              <Eye className="h-4 w-4" />
                              Hacer público
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Hacer privado
                            </>
                          )}
                        </Button>
                      </div>
                      <PostCard
                        post={post}
                        onVote={onVote}
                        onComment={onComment}
                        onReport={onReport}
                        isAuthenticated={true}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tienes posts guardados aún</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}