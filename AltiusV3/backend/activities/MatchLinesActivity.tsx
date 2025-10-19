import { useState } from 'react';
import { MatchLinesActivity as MatchLinesActivityType } from '../../types';

interface Props {
  activity: MatchLinesActivityType;
  onAnswer: (answer: number[], correct: boolean) => void;
}

export default function MatchLinesActivity({ activity, onAnswer }: Props) {
  const [matches, setMatches] = useState<(number | null)[]>(
    activity.rightItems.map(() => null)
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleLeftClick = (index: number) => {
    if (hasAnswered) return;
    setSelectedLeft(index);
  };

  const handleRightClick = (rightIndex: number) => {
    if (hasAnswered || selectedLeft === null) return;

    const newMatches = [...matches];
    const existingMatchIndex = newMatches.indexOf(selectedLeft);
    if (existingMatchIndex !== -1) {
      newMatches[existingMatchIndex] = null;
    }

    newMatches[rightIndex] = selectedLeft;
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (hasAnswered || matches.some(m => m === null)) return;
    setHasAnswered(true);

    const correct = JSON.stringify(matches) === JSON.stringify(activity.correctMatches);
    onAnswer(matches as number[], correct);
  };

  const allMatched = matches.every(m => m !== null);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {activity.question}
      </h3>

      <p className="text-center text-gray-600 text-lg">
        Haz clic en un elemento de la izquierda y luego en su pareja de la derecha
      </p>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          {activity.leftItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleLeftClick(index)}
              disabled={hasAnswered}
              className={`w-full p-6 rounded-2xl border-4 transition-all text-lg font-semibold ${
                selectedLeft === index
                  ? 'border-orange-500 bg-orange-100 shadow-lg transform scale-105'
                  : matches.includes(index)
                  ? 'border-green-300 bg-green-50'
                  : 'border-blue-300 bg-white hover:border-blue-500'
              } ${hasAnswered ? 'cursor-not-allowed' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activity.rightItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleRightClick(index)}
              disabled={hasAnswered}
              className={`w-full p-6 rounded-2xl border-4 transition-all text-lg font-semibold ${
                matches[index] !== null
                  ? 'border-green-500 bg-green-100 shadow-lg'
                  : 'border-purple-300 bg-white hover:border-purple-500'
              } ${hasAnswered ? 'cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span>{item}</span>
                {matches[index] !== null && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allMatched || hasAnswered}
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 disabled:scale-100 text-xl"
      >
        {hasAnswered ? 'Enviando...' : allMatched ? 'Enviar respuesta' : 'Completa todas las parejas'}
      </button>
    </div>
  );
}
