import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { PostCard } from "./components/PostCard";
import { CreatePostModal } from "./components/CreatePostModal";
import { StressTestModal } from "./components/StressTestModal";
import { UserProfile } from "./components/UserProfile";
import { ReportModal } from "./components/ReportModal";
import { AuthPromptModal } from "./components/AuthPromptModal";
import { CommentsModal } from "./components/CommentsModal";
import { ExerciseRoutines } from "./components/ExerciseRoutines";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import {
  TrendingUp,
  Clock,
  Star,
  Dumbbell,
  Play,
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<
    string | undefined
  >(undefined);
  const [currentView, setCurrentView] = useState<
    "feed" | "profile" | "routines"
  >("feed");
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(
    new Set(),
  );

  // Comentarios para posts específicos
  const [postComments, setPostComments] = useState<
    Record<string, Comment[]>
  >({
    "5": [
      // Post "Técnica del grounding 5-4-3-2-1 para ataques de pánico"
      {
        id: "c1",
        author: "mindful_maria",
        content:
          "Esta técnica me ha salvado literalmente en tantas ocasiones. La recomiendo a todos mis amigos que sufren de ansiedad. Es increíble cómo algo tan simple puede ser tan efectivo.",
        timeAgo: "hace 3 horas",
        votes: 24,
      },
      {
        id: "c2",
        author: "anxiety_warrior",
        content:
          "Yo uso una versión similar pero con 4-3-2-1 (sin el gusto). Me funciona perfecto especialmente en espacios públicos donde no puedo saborear nada fácilmente.",
        timeAgo: "hace 5 horas",
        votes: 18,
      },
      {
        id: "c3",
        author: "therapy_student",
        content:
          "En mi curso de psicología nos enseñaron esta técnica. Es parte de las terapias de mindfulness y grounding. Muy recomendada por profesionales de la salud mental.",
        timeAgo: "hace 8 horas",
        votes: 31,
      },
    ],
  });
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Técnica de respiración 4-7-8 que cambió mi vida",
      content:
        "Hace 6 meses estaba experimentando niveles altos de ansiedad. Un amigo me recomendó la técnica 4-7-8 y desde entonces la practico todas las noches antes de dormir. Inhala por 4 segundos, mantén por 7, exhala por 8. Los resultados han sido increíbles para mi calidad de sueño y nivel de estrés general.",
      author: "mindful_ana",
      category: "Respiración",
      votes: 127,
      comments: 23,
      timeAgo: "hace 2 horas",
      image:
        "https://images.unsplash.com/photo-1716284129276-c84a6b77325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhdGhpbmclMjBleGVyY2lzZXN8ZW58MXx8fHwxNzU2NDIxMzMwfDA&ixlib=rb-4.0.3&q=80&w=1080",
      tags: ["ansiedad", "sueño", "respiración", "noche"],
    },
    {
      id: "1b",
      title:
        "Mi experiencia con la meditación matutina - 6 meses después",
      content:
        "Hola comunidad! Quería compartir mi progreso después de 6 meses practicando meditación matutina. Empecé con solo 5 minutos y ahora medito 20 minutos cada mañana. Los beneficios han sido increíbles: mejor concentración, menos ansiedad, y una sensación general de paz interior. ¡Altamente recomendado para comenzar el día!",
      author: "usuario",
      category: "Meditación",
      votes: 45,
      comments: 8,
      timeAgo: "hace 1 día",
      image:
        "https://images.unsplash.com/photo-1627586718259-20c7fc926a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBtb3JuaW5nfGVufDF8fHx8MTc1ODI2NDQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["meditación", "rutina", "mañana", "progreso"],
      isPrivate: false,
    },
    {
      id: "2",
      title: "Mi rutina matutina de meditación de 10 minutos",
      content:
        "Durante el último año he mantenido una rutina matutina de meditación de solo 10 minutos y ha transformado completamente cómo manejo el estrés diario. Uso la app Headspace, pero cualquier app de meditación guiada funciona. La clave es la consistencia, no la duración.",
      author: "calm_carlos",
      category: "Meditación",
      votes: 89,
      comments: 15,
      timeAgo: "hace 4 horas",
      image:
        "https://images.unsplash.com/photo-1532433487260-0bd826defd7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwc3RyZXNzJTIwcmVsaWVmfGVufDF8fHx8MTc1NjQyMTMyOXww&ixlib=rb-4.0.3&q=80&w=1080",
      tags: ["mañana", "rutina", "headspace", "consistencia"],
    },
    {
      id: "3",
      title:
        "Ejercicios de yoga para liberar tensión en el cuello y hombros",
      content:
        "Para todos los que trabajan en computadora: estos 5 ejercicios de yoga me han salvado del dolor crónico de cuello. Los hago cada 2 horas durante mi jornada laboral. Rotaciones de cuello, estiramientos de hombros, y la postura del gato-vaca son especialmente efectivos.",
      author: "yoga_warrior",
      category: "Ejercicio",
      votes: 156,
      comments: 31,
      timeAgo: "hace 6 horas",
      image:
        "https://images.unsplash.com/photo-1672233414280-025944497125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcmVsYXhhdGlvbnxlbnwxfHx8fDE3NTY0MjEzMjl8MA&ixlib=rb-4.0.3&q=80&w=1080",
      tags: ["oficina", "cuello", "hombros", "estiramientos"],
    },
    {
      id: "4",
      title: "Cómo encontré al terapeuta perfecto para mí",
      content:
        "Después de 3 intentos fallidos, finalmente encontré un terapeuta con quien realmente conecto. Mi consejo: no te conformes con el primero. Es importante la química personal y que se especialice en tu área de necesidad. Para ansiedad, busquen terapeutas CBT especializados.",
      author: "therapy_advocate",
      category: "Terapia",
      votes: 78,
      comments: 19,
      timeAgo: "hace 8 horas",
      tags: ["CBT", "ansiedad", "búsqueda", "compatibilidad"],
    },
    {
      id: "5",
      title:
        "Técnica del grounding 5-4-3-2-1 para ataques de pánico",
      content:
        "Esta técnica me ha funcionado increíblemente bien durante ataques de pánico: 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes escuchar, 2 que puedes oler, 1 que puedes saborear. Te ayuda a conectar con el presente y salir del espiral de pánico.",
      author: "panic_survivor",
      category: "Técnicas",
      votes: 203,
      comments: 3,
      timeAgo: "hace 12 horas",
      tags: ["pánico", "grounding", "presente", "sentidos"],
    },
  ]);

  const [selectedCategory, setSelectedCategory] =
    useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);
  const [isStressTestOpen, setIsStressTestOpen] =
    useState(false);
  const [isReportModalOpen, setIsReportModalOpen] =
    useState(false);
  const [reportingPostId, setReportingPostId] =
    useState<string>("");
  const [reportingPostTitle, setReportingPostTitle] =
    useState<string>("");
  const [sortBy, setSortBy] = useState<
    "popular" | "recent" | "trending"
  >("popular");
  const [isAuthPromptOpen, setIsAuthPromptOpen] =
    useState(false);
  const [authPromptAction, setAuthPromptAction] =
    useState<string>("");
  const [isCommentsModalOpen, setIsCommentsModalOpen] =
    useState(false);
  const [selectedPostId, setSelectedPostId] =
    useState<string>("");
  const [selectedPostTitle, setSelectedPostTitle] =
    useState<string>("");

  // Posts del usuario actual
  const userPosts = useMemo(() => {
    if (!userEmail) return [];
    const username = userEmail.split("@")[0];
    return posts.filter((post) => post.author === username);
  }, [posts, userEmail]);

  // Posts guardados
  const savedPosts = useMemo(() => {
    return posts.filter((post) => savedPostIds.has(post.id));
  }, [posts, savedPostIds]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filtrar por categoría
    if (selectedCategory !== "Todas") {
      filtered = filtered.filter(
        (post) => post.category === selectedCategory,
      );
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(query),
          ) ||
          post.author.toLowerCase().includes(query),
      );
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.votes - a.votes;
        case "recent":
          // Simulamos ordenamiento por fecha más reciente
          return a.timeAgo.localeCompare(b.timeAgo);
        case "trending":
          // Simulamos trending como combinación de votos y comentarios recientes
          const scoreA = a.votes + a.comments * 2;
          const scoreB = b.votes + b.comments * 2;
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    return sorted;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const handleVote = (
    postId: string,
    direction: "up" | "down",
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              votes: post.votes + (direction === "up" ? 1 : -1),
            }
          : post,
      ),
    );
  };

  const handleComment = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPostId(postId);
      setSelectedPostTitle(post.title);
      setIsCommentsModalOpen(true);
    }
  };

  const handleAuthPrompt = (action: string) => {
    setAuthPromptAction(action);
    setIsAuthPromptOpen(true);
  };

  const handleAddComment = (content: string) => {
    if (!isAuthenticated || !userEmail) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: userEmail.split("@")[0],
      content,
      timeAgo: "hace unos segundos",
      votes: 1,
    };

    setPostComments((prev) => ({
      ...prev,
      [selectedPostId]: [
        ...(prev[selectedPostId] || []),
        newComment,
      ],
    }));

    // Actualizar el contador de comentarios en el post
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedPostId
          ? { ...post, comments: post.comments + 1 }
          : post,
      ),
    );
  };

  const handleVoteComment = (
    commentId: string,
    direction: "up" | "down",
  ) => {
    if (!isAuthenticated) return;

    setPostComments((prev) => ({
      ...prev,
      [selectedPostId]: (prev[selectedPostId] || []).map(
        (comment) =>
          comment.id === commentId
            ? {
                ...comment,
                votes:
                  comment.votes + (direction === "up" ? 1 : -1),
              }
            : comment,
      ),
    }));
  };

  const handleBookmark = (postId: string) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para guardar posts");
      return;
    }

    setSavedPostIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleCreatePost = (newPostData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image?: string;
  }) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para crear un post");
      return;
    }

    const newPost: Post = {
      id: (posts.length + 1).toString(),
      ...newPostData,
      author: userEmail ? userEmail.split("@")[0] : "usuario",
      votes: 1,
      comments: 0,
      timeAgo: "hace unos segundos",
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    // Simulate login - in real app this would call an API
    console.log("Login attempt:", { email, password });
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleGoogleLogin = async () => {
    // Simulate Google login
    console.log("Google login attempt");
    setIsAuthenticated(true);
    setUserEmail("usuario@gmail.com");
  };

  const handleRegister = async (
    email: string,
    password: string,
    confirmPassword: string,
    name?: string,
    birthDate?: string,
    country?: string,
  ) => {
    // Simulate registration
    console.log("Registration attempt:", {
      email,
      password,
      confirmPassword,
      name,
      birthDate,
      country,
    });
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleReport = (postId: string) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para reportar publicaciones");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (post) {
      setReportingPostId(postId);
      setReportingPostTitle(post.title);
      setIsReportModalOpen(true);
    }
  };

  const handleSubmitReport = async (
    postId: string,
    reason: string,
    details: string,
  ) => {
    // Simulate report submission
    console.log("Report submitted:", {
      postId,
      reason,
      details,
      reporter: userEmail,
    });
    alert(
      "Gracias por tu reporte. Nuestro equipo lo revisará pronto.",
    );
    setIsReportModalOpen(false);
    setReportingPostId("");
    setReportingPostTitle("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(undefined);
    setCurrentView("feed");
    setSavedPostIds(new Set());
  };

  const handleTogglePostPrivacy = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, isPrivate: !post.isPrivate }
          : post,
      ),
    );
  };

  const handleToggleSavedPostPrivacy = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId && savedPostIds.has(postId)) {
          return { ...post, isPrivate: !post.isPrivate };
        }
        return post;
      }),
    );
  };

  const getSortButtonVariant = (sort: typeof sortBy) => {
    return sortBy === sort ? "default" : "ghost";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={setSearchQuery}
        onCreatePost={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onGoToProfile={() => setCurrentView("profile")}
      />

      <div className="container mx-auto px-4 py-6">
        {currentView === "routines" ? (
          // Vista de rutinas de ejercicio
          <ExerciseRoutines
            onBack={() => setCurrentView("feed")}
          />
        ) : currentView === "profile" ? (
          // Vista del perfil
          isAuthenticated && userEmail ? (
            <UserProfile
              userEmail={userEmail}
              onBack={() => setCurrentView("feed")}
              userPosts={userPosts}
              savedPosts={savedPosts}
              onVote={handleVote}
              onComment={handleComment}
              onTogglePostPrivacy={handleTogglePostPrivacy}
              onToggleSavedPostPrivacy={
                handleToggleSavedPostPrivacy
              }
              onReport={handleReport}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Debes iniciar sesión para ver tu perfil
              </p>
              <Button
                className="mt-4"
                onClick={() => setCurrentView("feed")}
              >
                Volver al Feed
              </Button>
            </div>
          )
        ) : (
          // Vista del feed principal
          <div className="flex gap-6">
            {/* Sidebar */}
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onOpenStressTest={() => {
                if (!isAuthenticated) {
                  alert(
                    "Debes iniciar sesión para realizar el test de estrés",
                  );
                  return;
                }
                setIsStressTestOpen(true);
              }}
              onOpenRoutines={() => setCurrentView("routines")}
              isAuthenticated={isAuthenticated}
            />

            {/* Contenido principal */}
            <div className="flex-1 space-y-6">
              {/* Header del feed */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedCategory === "Todas"
                          ? "Todos los Posts"
                          : selectedCategory}
                        <Badge variant="outline">
                          {filteredAndSortedPosts.length} posts
                        </Badge>
                      </CardTitle>
                      {searchQuery && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Resultados para "{searchQuery}"
                        </p>
                      )}
                    </div>

                    {/* Botones de ordenamiento */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={getSortButtonVariant(
                          "popular",
                        )}
                        size="sm"
                        onClick={() => setSortBy("popular")}
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3" />
                        Popular
                      </Button>
                      <Button
                        variant={getSortButtonVariant("recent")}
                        size="sm"
                        onClick={() => setSortBy("recent")}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        Reciente
                      </Button>
                      <Button
                        variant={getSortButtonVariant(
                          "trending",
                        )}
                        size="sm"
                        onClick={() => setSortBy("trending")}
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Lista de posts */}
              <div className="space-y-4">
                {/* Post destacado de rutinas de ejercicio - solo en categoría Ejercicio */}
                {selectedCategory === "Ejercicio" && (
                  <Card className="overflow-hidden border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVyY2lzZSUyMHN0cmV0Y2glMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NjA1OTEwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Rutinas de ejercicio y yoga"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 hover:bg-green-700">
                          ✨ Destacado
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-green-600">
                          <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl mb-2">
                            Rutinas Guiadas de Ejercicio, Yoga y
                            Pilates
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Accede a nuestra colección de
                            rutinas paso a paso con animaciones
                            interactivas. Incluye yoga, pilates,
                            estiramientos de oficina y
                            ejercicios de respiración con
                            diferentes niveles de dificultad.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-black/20"
                            >
                              🧘 Yoga
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-black/20"
                            >
                              🏋️ Pilates
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-black/20"
                            >
                              💪 Estiramientos
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-black/20"
                            >
                              🌬️ Respiración
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-black/20"
                            >
                              ⏱️ 8-22 minutos
                            </Badge>
                          </div>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            size="lg"
                            onClick={() =>
                              setCurrentView("routines")
                            }
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Explorar Rutinas
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {filteredAndSortedPosts.length > 0 ? (
                  filteredAndSortedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onVote={handleVote}
                      onComment={handleComment}
                      onBookmark={handleBookmark}
                      isBookmarked={savedPostIds.has(post.id)}
                      onReport={handleReport}
                      isAuthenticated={isAuthenticated}
                      onAuthPrompt={handleAuthPrompt}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? `No se encontraron posts que coincidan con "${searchQuery}"`
                          : "No hay posts en esta categoría aún"}
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          if (!isAuthenticated) {
                            alert(
                              "Debes iniciar sesión para crear un post",
                            );
                            return;
                          }
                          setIsCreateModalOpen(true);
                        }}
                      >
                        ¡Sé el primero en publicar!
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Paginación simulada */}
              {filteredAndSortedPosts.length > 0 && (
                <Card>
                  <CardContent className="text-center py-4">
                    <Button variant="outline">
                      Cargar más posts
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de crear post */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Modal de test de estrés */}
      <StressTestModal
        isOpen={isStressTestOpen}
        onClose={() => setIsStressTestOpen(false)}
        isAuthenticated={isAuthenticated}
      />

      {/* Modal de reporte */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        postId={reportingPostId}
        postTitle={reportingPostTitle}
        onSubmit={handleSubmitReport}
      />

      {/* Modal de prompt de autenticación */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        onOpenLogin={() => {
          // Aquí se abriría el modal de login del Header
          setIsAuthPromptOpen(false);
          const loginButton = document.querySelector(
            "[data-login-trigger]",
          ) as HTMLButtonElement;
          loginButton?.click();
        }}
        action={authPromptAction}
      />

      {/* Modal de comentarios */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        postTitle={selectedPostTitle}
        comments={postComments[selectedPostId] || []}
        isAuthenticated={isAuthenticated}
        onAddComment={handleAddComment}
        onVoteComment={handleVoteComment}
        onOpenLogin={() => {
          setIsCommentsModalOpen(false);
          const loginButton = document.querySelector(
            "[data-login-trigger]",
          ) as HTMLButtonElement;
          loginButton?.click();
        }}
      />
    </div>
  );
}