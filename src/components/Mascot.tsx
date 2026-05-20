import React from 'react';

interface MascotProps {
  status: 'focus' | 'break' | 'paused' | 'idle';
}

export const Mascot: React.FC<MascotProps> = ({ status }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-48 w-full select-none">
      {/* 귀여운 캐릭터 팝업 말풍선 */}
      <div className="absolute -top-3 bg-white border-2 border-[#ffccd5] text-xs px-3 py-1.5 rounded-full text-[#ff4d6d] font-bold shadow-md animate-bounce">
        {status === 'focus' && "🎀 대표님, 헬로키티랑 빡집중해요! 화이팅!"}
        {status === 'break' && "🎀 대표님 고생하셨어요! 맛있는 간식 먹으며 쉬어요~"}
        {status === 'paused' && "⏸️ 앗, 헬로키티가 대표님을 기다리고 있어요!"}
        {status === 'idle' && "🎀 준비 완료! 헬로키티랑 같이 시작해볼까요?"}
      </div>

      {/* SVG 캐릭터 컨테이너 */}
      <svg
        viewBox="0 0 200 140"
        className="w-48 h-36 drop-shadow-[0_8px_16px_rgba(255,117,143,0.3)] transition-all duration-500"
      >
        {/* === 캐릭터 1: 대표 마스코트 '귀요미 토마토' === */}
        {/* 몸체 (Tomato Body) */}
        <ellipse
          cx="80"
          cy="85"
          rx="38"
          ry="32"
          className={`transition-colors duration-500 ${
            status === 'break' ? 'fill-brand-leaf' : 'fill-brand-tomato'
          }`}
          stroke="#4a3036"
          strokeWidth="2.5"
        />

        {/* 볼 터치 및 헬로키티 수염 */}
        <circle cx="54" cy="90" r="6" fill="#ffa6a6" opacity="0.9" />
        <circle cx="106" cy="90" r="6" fill="#ffa6a6" opacity="0.9" />

        <g stroke="#4a3036" strokeWidth="1.8" strokeLinecap="round">
          {/* 왼쪽 수염 */}
          <line x1="34" y1="84" x2="44" y2="86" />
          <line x1="31" y1="90" x2="44" y2="90" />
          <line x1="34" y1="96" x2="44" y2="94" />

          {/* 오른쪽 수염 */}
          <line x1="126" y1="84" x2="116" y2="86" />
          <line x1="129" y1="90" x2="116" y2="90" />
          <line x1="126" y1="96" x2="116" y2="94" />
        </g>

        {/* 헬로키티 핑크 리본 (Hello Kitty Ribbon) */}
        <g transform="translate(52, 60) scale(0.65)">
          {/* 왼쪽 리본 날개 */}
          <path d="M 0 0 C -15 -15, -20 10, 0 0" fill="#ff4d6d" stroke="#4a3036" strokeWidth="2.5" />
          {/* 오른쪽 리본 날개 */}
          <path d="M 0 0 C 15 -15, 20 10, 0 0" fill="#ff4d6d" stroke="#4a3036" strokeWidth="2.5" />
          {/* 리본 알맹이 */}
          <circle cx="0" cy="0" r="5.5" fill="#ffd166" stroke="#4a3036" strokeWidth="2.5" />
        </g>

        {/* 토마토 꼭지 (Tomato Leaf) */}
        <g className="origin-[80px_55px] animate-pulse">
          <path
            d="M 80 55 C 75 42, 60 48, 62 58 C 70 56, 75 58, 80 55"
            fill="#2f9e44"
          />
          <path
            d="M 80 55 C 85 42, 100 48, 98 58 C 90 56, 85 58, 80 55"
            fill="#2f9e44"
          />
          <path
            d="M 80 55 C 80 35, 76 35, 78 40"
            stroke="#2f9e44"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 눈과 입 - 상태별 변경 */}
        {status === 'focus' && (
          <g>
            {/* 진지하고 귀여운 눈길 (동글동글 안경) */}
            <circle cx="66" cy="78" r="8" stroke="#ffffff" strokeWidth="2" fill="none" />
            <circle cx="66" cy="78" r="3" fill="#ffffff" />
            <circle cx="94" cy="78" r="8" stroke="#ffffff" strokeWidth="2" fill="none" />
            <circle cx="94" cy="78" r="3" fill="#ffffff" />
            <line x1="74" y1="78" x2="86" y2="78" stroke="#ffffff" strokeWidth="2" />
            
            {/* 야무지게 다문 입 */}
            <path d="M 76 92 Q 80 88 84 92" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* 타이핑 중인 손 (동그라미) */}
            <circle cx="50" cy="105" r="4" fill="#ffffff" className="animate-bounce" />
            <circle cx="110" cy="105" r="4" fill="#ffffff" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
            
            {/* 미니 노트북 */}
            <path d="M 65 115 L 95 115 L 100 125 L 60 125 Z" fill="#4a5568" />
            <path d="M 60 125 L 100 125 L 98 128 L 62 128 Z" fill="#2d3748" />
            <rect x="70" y="117" width="20" height="7" fill="#63b3ed" opacity="0.8" className="animate-pulse" />
          </g>
        )}

        {status === 'break' && (
          <g>
            {/* 만족스러운 힐링 눈 (웃는 눈) */}
            <path d="M 60 80 Q 66 74 72 80" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 88 80 Q 94 74 100 80" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            
            {/* 웃는 입 */}
            <path d="M 74 90 Q 80 98 86 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            
            {/* 썬글라스 테마 (옵션: 휴식 중 선베드 느낌) */}
            <circle cx="79" cy="115" r="6" fill="#fbd38d" className="animate-pulse" />
            <text x="89" y="118" fill="#ffffff" fontSize="8" fontWeight="bold">🍹</text>
          </g>
        )}

        {status === 'paused' && (
          <g>
            {/* 당황한 눈 (x x 모양) */}
            <path d="M 62 74 L 70 82 M 70 74 L 62 82" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 90 74 L 98 82 M 98 74 L 90 82" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* 동그랗게 놀란 입 */}
            <circle cx="80" cy="94" r="5" fill="#ffffff" />
            
            {/* 땀방울 애니메이션 */}
            <path
              d="M 112 65 C 112 65, 115 70, 112 73 C 110 70, 112 65, 112 65"
              fill="#63b3ed"
              className="animate-bounce"
            />
          </g>
        )}

        {status === 'idle' && (
          <g>
            {/* 초롱초롱한 기본 눈 */}
            <circle cx="66" cy="80" r="5" fill="#ffffff" />
            <circle cx="66" cy="78" r="1.5" fill="#000000" />
            <circle cx="94" cy="80" r="5" fill="#ffffff" />
            <circle cx="94" cy="78" r="1.5" fill="#000000" />
            
            {/* 살짝 짓는 미소 */}
            <path d="M 75 92 Q 80 96 85 92" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}


        {/* === 캐릭터 2: 보좌역 '귀염둥이 코다리(Kodari)' === */}
        {/* 생선(코다리) 몸체 (Kodari Fish Body) */}
        <g transform="translate(135, 75) scale(0.75)" className="origin-center">
          {/* 꼬리 흔들림 효과 */}
          <path
            d="M 40 15 L 55 5 L 50 15 L 55 25 Z"
            fill="#4ecdc4"
            className={`${status === 'focus' ? 'animate-ping' : 'animate-pulse'}`}
            style={{ animationDuration: '1.5s' }}
          />
          {/* 생선 몸체 */}
          <path
            d="M 0 15 C 10 -5, 35 -2, 40 15 C 35 32, 10 35, 0 15 Z"
            fill="#a5d8ff"
            className="stroke-brand-leaf stroke-[1.5]"
          />
          {/* 아가미 */}
          <path d="M 12 8 Q 15 15 12 22" stroke="#4ecdc4" strokeWidth="2" fill="none" />
          
          {/* 코다리 눈 */}
          <circle cx="6" cy="11" r="3" fill="#ffffff" />
          <circle cx="6" cy="11" r="1" fill="#000000" />
          
          {/* 미니 부장님 안경 또는 장식 */}
          {status === 'focus' && (
            <path d="M 1 7 L 11 7" stroke="#ffd43b" strokeWidth="2" />
          )}

          {/* 헬로키티 리본 */}
          <g transform="translate(16, 2) scale(0.4)">
            <path d="M 0 0 C -15 -15, -20 10, 0 0" fill="#ff4d6d" stroke="#4a3036" strokeWidth="2.5" />
            <path d="M 0 0 C 15 -15, 20 10, 0 0" fill="#ff4d6d" stroke="#4a3036" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="5" fill="#ffd166" stroke="#4a3036" strokeWidth="2.5" />
          </g>

          {/* 말풍선 꼬리 */}
          <path d="M -10 10 L 0 15 L -5 20 Z" fill="#a5d8ff" />
        </g>
      </svg>
      
      {/* 타이머 상태 캡션 */}
      <span className="mt-2 text-sm font-semibold tracking-wider text-brand-text-muted">
        {status === 'focus' && "FOCUS TIME"}
        {status === 'break' && "BREAK TIME"}
        {status === 'paused' && "PAUSED"}
        {status === 'idle' && "READY TO FOCUS"}
      </span>
    </div>
  );
};
