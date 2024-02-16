export function checkOrThrow<E extends Error>(condition: boolean, error: E): void {
  if (!condition) {
    throw error;
  }
}
