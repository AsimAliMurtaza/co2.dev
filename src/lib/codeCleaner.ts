// lib/cleanGeminiOutput.ts
export function cleanGeminiOutput(raw: string) {
  // Match from <html> to </html> or similar full page pattern
  const htmlMatch = raw.match(/<html[\s\S]*<\/html>/i);
  if (htmlMatch) return htmlMatch[0];

  // Or fallback to stripping "tips" by cutting before "Here are some things you might add" etc.
  return raw.split("Here are")[0].trim();
}
