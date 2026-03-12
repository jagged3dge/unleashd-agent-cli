import { describe, it, expect } from 'vitest';
import { piConfig } from '../pi';

describe('Pi Harness Config', () => {
  describe('RED: basic structure', () => {
    it('should have binary set to "pi"', () => {
      expect(piConfig.binary).toBe('pi');
    });

    it('should have baseCmd with --mode rpc', () => {
      expect(piConfig.baseCmd).toEqual(['--mode', 'rpc']);
    });

    it('should have modelFlag set to "--model"', () => {
      expect(piConfig.modelFlag).toBe('--model');
    });

    it('should have stdin set to "pipe"', () => {
      expect(piConfig.stdin).toBe('pipe');
    });

    it('should have stdout set to "jsonl"', () => {
      expect(piConfig.stdout).toBe('jsonl');
    });

    it('should have promptVia set to "flag"', () => {
      expect(piConfig.promptVia).toBe('flag');
    });

    it('should have promptFlag set to "-p"', () => {
      expect(piConfig.promptFlag).toBe('-p');
    });
  });

  describe('RED: session flags', () => {
    it('should have sessionCreateFlags function', () => {
      expect(piConfig.sessionCreateFlags).toBeTypeOf('function');
    });

    it('should create session flags with --session', () => {
      const flags = piConfig.sessionCreateFlags!('test-session-id');
      expect(flags).toEqual(['--session', 'test-session-id']);
    });

    it('should have sessionResumeFlags function', () => {
      expect(piConfig.sessionResumeFlags).toBeTypeOf('function');
    });

    it('should resume session flags with --session', () => {
      const flags = piConfig.sessionResumeFlags!('test-session-id');
      expect(flags).toEqual(['--session', 'test-session-id']);
    });
  });

  describe('RED: extra args', () => {
    it('should include default tools', () => {
      expect(piConfig.extraArgs).toContain('--tools');
      expect(piConfig.extraArgs).toContain('read,bash,edit,write');
    });
  });

  describe('RED: model decomposition', () => {
    it('should have decomposeModel function', () => {
      expect(piConfig.decomposeModel).toBeTypeOf('function');
    });

    it('should decompose simple model ID', () => {
      const args = piConfig.decomposeModel!('anthropic/claude-3-5-sonnet-latest');
      expect(args).toEqual(['anthropic/claude-3-5-sonnet-latest']);
    });

    it('should decompose model ID with thinking level', () => {
      const args = piConfig.decomposeModel!('anthropic/claude-3-5-sonnet-latest:high');
      expect(args).toEqual([
        'anthropic/claude-3-5-sonnet-latest',
        '--thinking',
        'high',
      ]);
    });

    it('should handle minimal thinking level', () => {
      const args = piConfig.decomposeModel!('openai/gpt-4o:minimal');
      expect(args).toEqual([
        'openai/gpt-4o',
        '--thinking',
        'minimal',
      ]);
    });

    it('should handle off thinking level (no flag)', () => {
      const args = piConfig.decomposeModel!('google/gemini-2.0-flash-exp:off');
      expect(args).toEqual(['google/gemini-2.0-flash-exp']);
    });

    it('should handle model shorthand format', () => {
      const args = piConfig.decomposeModel!('sonnet');
      expect(args).toEqual(['anthropic/claude-3-5-sonnet-latest']);
    });

    it('should handle opus shorthand', () => {
      const args = piConfig.decomposeModel!('opus');
      expect(args).toEqual(['anthropic/claude-3-opus-latest']);
    });

    it('should handle haiku shorthand', () => {
      const args = piConfig.decomposeModel!('haiku');
      expect(args).toEqual(['anthropic/claude-3-5-haiku-latest']);
    });

    it('should handle shorthand with thinking', () => {
      const args = piConfig.decomposeModel!('sonnet:high');
      expect(args).toEqual([
        'anthropic/claude-3-5-sonnet-latest',
        '--thinking',
        'high',
      ]);
    });
  });
});
