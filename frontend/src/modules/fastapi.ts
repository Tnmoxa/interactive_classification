export class FastError extends Error {
  public readonly status: number;
  public readonly extra: unknown;

  constructor(status: number, extra: unknown, ...params: string[]) {
    super(...params);
    this.status = status;
    this.extra = extra;
  }
}

/// Фетчер адаптированный для взаимодействия с FastAPI
export async function fastFetch<T>(url: string | Request) {
  let extra;
  const res = await fetch(url);
  if (res.ok)
    try {
      return (await res.json()) as T;
    } catch (error) {
      /**/
    }
  else
    try {
      extra = await res.json();
    } catch (error) {
      /**/
    }
  throw new FastError(res.status, extra, `FastAPI Error: ${res.status} ${res.statusText}`);
}
