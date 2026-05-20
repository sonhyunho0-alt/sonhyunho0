import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/sound';

interface TimerControlsProps {
  isTicking: boolean;
  isMuted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleMute: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isTicking,
  isMuted,
  onStart,
  onPause,
  onReset,
  onToggleMute,
}) => {
  const handleButtonClick = (action: () => void) => {
    sounds.playPop(); // 모든 컨트롤 버튼에 귀여운 팝업음 바인딩
    action();
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-2">
      {/* 주 제어 버튼 그룹 */}
      <div className="flex items-center justify-center gap-4">
        {/* 리셋 버튼 */}
        <button
          onClick={() => handleButtonClick(onReset)}
          title="초기화"
          className="p-3.5 bg-brand-card hover:bg-[#fff0f3] border border-[#ffccd5] text-brand-text hover:text-[#ff4d6d] rounded-full transition-all duration-200 shadow-md jelly-hover cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* 시작 / 일시정지 버튼 (대형 핵심 버튼) */}
        {!isTicking ? (
          <button
            onClick={() => handleButtonClick(onStart)}
            title="시작"
            className="p-5 bg-brand-tomato hover:bg-[#ff758f] text-white rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(255,77,109,0.35)] jelly-hover hover:scale-105 cursor-pointer flex items-center justify-center"
          >
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </button>
        ) : (
          <button
            onClick={() => handleButtonClick(onPause)}
            title="일시정지"
            className="p-5 bg-brand-coffee hover:bg-[#ffa6c9] text-[#4a3036] rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(255,183,197,0.35)] jelly-hover hover:scale-105 cursor-pointer flex items-center justify-center"
          >
            <Pause className="w-7 h-7 fill-[#4a3036] stroke-[#4a3036]" />
          </button>
        )}

        {/* 음소거 / 효과음 버튼 */}
        <button
          onClick={() => handleButtonClick(onToggleMute)}
          title={isMuted ? '소리 켜기' : '소리 끄기'}
          className={`p-3.5 border rounded-full transition-all duration-200 shadow-md jelly-hover cursor-pointer ${
            isMuted
              ? 'bg-[#ff4d6d]/10 border-[#ff4d6d]/20 text-[#ff4d6d] hover:bg-[#ff4d6d]/20'
              : 'bg-brand-card hover:bg-[#fff0f3] border-[#ffccd5] text-[#ff758f] hover:text-[#ff4d6d]'
          }`}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* 대표님의 개발 집중을 위한 응원 가이드 팁 */}
      <span className="text-[11px] text-brand-text-muted text-center max-w-[240px] leading-relaxed opacity-75">
        Tip: 버튼을 누르시면 아주 쫀득쫀득한 소리와 모션이 재생됩니다! 🎧
      </span>
    </div>
  );
};
