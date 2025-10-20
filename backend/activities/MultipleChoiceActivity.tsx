import { useState } from 'react';
import { MultipleChoiceActivity as MultipleChoiceActivityType } from '../../types';

interface Props {
  activity: MultipleChoiceActivityType;
  onAnswer: (answer: number, correct: boolean) => void;
}

export default function MultipleChoiceActivity({ activity, onAnswer }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasAnswered) return;
    setHasAnswered(true);
    const correct = selectedOption === activity.correctAnswer;
    onAnswer(selectedOption, correct);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {activity.question}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activity.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={hasAnswered}
            className={`p-6 rounded-2xl border-4 transition-all transform hover:scale-105 text-lg font-semibold ${
              selectedOption === index
                ? 'border-purple-500 bg-purple-100 shadow-lg'
                : 'border-gray-300 bg-white hover:border-purple-300'
            } ${hasAnswered ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                  selectedOption === index
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {selectedOption === index && (
                  <div className="text-white text-xl">✓</div>
                )}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedOption === null || hasAnswered}
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 disabled:scale-100 text-xl"
      >
        {hasAnswered ? 'Enviando...' : 'Enviar respuesta'}
      </button>
    </div>
  );
}
