import { describe, it, expect } from 'vitest';
import { getHarness, listHarnesses, registry } from '../index';

describe('Harness Registry', () => {
  describe('RED: getHarness', () => {
    it('should return claude harness', () => {
      const harness = getHarness('claude');
      expect(harness.binary).toBe('claude');
    });

    it('should return codex harness', () => {
      const harness = getHarness('codex');
      expect(harness.binary).toBe('codex');
    });

    it('should return opencode harness', () => {
      const harness = getHarness('opencode');
      expect(harness.binary).toBe('opencode');
    });

    it('should return gemini harness', () => {
      const harness = getHarness('gemini');
      expect(harness.binary).toBe('gemini');
    });

    it('should return pi harness', () => {
      const harness = getHarness('pi');
      expect(harness.binary).toBe('pi');
    });

    it('should throw for unknown harness', () => {
      expect(() => getHarness('unknown')).toThrow('Unknown harness');
    });
  });

  describe('RED: registry', () => {
    it('should include all harnesses', () => {
      expect(registry).toHaveProperty('claude');
      expect(registry).toHaveProperty('codex');
      expect(registry).toHaveProperty('opencode');
      expect(registry).toHaveProperty('gemini');
      expect(registry).toHaveProperty('pi');
    });

    it('should have exactly 5 harnesses', () => {
      expect(Object.keys(registry)).toHaveLength(5);
    });
  });

  describe('RED: listHarnesses', () => {
    it('should list all harnesses', () => {
      const harnesses = listHarnesses();
      expect(harnesses).toContain('claude');
      expect(harnesses).toContain('codex');
      expect(harnesses).toContain('opencode');
      expect(harnesses).toContain('gemini');
      expect(harnesses).toContain('pi');
    });

    it('should return 5 harnesses', () => {
      const harnesses = listHarnesses();
      expect(harnesses).toHaveLength(5);
    });
  });
});
