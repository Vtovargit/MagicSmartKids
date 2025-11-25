import { useState } from 'react';
import { ShortAnswerActivity as ShortAnswerActivityType } from './ActivityEditor';

interface Props {
  activity: ShortAnswerActivityType;
  onAnswer: (answer: string, correct: boolean) => void;
}

export default function InteractiveShortAnswerActivity({ activity, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || hasAnswered) return;
    setHasAnswered(true);

    const correct = answer.trim().toLowerCase() === activity.correctAnswer.toLowerCase();
    onAnswer(answer, correct);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-neutral-black mb-4 sm:mb-6 text-center">
        {activity.question}
      </h3>

      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={hasAnswered}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-xl rounded-xl border-2 border-secondary-300 focus:border-primary focus:outline-none disabled:bg-secondary-100 bg-neutral-white text-neutral-black"
          placeholder="Escribe tu respuesta aquí..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!answer.trim() || hasAnswered}
        className="w-full bg-primary hover:bg-primary-600 disabled:bg-secondary-300 disabled:text-secondary-500 text-neutral-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 text-base sm:text-xl"
      >
        {hasAnswered ? 'Enviando...' : 'Enviar respuesta'}
      </button>
    </div>
  );
}