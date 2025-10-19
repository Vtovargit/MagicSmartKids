import { useState } from 'react';
import { ShortAnswerActivity as ShortAnswerActivityType } from '../../types';

interface Props {
  activity: ShortAnswerActivityType;
  onAnswer: (answer: string, correct: boolean) => void;
}

export default function ShortAnswerActivity({ activity, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || hasAnswered) return;
    setHasAnswered(true);

    const correct = answer.trim().toLowerCase() === activity.correctAnswer.toLowerCase();
    onAnswer(answer, correct);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {activity.question}
      </h3>

      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={hasAnswered}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          className="w-full px-6 py-4 text-xl rounded-2xl border-4 border-pink-300 focus:border-pink-500 focus:outline-none disabled:bg-gray-100"
          placeholder="Escribe tu respuesta aquí..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!answer.trim() || hasAnswered}
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 disabled:scale-100 text-xl"
      >
        {hasAnswered ? 'Enviando...' : 'Enviar respuesta'}
      </button>
    </div>
  );
}
