export type GeminiHookType =
  | 'SessionStart'
  | 'SessionEnd'
  | 'BeforeTool'
  | 'AfterTool'
  | 'AfterAgent'
  | 'AfterModel'
  | 'BeforeModel'
  | 'BeforeAgent'
  | 'Notification'
  | 'PreCompress';

export interface GeminiHookInput {
  event: GeminiHookType;
  data: any;
}

export interface GeminiHookResult {
  status: 'allow' | 'deny' | 'continue' | 'stop';
  message?: string;
  data?: any;
}
