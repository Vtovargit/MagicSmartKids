import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardTitle } from '../ui/Card';
import { Task, Result, activityStorage } from '../../services/activityStorage';
import { Activity } from './ActivityEditor';
import { useAuthStore } from '../../stores/authStore';
import MultipleChoiceActivity from './MultipleChoiceActivity';
import InteractiveDragDropActivity from './InteractiveDragDropActivity';
import InteractiveMatchLinesActivity from './InteractiveMatchLinesActivity';
import InteractiveShortAnswerActivity from './InteractiveShortAnswerActivity';
import InteractiveVideoActivity from './InteractiveVideoActivity';

interface StudentActivityViewProps {
  taskId: string;
  onBack: () => void;
}

export default function StudentActivityView({ taskId, onBack }: StudentActivityViewProps) {
  const { user } = useAuthStore();
  const [task, setTask] = useState<Task | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const loadedTask = activityStorage.getTask(taskId);
    if (loadedTask) {
      setTask(loadedTask);
    }
  }, [taskId]);

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Cargando actividad...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / task.activities.length) * 100);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-black flex items-center gap-2">
              <div className="p-2 bg-accent-green/10 rounded-lg">
                🏆
              </div>
              ¡Actividad Completada!
            </h1>
            <p className="text-sm sm:text-base text-secondary">Revisa tus resultados</p>
          </div>
          <Button 
            onClick={onBack} 
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50"
          >
            ← Volver a Actividades
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-[60vh] sm:min-h-96">
          <Card className="max-w-2xl w-full mx-4 border-secondary-200">
            <CardContent className="text-center p-6 sm:p-8 lg:p-12">
              <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 animate-bounce">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '🎉'}
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-black mb-4">
                ¡Felicidades, {user?.firstName}!
              </CardTitle>
              <p className="text-base sm:text-lg lg:text-xl text-secondary mb-6 sm:mb-8">
                Has completado todas las actividades
              </p>
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 sm:p-8 mb-6 sm:mb-8">
                <p className="text-base sm:text-lg font-semibold text-neutral-black mb-2">
                  Tu puntuación
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  {score} / {task.activities.length}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-accent-green mt-4">
                  {percentage}%
                </p>
              </div>
              {percentage >= 80 && (
                <p className="text-base sm:text-lg text-accent-green font-semibold mb-6">
                  ¡Excelente trabajo! 🌟
                </p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-base sm:text-lg text-primary font-semibold mb-6">
                  ¡Muy bien! Sigue practicando 💪
                </p>
              )}
              {percentage < 60 && (
                <p className="text-base sm:text-lg text-accent-yellow font-semibold mb-6">
                  ¡Buen intento! Sigue aprendiendo 📚
                </p>
              )}
              <Button 
                onClick={onBack} 
                className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2 px-6 py-3"
              >
                <Home className="h-4 w-4" />
                Volver a Actividades
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentActivity = task.activities[currentActivityIndex];
  const progress = ((currentActivityIndex + 1) / task.activities.length) * 100;

  const handleAnswer = (answer: any, correct: boolean) => {
    setAnswers({ ...answers, [currentActivityIndex]: answer });
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentActivityIndex < task.activities.length - 1) {
        setCurrentActivityIndex(currentActivityIndex + 1);
      } else {
        const result: Result = {
          id: Date.now().toString(),
          taskId: task.id,
          studentName: user?.firstName + ' ' + user?.lastName || 'Usuario',
          answers,
          score: correct ? score + 1 : score,
          completedAt: new Date().toISOString()
        };
        activityStorage.saveResult(result);
        setCompleted(true);
      }
    }, 2000);
  };

  const renderActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceActivity
            activity={activity}
            onAnswer={handleAnswer}
          />
        );
      case 'drag-drop':
        return (
          <InteractiveDragDropActivity
            activity={activity}
            onAnswer={handleAnswer}
          />
        );
      case 'match-lines':
        return (
          <InteractiveMatchLinesActivity
            activity={activity}
            onAnswer={handleAnswer}
          />
        );
      case 'short-answer':
        return (
          <InteractiveShortAnswerActivity
            activity={activity}
            onAnswer={handleAnswer}
          />
        );
      case 'video':
        return (
          <InteractiveVideoActivity
            activity={activity}
            onAnswer={handleAnswer}
          />
        );
      default:
        return <div>Tipo de actividad no soportado</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              🎯
            </div>
            {task.title}
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Actividad {currentActivityIndex + 1} de {task.activities.length} • Puntuación: {score}
          </p>
        </div>
        <Button 
          onClick={onBack} 
          variant="outline"
          className="border-secondary-300 text-secondary hover:bg-secondary-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Salir
        </Button>
      </div>

      {/* Progress */}
      <Card className="border-secondary-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-secondary-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-accent-yellow h-5 w-5" />
              <span className="font-semibold text-neutral-black">{score}</span>
            </div>
            <span className="text-sm font-medium text-secondary">
              {currentActivityIndex + 1}/{task.activities.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Activity */}
      <Card className="border-secondary-200">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {renderActivity(currentActivity)}
        </CardContent>
      </Card>

      {/* Feedback Modal - Mejorado */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-md mx-auto">
            <Card className={`${isCorrect ? 'bg-accent-green' : 'bg-accent-yellow'} text-neutral-white shadow-2xl transform animate-bounce-in border-0`}>
              <CardContent className="text-center p-6 sm:p-8 lg:p-12">
                <div className="text-6xl sm:text-7xl lg:text-8xl mb-4 animate-bounce">
                  {isCorrect ? '🎉' : '💪'}
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {isCorrect ? '¡Muy bien!' : '¡Sigue intentando!'}
                </p>
                <p className="text-sm sm:text-base lg:text-lg opacity-90">
                  {isCorrect ? 'Respuesta correcta' : 'Puedes hacerlo mejor'}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-1000 rounded-full"
                    style={{ width: '100%', animation: 'progress 2s ease-in-out' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}