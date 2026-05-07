export type GeminiHookType =
  | 'SessionStart'
  | 'BeforeTool'
  | 'AfterTool'
  | 'AfterAgent'
  | 'AfterModel'
  | 'BeforeModel'
  | 'Notification'
  | 'PreCompress'
  | 'SessionEnd';

export interface GeminiHookInput {
  event: GeminiHookType;
  data: any;
}

export interface GeminiHookResult {
  status: 'allow' | 'deny' | 'continue' | 'stop';
  message?: string;
  data?: any;
}
