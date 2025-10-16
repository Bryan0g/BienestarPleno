import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  User,
  Calendar,
  Globe
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onRegister: (email: string, password: string, confirmPassword: string, name?: string, birthDate?: string, country?: string) => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password';

export function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onGoogleLogin,
  onRegister 
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        await onRegister(email, password, confirmPassword, name, birthDate, country);
      } else if (mode === 'forgot-password') {
        // Simulate forgot password
        alert(`Se ha enviado un correo de recuperación a ${email}`);
        setMode('login');
      }
      
      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setBirthDate("");
      setCountry("");
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await onGoogleLogin();
      onClose();
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Iniciar Sesión';
      case 'register':
        return 'Crear Cuenta';
      case 'forgot-password':
        return 'Recuperar Contraseña';
      default:
        return 'Autenticación';
    }
  };

  const getSubmitText = () => {
    switch (mode) {
      case 'login':
        return 'Iniciar Sesión';
      case 'register':
        return 'Crear Cuenta';
      case 'forgot-password':
        return 'Enviar Correo';
      default:
        return 'Continuar';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {mode !== 'login' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('login')}
                className="p-1 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>{getTitle()}</DialogTitle>
          </div>
          <DialogDescription>
            {mode === 'login' && 'Accede a tu cuenta para participar en la comunidad de bienestar.'}
            {mode === 'register' && 'Únete a nuestra comunidad y comparte tu experiencia en el manejo del estrés.'}
            {mode === 'forgot-password' && 'Ingresa tu correo electrónico para recibir instrucciones de recuperación.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Google Login */}
          {mode === 'login' && (
            <>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O continúa con
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - Only for register */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot-password' && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            {/* Confirm Password for Register */}
            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={country} onValueChange={setCountry} required>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Selecciona tu país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AR">Argentina</SelectItem>
                        <SelectItem value="BO">Bolivia</SelectItem>
                        <SelectItem value="CL">Chile</SelectItem>
                        <SelectItem value="CO">Colombia</SelectItem>
                        <SelectItem value="CR">Costa Rica</SelectItem>
                        <SelectItem value="CU">Cuba</SelectItem>
                        <SelectItem value="EC">Ecuador</SelectItem>
                        <SelectItem value="SV">El Salvador</SelectItem>
                        <SelectItem value="ES">España</SelectItem>
                        <SelectItem value="GT">Guatemala</SelectItem>
                        <SelectItem value="HN">Honduras</SelectItem>
                        <SelectItem value="MX">México</SelectItem>
                        <SelectItem value="NI">Nicaragua</SelectItem>
                        <SelectItem value="PA">Panamá</SelectItem>
                        <SelectItem value="PY">Paraguay</SelectItem>
                        <SelectItem value="PE">Perú</SelectItem>
                        <SelectItem value="PR">Puerto Rico</SelectItem>
                        <SelectItem value="DO">República Dominicana</SelectItem>
                        <SelectItem value="UY">Uruguay</SelectItem>
                        <SelectItem value="VE">Venezuela</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email.trim() || (mode !== 'forgot-password' && !password.trim())}
            >
              {isLoading ? 'Cargando...' : getSubmitText()}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="space-y-3 text-center text-sm">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <div>
                  <span className="text-muted-foreground">¿No tienes cuenta? </span>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-primary hover:underline"
                  >
                    Regístrate
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div>
                <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline"
                >
                  Inicia sesión
                </button>
              </div>
            )}

            {mode === 'forgot-password' && (
              <p className="text-muted-foreground text-xs">
                Te enviaremos un correo con instrucciones para restablecer tu contraseña.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}