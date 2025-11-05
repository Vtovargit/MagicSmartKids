import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { CheckCircle, XCircle, Star, Trophy, Clock, BookOpen } from 'lucide-react';

const StudentTaskView: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [isActive, setIsActive] = useState(false);

  const loadTasks = async () => {
    try {
      console.log('🔄 Cargando tareas para estudiante...');
      
      // 🎭 DATOS FALSOS PARA LA PRESENTACIÓN
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const fakeTasks = [
        {
          id: '1',
          title: '🧮 Aventura Matemática Interactiva',
          description: 'Resuelve problemas matemáticos divertidos con animaciones y efectos visuales. ¡Cada respuesta correcta te da puntos!',
          subjectName: 'Matemáticas',
          createdAt: '2025-10-25T10:00:00Z',
          difficulty: 'Fácil',
          timeLimit: 300,
          type: 'interactive',
          questions: [
            {
              questionText: '🍎 María tiene 5 manzanas y compra 3 más. ¿Cuántas manzanas tiene en total?',
              options: JSON.stringify(['6', '7', '8', '9']),
              correctAnswer: '8',
              explanation: '¡Correcto! 5 + 3 = 8 manzanas 🍎',
              visual: '🍎🍎🍎🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎🍎🍎🍎'
            },
            {
              questionText: '🚗 En el estacionamiento hay 10 carros, se van 4. ¿Cuántos carros quedan?',
              options: JSON.stringify(['5', '6', '7', '8']),
              correctAnswer: '6',
              explanation: '¡Excelente! 10 - 4 = 6 carros 🚗',
              visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗 - 🚗🚗🚗🚗 = 🚗🚗🚗🚗🚗🚗'
            },
            {
              questionText: '⭐ Si tienes 2 estrellas y encuentras 7 más, ¿cuántas estrellas tienes?',
              options: JSON.stringify(['8', '9', '10', '11']),
              correctAnswer: '9',
              explanation: '¡Fantástico! 2 + 7 = 9 estrellas ⭐',
              visual: '⭐⭐ + ⭐⭐⭐⭐⭐⭐⭐ = ⭐⭐⭐⭐⭐⭐⭐⭐⭐'
            },
            {
              questionText: '🎈 Ana tiene 15 globos y regala 8. ¿Cuántos globos le quedan?',
              options: JSON.stringify(['6', '7', '8', '9']),
              correctAnswer: '7',
              explanation: '¡Perfecto! 15 - 8 = 7 globos 🎈',
              visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 - 🎈🎈🎈🎈🎈🎈🎈🎈 = 🎈🎈🎈🎈🎈🎈🎈'
            },
            {
              questionText: '🍪 En una caja hay 6 galletas, en otra hay 5. ¿Cuántas galletas hay en total?',
              options: JSON.stringify(['10', '11', '12', '13']),
              correctAnswer: '11',
              explanation: '¡Increíble! 6 + 5 = 11 galletas 🍪',
              visual: '🍪🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪 = 🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'
            }
          ]
        },
        {
          id: '2',
          title: '📚 Aventura del Patito Feo',
          description: 'Vive la historia del Patito Feo de manera interactiva. Responde preguntas y descubre el final.',
          subjectName: 'Español',
          createdAt: '2025-10-24T14:30:00Z',
          difficulty: 'Medio',
          timeLimit: 240,
          type: 'story',
          questions: [
            {
              questionText: '🐣 Al principio de la historia, ¿cómo se sentía el patito?',
              options: JSON.stringify(['😊 Feliz', '😢 Triste', '😠 Enojado', '😨 Asustado']),
              correctAnswer: '😢 Triste',
              explanation: 'Correcto! El patito se sentía triste porque era diferente a los demás.',
              visual: '🐣💭😢'
            },
            {
              questionText: '🦢 ¿En qué hermoso animal se convirtió el patito al final?',
              options: JSON.stringify(['🦆 Pato', '🦢 Cisne', '🪿 Ganso', '🐓 Pollo']),
              correctAnswer: '🦢 Cisne',
              explanation: '¡Exacto! El patito se convirtió en un hermoso cisne blanco.',
              visual: '🐣➡️🦢✨'
            },
            {
              questionText: '💭 ¿Cuál es la moraleja principal del cuento?',
              options: JSON.stringify(['Ser diferente es malo', 'Todos somos especiales', 'Los cisnes son mejores', 'No importa la apariencia']),
              correctAnswer: 'Todos somos especiales',
              explanation: '¡Perfecto! La historia nos enseña que todos somos especiales y únicos.',
              visual: '🌟👥💖'
            }
          ]
        },
        {
          id: '3',
          title: '🌈 Quiz Colorido de Inglés',
          description: 'Aprende los colores en inglés de forma divertida con efectos visuales y sonidos.',
          subjectName: 'Inglés',
          createdAt: '2025-10-23T09:15:00Z',
          difficulty: 'Fácil',
          timeLimit: 180,
          type: 'colors',
          questions: [
            {
              questionText: '🔴 ¿Cómo se dice "rojo" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Red',
              explanation: '¡Correcto! Red significa rojo 🔴',
              visual: '🔴',
              color: '#ef4444'
            },
            {
              questionText: '🔵 ¿Cómo se dice "azul" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Blue',
              explanation: '¡Excelente! Blue significa azul 🔵',
              visual: '🔵',
              color: '#3b82f6'
            },
            {
              questionText: '🟢 ¿Cómo se dice "verde" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Green',
              explanation: '¡Fantástico! Green significa verde 🟢',
              visual: '🟢',
              color: '#22c55e'
            },
            {
              questionText: '🟡 ¿Cómo se dice "amarillo" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Yellow',
              explanation: '¡Increíble! Yellow significa amarillo 🟡',
              visual: '🟡',
              color: '#eab308'
            }
          ]
        }
      ];
      
      setTasks(fakeTasks);
      console.log(`✅ ${fakeTasks.length} tareas cargadas (datos de presentación)`);
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      setTasks([]);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitTask();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTask = (task: any) => {
    setSelectedTask(task);
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
    setScore(0);
    setTimeLeft(task.timeLimit || 300);
    setIsActive(true);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    // Auto advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < selectedTask.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitTask();
      }
    }, 1000);
  };

  const handleSubmitTask = () => {
    setIsActive(false);
    
    // Calculate score
    let correctAnswers = 0;
    selectedTask.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedTask.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '¡Excelente trabajo! 🌟';
    if (score >= 80) return '¡Muy bien! 👏';
    if (score >= 70) return '¡Buen trabajo! 👍';
    if (score >= 60) return 'Puedes mejorar 💪';
    return 'Sigue practicando 📚';
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (selectedTask) {
    if (showResults) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                {score >= 80 ? (
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                ) : (
                  <Star className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-pulse" />
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">¡Tarea Completada!</h1>
              <h2 className="text-2xl font-semibold mb-6">{selectedTask.title}</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="text-6xl font-bold mb-2 ${getScoreColor(score)}">{score}%</div>
                <div className="text-xl text-gray-600 mb-4">{getScoreMessage(score)}</div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-100 rounded-lg p-3">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-green-800">
                      {Object.values(answers).filter((answer, index) => 
                        answer === selectedTask.questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-green-600">Correctas</div>
                  </div>
                  
                  <div className="bg-red-100 rounded-lg p-3">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="font-semibold text-red-800">
                      {Object.values(answers).filter((answer, index) => 
                        answer !== selectedTask.questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-red-600">Incorrectas</div>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-800">
                      {formatTime(selectedTask.timeLimit - timeLeft)}
                    </div>
                    <div className="text-sm text-blue-600">Tiempo usado</div>
                  </div>
                </div>
              </div>

              {/* Review answers */}
              <div className="text-left mb-6">
                <h3 className="text-xl font-semibold mb-4">Revisión de Respuestas:</h3>
                {selectedTask.questions.map((question: any, index: number) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg mb-3 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.questionText}</p>
                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Tu respuesta: {userAnswer || 'Sin respuesta'}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700">
                              Respuesta correcta: {question.correctAnswer}
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => startTask(selectedTask)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Intentar de Nuevo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTask(null)}
                >
                  Volver a Tareas
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = selectedTask.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTask.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with progress and timer */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{selectedTask.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {currentQuestion + 1} de {selectedTask.questions.length}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              {currentQ.visual && (
                <div className="text-6xl mb-4" style={{ color: currentQ.color }}>
                  {currentQ.visual}
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4">{currentQ.questionText}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {JSON.parse(currentQ.options || '[]').map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    answers[currentQuestion] === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-lg font-medium">{option}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() => setSelectedTask(null)}
                className="flex items-center gap-2"
              >
                Salir
              </Button>
              
              <div className="flex gap-2">
                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Anterior
                  </Button>
                )}
                
                {currentQuestion < selectedTask.questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!answers[currentQuestion]}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitTask}
                    disabled={!answers[currentQuestion]}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Tareas Interactivas</h1>
          <p className="text-lg text-gray-600">Aprende de forma divertida con nuestras actividades interactivas</p>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No hay tareas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => {
              const getDifficultyColor = (difficulty: string) => {
                switch (difficulty) {
                  case 'Fácil': return 'bg-green-100 text-green-800';
                  case 'Medio': return 'bg-yellow-100 text-yellow-800';
                  case 'Difícil': return 'bg-red-100 text-red-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };

              const getTypeIcon = (type: string) => {
                switch (type) {
                  case 'interactive': return '🧮';
                  case 'story': return '📚';
                  case 'colors': return '🌈';
                  default: return '📝';
                }
              };

              return (
                <div key={task.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{getTypeIcon(task.type)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-gray-800">{task.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{task.subjectName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(task.timeLimit)} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-4 h-4" />
                        <span>{task.questions.length} preguntas</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startTask(task)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-xl transition-all duration-300"
                    >
                      🚀 Comenzar Tarea
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTaskView;