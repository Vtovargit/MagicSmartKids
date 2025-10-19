import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export type ActivityType = 'multiple-choice' | 'drag-drop' | 'match-lines' | 'short-answer' | 'video';

export interface BaseActivity {
  type: ActivityType;
  question: string;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

export interface DragDropActivity extends BaseActivity {
  type: 'drag-drop';
  items: string[];
  correctOrder: number[];
}

export interface MatchLinesActivity extends BaseActivity {
  type: 'match-lines';
  leftItems: string[];
  rightItems: string[];
  correctMatches: number[];
}

export interface ShortAnswerActivity extends BaseActivity {
  type: 'short-answer';
  correctAnswer: string;
}

export interface VideoActivity extends BaseActivity {
  type: 'video';
  videoUrl: string;
}

export type Activity = 
  | MultipleChoiceActivity 
  | DragDropActivity 
  | MatchLinesActivity 
  | ShortAnswerActivity 
  | VideoActivity;

interface ActivityEditorProps {
  activity?: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}

export default function ActivityEditor({ activity, onSave, onCancel }: ActivityEditorProps) {
  const [activityType, setActivityType] = useState<ActivityType>(activity?.type || 'multiple-choice');
  const [question, setQuestion] = useState(activity?.question || '');

  const [mcOptions, setMcOptions] = useState<string[]>(
    activity?.type === 'multiple-choice' ? activity.options : ['', '', '', '']
  );
  const [mcCorrect, setMcCorrect] = useState(
    activity?.type === 'multiple-choice' ? activity.correctAnswer : 0
  );

  const [ddItems, setDdItems] = useState<string[]>(
    activity?.type === 'drag-drop' ? activity.items : ['', '', '']
  );

  const [mlLeft, setMlLeft] = useState<string[]>(
    activity?.type === 'match-lines' ? activity.leftItems : ['', '', '']
  );
  const [mlRight, setMlRight] = useState<string[]>(
    activity?.type === 'match-lines' ? activity.rightItems : ['', '', '']
  );
  const [mlMatches, setMlMatches] = useState<number[]>(
    activity?.type === 'match-lines' ? activity.correctMatches : [0, 1, 2]
  );

  const [saAnswer, setSaAnswer] = useState(
    activity?.type === 'short-answer' ? activity.correctAnswer : ''
  );

  const [videoUrl, setVideoUrl] = useState(
    activity?.type === 'video' ? activity.videoUrl : ''
  );

  const handleSave = () => {
    let newActivity: Activity;

    switch (activityType) {
      case 'multiple-choice':
        newActivity = {
          type: 'multiple-choice',
          question,
          options: mcOptions.filter(o => o.trim() !== ''),
          correctAnswer: mcCorrect
        };
        break;

      case 'drag-drop':
        newActivity = {
          type: 'drag-drop',
          question,
          items: ddItems.filter(i => i.trim() !== ''),
          correctOrder: ddItems.map((_, i) => i)
        };
        break;

      case 'match-lines':
        newActivity = {
          type: 'match-lines',
          question,
          leftItems: mlLeft.filter(i => i.trim() !== ''),
          rightItems: mlRight.filter(i => i.trim() !== ''),
          correctMatches: mlMatches
        };
        break;

      case 'short-answer':
        newActivity = {
          type: 'short-answer',
          question,
          correctAnswer: saAnswer
        };
        break;

      case 'video':
        newActivity = {
          type: 'video',
          question,
          videoUrl
        };
        break;
    }

    onSave(newActivity);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {activity ? 'Editar Actividad' : 'Nueva Actividad'}
          </h1>
          <p className="text-gray-600 mt-1">
            Configura tu actividad interactiva
          </p>
        </div>
        <Button onClick={onCancel} variant="outline">
          ← Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de la Actividad</CardTitle>
        </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-base sm:text-lg font-semibold text-neutral-black mb-2">
                Tipo de Actividad
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as ActivityType)}
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-300 focus:border-primary focus:outline-none text-base sm:text-lg bg-neutral-white text-neutral-black"
              >
                <option value="multiple-choice">✅ Opción Múltiple</option>
                <option value="drag-drop">🎯 Arrastrar y Soltar</option>
                <option value="match-lines">🔗 Unir con Líneas</option>
                <option value="short-answer">✍️ Respuesta Corta</option>
                <option value="video">🎥 Video</option>
              </select>
            </div>

            <div>
              <label className="block text-base sm:text-lg font-semibold text-neutral-black mb-2">
                Pregunta o Instrucción
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-300 focus:border-primary focus:outline-none text-base sm:text-lg bg-neutral-white text-neutral-black"
                placeholder="Escribe la pregunta..."
              />
            </div>

            {activityType === 'multiple-choice' && (
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Opciones
                </label>
                {mcOptions.map((option, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="radio"
                      name="correct"
                      checked={mcCorrect === index}
                      onChange={() => setMcCorrect(index)}
                      className="w-6 h-6"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...mcOptions];
                        newOptions[index] = e.target.value;
                        setMcOptions(newOptions);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none"
                      placeholder={`Opción ${index + 1}`}
                    />
                  </div>
                ))}
                <Button
                  onClick={() => setMcOptions([...mcOptions, ''])}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  + Agregar Opción
                </Button>
              </div>
            )}

            {activityType === 'drag-drop' && (
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Elementos (orden correcto)
                </label>
                {ddItems.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...ddItems];
                      newItems[index] = e.target.value;
                      setDdItems(newItems);
                    }}
                    className="w-full px-4 py-2 rounded-xl border-2 border-green-300 focus:border-green-500 focus:outline-none"
                    placeholder={`Elemento ${index + 1}`}
                  />
                ))}
                <Button
                  onClick={() => setDdItems([...ddItems, ''])}
                  className="bg-green-500 hover:bg-green-600"
                >
                  + Agregar Elemento
                </Button>
              </div>
            )}

            {activityType === 'match-lines' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Columna Izquierda
                  </label>
                  {mlLeft.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...mlLeft];
                        newItems[index] = e.target.value;
                        setMlLeft(newItems);
                      }}
                      className="w-full px-4 py-2 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none mb-2"
                      placeholder={`Item ${index + 1}`}
                    />
                  ))}
                  <Button
                    onClick={() => setMlLeft([...mlLeft, ''])}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    + Agregar
                  </Button>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Columna Derecha
                  </label>
                  {mlRight.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select
                        value={mlMatches[index]}
                        onChange={(e) => {
                          const newMatches = [...mlMatches];
                          newMatches[index] = parseInt(e.target.value);
                          setMlMatches(newMatches);
                        }}
                        className="px-2 py-2 rounded-lg border-2 border-orange-300"
                      >
                        {mlLeft.map((_, i) => (
                          <option key={i} value={i}>{i + 1}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...mlRight];
                          newItems[index] = e.target.value;
                          setMlRight(newItems);
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none"
                        placeholder={`Respuesta ${index + 1}`}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setMlRight([...mlRight, '']);
                      setMlMatches([...mlMatches, 0]);
                    }}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    + Agregar
                  </Button>
                </div>
              </div>
            )}

            {activityType === 'short-answer' && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Respuesta Correcta
                </label>
                <input
                  type="text"
                  value={saAnswer}
                  onChange={(e) => setSaAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-lg"
                  placeholder="Escribe la respuesta correcta..."
                />
              </div>
            )}

            {activityType === 'video' && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  URL del Video (YouTube Embed)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-red-300 focus:border-red-500 focus:outline-none text-lg"
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Usa el formato embed de YouTube. Ejemplo: https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Guardar Actividad
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}