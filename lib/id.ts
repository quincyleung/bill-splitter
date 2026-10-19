/**
 * A random id. Uses getRandomValues rather than randomUUID, because randomUUID
 * only exists on https, and plain http is how a phone reaches the dev server on
 * the local network.
 */
export function createId(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
