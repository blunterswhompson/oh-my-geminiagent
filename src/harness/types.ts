export type GeminiHookType =
  | 'SessionStart'
  | 'BeforeTool'
  | 'AfterTool'
  | 'AfterAgent'
  | 'AfterModel'
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
