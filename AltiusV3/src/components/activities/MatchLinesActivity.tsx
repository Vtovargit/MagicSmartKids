import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, RotateCcw, Trophy } from 'lucide-react';

interface MatchItem {
  id: string;
  content: string;
  matchId: string;
}

interface MatchLinesActivityProps {
  title: string;
  instructions: string;
  leftItems: MatchItem[];
  rightItems: MatchItem[];
  onComplete: (score: number, totalMatches: number) => void;
}

const MatchLinesActivity: React.FC<MatchLinesActivityProps> = ({
  title,
  instructions,
  leftItems,
  rightItems,
  onComplete
}) => {
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLeftItemClick = (itemId: string) => {
    if (selectedLeft === itemId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(itemId);
    }
  };

  const handleRightItemClick = (itemId: string) => {
    if (selectedLeft) {
      // Create or update connection
      setConnections(prev => ({
        ...prev,
        [selectedLeft]: itemId
      }));
      setSelectedLeft(null);
    }
  };

  const removeConnection = (leftItemId: string) => {
    setConnections(prev => {
      const newConnections = { ...prev };
      delete newConnections[leftItemId];
      return newConnections;
    });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    Object.entries(connections).forEach(([leftId, rightId]) => {
      const leftItem = leftItems.find(item => item.id === leftId);
      const rightItem = rightItems.find(item => item.id === rightId);
      if (leftItem && rightItem && leftItem.matchId === rightItem.matchId) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsCompleted(true);
    onComplete(correctCount, leftItems.length);
  };

  const resetActivity = () => {
    setConnections({});
    setSelectedLeft(null);
    setIsCompleted(false);
    setScore(0);
  };

  const getItemPosition = (itemId: string, side: 'left' | 'right') => {
    const element = document.getElementById(`${side}-${itemId}`);
    const container = containerRef.current;
    if (!element || !container) return { x: 0, y: 0 };

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    return {
      x: elementRect.left - containerRect.left + (side === 'left' ? elementRect.width : 0),
      y: elementRect.top - containerRect.top + elementRect.height / 2
    };
  };

  const renderConnections = () => {
    return Object.entries(connections).map(([leftId, rightId]) => {
      const leftPos = getItemPosition(leftId, 'left');
      const rightPos = getItemPosition(rightId, 'right');
      const leftItem = leftItems.find(item => item.id === leftId);
      const rightItem = rightItems.find(item => item.id === rightId);
      const isCorrect = leftItem && rightItem && leftItem.matchId === rightItem.matchId;

      return (
        <line
          key={`${leftId}-${rightId}`}
          x1={leftPos.x}
          y1={leftPos.y}
          x2={rightPos.x}
          y2={rightPos.y}
          stroke={isCompleted ? (isCorrect ? '#10b981' : '#ef4444') : '#3b82f6'}
          strokeWidth="2"
          className="transition-colors"
        />
      );
    });
  };

  if (isCompleted) {
    const percentage = Math.round((score / leftItems.length) * 100);
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
            {score}/{leftItems.length}
          </div>
          <p className="text-lg text-gray-600">
            Conexiones correctas: {percentage}%
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

      <Card>
        <CardContent className="p-6">
          <div ref={containerRef} className="relative">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-center mb-4">Columna A</h3>
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    id={`left-${item.id}`}
                    onClick={() => handleLeftItemClick(item.id)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      selectedLeft === item.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : connections[item.id]
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.content}</span>
                      {connections[item.id] && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeConnection(item.id);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-center mb-4">Columna B</h3>
                {rightItems.map(item => {
                  const isConnected = Object.values(connections).includes(item.id);
                  return (
                    <button
                      key={item.id}
                      id={`right-${item.id}`}
                      onClick={() => handleRightItemClick(item.id)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                        isConnected
                          ? 'border-green-300 bg-green-50'
                          : selectedLeft
                          ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {item.content}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SVG for drawing lines */}
            <svg
              ref={svgRef}
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            >
              {renderConnections()}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Haz clic en un elemento de la Columna A para seleccionarlo</p>
            <p>• Luego haz clic en el elemento correspondiente de la Columna B para crear la conexión</p>
            <p>• Puedes hacer clic en la ✕ para eliminar una conexión</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Conexiones realizadas: {Object.keys(connections).length}/{leftItems.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(Object.keys(connections).length / leftItems.length) * 100}%` }}
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
                disabled={Object.keys(connections).length !== leftItems.length}
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

export default MatchLinesActivity;