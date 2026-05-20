/**
 * Web Audio API를 활용한 귀엽고 깜찍한 효과음 생성 유틸리티
 * 외부 오디오 자원 없이 브라우저 내장 신디사이저로 작동하여 가볍고 안정적입니다.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // 브라우저 보안 정책 대응: suspended 상태일 때 재개
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * 말랑말랑한 버튼 팝업음 ("블룹!" 소리)
   */
  public playPop() {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // 주파수가 빠르게 상승했다가 하강하는 피치 모듈레이션
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("효과음 재생 실패:", e);
    }
  }

  /**
   * 집중 시작 알림음 (신나는 상승 멜로디)
   */
  public playFocusStart() {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (도-미-솔-도)
      const duration = 0.08;

      notes.forEach((freq, idx) => {
        const time = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // 조금 부드러운 8비트 사운드
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      });
    } catch (e) {
      console.warn("효과음 재생 실패:", e);
    }
  }

  /**
   * 휴식 시작 알림음 (차분한 하강 멜로디)
   */
  public playBreakStart() {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const notes = [523.25, 392.00, 329.63, 261.63]; // C5, G4, E4, C4 (도-솔-미-도)
      const duration = 0.12;

      notes.forEach((freq, idx) => {
        const time = now + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      });
    } catch (e) {
      console.warn("효과음 재생 실패:", e);
    }
  }

  /**
   * 타이머 째깍 소리 (가볍고 귀여운 나무 실로폰 터치음)
   */
  public playTick() {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.02);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn("효과음 재생 실패:", e);
    }
  }

  /**
   * 타이머 완료 축하음 (신나는 레트로 팡파르!)
   */
  public playComplete() {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      // C5, E5, G5, C6 연타 후 코드 울림
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      // 개별 음 연주
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.2);
      });

      // 마지막 C화음 듀엣 울림
      const chordTime = now + 0.45;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);
        gain.gain.setValueAtTime(0.05, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chordTime);
        osc.stop(chordTime + 0.8);
      });

    } catch (e) {
      console.warn("효과음 재생 실패:", e);
    }
  }
}

export const sounds = new SoundEffects();
