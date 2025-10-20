import { useState } from 'react';
import { DragDropActivity as DragDropActivityType } from '../../types';

interface Props {
  activity: DragDropActivityType;
  onAnswer: (answer: number[], correct: boolean) => void;
}

export default function DragDropActivity({ activity, onAnswer }: Props) {
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
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {activity.question}
      </h3>

      <p className="text-center text-gray-600 text-lg">
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
            className={`bg-white border-4 border-blue-300 rounded-2xl p-6 cursor-move hover:shadow-lg transition-all transform hover:scale-102 ${
              draggedItem === index ? 'opacity-50' : ''
            } ${hasAnswered ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">☰</div>
              <span className="text-xl font-semibold text-gray-800">
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={hasAnswered}
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 disabled:scale-100 text-xl"
      >
        {hasAnswered ? 'Enviando...' : 'Enviar respuesta'}
      </button>
    </div>
  );
}
