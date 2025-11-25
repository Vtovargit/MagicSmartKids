import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, RotateCcw, Trophy } from 'lucide-react';

interface DragItem {
  id: string;
  content: string;
  correctZone: string;
}

interface DropZone {
  id: string;
  label: string;
  items: DragItem[];
}

interface DragDropActivityProps {
  title: string;
  instructions: string;
  items: DragItem[];
  zones: Omit<DropZone, 'items'>[];
  onComplete: (score: number, totalItems: number) => void;
}

const DragDropActivity: React.FC<DragDropActivityProps> = ({
  title,
  instructions,
  items,
  zones,
  onComplete
}) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropZones, setDropZones] = useState<DropZone[]>(
    zones.map(zone => ({ ...zone, items: [] }))
  );
  const [availableItems, setAvailableItems] = useState<DragItem[]>(items);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove item from its current location
    setAvailableItems(prev => prev.filter(item => item.id !== draggedItem.id));
    setDropZones(prev => prev.map(zone => ({
      ...zone,
      items: zone.items.filter(item => item.id !== draggedItem.id)
    })));

    // Add item to new zone
    setDropZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { ...zone, items: [...zone.items, draggedItem] }
        : zone
    ));

    setDraggedItem(null);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove item from drop zones
    setDropZones(prev => prev.map(zone => ({
      ...zone,
      items: zone.items.filter(item => item.id !== draggedItem.id)
    })));

    // Add back to available items
    setAvailableItems(prev => [...prev, draggedItem]);
    setDraggedItem(null);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    dropZones.forEach(zone => {
      zone.items.forEach(item => {
        if (item.correctZone === zone.id) {
          correctCount++;
        }
      });
    });
    setScore(correctCount);
    setIsCompleted(true);
    onComplete(correctCount, items.length);
  };

  const resetActivity = () => {
    setAvailableItems(items);
    setDropZones(zones.map(zone => ({ ...zone, items: [] })));
    setIsCompleted(false);
    setScore(0);
    setDraggedItem(null);
  };

  const isAllItemsPlaced = availableItems.length === 0;

  if (isCompleted) {
    const percentage = Math.round((score / items.length) * 100);
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            ¡Actividad Completada!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4">
            {percentage >= 90 ? '🌟' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <div className="text-4xl font-bold text-green-600">
            {score}/{items.length}
          </div>
          <p className="text-lg text-gray-600">
            Elementos correctos: {percentage}%
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-gray-600">{instructions}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elementos disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="min-h-32 p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-2"
              onDragOver={handleDragOver}
              onDrop={handleDropToAvailable}
            >
              {availableItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="p-3 bg-blue-100 border border-blue-300 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
                >
                  {item.content}
                </div>
              ))}
              {availableItems.length === 0 && (
                <p className="text-gray-500 text-center">
                  Todos los elementos han sido colocados
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Drop Zones */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {dropZones.map(zone => (
            <Card key={zone.id}>
              <CardHeader>
                <CardTitle className="text-lg">{zone.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-32 p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-2"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, zone.id)}
                >
                  {zone.items.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="p-3 bg-green-100 border border-green-300 rounded-lg cursor-move hover:bg-green-200 transition-colors"
                    >
                      {item.content}
                    </div>
                  ))}
                  {zone.items.length === 0 && (
                    <p className="text-gray-400 text-center">
                      Arrastra elementos aquí
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Elementos colocados: {items.length - availableItems.length}/{items.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((items.length - availableItems.length) / items.length) * 100}%` }}
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
                disabled={!isAllItemsPlaced}
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

export default DragDropActivity;