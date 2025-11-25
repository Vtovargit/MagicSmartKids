import { useState } from 'react';
import { DragDropActivity as DragDropActivityType } from './ActivityEditor';

interface Props {
  activity: DragDropActivityType;
  onAnswer: (answer: number[], correct: boolean) => void;
}

export default function InteractiveDragDropActivity({ activity, onAnswer }: Props) {
  const [items, setItems] = useState(
    activity.items.map((item, index) => ({ id: index, text: item }))
  );
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleDragStart = (index: number) => {
    if (hasAnswered) return;
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedItem === null || hasAnswered) return;

    const newItems = [...items];
    const draggedItemData = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemData);

    setItems(newItems);
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    if (hasAnswered) return;
    setHasAnswered(true);

    const currentOrder = items.map(item => item.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(activity.correctOrder);

    onAnswer(currentOrder, correct);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-neutral-black mb-4 sm:mb-6 text-center">
        {activity.question}
      </h3>

      <p className="text-center text-secondary text-base sm:text-lg">
        Arrastra los elementos para ordenarlos correctamente
      </p>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={!hasAnswered}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`bg-neutral-white border-2 border-secondary-300 rounded-xl p-4 sm:p-6 cursor-move hover:shadow-lg hover:border-primary transition-all duration-200 transform hover:scale-102 ${
              draggedItem === index ? 'opacity-50' : ''
            } ${hasAnswered ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-2xl sm:text-3xl text-secondary">☰</div>
              <span className="text-base sm:text-xl font-semibold text-neutral-black">
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={hasAnswered}
        className="w-full bg-primary hover:bg-primary-600 disabled:bg-secondary-300 disabled:text-secondary-500 text-neutral-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 text-base sm:text-xl"
      >
        {hasAnswered ? 'Enviando...' : 'Enviar respuesta'}
      </button>
    </div>
  );
}