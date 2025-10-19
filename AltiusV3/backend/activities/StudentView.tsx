import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Star, Trophy } from 'lucide-react';
import { Task, Activity, Result } from '../types';
import { storage } from '../storage';
import DragDropActivity from './activities/DragDropActivity';
import MatchLinesActivity from './activities/MatchLinesActivity';
import ShortAnswerActivity from './activities/ShortAnswerActivity';
import MultipleChoiceActivity from './activities/MultipleChoiceActivity';
import VideoActivity from './activities/VideoActivity';

interface StudentViewProps {
  taskId: string;
  onBack: () => void;
}

export default function StudentView({ taskId, onBack }: StudentViewProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(true);

  useEffect(() => {
    const loadedTask = storage.getTask(taskId);
    if (loadedTask) {
      setTask(loadedTask);
    }
  }, [taskId]);

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Cargando tarea...</p>
      </div>
    );
  }

  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6">👋</div>
          <h2 className="text-4xl font-bold text-purple-600 mb-4">
            ¡Hola!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            ¿Cómo te llamas?
          </p>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-xl mb-6"
            placeholder="Tu nombre..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && studentName.trim()) {
                setShowNamePrompt(false);
              }
            }}
          />
          <button
            onClick={() => {
              if (studentName.trim()) {
                setShowNamePrompt(false);
              }
            }}
            disabled={!studentName.trim()}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 disabled:scale-100 text-xl"
          >
            ¡Comenzar! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / task.activities.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center animate-bounce-in">
          <div className="text-8xl mb-6 animate-spin-slow">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '🎉'}
          </div>
          <h2 className="text-5xl font-bold text-purple-600 mb-4">
            ¡Felicidades, {studentName}!
          </h2>
          <p className="text-3xl text-gray-700 mb-8">
            Has completado todas las actividades
          </p>
          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-3xl p-8 mb-8">
            <p className="text-2xl font-semibold text-gray-700 mb-2">
              Tu puntuación
            </p>
            <p className="text-6xl font-bold text-purple-600">
              {score} / {task.activities.length}
            </p>
            <p className="text-3xl font-bold text-orange-600 mt-4">
              {percentage}%
            </p>
          </div>
          {percentage >= 80 && (
            <p className="text-2xl text-green-600 font-semibold mb-6">
              ¡Excelente trabajo! 🌟
            </p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p className="text-2xl text-blue-600 font-semibold mb-6">
              ¡Muy bien! Sigue practicando 💪
            </p>
          )}
          {percentage < 60 && (
            <p className="text-2xl text-orange-600 font-semibold mb-6">
              ¡Buen intento! Sigue aprendiendo 📚
            </p>
          )}
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transform transition hover:scale-105 text-xl flex items-center gap-3 mx-auto"
          >
            <Home size={28} />
            Volver al inicio
          </button>
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
          studentName,
          answers,
          score: correct ? score + 1 : score,
          completedAt: new Date().toISOString()
        };
        storage.saveResult(result);
        setCompleted(true);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-3xl shadow-lg p-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            <ArrowLeft size={24} />
            Salir
          </button>
          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" size={24} />
            <span className="text-2xl font-bold text-purple-600">{score}</span>
          </div>
        </div>

        <div className="bg-white px-4 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-purple-600">
              {currentActivityIndex + 1}/{task.activities.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            {task.title}
          </h2>

          {currentActivity.type === 'drag-drop' && (
            <DragDropActivity
              activity={currentActivity}
              onAnswer={handleAnswer}
            />
          )}

          {currentActivity.type === 'match-lines' && (
            <MatchLinesActivity
              activity={currentActivity}
              onAnswer={handleAnswer}
            />
          )}

          {currentActivity.type === 'short-answer' && (
            <ShortAnswerActivity
              activity={currentActivity}
              onAnswer={handleAnswer}
            />
          )}

          {currentActivity.type === 'multiple-choice' && (
            <MultipleChoiceActivity
              activity={currentActivity}
              onAnswer={handleAnswer}
            />
          )}

          {currentActivity.type === 'video' && (
            <VideoActivity
              activity={currentActivity}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className={`${isCorrect ? 'bg-green-500' : 'bg-orange-500'} text-white rounded-3xl p-12 text-center shadow-2xl transform animate-bounce-in`}>
              <div className="text-8xl mb-4">
                {isCorrect ? '🎉' : '💪'}
              </div>
              <p className="text-4xl font-bold">
                {isCorrect ? '¡Muy bien!' : '¡Inténtalo de nuevo!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
