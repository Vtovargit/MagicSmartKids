import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CheckCircle, RotateCcw, Trophy, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  correctAnswers: string[]; // Multiple possible correct answers
  hint?: string;
}

interface ShortAnswerActivityProps {
  title: string;
  instructions: string;
  questions: Question[];
  onComplete: (score: number, totalQuestions: number) => void;
}

const ShortAnswerActivity: React.FC<ShortAnswerActivityProps> = ({
  title,
  instructions,
  questions,
  onComplete
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    let correctCount = 0;

    questions.forEach(question => {
      const userAnswer = answers[question.id]?.trim().toLowerCase() || '';
      const isCorrect = question.correctAnswers.some(
        correctAnswer => correctAnswer.toLowerCase() === userAnswer
      );
      newResults[question.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setResults(newResults);
    setScore(correctCount);
    setIsCompleted(true);
    onComplete(correctCount, questions.length);
  };

  const resetActivity = () => {
    setAnswers({});
    setShowHints({});
    setResults({});
    setIsCompleted(false);
    setScore(0);
  };

  const isAllAnswered = questions.every(q => answers[q.id]?.trim());

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              ¡Actividad Completada!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl mb-4">
              {percentage >= 90 ? '🌟' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <div className="text-4xl font-bold text-green-600">
              {score}/{questions.length}
            </div>
            <p className="text-lg text-gray-600">
              Respuestas correctas: {percentage}%
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg font-medium text-gray-900">
                {percentage >= 90 ? '¡Excelente trabajo! 🌟' : 
                 percentage >= 70 ? '¡Muy bien! 👏' : 
                 percentage >= 50 ? '¡Buen intento! 👍' : 
                 '¡Sigue practicando! 💪'}
              </p>
            </div>
            <Button onClick={resetActivity} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Repetir Actividad
            </Button>
          </CardContent>
        </Card>

        {/* Review Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Revisión de Respuestas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {results[question.id] ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Tu respuesta: <span className={results[question.id] ? 'text-green-600' : 'text-red-600'}>
                        {answers[question.id] || 'Sin respuesta'}
                      </span>
                    </p>
                    {!results[question.id] && (
                      <p className="text-sm text-green-600">
                        Respuesta correcta: {question.correctAnswers[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-gray-600">{instructions}</p>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="space-y-3">
                <p className="font-medium text-lg">
                  {index + 1}. {question.question}
                </p>
                <Input
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="text-lg"
                />
                {question.hint && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => toggleHint(question.id)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600"
                    >
                      {showHints[question.id] ? 'Ocultar pista' : 'Ver pista'}
                    </Button>
                    {showHints[question.id] && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-800 text-sm">
                          💡 Pista: {question.hint}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Preguntas respondidas: {Object.keys(answers).filter(key => answers[key]?.trim()).length}/{questions.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(Object.keys(answers).filter(key => answers[key]?.trim()).length / questions.length) * 100}%` 
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={resetActivity}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </Button>
              <Button
                onClick={checkAnswers}
                disabled={!isAllAnswered}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Verificar Respuestas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShortAnswerActivity;