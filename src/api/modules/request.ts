export const request = async (url: string, options?: RequestInit) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://example.com/api';

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};
