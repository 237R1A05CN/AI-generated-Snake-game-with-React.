import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "0x01_CYBER_HORIZON", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "0x02_GRID_RUNNER", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "0x03_DIGITAL_DECAY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.log("Audio play blocked", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="flex flex-col p-4 bg-black border-2 border-[#FF00FF] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00FFFF] opacity-50 animate-pulse"></div>
      
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
      />

      <div className="mb-6 border-b-2 border-[#00FFFF] pb-4">
        <p className="text-[#FF00FF] text-sm mb-2">&gt; AUDIO_STREAM_STATUS:</p>
        <div className="bg-[#00FFFF] text-black p-2 font-bold truncate">
          {isPlaying ? "STREAMING..." : "IDLE"} {TRACKS[currentTrack].title}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={prevTrack} 
            className="px-3 py-1 bg-black border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black cursor-pointer"
          >
            [ {"<<"} ]
          </button>
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-black border-2 border-[#FF00FF] text-[#FF00FF] font-bold hover:bg-[#FF00FF] hover:text-black cursor-pointer"
          >
            {isPlaying ? "[ HALT ]" : "[ EXECUTE ]"}
          </button>
          <button 
            onClick={nextTrack} 
            className="px-3 py-1 bg-black border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black cursor-pointer"
          >
            [ {">>"} ]
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <span className="text-[#FF00FF] text-sm">VOL:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-[#00FFFF]/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#FF00FF] [&::-webkit-slider-thumb]:-mt-2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
