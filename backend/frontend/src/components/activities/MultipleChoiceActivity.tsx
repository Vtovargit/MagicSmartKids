import { useState } from 'react';
import { MultipleChoiceActivity as MultipleChoiceActivityType } from './ActivityEditor';

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
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-neutral-black mb-4 sm:mb-6 text-center">
        {activity.question}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {activity.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={hasAnswered}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-base sm:text-lg font-semibold ${
              selectedOption === index
                ? 'border-primary bg-primary-50 shadow-lg transform scale-105'
                : 'border-secondary-300 bg-neutral-white hover:border-primary hover:bg-primary-50'
            } ${hasAnswered ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === index
                    ? 'border-primary bg-primary'
                    : 'border-secondary-300 bg-neutral-white'
                }`}
              >
                {selectedOption === index && (
                  <div className="text-neutral-white text-sm sm:text-xl">✓</div>
                )}
              </div>
              <span className="text-left">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedOption === null || hasAnswered}
        className="w-full bg-primary hover:bg-primary-600 disabled:bg-secondary-300 disabled:text-secondary-500 text-neutral-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 text-base sm:text-xl"
      >
        {hasAnswered ? 'Enviando...' : 'Enviar respuesta'}
      </button>
    </div>
  );
}