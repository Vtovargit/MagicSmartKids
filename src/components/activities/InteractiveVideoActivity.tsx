import { useState, useEffect } from 'react';
import { VideoActivity as VideoActivityType } from './ActivityEditor';

interface Props {
  activity: VideoActivityType;
  onAnswer: (answer: boolean, correct: boolean) => void;
}

export default function InteractiveVideoActivity({ activity, onAnswer }: Props) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      handleContinue();
    }
  }, [showCountdown, countdown]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowCountdown(true);
  };

  const handleContinue = () => {
    onAnswer(true, true);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {activity.question}
      </h3>

      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          width="100%"
          height="100%"
          src={activity.videoUrl}
          title="Video educativo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={(e) => {
            const iframe = e.target as HTMLIFrameElement;
            iframe.contentWindow?.postMessage('{"event":"listening"}', '*');
          }}
        />
      </div>

      {!videoEnded && (
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Mira el video completo para continuar
          </p>
          <button
            onClick={handleVideoEnd}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition"
          >
            Ya terminé de ver el video
          </button>
        </div>
      )}

      {videoEnded && showCountdown && countdown > 0 && (
        <div className="text-center">
          <div className="text-6xl font-bold text-purple-600 mb-4 animate-bounce">
            {countdown}
          </div>
          <p className="text-xl text-gray-600">
            Continuando en...
          </p>
        </div>
      )}

      {videoEnded && !showCountdown && (
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 text-xl"
        >
          Continuar
        </button>
      )}
    </div>
  );
}