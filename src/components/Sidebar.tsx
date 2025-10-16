import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Phone, 
  ExternalLink,
  Sparkles,
  ClipboardList
} from "lucide-react";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onOpenStressTest?: () => void;
  onOpenRoutines?: () => void;
  isAuthenticated: boolean;
}

export function Sidebar({ selectedCategory, onCategoryChange, onOpenStressTest, onOpenRoutines, isAuthenticated }: SidebarProps) {
  const categories = [
    { name: "Todas", icon: Sparkles, count: 245, color: "text-purple-600" },
    { name: "Meditación", icon: Brain, count: 89, color: "text-purple-600" },
    { name: "Ejercicio", icon: Activity, count: 67, color: "text-green-600" },
    { name: "Terapia", icon: Heart, count: 43, color: "text-blue-600" },
    { name: "Técnicas", icon: Users, count: 32, color: "text-orange-600" },
    { name: "Respiración", icon: Activity, count: 28, color: "text-cyan-600" }
  ];

  const emergencyResources = [
    { name: "Línea Nacional de Prevención del Suicidio", phone: "988", available: "24/7" },
    { name: "Crisis Text Line", phone: "741741", available: "24/7" },
    { name: "SAMHSA National Helpline", phone: "1-800-662-4357", available: "24/7" }
  ];

  const tips = [
    "Practica respiración profunda por 5 minutos al día",
    "Mantén un horario de sueño regular",
    "Limita la cafeína después de las 2 PM",
    "Dedica tiempo a actividades que disfrutes",
    "Conecta con amigos y familia regularmente"
  ];

  return (
    <div className="w-80 space-y-6">
      {/* Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Categorías
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "secondary" : "ghost"}
                className="w-full justify-between h-auto py-3"
                onClick={() => onCategoryChange(category.name)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4 w-4 ${category.color}`} />
                  <span>{category.name}</span>
                </div>
                <Badge variant="outline">{category.count}</Badge>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Rutinas de Ejercicio Destacadas */}
      <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Activity className="h-5 w-5" />
            Rutinas Guiadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Explora rutinas de yoga, estiramientos y respiración con instrucciones paso a paso.
          </p>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onOpenRoutines}
          >
            <Activity className="h-4 w-4 mr-2" />
            Ver Rutinas
          </Button>
        </CardContent>
      </Card>

      {/* Test de Estrés Especial */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <ClipboardList className="h-5 w-5" />
            Evaluación Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Realiza un test personalizado para evaluar tu nivel de estrés y recibe recomendaciones específicas.
          </p>
          {!isAuthenticated && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-3 p-2 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
              💡 Inicia sesión para acceder al test personalizado
            </p>
          )}
          <Button 
            className={`w-full ${isAuthenticated 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
            }`}
            onClick={onOpenStressTest}
            disabled={!isAuthenticated}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            {isAuthenticated ? 'Realizar Test de Estrés' : 'Inicia Sesión para el Test'}
          </Button>
        </CardContent>
      </Card>

      {/* Recursos de Emergencia */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Phone className="h-5 w-5" />
            Recursos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyResources.map((resource, index) => (
            <div key={index} className="space-y-1">
              <p className="font-medium text-sm">{resource.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-mono text-red-600 dark:text-red-400">{resource.phone}</p>
                <Badge variant="outline" className="text-xs">{resource.available}</Badge>
              </div>
              {index < emergencyResources.length - 1 && <Separator className="mt-2" />}
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-3">
            <ExternalLink className="h-3 w-3 mr-2" />
            Más recursos
          </Button>
        </CardContent>
      </Card>

      {/* Tips Diarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Tips Diarios para el Bienestar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Estadísticas de la Comunidad */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de la Comunidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Miembros activos</span>
            <span className="font-medium">12,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts esta semana</span>
            <span className="font-medium">156</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comentarios hoy</span>
            <span className="font-medium">324</span>
          </div>
          <Separator />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              🌟 ¡Juntos somos más fuertes! 🌟
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}