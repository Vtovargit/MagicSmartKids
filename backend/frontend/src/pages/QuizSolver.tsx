import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const QuizSolver: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos en segundos
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const quiz = {
    id: 1,
    title: 'Operaciones Básicas - Matemáticas',
    description: 'Evaluación de suma, resta, multiplicación y división',
    timeLimit: 30,
    totalPoints: 100,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: '¿Cuál es el resultado de 25 + 17?',
        options: ['40', '42', '43', '45'],
        correctAnswer: '42',
        points: 10,
        explanation: '25 + 17 = 42. Sumamos las unidades: 5 + 7 = 12, llevamos 1. Sumamos las decenas: 2 + 1 + 1 = 4.'
      },
      {
        id: 2,
        type: 'multiple_choice',
        question: '¿Cuánto es 8 × 7?',
        options: ['54', '56', '58', '64'],
        correctAnswer: '56',
        points: 10,
        explanation: '8 × 7 = 56. Podemos recordar que 8 × 7 es igual a 7 × 8.'
      },
      {
        id: 3,
        type: 'true_false',
        question: '¿Es verdad que 100 ÷ 4 = 25?',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 'Verdadero',
        points: 10,
        explanation: '100 ÷ 4 = 25 es correcto. 25 × 4 = 100.'
      },
      {
        id: 4,
        type: 'multiple_choice',
        question: '¿Cuál es el resultado de 63 - 28?',
        options: ['35', '37', '39', '41'],
        correctAnswer: '35',
        points: 10,
        explanation: '63 - 28 = 35. Restamos: 63 - 28 = 35.'
      },
      {
        id: 5,
        type: 'fill_blank',
        question: 'Completa: 6 × 9 = ___',
        correctAnswer: '54',
        points: 10,
        explanation: '6 × 9 = 54. Es una tabla de multiplicar básica.'
      },
      {
        id: 6,
        type: 'multiple_choice',
        question: '¿Cuántas decenas hay en el número 347?',
        options: ['3', '4', '7', '34'],
        correctAnswer: '4',
        points: 10,
        explanation: 'En 347, el dígito 4 está en la posición de las decenas.'
      },
      {
        id: 7,
        type: 'true_false',
        question: '¿Es 15 un número par?',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 'Falso',
        points: 10,
        explanation: '15 es un número impar porque termina en 5.'
      },
      {
        id: 8,
        type: 'multiple_choice',
        question: '¿Cuál es la mitad de 84?',
        options: ['40', '42', '44', '46'],
        correctAnswer: '42',
        points: 10,
        explanation: 'La mitad de 84 es 84 ÷ 2 = 42.'
      },
      {
        id: 9,
        type: 'fill_blank',
        question: 'Si tengo 3 grupos de 8 manzanas, tengo ___ manzanas en total.',
        correctAnswer: '24',
        points: 10,
        explanation: '3 × 8 = 24 manzanas en total.'
      },
      {
        id: 10,
        type: 'multiple_choice',
        question: '¿Cuál es el número mayor?',
        options: ['789', '798', '879', '897'],
        correctAnswer: '897',
        points: 10,
        explanation: '897 es el mayor porque tiene 8 centenas, 9 decenas y 7 unidades.'
      }
    ]
  };

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct++;
        totalPoints += question.points;
      }
    });
    
    return { correct, totalPoints, total: quiz.questions.length };
  };

  const getQuestionIcon = (questionIndex: number) => {
    const questionId = quiz.questions[questionIndex].id;
    const hasAnswer = answers[questionId];
    
    if (showResults) {
      const isCorrect = answers[questionId] === quiz.questions[questionIndex].correctAnswer;
      return isCorrect ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      );
    }
    
    return hasAnswer ? (
      <CheckCircle className="w-4 h-4 text-blue-600" />
    ) : (
      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
    );
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score.correct / score.total) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">¡Quiz Completado! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{score.correct}</p>
                  <p className="text-sm text-gray-600">Correctas</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{score.total - score.correct}</p>
                  <p className="text-sm text-gray-600">Incorrectas</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{percentage}%</p>
                  <p className="text-sm text-gray-600">Porcentaje</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{score.totalPoints}</p>
                  <p className="text-sm text-gray-600">Puntos</p>
                </div>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <Button onClick={() => navigate('/assignments')}>
                  Volver a Tareas
                </Button>
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Revisar Respuestas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        
                        {question.type === 'fill_blank' ? (
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-600">Tu respuesta: </span>
                              <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {userAnswer || 'Sin respuesta'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm">
                                <span className="text-gray-600">Respuesta correcta: </span>
                                <span className="text-green-600 font-medium">{question.correctAnswer}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {question.options?.map(option => (
                              <div 
                                key={option}
                                className={`p-2 rounded border ${
                                  option === question.correctAnswer 
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : option === userAnswer && !isCorrect
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{option}</span>
                                  {option === question.correctAnswer && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                  {option === userAnswer && !isCorrect && (
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Explicación:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <Badge variant="outline">
                  {currentQuestion + 1} de {quiz.questions.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Navegación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
                  {quiz.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`p-2 rounded text-sm font-medium flex items-center justify-center space-x-1 ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white'
                          : answers[quiz.questions[index].id]
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{index + 1}</span>
                      {getQuestionIcon(index)}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Respondidas:</span>
                    <span className="font-medium">{Object.keys(answers).length}/{quiz.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Puntos:</span>
                    <span className="font-medium">{quiz.totalPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Question */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Pregunta {currentQuestion + 1}
                  </CardTitle>
                  <Badge variant="secondary">
                    {currentQ.points} puntos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-gray-900">
                  {currentQ.question}
                </div>

                {currentQ.type === 'fill_blank' ? (
                  <div>
                    <input
                      type="text"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Escribe tu respuesta aquí..."
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQ.options?.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          answers[currentQ.id] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option}
                          checked={answers[currentQ.id] === option}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </Button>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Marcar</span>
                    </Button>

                    {currentQuestion === quiz.questions.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Finalizar Quiz</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                        className="flex items-center space-x-2"
                      >
                        <span>Siguiente</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSolver;