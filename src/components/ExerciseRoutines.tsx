import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  CheckCircle2,
  Heart,
  Dumbbell,
  Wind,
  Activity
} from "lucide-react";

interface Routine {
  id: string;
  name: string;
  duration: string;
  difficulty: "Fácil" | "Intermedio" | "Avanzado";
  type: "yoga" | "stretching" | "breathing" | "pilates";
  description: string;
  image: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  duration: number; // en segundos
  instructions: string[];
  benefits: string[];
  animation: "breathe" | "stretch-up" | "stretch-side" | "rotate" | "balance";
}

interface ExerciseRoutinesProps {
  onBack: () => void;
}

export function ExerciseRoutines({ onBack }: ExerciseRoutinesProps) {
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const routines: Routine[] = [
    {
      id: "yoga-basic",
      name: "Yoga para Principiantes",
      duration: "15 min",
      difficulty: "Fácil",
      type: "yoga",
      description: "Secuencia suave de posturas básicas de yoga para relajar cuerpo y mente",
      image: "https://images.unsplash.com/photo-1635617240041-c95219c05542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcG9zZSUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzYwNTkxMDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      exercises: [
        {
          id: "mountain",
          name: "Postura de la Montaña (Tadasana)",
          duration: 60,
          instructions: [
            "Párate con los pies juntos, brazos a los lados",
            "Distribuye el peso uniformemente en ambos pies",
            "Alarga la columna hacia el cielo",
            "Relaja los hombros hacia abajo",
            "Respira profundamente"
          ],
          benefits: ["Mejora postura", "Aumenta concentración", "Fortalece piernas"],
          animation: "balance"
        },
        {
          id: "child",
          name: "Postura del Niño (Balasana)",
          duration: 90,
          instructions: [
            "Arrodíllate en el suelo",
            "Siéntate sobre tus talones",
            "Inclínate hacia adelante, brazos extendidos",
            "Apoya la frente en el suelo",
            "Respira profundamente en la espalda"
          ],
          benefits: ["Relaja espalda", "Calma la mente", "Alivia estrés"],
          animation: "breathe"
        },
        {
          id: "cat-cow",
          name: "Gato-Vaca (Marjaryasana-Bitilasana)",
          duration: 90,
          instructions: [
            "Colócate en cuatro patas",
            "Inhala: arquea la espalda (vaca)",
            "Exhala: redondea la espalda (gato)",
            "Muévete con la respiración",
            "Repite 10 veces"
          ],
          benefits: ["Flexibiliza columna", "Masajea órganos", "Libera tensión"],
          animation: "rotate"
        },
        {
          id: "tree",
          name: "Postura del Árbol (Vrksasana)",
          duration: 60,
          instructions: [
            "Párate en una pierna",
            "Coloca el otro pie en el muslo interno",
            "Junta las manos frente al pecho",
            "Fija la mirada en un punto",
            "Mantén el equilibrio y respira"
          ],
          benefits: ["Mejora equilibrio", "Fortalece piernas", "Aumenta concentración"],
          animation: "balance"
        }
      ]
    },
    {
      id: "office-stretches",
      name: "Estiramientos de Oficina",
      duration: "10 min",
      difficulty: "Fácil",
      type: "stretching",
      description: "Ejercicios rápidos para aliviar la tensión del trabajo de escritorio",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVyY2lzZSUyMHN0cmV0Y2glMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NjA1OTEwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      exercises: [
        {
          id: "neck-rolls",
          name: "Rotaciones de Cuello",
          duration: 45,
          instructions: [
            "Siéntate derecho en tu silla",
            "Inclina lentamente la cabeza a la derecha",
            "Mantén 10 segundos",
            "Repite hacia la izquierda",
            "Haz rotaciones suaves completas"
          ],
          benefits: ["Alivia tensión cervical", "Mejora movilidad", "Previene dolores"],
          animation: "rotate"
        },
        {
          id: "shoulder-stretch",
          name: "Estiramiento de Hombros",
          duration: 60,
          instructions: [
            "Entrelaza los dedos detrás de la espalda",
            "Estira los brazos hacia abajo",
            "Levanta el pecho",
            "Mantén 20 segundos",
            "Respira profundamente"
          ],
          benefits: ["Abre el pecho", "Libera hombros", "Mejora postura"],
          animation: "stretch-up"
        },
        {
          id: "side-bend",
          name: "Flexión Lateral",
          duration: 60,
          instructions: [
            "Siéntate con la espalda recta",
            "Levanta un brazo sobre la cabeza",
            "Inclínate hacia el lado opuesto",
            "Mantén 20 segundos cada lado",
            "Siente el estiramiento en el costado"
          ],
          benefits: ["Estira oblicuos", "Alivia espalda baja", "Mejora flexibilidad"],
          animation: "stretch-side"
        },
        {
          id: "wrist-circles",
          name: "Círculos de Muñeca",
          duration: 45,
          instructions: [
            "Extiende los brazos al frente",
            "Haz círculos con las muñecas",
            "10 círculos en cada dirección",
            "Sacude las manos suavemente",
            "Abre y cierra los puños"
          ],
          benefits: ["Previene túnel carpiano", "Alivia tensión", "Mejora circulación"],
          animation: "rotate"
        }
      ]
    },
    {
      id: "breathing-exercises",
      name: "Ejercicios de Respiración",
      duration: "8 min",
      difficulty: "Fácil",
      type: "breathing",
      description: "Técnicas de respiración para reducir estrés y ansiedad",
      image: "https://images.unsplash.com/photo-1713428856080-43fc975d2496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhdGhpbmclMjBleGVyY2lzZSUyMGNhbG18ZW58MXx8fHwxNzYwNTg1NDI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      exercises: [
        {
          id: "box-breathing",
          name: "Respiración Cuadrada",
          duration: 120,
          instructions: [
            "Inhala contando hasta 4",
            "Mantén el aire contando hasta 4",
            "Exhala contando hasta 4",
            "Mantén vacío contando hasta 4",
            "Repite 5 veces"
          ],
          benefits: ["Calma el sistema nervioso", "Reduce ansiedad", "Mejora concentración"],
          animation: "breathe"
        },
        {
          id: "4-7-8",
          name: "Respiración 4-7-8",
          duration: 90,
          instructions: [
            "Inhala por la nariz contando hasta 4",
            "Mantén la respiración contando hasta 7",
            "Exhala por la boca contando hasta 8",
            "Repite 4 veces",
            "Siente la relajación profunda"
          ],
          benefits: ["Induce sueño", "Reduce estrés", "Calma mente"],
          animation: "breathe"
        },
        {
          id: "belly-breathing",
          name: "Respiración Diafragmática",
          duration: 120,
          instructions: [
            "Coloca una mano en el pecho, otra en el abdomen",
            "Inhala profundamente por la nariz",
            "El abdomen debe expandirse, no el pecho",
            "Exhala lentamente por la boca",
            "Repite durante 2 minutos"
          ],
          benefits: ["Activa relajación", "Oxigena cuerpo", "Reduce tensión"],
          animation: "breathe"
        }
      ]
    },
    {
      id: "yoga-intermediate",
      name: "Yoga Intermedio",
      duration: "20 min",
      difficulty: "Intermedio",
      type: "yoga",
      description: "Secuencia más desafiante para profundizar tu práctica",
      image: "https://images.unsplash.com/photo-1635617240041-c95219c05542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcG9zZSUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzYwNTkxMDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      exercises: [
        {
          id: "warrior-one",
          name: "Guerrero I (Virabhadrasana I)",
          duration: 60,
          instructions: [
            "Da un gran paso hacia atrás con el pie izquierdo",
            "Dobla la rodilla derecha a 90 grados",
            "Levanta los brazos hacia el cielo",
            "Mira hacia arriba",
            "Mantén 30 segundos cada lado"
          ],
          benefits: ["Fortalece piernas", "Abre caderas", "Mejora equilibrio"],
          animation: "stretch-up"
        },
        {
          id: "downward-dog",
          name: "Perro Boca Abajo (Adho Mukha Svanasana)",
          duration: 90,
          instructions: [
            "Desde cuatro patas, levanta las caderas",
            "Forma una V invertida con el cuerpo",
            "Presiona las palmas en el suelo",
            "Intenta llevar los talones al suelo",
            "Relaja la cabeza entre los brazos"
          ],
          benefits: ["Estira todo el cuerpo", "Fortalece brazos", "Calma la mente"],
          animation: "stretch-up"
        },
        {
          id: "plank",
          name: "Plancha (Phalakasana)",
          duration: 60,
          instructions: [
            "Colócate en posición de flexión",
            "Mantén el cuerpo en línea recta",
            "Activa el core",
            "Respira normalmente",
            "Mantén 30-60 segundos"
          ],
          benefits: ["Fortalece core", "Tonifica cuerpo", "Mejora estabilidad"],
          animation: "balance"
        }
      ]
    },
    {
      id: "pilates-basic",
      name: "Pilates para Principiantes",
      duration: "18 min",
      difficulty: "Fácil",
      type: "pilates",
      description: "Ejercicios fundamentales de Pilates para fortalecer el core y mejorar la postura",
      image: "https://images.unsplash.com/photo-1731325632687-51e90609e700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2UlMjBtYXR8ZW58MXx8fHwxNzYwNTkxNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      exercises: [
        {
          id: "hundred",
          name: "The Hundred",
          duration: 90,
          instructions: [
            "Acuéstate boca arriba, rodillas dobladas",
            "Levanta la cabeza y los hombros del suelo",
            "Extiende los brazos a los lados",
            "Bombea los brazos arriba y abajo",
            "Inhala 5 bombeos, exhala 5 bombeos",
            "Repite 10 veces (100 bombeos totales)"
          ],
          benefits: ["Activa core profundo", "Mejora circulación", "Fortalece abdomen"],
          animation: "breathe"
        },
        {
          id: "roll-up",
          name: "Roll Up",
          duration: 75,
          instructions: [
            "Acuéstate con piernas extendidas",
            "Brazos extendidos sobre la cabeza",
            "Inhala y levanta los brazos",
            "Exhala y enrolla el cuerpo vértebra por vértebra",
            "Alcanza los dedos de los pies",
            "Vuelve a bajar lentamente"
          ],
          benefits: ["Fortalece abdomen", "Mejora flexibilidad espinal", "Estira espalda"],
          animation: "stretch-up"
        },
        {
          id: "single-leg-stretch",
          name: "Single Leg Stretch",
          duration: 60,
          instructions: [
            "Acuéstate boca arriba",
            "Lleva una rodilla al pecho",
            "Levanta cabeza y hombros",
            "Extiende la otra pierna a 45 grados",
            "Cambia de pierna en movimiento fluido",
            "Mantén el core activado"
          ],
          benefits: ["Tonifica abdomen", "Mejora coordinación", "Fortalece core"],
          animation: "rotate"
        },
        {
          id: "spine-stretch",
          name: "Spine Stretch Forward",
          duration: 60,
          instructions: [
            "Siéntate con piernas extendidas",
            "Brazos extendidos al frente",
            "Inhala y alarga la columna",
            "Exhala e inclínate hacia adelante",
            "Mantén la espalda redondeada",
            "Vuelve a la posición inicial"
          ],
          benefits: ["Estira columna vertebral", "Mejora flexibilidad", "Alivia tensión"],
          animation: "stretch-up"
        },
        {
          id: "bridge",
          name: "Bridge (Puente)",
          duration: 75,
          instructions: [
            "Acuéstate boca arriba, rodillas dobladas",
            "Pies apoyados en el suelo, separados al ancho de cadera",
            "Levanta la pelvis hacia el techo",
            "Forma una línea recta de rodillas a hombros",
            "Mantén el core activo",
            "Baja vértebra por vértebra"
          ],
          benefits: ["Fortalece glúteos", "Estabiliza core", "Mejora postura"],
          animation: "stretch-up"
        }
      ]
    },
    {
      id: "pilates-intermediate",
      name: "Pilates Intermedio",
      duration: "22 min",
      difficulty: "Intermedio",
      type: "pilates",
      description: "Secuencia avanzada de Pilates para aumentar fuerza y control corporal",
      image: "https://images.unsplash.com/photo-1731325632687-51e90609e700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2UlMjBtYXR8ZW58MXx8fHwxNzYwNTkxNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      exercises: [
        {
          id: "criss-cross",
          name: "Criss Cross",
          duration: 60,
          instructions: [
            "Acuéstate con manos detrás de la cabeza",
            "Levanta cabeza, hombros y piernas",
            "Gira el torso llevando codo a rodilla opuesta",
            "Extiende la otra pierna",
            "Alterna los lados con control",
            "Mantén la pelvis estable"
          ],
          benefits: ["Tonifica oblicuos", "Mejora rotación espinal", "Fortalece core"],
          animation: "rotate"
        },
        {
          id: "double-leg-stretch",
          name: "Double Leg Stretch",
          duration: 75,
          instructions: [
            "Acuéstate boca arriba",
            "Abraza las rodillas al pecho",
            "Levanta cabeza y hombros",
            "Extiende brazos y piernas simultáneamente",
            "Haz un círculo con los brazos",
            "Regresa a la posición inicial"
          ],
          benefits: ["Fortalece abdomen completo", "Mejora coordinación", "Estabiliza core"],
          animation: "stretch-up"
        },
        {
          id: "swan",
          name: "Swan (Cisne)",
          duration: 60,
          instructions: [
            "Acuéstate boca abajo",
            "Manos debajo de los hombros",
            "Presiona y levanta el pecho",
            "Extiende la columna hacia arriba",
            "Mantén las costillas en el suelo",
            "Baja con control"
          ],
          benefits: ["Fortalece espalda", "Mejora extensión espinal", "Abre pecho"],
          animation: "stretch-up"
        },
        {
          id: "side-kick-series",
          name: "Side Kick Series",
          duration: 90,
          instructions: [
            "Acuéstate de lado, cuerpo alineado",
            "Apoya la cabeza en la mano",
            "Levanta la pierna superior",
            "Balancea hacia adelante y atrás",
            "Mantén el torso estable",
            "Cambia de lado"
          ],
          benefits: ["Tonifica piernas", "Fortalece cadera", "Mejora equilibrio lateral"],
          animation: "stretch-side"
        },
        {
          id: "teaser",
          name: "Teaser",
          duration: 60,
          instructions: [
            "Acuéstate boca arriba",
            "Levanta piernas a 45 grados",
            "Extiende brazos al frente",
            "Rueda hacia arriba formando una V",
            "Mantén el equilibrio",
            "Baja con control"
          ],
          benefits: ["Desafía core completo", "Mejora equilibrio", "Fortalece abdomen"],
          animation: "balance"
        },
        {
          id: "plank-pilates",
          name: "Plank con Leg Lift",
          duration: 75,
          instructions: [
            "Colócate en posición de plancha",
            "Mantén el cuerpo en línea recta",
            "Levanta una pierna manteniéndola extendida",
            "Mantén 5 segundos",
            "Alterna las piernas",
            "Mantén el core activado en todo momento"
          ],
          benefits: ["Fortalece core y glúteos", "Mejora estabilidad", "Tonifica cuerpo completo"],
          animation: "balance"
        }
      ]
    }
  ];

  const startExercise = () => {
    if (!selectedRoutine) return;
    
    const exercise = selectedRoutine.exercises[currentExerciseIndex];
    setTimeRemaining(exercise.duration);
    setIsPlaying(true);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          
          // Marcar ejercicio como completado
          setCompletedExercises(prev => new Set([...prev, exercise.id]));
          
          // Auto-avanzar al siguiente ejercicio si hay más
          if (currentExerciseIndex < selectedRoutine.exercises.length - 1) {
            setTimeout(() => {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
            }, 1000);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseExercise = () => {
    setIsPlaying(false);
  };

  const resetExercise = () => {
    if (!selectedRoutine) return;
    const exercise = selectedRoutine.exercises[currentExerciseIndex];
    setTimeRemaining(exercise.duration);
    setIsPlaying(false);
  };

  const resetRoutine = () => {
    setCurrentExerciseIndex(0);
    setTimeRemaining(0);
    setIsPlaying(false);
    setCompletedExercises(new Set());
  };

  const getAnimationStyle = (animation: Exercise['animation']) => {
    const animations = {
      breathe: {
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      },
      "stretch-up": {
        y: [0, -10, 0],
        scale: [1, 1.05, 1],
      },
      "stretch-side": {
        x: [-5, 5, -5],
        rotate: [-2, 2, -2],
      },
      rotate: {
        rotate: [0, 360],
      },
      balance: {
        x: [-2, 2, -2],
        y: [-2, 0, -2],
      },
    };

    return animations[animation];
  };

  const getDifficultyColor = (difficulty: Routine['difficulty']) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Intermedio": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Avanzado": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    }
  };

  const getTypeIcon = (type: Routine['type']) => {
    switch (type) {
      case "yoga": return <Heart className="h-4 w-4" />;
      case "stretching": return <Dumbbell className="h-4 w-4" />;
      case "breathing": return <Wind className="h-4 w-4" />;
      case "pilates": return <Activity className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Vista de la rutina activa
  if (selectedRoutine) {
    const currentExercise = selectedRoutine.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + (completedExercises.has(currentExercise.id) ? 1 : 0)) / selectedRoutine.exercises.length) * 100;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => {
          setSelectedRoutine(null);
          resetRoutine();
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a rutinas
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedRoutine.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Ejercicio {currentExerciseIndex + 1} de {selectedRoutine.exercises.length}
                </p>
              </div>
              <Badge className={getDifficultyColor(selectedRoutine.difficulty)}>
                {selectedRoutine.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2" />

            <div className="text-center space-y-4">
              <h3 className="text-2xl">{currentExercise.name}</h3>
              
              {/* Animación visual */}
              <div className="flex justify-center py-8">
                <motion.div
                  animate={isPlaying ? getAnimationStyle(currentExercise.animation) : {}}
                  transition={{
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <span className="text-4xl">🧘</span>
                  </div>
                </motion.div>
              </div>

              {/* Timer */}
              <div className="space-y-2">
                <div className="text-6xl font-mono">
                  {formatTime(timeRemaining || currentExercise.duration)}
                </div>
                <div className="flex justify-center gap-2">
                  {!isPlaying ? (
                    <Button onClick={startExercise} size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar
                    </Button>
                  ) : (
                    <Button onClick={pauseExercise} variant="secondary" size="lg">
                      <Pause className="h-5 w-5 mr-2" />
                      Pausar
                    </Button>
                  )}
                  <Button onClick={resetExercise} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Instrucciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {currentExercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Beneficios */}
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg text-green-700 dark:text-green-300">
                  Beneficios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {currentExercise.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Navegación entre ejercicios */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentExerciseIndex > 0) {
                    setCurrentExerciseIndex(currentExerciseIndex - 1);
                    setIsPlaying(false);
                  }
                }}
                disabled={currentExerciseIndex === 0}
              >
                Anterior
              </Button>
              
              {currentExerciseIndex === selectedRoutine.exercises.length - 1 ? (
                <Button
                  onClick={() => {
                    setSelectedRoutine(null);
                    resetRoutine();
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Finalizar Rutina
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentExerciseIndex(currentExerciseIndex + 1);
                    setIsPlaying(false);
                  }}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista principal con todas las rutinas
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al feed
            </Button>
          </div>
          <h1 className="text-4xl">Rutinas de Ejercicio, Yoga y Pilates</h1>
          <p className="text-muted-foreground mt-2">
            Rutinas guiadas paso a paso para mejorar tu bienestar físico y mental
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="yoga">Yoga</TabsTrigger>
          <TabsTrigger value="pilates">Pilates</TabsTrigger>
          <TabsTrigger value="stretching">Estiramientos</TabsTrigger>
          <TabsTrigger value="breathing">Respiración</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.map((routine) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden cursor-pointer h-full" onClick={() => setSelectedRoutine(routine)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={routine.image} 
                      alt={routine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(routine.type)}
                        {routine.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(routine.difficulty)}>
                        {routine.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{routine.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {routine.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {routine.exercises.length} ejercicios
                      </div>
                    </div>
                    <Button className="w-full">
                      Comenzar rutina
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="yoga" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.filter(r => r.type === "yoga").map((routine) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden cursor-pointer h-full" onClick={() => setSelectedRoutine(routine)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={routine.image} 
                      alt={routine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(routine.type)}
                        {routine.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(routine.difficulty)}>
                        {routine.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{routine.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {routine.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {routine.exercises.length} ejercicios
                      </div>
                    </div>
                    <Button className="w-full">
                      Comenzar rutina
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pilates" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.filter(r => r.type === "pilates").map((routine) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden cursor-pointer h-full" onClick={() => setSelectedRoutine(routine)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={routine.image} 
                      alt={routine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(routine.type)}
                        {routine.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(routine.difficulty)}>
                        {routine.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{routine.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {routine.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {routine.exercises.length} ejercicios
                      </div>
                    </div>
                    <Button className="w-full">
                      Comenzar rutina
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stretching" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.filter(r => r.type === "stretching").map((routine) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden cursor-pointer h-full" onClick={() => setSelectedRoutine(routine)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={routine.image} 
                      alt={routine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(routine.type)}
                        {routine.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(routine.difficulty)}>
                        {routine.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{routine.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {routine.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {routine.exercises.length} ejercicios
                      </div>
                    </div>
                    <Button className="w-full">
                      Comenzar rutina
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breathing" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.filter(r => r.type === "breathing").map((routine) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden cursor-pointer h-full" onClick={() => setSelectedRoutine(routine)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={routine.image} 
                      alt={routine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(routine.type)}
                        {routine.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(routine.difficulty)}>
                        {routine.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{routine.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {routine.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {routine.exercises.length} ejercicios
                      </div>
                    </div>
                    <Button className="w-full">
                      Comenzar rutina
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
