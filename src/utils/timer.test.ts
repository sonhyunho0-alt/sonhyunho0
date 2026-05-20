import { describe, it, expect } from 'vitest';
import { formatTime, calculateTimeLeft, getNextSession } from './timer';

describe('timer utility tests', () => {
  describe('formatTime', () => {
    it('should format minutes and seconds with double digits', () => {
      expect(formatTime(1500)).toBe('25:00');
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(5)).toBe('00:05');
      expect(formatTime(0)).toBe('00:00');
    });
  });

  describe('calculateTimeLeft', () => {
    it('should correctly deduct elapsed time', () => {
      const startTime = 10000; // Mock timestamp ms
      const secondsAtStart = 25 * 60; // 1500s
      
      // 5 seconds elapsed (5000ms)
      const now = startTime + 5000;
      expect(calculateTimeLeft(startTime, secondsAtStart, now)).toBe(1495);
    });

    it('should not go below 0', () => {
      const startTime = 10000;
      const secondsAtStart = 10;
      
      // 12 seconds elapsed
      const now = startTime + 12000;
      expect(calculateTimeLeft(startTime, secondsAtStart, now)).toBe(0);
    });
  });

  describe('getNextSession', () => {
    it('should transition from focus to break', () => {
      const focusDuration = 25 * 60;
      const breakDuration = 5 * 60;
      const next = getNextSession('focus', focusDuration, breakDuration);
      
      expect(next.type).toBe('break');
      expect(next.duration).toBe(breakDuration);
    });

    it('should transition from break to focus', () => {
      const focusDuration = 25 * 60;
      const breakDuration = 5 * 60;
      const next = getNextSession('break', focusDuration, breakDuration);
      
      expect(next.type).toBe('focus');
      expect(next.duration).toBe(focusDuration);
    });
  });
});
