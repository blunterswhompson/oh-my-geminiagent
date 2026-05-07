import { describe, it, expect, vi, beforeEach } from 'bun:test';
import { handleGeminiHook, resetPluginInstance } from '../hooks';

// We need to mock createManagers and createHooks to verify disposal
vi.mock('../../create-managers', () => ({
  createManagers: vi.fn().mockReturnValue({
    backgroundManager: {
      shutdown: vi.fn(),
    },
    skillMcpManager: {
      disconnectSession: vi.fn(),
    },
    modelFallbackControllerAccessor: {},
  }),
}));

vi.mock('../../create-hooks', () => ({
  createHooks: vi.fn().mockReturnValue({
    disposeHooks: vi.fn(),
  }),
  disposeCreatedHooks: vi.fn(),
}));

describe('Lifecycle hooks', () => {
  beforeEach(() => {
    resetPluginInstance();
    vi.clearAllMocks();
  });

  it('should call disposeHooks, disconnectSession and shutdown on SessionEnd', async () => {
    const { createHooks } = await import('../../create-hooks');
    const { createManagers } = await import('../../create-managers');
    
    // First, trigger a SessionStart to initialize the plugin instance
    await handleGeminiHook({
      event: 'SessionStart',
      data: {
        sessionID: 'test-session',
        directory: process.cwd(),
      },
    });

    // Now trigger SessionEnd
    const result = await handleGeminiHook({
      event: 'SessionEnd',
      data: {
        sessionID: 'test-session',
        directory: process.cwd(),
      },
    });

    expect(result.status).toBe('allow');

    // Get the mocked instances
    const hooks = (createHooks as any).mock.results[0].value;
    const managers = (createManagers as any).mock.results[0].value;

    expect(hooks.disposeHooks).toHaveBeenCalled();
    expect(managers.skillMcpManager.disconnectSession).toHaveBeenCalledWith('test-session');
    expect(managers.backgroundManager.shutdown).toHaveBeenCalled();
  });
});
