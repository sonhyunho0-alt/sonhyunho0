import { useState, useEffect, useRef } from 'react';
import { Mascot } from './components/Mascot';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { sounds } from './utils/sound';
import { calculateTimeLeft, getNextSession } from './utils/timer';
import { Award, Zap, Coffee, Flame, RotateCcw } from 'lucide-react';

interface Preset {
  name: string;
  focus: number; // 초 단위
  break: number; // 초 단위
  label: string;
  icon: 'standard' | 'long' | 'test';
}

const PRESETS: Preset[] = [
  { name: '뽀모도로 (기본)', focus: 25 * 60, break: 5 * 60, label: '집중 25분 / 휴식 5분', icon: 'standard' },
  { name: '하이퍼 집중', focus: 50 * 60, break: 10 * 60, label: '집중 50분 / 휴식 10분', icon: 'long' },
  { name: '코다리 테스트', focus: 10, break: 3, label: '집중 10초 / 휴식 3초 (빠른 확인용)', icon: 'test' },
];

interface FocusLog {
  time: string;
  type: 'focus' | 'break';
  durationMinutes: number | string;
  message: string;
}

const KODARI_ENCOURAGEMENTS = [
  "역시 대표님의 안목과 집중력은 기가 막히십니다! 🚀",
  "이 코다리가 보기에 대표님은 오늘 100억 자산가에 한 걸음 더 다가섰습니다! 😎",
  "아주 좋습니다! 이 기세로 세상을 정복해 버리시죠! 🫡",
  "대표님의 손가락 끝에서 명작이 탄생하고 있습니다! 🔥",
  "완벽한 집중이었습니다! 5분 푹 쉬고 다음 질주를 준비하시죠! ☕",
];

export default function App() {
  // 상태 정의
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(PRESETS[0].focus);
  const [isTicking, setIsTicking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // 통계
  const [focusCount, setFocusCount] = useState<number>(0);
  const [logs, setLogs] = useState<FocusLog[]>([]);

  // 정확한 시간 측정을 위한 타이머 Ref
  const startTimeRef = useRef<number | null>(null);
  const secondsAtStartRef = useRef<number>(timeLeft);
  const previousSecondRef = useRef<number>(timeLeft);

  // 프리셋 변경 처리
  const handleApplyPreset = (preset: Preset) => {
    sounds.playPop();
    setSelectedPreset(preset);
    setSessionType('focus');
    setTimeLeft(preset.focus);
    setIsTicking(false);
    startTimeRef.current = null;
  };

  // 타이머 작동 상태 관리 (동기화 보정 엔진)
  useEffect(() => {
    if (!isTicking) {
      startTimeRef.current = null;
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      secondsAtStartRef.current = timeLeft;
      previousSecondRef.current = timeLeft;
    }

    const timerInterval = setInterval(() => {
      const nextTimeLeft = calculateTimeLeft(startTimeRef.current!, secondsAtStartRef.current);

      // 초가 실제로 바뀔 때 째깍음 출력 (음소거 상태가 아닐 때)
      if (nextTimeLeft !== previousSecondRef.current) {
        if (nextTimeLeft > 0) {
          sounds.playTick();
        }
        previousSecondRef.current = nextTimeLeft;
      }

      setTimeLeft(nextTimeLeft);

      // 시간 완료 시 처리
      if (nextTimeLeft === 0) {
        clearInterval(timerInterval);
        handleSessionComplete();
      }
    }, 100);

    return () => clearInterval(timerInterval);
  }, [isTicking, sessionType]);

  // 세션 완료 처리
  const handleSessionComplete = () => {
    setIsTicking(false);
    startTimeRef.current = null;
    
    // 완료음 재생
    sounds.playComplete();

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const nextSession = getNextSession(sessionType, selectedPreset.focus, selectedPreset.break);

    if (sessionType === 'focus') {
      // 집중 세션 완료
      setFocusCount((prev) => prev + 1);
      
      const newLog: FocusLog = {
        time: timeString,
        type: 'focus',
        durationMinutes: selectedPreset.focus >= 60 ? Math.round(selectedPreset.focus / 60) : `${selectedPreset.focus}초`,
        message: KODARI_ENCOURAGEMENTS[Math.floor(Math.random() * KODARI_ENCOURAGEMENTS.length)],
      };
      setLogs((prev) => [newLog, ...prev]);

      // 1초 뒤 휴식 시작 알림음
      setTimeout(() => {
        sounds.playBreakStart();
      }, 1200);

    } else {
      // 휴식 완료
      const newLog: FocusLog = {
        time: timeString,
        type: 'break',
        durationMinutes: selectedPreset.break >= 60 ? Math.round(selectedPreset.break / 60) : `${selectedPreset.break}초`,
        message: "휴식 끝! 대표님, 다시 한번 맹렬히 달려봅시다! 🫡🚀",
      };
      setLogs((prev) => [newLog, ...prev]);

      // 1초 뒤 집중 시작 알림음
      setTimeout(() => {
        sounds.playFocusStart();
      }, 1200);
    }

    setSessionType(nextSession.type);
    setTimeLeft(nextSession.duration);
  };

  // 제어 콜백
  const handleStart = () => {
    if (timeLeft === 0) return;
    setIsTicking(true);
    if (sessionType === 'focus') {
      sounds.playFocusStart();
    } else {
      sounds.playBreakStart();
    }
  };

  const handlePause = () => {
    setIsTicking(false);
    startTimeRef.current = null;
  };

  const handleReset = () => {
    setIsTicking(false);
    startTimeRef.current = null;
    setTimeLeft(sessionType === 'focus' ? selectedPreset.focus : selectedPreset.break);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.muted = nextMute;
  };

  const handleClearLogs = () => {
    sounds.playPop();
    setLogs([]);
    setFocusCount(0);
  };

  const FLOATING_ELEMENTS = [
    { char: '🎀', size: '1.8rem', left: '8%', top: '12%', delay: '0s', duration: '14s' },
    { char: '💖', size: '1.4rem', left: '88%', top: '22%', delay: '2s', duration: '16s' },
    { char: '✨', size: '1.2rem', left: '72%', top: '8%', delay: '4s', duration: '10s' },
    { char: '🎀', size: '2.0rem', left: '84%', top: '68%', delay: '1s', duration: '12s' },
    { char: '💖', size: '1.3rem', left: '12%', top: '78%', delay: '3s', duration: '11s' },
    { char: '✨', size: '1.5rem', left: '6%', top: '44%', delay: '5s', duration: '9s' },
    { char: '🎀', size: '1.6rem', left: '92%', top: '46%', delay: '6s', duration: '13s' },
    { char: '💖', size: '1.4rem', left: '22%', top: '92%', delay: '0.5s', duration: '15s' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-[#fff0f3] via-[#ffccd5] to-[#ffb3c1] min-h-screen relative overflow-hidden">
      {/* 둥둥 떠다니는 헬로키티 데코레이션 */}
      {FLOATING_ELEMENTS.map((el, i) => (
        <span
          key={i}
          className="absolute pointer-events-none opacity-40 select-none animate-float"
          style={{
            left: el.left,
            top: el.top,
            fontSize: el.size,
            animationDelay: el.delay,
            animationDuration: el.duration,
          }}
        >
          {el.char}
        </span>
      ))}

      {/* 헤더 타이틀 */}
      <header className="text-center mb-6 z-10 animate-fade-in select-none">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#4a3036] flex items-center justify-center gap-2">
          <span>🎀</span> 지은타이머 <span className="text-[#ff4d6d] font-light">Jieun Timer</span>
        </h1>
        <p className="text-xs text-[#8c7278] mt-1 font-medium">
          든든한 <strong className="text-[#ff4d6d]">코다리 부장</strong>이 보좌하는 지은님 전용 헬로키티 타이머
        </p>
      </header>

      {/* 메인 대시보드 카드 */}
      <main className="w-full max-w-md bg-white/80 border border-[#ffccd5] backdrop-blur-xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(255,117,143,0.25)] z-10 flex flex-col gap-5">
        
        {/* 캐릭터 마스코트 영역 */}
        <Mascot status={isTicking ? sessionType : timeLeft === (sessionType === 'focus' ? selectedPreset.focus : selectedPreset.break) ? 'idle' : 'paused'} />

        <hr className="border-[#ffccd5]/50" />

        {/* 타이머 서클 디스플레이 */}
        <TimerDisplay
          timeLeft={timeLeft}
          totalDuration={sessionType === 'focus' ? selectedPreset.focus : selectedPreset.break}
          isTicking={isTicking}
          sessionType={sessionType}
        />

        {/* 컨트롤 버튼 */}
        <TimerControls
          isTicking={isTicking}
          isMuted={isMuted}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onToggleMute={handleToggleMute}
        />

        {/* 프리셋 셀렉터 */}
        <div className="mt-2">
          <label className="text-[11px] font-bold text-[#8c7278] tracking-wider uppercase block mb-2 select-none">
            ⏱️ 집중 코스 설정
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const isActive = selectedPreset.name === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-[11px] font-bold p-2.5 rounded-xl transition-all duration-200 text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#ff4d6d]/20 border border-[#ff4d6d] text-[#ff4d6d] shadow-inner font-extrabold'
                      : 'bg-white/60 border border-[#ffccd5] text-[#8c7278] hover:border-[#ff4d6d]/40 hover:text-[#ff4d6d]'
                  }`}
                >
                  {preset.icon === 'standard' && <Zap className="w-3.5 h-3.5" />}
                  {preset.icon === 'long' && <Flame className="w-3.5 h-3.5" />}
                  {preset.icon === 'test' && <Coffee className="w-3.5 h-3.5" />}
                  <span className="truncate w-full">{preset.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 획득 스탯 정보 */}
        <div className="bg-white/40 rounded-2xl p-3 border border-[#ffccd5] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#ff4d6d]/10 rounded-lg text-[#ff4d6d]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#8c7278] font-semibold">오늘의 몰입 달성</p>
              <h4 className="text-xs font-bold text-[#4a3036]">누적 {focusCount} 세션 완료</h4>
            </div>
          </div>
          <div className="flex gap-1 text-sm">
            {Array.from({ length: Math.min(focusCount, 5) }).map((_, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                🍅
              </span>
            ))}
            {focusCount > 5 && <span className="text-xs font-bold text-[#ff4d6d]">+{focusCount - 5}</span>}
            {focusCount === 0 && <span className="text-[10px] text-[#8c7278] font-bold">도전 시작! 🎀</span>}
          </div>
        </div>

      </main>

      {/* 오늘의 몰입 로그 실시간 출력 */}
      {logs.length > 0 && (
        <section className="w-full max-w-md mt-5 z-10 animate-fade-in">
          <div className="flex items-center justify-between mb-2 px-1 select-none">
            <h3 className="text-xs font-bold text-[#8c7278] tracking-wider uppercase flex items-center gap-1.5">
              <span>📋</span> 오늘의 실시간 집중 현황
            </h3>
            <button
              onClick={handleClearLogs}
              className="text-[10px] font-bold text-[#ff4d6d]/70 hover:text-[#ff4d6d] flex items-center gap-1 cursor-pointer transition-colors duration-150"
            >
              <RotateCcw className="w-3 h-3" /> 초기화
            </button>
          </div>
          <div className="bg-white/30 border border-[#ffccd5]/40 rounded-2xl p-4 max-h-40 overflow-y-auto flex flex-col gap-2.5 custom-scrollbar">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`text-[11px] p-2.5 rounded-xl flex flex-col gap-1 border animate-slide-in ${
                  log.type === 'focus'
                    ? 'bg-[#ff4d6d]/5 border-[#ffccd5]/30'
                    : 'bg-[#ff758f]/5 border-[#ffccd5]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold uppercase tracking-wider text-[9px] ${
                      log.type === 'focus' ? 'text-[#ff4d6d]' : 'text-[#ff758f]'
                    }`}
                  >
                    {log.type === 'focus' ? `🎀 FOCUS (${log.durationMinutes})` : `☕ BREAK (${log.durationMinutes})`}
                  </span>
                  <span className="text-[9px] text-[#8c7278] font-mono">{log.time}</span>
                </div>
                <p className="text-[#4a3036] leading-relaxed font-medium">
                  {log.type === 'focus' ? (
                    <>
                      <strong className="text-[#ff4d6d]">부장 코다리 왈:</strong> "{log.message}"
                    </>
                  ) : (
                    log.message
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 푸터 카피라이트 */}
      <footer className="mt-8 text-center text-[10px] text-[#8c7278] select-none">
        <p>© 2026 Jieun Timer. Created with 🎀 by Kodari & Solopreneur Representative.</p>
      </footer>
    </div>
  );
}
