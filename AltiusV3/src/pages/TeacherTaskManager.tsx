import React, { useState, useEffect } from 'react';
import { Button, Input, Label } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const TeacherTaskManager: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectName: '',
    questions: [{ questionText: '', options: ['', ''], correctAnswer: '' }] as Question[]
  });

  const defaultSubjects = [
    'Lengua Castellana', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales', 
    'Inglés', 'Educación Artística', 'Educación Física', 'Ética y Valores', 
    'Tecnología e Informática', 'Religión'
  ];

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', options: ['', ''], correctAnswer: '' }]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    (newQuestions[index] as any)[field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          subjectName: formData.subjectName,
          teacherId: user?.id,
          institutionId: user?.institutionId || 1,
          questions: formData.questions
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Tarea creada exitosamente!');
        setShowForm(false);
        setFormData({ title: '', description: '', subjectName: '', questions: [{ questionText: '', options: ['', ''], correctAnswer: '' }] });
        loadTasks();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const loadTasks = async () => {
    try {
      console.log('🔄 Cargando tareas para profesor...');
      console.log('👤 Usuario:', user);
      console.log('🏛️ Institution ID:', user?.institutionId);
      
      // Primero intentar cargar todas las tareas para debugging
      const allTasksResponse = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const allTasksData = await allTasksResponse.json();
      console.log('📊 Todas las tareas en BD:', allTasksData);
      
      // Luego cargar tareas por institución
      const institutionId = user?.institutionId || 1;
      const response = await fetch(`/api/tasks/institution/${institutionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('📡 Status response:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 Respuesta tareas por institución:', data);
      
      if (data.success) {
        setTasks(data.tasks || []);
        console.log(`✅ ${data.tasks?.length || 0} tareas cargadas`);
      } else {
        console.error('❌ Error en respuesta:', data.message);
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      alert('Error de conexión al cargar tareas: ' + error.message);
    }
  };

  const loadSubjects = async () => {
    try {
      console.log('📚 Cargando materias...');
      
      // Intentar cargar materias del profesor
      const response = await fetch('/api/subjects/teacher', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.subjects.length > 0) {
          setSubjects(data.subjects.map((s: any) => s.name));
          console.log('✅ Materias del profesor cargadas:', data.subjects.length);
          return;
        }
      }
      
      // Si no hay materias del profesor, usar las por defecto
      console.log('📚 Usando materias por defecto');
      setSubjects(defaultSubjects);
      
    } catch (error) {
      console.error('❌ Error cargando materias:', error);
      setSubjects(defaultSubjects);
    }
  };

  useEffect(() => {
    loadTasks();
    loadSubjects();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
        <Button onClick={() => setShowForm(true)}>➕ Nueva Tarea</Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Tarea</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label>Descripción</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <Label>Materia</Label>
              <select
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccionar materia</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Preguntas</h3>
              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="border p-4 rounded mb-4">
                  <Input
                    placeholder="Pregunta"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                    className="mb-2"
                  />
                  
                  {question.options.map((option, oIndex) => (
                    <Input
                      key={oIndex}
                      placeholder={`Opción ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[oIndex] = e.target.value;
                        updateQuestion(qIndex, 'options', newOptions);
                      }}
                      className="mb-1"
                    />
                  ))}
                  
                  <Button type="button" onClick={() => addOption(qIndex)} className="mb-2">
                    + Opción
                  </Button>
                  
                  <Input
                    placeholder="Respuesta correcta"
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                  />
                </div>
              ))}
              
              <Button type="button" onClick={addQuestion}>+ Pregunta</Button>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Crear Tarea</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Mis Tareas</h2>
        </div>
        <div className="p-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No hay tareas creadas</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task: any) => (
                <div key={task.id} className="p-3 border rounded">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Creada: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherTaskManager;