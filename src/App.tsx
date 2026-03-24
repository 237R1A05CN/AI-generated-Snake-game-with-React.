/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00FFFF] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-noise"></div>
      <div className="scanlines"></div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center screen-tear">
        <h1 
          className="glitch-text text-3xl md:text-5xl mb-12 text-center" 
          data-text="SYS.PROTOCOL_SNAKE"
        >
          SYS.PROTOCOL_SNAKE
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start w-full justify-center">
          {/* Left: Game Area */}
          <div className="flex flex-col items-center w-full max-w-[400px]">
            <div className="w-full flex justify-between items-end mb-2 border-b-2 border-[#FF00FF] pb-2">
              <div className="text-xl text-[#FF00FF]">
                DATA_YIELD:
              </div>
              <div className="text-2xl font-bold text-[#00FFFF]">
                {score.toString().padStart(4, '0')}
              </div>
            </div>
            <SnakeGame onScoreChange={setScore} onGameOver={() => {}} />
          </div>

          {/* Right: Sidebar (Music & Controls) */}
          <div className="flex flex-col gap-8 w-full max-w-md mt-4 lg:mt-0">
            <MusicPlayer />

            <div className="p-4 bg-black border-2 border-[#00FFFF] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FF00FF] opacity-50 animate-pulse"></div>
              <h3 className="text-[#FF00FF] text-xl mb-4 font-['Press_Start_2P'] text-sm">
                &gt; EXECUTION_PARAMS
              </h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-[#FF00FF]">[W,A,S,D]</span>
                  <span className="text-[#00FFFF]">VECTOR_OVERRIDE</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FF00FF]">[SPACE]</span>
                  <span className="text-[#00FFFF]">HALT_PROCESS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
