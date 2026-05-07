import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { TranscriptClient } from '../transcript-client';

const TEST_DIR = join(process.cwd(), '.test-transcript-client');
const TRANSCRIPT_PATH = join(TEST_DIR, 'transcript.json');

describe('TranscriptClient', () => {
  let client: TranscriptClient;

  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
    client = new TranscriptClient(TRANSCRIPT_PATH);
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('session.messages', () => {
    test('returns empty array if file does not exist', async () => {
      const result = await client.session.messages();
      expect(result).toEqual({ data: [] });
    });

    test('returns messages from transcript', async () => {
      const mockMessages = [{ role: 'user', content: 'hello' }];
      writeFileSync(TRANSCRIPT_PATH, JSON.stringify({ messages: mockMessages }));

      const result = await client.session.messages();
      expect(result).toEqual({ data: mockMessages });
    });
  });

  describe('session.todo', () => {
    test('returns empty array if file does not exist', async () => {
      const result = await client.session.todo();
      expect(result).toEqual({ data: [] });
    });

    test('extracts todos from the latest write_todos tool call', async () => {
      const mockTranscript = {
        messages: [
          {
            role: 'assistant',
            content: [
              {
                type: 'tool_use',
                name: 'write_todos',
                input: { todos: [{ id: '1', task: 'First', status: 'completed' }] }
              }
            ]
          },
          {
            role: 'user',
            content: 'Next'
          },
          {
            role: 'assistant',
            content: [
              {
                type: 'tool_use',
                name: 'write_todos',
                input: { todos: [{ id: '2', task: 'Latest', status: 'pending' }] }
              }
            ]
          }
        ]
      };

      writeFileSync(TRANSCRIPT_PATH, JSON.stringify(mockTranscript));

      const result = await client.session.todo();
      expect(result).toEqual({ data: [{ id: '2', task: 'Latest', status: 'pending' }] });
    });

    test('returns empty array if no write_todos tool call is found', async () => {
      const mockTranscript = {
        messages: [
          { role: 'user', content: 'hello' }
        ]
      };

      writeFileSync(TRANSCRIPT_PATH, JSON.stringify(mockTranscript));

      const result = await client.session.todo();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('session.abort', () => {
    test('is a no-op', async () => {
      const result = await client.session.abort();
      expect(result).toEqual({});
    });
  });

  describe('UI Bridge (toastBuffer)', () => {
    test('showToast adds messages with prefix', () => {
      const c = new TranscriptClient('dummy.json');
      (c as any).tui.showToast({ message: 'Test Toast' });
      expect((c as any).toastBuffer).toEqual(['[OMO] Test Toast']);
    });
  });

  describe('getTurnCount', () => {
    test('returns 1 if file missing', () => {
      const c = new TranscriptClient('missing.json');
      expect((c as any).getTurnCount()).toBe(1);
    });

    test('returns 1 if transcript has no user messages', () => {
      writeFileSync(TRANSCRIPT_PATH, JSON.stringify({ messages: [] }));
      const c = new TranscriptClient(TRANSCRIPT_PATH);
      expect((c as any).getTurnCount()).toBe(1);
    });

    test('returns 2 if transcript has one user message', () => {
      const mockMessages = [
        { role: 'user', content: 'hello' }
      ];
      writeFileSync(TRANSCRIPT_PATH, JSON.stringify({ messages: mockMessages }));
      const c = new TranscriptClient(TRANSCRIPT_PATH);
      expect((c as any).getTurnCount()).toBe(2);
    });
  });
});
