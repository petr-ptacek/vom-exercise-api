export function getCookies(): Map<string, string> {
  const entries: [string, string][] = window.document.cookie
    .split(';')
    .map(
      chunk => {
        const [key, value] = chunk.split('=');
        return [key.trim(), value.trim()];
      }
    );

  return new Map<string, string>(entries);
}
