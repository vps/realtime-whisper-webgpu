import { describe, it, expect } from 'vitest';
import { mergeTranscriptions } from '../src/utils/transcription.js';

describe('mergeTranscriptions', () => {
  it('returns previous when segments completely overlap', () => {
    const prev = 'hello world';
    const curr = 'hello world';
    expect(mergeTranscriptions(prev, curr)).toBe('hello world');
  });

  it('merges removing duplicated overlap', () => {
    const prev = 'this is some text we like';
    const curr = 'we like to dance';
    expect(mergeTranscriptions(prev, curr)).toBe('this is some text we like to dance');
  });

  it('concatenates when there is no overlap', () => {
    const prev = 'hello world';
    const curr = 'this is new';
    expect(mergeTranscriptions(prev, curr)).toBe('hello world this is new');
  });
});
