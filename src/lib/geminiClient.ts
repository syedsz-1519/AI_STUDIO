export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: { title: string; uri: string }[];
  modelUsed?: string;
  thinkingMode?: boolean;
}

export type GeminiModelType = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';

export interface ChatOptions {
  messages: { role: 'user' | 'model'; content: string }[];
  model?: GeminiModelType;
  systemInstruction?: string;
  useSearch?: boolean;
  thinking?: boolean;
  language?: 'en' | 'hyd' | 'te';
}

export interface ChatResponse {
  reply: string;
  sources?: { title: string; uri: string }[];
  model: string;
  grounded?: boolean;
}

export async function sendGeminiChat(options: ChatOptions): Promise<ChatResponse> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gemini request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function transcribeAudioBlob(
  audioBlob: Blob,
  language: 'en' | 'hyd' | 'te' = 'en'
): Promise<string> {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });

  reader.readAsDataURL(audioBlob);
  const audioBase64 = await base64Promise;

  const response = await fetch('/api/gemini/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioBase64,
      mimeType: audioBlob.type || 'audio/webm',
      language,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to transcribe audio');
  }

  const data = await response.json();
  return data.transcript || '';
}

export interface VeoGenerateOptions {
  prompt?: string;
  imageBase64?: string;
  mimeType?: string;
  aspectRatio?: '16:9' | '9:16';
}

export async function startVeoGeneration(options: VeoGenerateOptions): Promise<{ operationName: string; done: boolean }> {
  const response = await fetch('/api/gemini/veo/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to start video generation');
  }

  return response.json();
}

export async function checkVeoStatus(operationName: string): Promise<{ done: boolean; videoBase64?: string | null }> {
  const response = await fetch(`/api/gemini/veo/status?operationName=${encodeURIComponent(operationName)}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to check video generation status');
  }
  return response.json();
}

export async function explainAIConcept(
  topic: string,
  context?: string,
  language: 'en' | 'hyd' | 'te' = 'en',
  depth: 'simple' | 'deep' = 'simple'
): Promise<string> {
  const response = await fetch('/api/gemini/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, context, language, depth }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate explanation');
  }

  const data = await response.json();
  return data.explanation || '';
}
