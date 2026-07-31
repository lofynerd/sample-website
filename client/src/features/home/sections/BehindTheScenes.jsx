import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal.jsx';

export default function BehindTheScenes() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <section className="bg-ink text-bone py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-12 max-w-2xl">
          <span className="text-xs uppercase tracking-widest2 text-bone/50">
            Behind the Scenes
          </span>
          <h2 className="font-display text-display mt-6 text-balance">
            Inside the Atelier
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-video bg-bone/5 overflow-hidden group">
            <video
              ref={videoRef}
              poster="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="none"
              aria-label="Behind the scenes footage from the atelier, muted by default"
            >
              {/* Source intentionally omitted in mock — wire to CloudFront asset URL in production */}
            </video>
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pause video' : 'Play video'}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="w-16 h-16 rounded-full bg-bone/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-luxury">
                {playing ? (
                  <Pause size={22} className="text-ink" />
                ) : (
                  <Play size={22} className="text-ink ml-0.5" />
                )}
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
