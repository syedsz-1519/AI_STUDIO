// Security utility for input sanitization and validation

/**
 * Sanitize text input for audio narration
 * Removes potentially harmful characters while preserving readability
 */
export function sanitizeAudioText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Maximum length protection
  const MAX_LENGTH = 5000;
  let text = input.substring(0, MAX_LENGTH);

  // Remove HTML tags and script content
  text = text
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  // Remove control characters and zero-width characters
  text = text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Remove multiple consecutive spaces/punctuation
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\.{2,}/g, '.')
    .trim();

  return text;
}

/**
 * Validate language code
 */
export function validateLanguage(lang: string): 'en' | 'hyd' {
  return ['en', 'hyd'].includes(lang) ? (lang as 'en' | 'hyd') : 'en';
}

/**
 * Validate and parse speech rate (0.5 to 2.0)
 */
export function validateSpeechRate(rate: number): number {
  const parsed = parseFloat(String(rate));
  return isNaN(parsed) ? 0.96 : Math.max(0.5, Math.min(2.0, parsed));
}

/**
 * Validate and parse pitch (0.5 to 2.0)
 */
export function validatePitch(pitch: number): number {
  const parsed = parseFloat(String(pitch));
  return isNaN(parsed) ? 1.15 : Math.max(0.5, Math.min(2.0, parsed));
}

/**
 * Validate and parse volume (0 to 100)
 */
export function validateVolume(volume: number): number {
  const parsed = parseInt(String(volume), 10);
  return isNaN(parsed) ? 50 : Math.max(0, Math.min(100, parsed));
}

/**
 * Check if text is safe for audio narration
 */
export function isAudioTextSafe(text: string): boolean {
  if (!text || typeof text !== 'string' || text.length === 0) {
    return false;
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /<script/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /expression\(/i
  ];

  return !suspiciousPatterns.some(pattern => pattern.test(text));
}
