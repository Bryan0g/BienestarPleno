import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  Brain, 
  Heart, 
  Activity, 
  Users, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface StressTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
}

interface Question {
  id: number;
  text: string;
  options: { value: number; label: string }[];
}

interface TestResult {
  level: 'bajo' | 'moderado' | 'alto' | 'muy-alto';
  score: number;
  maxScore: number;
  title: string;
  description: string;
  color: string;
  icon: any;
  recommendations: {
    immediate: string[];
    longTerm: string[];
    resources: string[];
  };
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿Con qué frecuencia te has sentido nervioso o estresado?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 2,
    text: "¿Te resulta difícil controlar las cosas importantes de tu vida?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 3,
    text: "¿Con qué frecuencia tienes dificultades para dormir?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 4,
    text: "¿Te sientes abrumado por tus responsabilidades?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 5,
    text: "¿Has experimentado síntomas físicos de estrés (dolor de cabeza, tensión muscular, etc.)?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 6,
    text: "¿Te resulta difícil concentrarte en las tareas?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 7,
    text: "¿Has perdido el interés en actividades que antes disfrutabas?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  },
  {
    id: 8,
    text: "¿Te sientes irritable o con cambios de humor frecuentes?",
    options: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Casi nunca" },
      { value: 2, label: "A veces" },
      { value: 3, label: "Frecuentemente" },
      { value: 4, label: "Muy frecuentemente" }
    ]
  }
];

export function StressTestModal({ isOpen, onClose, isAuthenticated = true }: StressTestModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calcular resultado
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      const maxScore = questions.length * 4;
      const result = calculateResult(totalScore, maxScore);
      setTestResult(result);
      setShowResult(true);
    }
  };

  const calculateResult = (score: number, maxScore: number): TestResult => {
    const percentage = (score / maxScore) * 100;

    if (percentage <= 25) {
      return {
        level: 'bajo',
        score,
        maxScore,
        title: 'Nivel de Estrés Bajo',
        description: 'Tu nivel de estrés está en un rango saludable. Continúa con tus buenas prácticas de bienestar.',
        color: 'text-green-600',
        icon: CheckCircle,
        recommendations: {
          immediate: [
            'Mantén tus rutinas actuales de bienestar',
            'Practica gratitud diariamente',
            'Continúa con ejercicio regular'
          ],
          longTerm: [
            'Desarrolla estrategias preventivas de manejo del estrés',
            'Mantén un estilo de vida equilibrado',
            'Fortalece tu red de apoyo social'
          ],
          resources: [
            'Apps de meditación para mantenimiento',
            'Lecturas sobre psicología positiva',
            'Comunidades de bienestar'
          ]
        }
      };
    } else if (percentage <= 50) {
      return {
        level: 'moderado',
        score,
        maxScore,
        title: 'Nivel de Estrés Moderado',
        description: 'Experimentas algunos síntomas de estrés. Es un buen momento para implementar técnicas de manejo.',
        color: 'text-yellow-600',
        icon: Info,
        recommendations: {
          immediate: [
            'Practica técnicas de respiración profunda',
            'Establece límites claros en trabajo y vida personal',
            'Dedica tiempo diario a actividades relajantes'
          ],
          longTerm: [
            'Desarrolla una rutina de ejercicio regular',
            'Aprende técnicas de mindfulness',
            'Considera terapia preventiva'
          ],
          resources: [
            'Apps de meditación guiada',
            'Clases de yoga o tai chi',
            'Libros sobre manejo del estrés'
          ]
        }
      };
    } else if (percentage <= 75) {
      return {
        level: 'alto',
        score,
        maxScore,
        title: 'Nivel de Estrés Alto',
        description: 'Tu nivel de estrés está afectando tu bienestar. Es importante tomar medidas activas.',
        color: 'text-orange-600',
        icon: AlertTriangle,
        recommendations: {
          immediate: [
            'Practica técnicas de relajación varias veces al día',
            'Reduce compromisos no esenciales',
            'Busca apoyo de amigos, familia o profesionales'
          ],
          longTerm: [
            'Considera terapia psicológica',
            'Evalúa cambios en tu estilo de vida',
            'Desarrolla estrategias de afrontamiento'
          ],
          resources: [
            'Consulta con un psicólogo',
            'Programas de reducción de estrés',
            'Grupos de apoyo'
          ]
        }
      };
    } else {
      return {
        level: 'muy-alto',
        score,
        maxScore,
        title: 'Nivel de Estrés Muy Alto',
        description: 'Tu nivel de estrés requiere atención inmediata. Busca ayuda profesional.',
        color: 'text-red-600',
        icon: AlertTriangle,
        recommendations: {
          immediate: [
            'Busca ayuda profesional inmediatamente',
            'Considera tomar un descanso si es posible',
            'No enfrentes esto solo, busca apoyo'
          ],
          longTerm: [
            'Terapia psicológica especializada',
            'Posible evaluación médica',
            'Cambios significativos en estilo de vida'
          ],
          resources: [
            'Líneas de crisis y apoyo inmediato',
            'Servicios de salud mental',
            'Programas intensivos de manejo del estrés'
          ]
        }
      };
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResult(null);
    setShowResult(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isOpen || !isAuthenticated) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Test de Evaluación de Estrés
          </DialogTitle>
          <DialogDescription>
            Completa este cuestionario para evaluar tu nivel de estrés actual y recibir recomendaciones personalizadas.
          </DialogDescription>
        </DialogHeader>

        {!showResult ? (
          <div className="space-y-6">
            {/* Barra de progreso */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Pregunta actual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {questions[currentQuestion].text}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 text-left"
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Mostrar resultados
          <div className="space-y-6">
            {testResult && (
              <>
                {/* Resultado principal */}
                <Card className="border-2">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <testResult.icon className={`h-12 w-12 ${testResult.color}`} />
                    </div>
                    <CardTitle className={testResult.color}>
                      {testResult.title}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {testResult.description}
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {testResult.score}/{testResult.maxScore} puntos
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Recomendaciones inmediatas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Recomendaciones Inmediatas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {testResult.recommendations.immediate.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recomendaciones a largo plazo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Plan a Largo Plazo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {testResult.recommendations.longTerm.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recursos recomendados */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Recursos Recomendados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {testResult.recommendations.resources.map((resource, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                          <span className="text-sm">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Separator />

                {/* Botones de acción */}
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={resetTest}>
                    Realizar Test Nuevamente
                  </Button>
                  <Button onClick={onClose}>
                    Guardar Resultados
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}