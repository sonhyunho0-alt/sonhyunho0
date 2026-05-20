/**
 * 뽀모도로 타이머 비즈니스 로직 연산용 순수 함수 유틸리티
 * 컴포넌트 종속성 없이 쉽게 단위 테스트가 가능하도록 분리 설계되었습니다.
 */

/**
 * 남은 초를 MM:SS 형식의 문자열로 포맷팅합니다.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 시작 타임스탬프와 현재 시각을 비교하여 경과 시간을 제하고 남은 초를 계산합니다.
 * 백그라운드 지연(Drift) 현상을 예방하기 위한 핵심 보정 연산입니다.
 */
export function calculateTimeLeft(
  startTime: number,
  secondsAtStart: number,
  now: number = Date.now()
): number {
  const elapsedMs = now - startTime;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  return Math.max(0, secondsAtStart - elapsedSeconds);
}

/**
 * 세션이 끝났을 때 전환될 다음 세션 유형과 기본 타이머 초를 계산합니다.
 */
export function getNextSession(
  currentType: 'focus' | 'break',
  focusDuration: number,
  breakDuration: number
): { type: 'focus' | 'break'; duration: number } {
  if (currentType === 'focus') {
    return { type: 'break', duration: breakDuration };
  } else {
    return { type: 'focus', duration: focusDuration };
  }
}
