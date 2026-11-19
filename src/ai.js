const API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3002';

export async function askCampusAI(question, events, profile = {}) {
  const controller = new AbortController();
  // Beri waktu cukup untuk cold start / koneksi Google API yang lambat.
  const timeout = setTimeout(() => controller.abort(), 95000);
  let response;
  try {
    response = await fetch(`${API_URL}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, events, profile }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Gemini membutuhkan waktu lebih lama untuk merespons. Hasil lokal ditampilkan sebagai fallback.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Campus AI belum dapat dihubungi.');
  return payload;
}
