import type { HarnessConfig } from '../types';

/**
 * Pi agent CLI harness config.
 *
 * Pi is a universal AI agent CLI that provides access to multiple providers
 * (Anthropic, OpenAI, Google) through a single RPC interface.
 *
 * Model format: provider/model[:thinking_level]
 * Examples:
 *   - anthropic/claude-3-5-sonnet-latest
 *   - anthropic/claude-3-5-sonnet-latest:high
 *   - openai/gpt-4o:medium
 *   - google/gemini-2.0-flash-thinking-exp-1219
 *
 * Shorthand aliases:
 *   - sonnet → anthropic/claude-3-5-sonnet-latest
 *   - opus → anthropic/claude-3-opus-latest
 *   - haiku → anthropic/claude-3-5-haiku-latest
 *
 * Thinking levels: off, minimal, low, medium, high, xhigh
 *
 * RPC Mode:
 *   Pi operates in RPC mode (--mode rpc) for bidirectional communication.
 *   Stdin is kept open ('pipe') for RPC commands/responses.
 *   Stdout emits JSONL events for streaming updates.
 *
 * Session Management:
 *   Both create and resume use the same flag: --session <id>
 *   Pi automatically detects if the session exists and resumes it.
 */

/**
 * Model shorthand expansions.
 * Maps simple names like 'sonnet' to full provider/model format.
 */
const MODEL_SHORTHANDS: Record<string, string> = {
  sonnet: 'anthropic/claude-3-5-sonnet-latest',
  opus: 'anthropic/claude-3-opus-latest',
  haiku: 'anthropic/claude-3-5-haiku-latest',
};

/**
 * Decompose a pi model ID into command-line arguments.
 *
 * Format: [provider/]model[:thinking_level] or shorthand[:thinking_level]
 *
 * Examples:
 *   - 'anthropic/claude-3-5-sonnet-latest' → ['anthropic/claude-3-5-sonnet-latest']
 *   - 'anthropic/claude-3-5-sonnet-latest:high' → ['anthropic/claude-3-5-sonnet-latest', '--thinking', 'high']
 *   - 'sonnet' → ['anthropic/claude-3-5-sonnet-latest']
 *   - 'sonnet:high' → ['anthropic/claude-3-5-sonnet-latest', '--thinking', 'high']
 *   - 'openai/gpt-4o:off' → ['openai/gpt-4o'] (off means no thinking flag)
 *
 * @param modelId - Model identifier with optional thinking level
 * @returns Array of command-line arguments for model selection
 */
function decomposeModel(modelId: string): readonly string[] {
  // Parse model ID format: [provider/]model[:thinking]
  const parts = modelId.split(':');
  let baseModel = parts[0];
  const thinkingLevel = parts[1];

  // Expand shorthand aliases
  if (baseModel in MODEL_SHORTHANDS) {
    baseModel = MODEL_SHORTHANDS[baseModel];
  }

  // Build args: start with base model
  const args: string[] = [baseModel];

  // Add thinking flag if level specified and not 'off'
  if (thinkingLevel && thinkingLevel !== 'off') {
    args.push('--thinking', thinkingLevel);
  }

  return args;
}

export const piConfig: HarnessConfig = {
  binary: 'pi',
  baseCmd: ['--mode', 'rpc'],
  bypassFlags: [],
  modelFlag: '--model',
  promptVia: 'flag',
  promptFlag: '-p',
  stdin: 'pipe',
  stdout: 'jsonl',
  extraArgs: ['--tools', 'read,bash,edit,write'],
  sessionCreateFlags: (id) => ['--session', id],
  sessionResumeFlags: (id) => ['--session', id],
  decomposeModel,
};
