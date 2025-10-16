import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AuthModal } from "./AuthModal";
import { WellnessNotifications } from "./WellnessNotifications";
import logoImage from 'figma:asset/5151e3b443f7e69e99d814f56a8a93c159a70e98.png';
import { 
  Search, 
  Plus, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Heart,
  Moon,
  Sun
} from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCreatePost: () => void;
  searchQuery: string;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onRegister: (email: string, password: string, confirmPassword: string, name?: string, birthDate?: string, country?: string) => void;
  onLogout: () => void;
  onGoToProfile?: () => void;
}

export function Header({ 
  onSearch, 
  onCreatePost, 
  searchQuery, 
  isAuthenticated,
  userEmail,
  onLogin,
  onGoogleLogin,
  onRegister,
  onLogout,
  onGoToProfile
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await onLogin(email, password);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await onGoogleLogin();
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string, name?: string, birthDate?: string, country?: string) => {
    try {
      await onRegister(email, password, confirmPassword, name, birthDate, country);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Bienestar Pleno Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Bienestar Pleno</h1>
              <p className="text-xs text-muted-foreground">Tu espacio de bienestar</p>
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar técnicas, consejos, experiencias..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Crear post */}
          <Button 
            onClick={() => {
              if (!isAuthenticated) {
                setIsAuthModalOpen(true);
                return;
              }
              onCreatePost();
            }} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Crear Post</span>
          </Button>

          {/* Notificaciones */}
          <WellnessNotifications 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
          />

          {/* Toggle tema */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Autenticación */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full border-0 bg-transparent p-0 hover:bg-accent focus:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>
                    {userEmail ? userEmail.slice(0, 2).toUpperCase() : 'TU'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Tu Usuario</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {userEmail || 'usuario@ejemplo.com'}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onGoToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              data-login-trigger
            >
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        onRegister={handleRegister}
      />
    </header>
  );
}