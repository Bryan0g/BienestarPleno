import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { 
  Bell, 
  Heart, 
  Sparkles, 
  Sun, 
  Moon,
  Flower,
  Coffee,
  X
} from "lucide-react";

interface WellnessNotification {
  id: string;
  message: string;
  icon: any;
  type: 'reminder' | 'encouragement' | 'tip';
  timestamp: string;
}

interface WellnessNotificationsProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

const wellnessMessages = [
  {
    id: '1',
    message: 'Es un hermoso día para hacer yoga. ¿Qué tal si dedicas 10 minutos a estirar tu cuerpo?',
    icon: Flower,
    type: 'reminder' as const,
    timestamp: 'hace 2 horas'
  },
  {
    id: '2',
    message: 'Recuerda tomar un respiro profundo. Tu bienestar mental es importante para nosotros.',
    icon: Heart,
    type: 'encouragement' as const,
    timestamp: 'hace 4 horas'
  },
  {
    id: '3',
    message: '¿Sabías que 5 minutos de meditación pueden mejorar tu concentración? ¡Inténtalo ahora!',
    icon: Sparkles,
    type: 'tip' as const,
    timestamp: 'hace 6 horas'
  },
  {
    id: '4',
    message: 'Tu sonrisa puede iluminar el día de alguien más. Comparte algo positivo en la comunidad.',
    icon: Sun,
    type: 'encouragement' as const,
    timestamp: 'hace 8 horas'
  },
  {
    id: '5',
    message: 'La hora perfecta para una pausa mindful. Observa tu respiración por unos momentos.',
    icon: Coffee,
    type: 'reminder' as const,
    timestamp: 'hace 1 día'
  }
];

export function WellnessNotifications({ isAuthenticated, userEmail }: WellnessNotificationsProps) {
  const [notifications, setNotifications] = useState<WellnessNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      setNotifications(wellnessMessages);
      setUnreadCount(3); // Simulamos 3 notificaciones no leídas
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIconComponent = (IconComponent: any) => {
    return <IconComponent className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'encouragement':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'tip':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Cuidado Personal</h3>
          <p className="text-sm text-muted-foreground">
            Mensajes especiales para tu bienestar
          </p>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b last:border-b-0 hover:bg-accent/50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900">
                    {getIconComponent(notification.icon)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeColor(notification.type)}`}
                      >
                        {notification.type === 'reminder' && 'Recordatorio'}
                        {notification.type === 'encouragement' && 'Ánimo'}
                        {notification.type === 'tip' && 'Consejo'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No tienes notificaciones nuevas
              </p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t bg-accent/20">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => {
                setNotifications([]);
                setUnreadCount(0);
              }}
            >
              Marcar todas como leídas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}