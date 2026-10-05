export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
export async function fakeRequest<T>(fn: () => T, ms?: number): Promise<T> {
  await delay(ms);
  return fn();
}
