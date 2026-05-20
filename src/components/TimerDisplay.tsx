import React from 'react';

interface TimerDisplayProps {
  timeLeft: number; // 남은 시간 (초)
  totalDuration: number; // 전체 설정 시간 (초)
  isTicking: boolean;
  sessionType: 'focus' | 'break';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalDuration,
  isTicking,
  sessionType,
}) => {
  // 분과 초 계산
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // 두 자리 포맷
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // 원형 프로그레스 계산
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDuration > 0 ? timeLeft / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // 세션 유형에 따른 테마 색상 결정
  const colorClass = sessionType === 'focus' ? 'text-brand-tomato' : 'text-brand-leaf';
  const strokeClass = sessionType === 'focus' ? 'stroke-brand-tomato' : 'stroke-brand-leaf';

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-6 select-none">
      {/* 백그라운드 원형 트랙 */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r={radius}
          className="stroke-[#ffe5ec]"
          strokeWidth="10"
          fill="transparent"
        />
        {/* 애니메이션 프로그레스 링 */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          className={`transition-all duration-300 ease-linear ${strokeClass}`}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* 중앙 타이머 텍스트 정보 */}
      <div className="z-10 flex flex-col items-center justify-center">
        {/* 세션 명칭 배지 */}
        <span
          className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase mb-1 shadow-sm ${
            sessionType === 'focus'
              ? 'bg-brand-tomato/10 text-brand-tomato border border-brand-tomato/20'
              : 'bg-brand-leaf/10 text-brand-leaf border border-brand-leaf/20'
          }`}
        >
          {sessionType === 'focus' ? 'Focus' : 'Break'}
        </span>

        {/* 대형 타이머 숫자 */}
        <div
          className={`font-display text-5xl font-black tracking-tighter tabular-nums leading-none select-text ${colorClass} ${
            isTicking ? 'ticking' : ''
          }`}
        >
          {formattedMinutes}
          <span className={`inline-block mx-0.5 ${isTicking ? 'animate-pulse' : ''}`}>:</span>
          {formattedSeconds}
        </div>

        {/* 미세 서브 텍스트 */}
        <span className="text-[10px] text-brand-text-muted mt-2 tracking-wide font-medium">
          {isTicking ? '째깍째깍 집중하는 중...' : '잠시 대기 중'}
        </span>
      </div>

      {/* 데코용 귀여운 반짝이 별 (Focus 상태이고 작동 중일 때만 표시) */}
      {isTicking && sessionType === 'focus' && (
        <>
          <div className="absolute top-8 left-8 text-yellow-300 animate-ping text-xs">✨</div>
          <div className="absolute bottom-10 right-10 text-yellow-300 animate-bounce text-sm">⭐</div>
        </>
      )}
    </div>
  );
};
