import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

const StudentTaskView: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const loadTasks = async () => {
    try {
      console.log('🔄 Cargando tareas para estudiante...');
      console.log('👤 Usuario:', user);
      
      // Primero intentar cargar todas las tareas
      const allTasksResponse = await fetch('/api/tasks');
      const allTasksData = await allTasksResponse.json();
      console.log('📊 Todas las tareas disponibles:', allTasksData);
      
      // Luego cargar tareas del estudiante
      const response = await fetch(`/api/tasks/student/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('📡 Status response:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 Respuesta tareas del estudiante:', data);
      
      if (data.success) {
        setTasks(data.tasks || []);
        console.log(`✅ ${data.tasks?.length || 0} tareas disponibles`);
      } else {
        console.error('❌ Error en respuesta:', data.message);
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      alert('Error de conexión al cargar tareas: ' + error.message);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const submitTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId: user?.id,
          answers: JSON.stringify(answers)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        alert(`¡Tarea enviada! Puntaje: ${data.submission.score}`);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (selectedTask) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">{selectedTask.title}</h1>
          <p className="text-gray-600 mb-6">{selectedTask.description}</p>

          {!submitted ? (
            <>
              {selectedTask.questions?.map((question: any, index: number) => (
                <div key={index} className="mb-6 p-4 border rounded">
                  <h3 className="font-semibold mb-3">
                    {index + 1}. {question.questionText}
                  </h3>
                  
                  {JSON.parse(question.options || '[]').map((option: string, optIndex: number) => (
                    <label key={optIndex} className="block mb-2">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button onClick={submitTask}>Enviar Respuestas</Button>
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Volver
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                ¡Tarea Completada!
              </h2>
              <Button onClick={() => setSelectedTask(null)}>
                Volver a Tareas
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Tareas</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Tareas Disponibles</h2>
        </div>
        <div className="p-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No hay tareas disponibles</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task: any) => (
                <div key={task.id} className="p-4 border rounded hover:bg-gray-50">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Materia: {task.subjectName} | Creada: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <Button onClick={() => setSelectedTask(task)}>
                      Resolver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTaskView;