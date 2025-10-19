import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2, VolumeX, RotateCcw, CheckCircle } from 'lucide-react';

interface VideoActivityProps {
  title: string;
  videoUrl: string;
  questions: Array<{
    id: string;
    time: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  onComplete: (score: number, totalQuestions: number) => void;
}

const VideoActivity: React.FC<VideoActivityProps> = ({
  title,
  videoUrl,
  questions,
  onComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Check if we should show a question
      const questionToShow = questions.find(
        q => Math.abs(video.currentTime - q.time) < 0.5 && !answers[q.id]
      );
      if (questionToShow && currentQuestion !== questions.indexOf(questionToShow)) {
        video.pause();
        setIsPlaying(false);
        setCurrentQuestion(questions.indexOf(questionToShow));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [questions, currentQuestion, answers]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuestionSubmit = () => {
    setCurrentQuestion(null);
    // Check if all questions are answered
    if (Object.keys(answers).length === questions.length) {
      calculateResults();
    } else {
      // Continue video
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPlaying(true);
      }
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
    onComplete(correctAnswers, questions.length);
  };

  const resetActivity = () => {
    setAnswers({});
    setCurrentQuestion(null);
    setShowResults(false);
    setScore(0);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            ¡Actividad Completada!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-green-600">
            {score}/{questions.length}
          </div>
          <p className="text-lg text-gray-600">
            Respuestas correctas: {Math.round((score / questions.length) * 100)}%
          </p>
          <Button onClick={resetActivity} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Repetir Actividad
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-white text-sm">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white text-sm">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Modal */}
      {currentQuestion !== null && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-600">
              Pregunta {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{questions[currentQuestion].question}</p>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    answers[questions[currentQuestion].id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button
              onClick={handleQuestionSubmit}
              disabled={!answers[questions[currentQuestion].id]}
              className="w-full"
            >
              Continuar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Preguntas respondidas: {Object.keys(answers).length}/{questions.length}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoActivity;