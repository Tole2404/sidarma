export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const endpoint = typeof input === "string" ? input : input instanceof URL ? input.toString() : "unknown-endpoint";
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: string }).message)
        : "Permintaan gagal diproses.";
    throw new Error(`[${response.status}] ${endpoint}: ${message}`);
  }

  return payload as T;
}
