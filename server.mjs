import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

function loadEnv() {
  const values = { ...process.env };
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match) {
        values[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
      }
    }
  }
  return values;
}

const env = loadEnv();
const port = Number(env.AI_PORT || 3002);
const defaultModel = env.GEMINI_MODEL || 'gemini-2.0-flash';
const modelTimeoutMs = Number(env.GEMINI_TIMEOUT_MS || 30000);

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
};

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    return json(res, 200, { status: 'ok', activeModel: defaultModel, hasKey: Boolean(env.GEMINI_API_KEY) });
  }

  if (req.method !== 'POST' || req.url !== '/api/ai') {
    return json(res, 404, { error: 'Endpoint tidak ditemukan.' });
  }

  if (!env.GEMINI_API_KEY) {
    return json(res, 503, { error: 'Gemini belum dikonfigurasi. Isi GEMINI_API_KEY pada file .env lalu jalankan ulang npm run api.' });
  }

  try {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const { question, events = [], profile = {} } = JSON.parse(raw || '{}');

    if (!question?.trim()) {
      return json(res, 400, { error: 'Pertanyaan tidak boleh kosong.' });
    }

    const context = events.slice(0, 60).map((event) => ({
      id: event.id,
      title: event.title,
      category: event.categoryId,
      organizer: event.organizerName,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      tags: event.tags || [],
      description: event.description || '',
      status: event.status,
    }));

    const prompt = `Kamu adalah Campus AI untuk UNKLAB HUB. Jawab dalam Bahasa Indonesia yang ramah dan sangat rapi. Gunakan HANYA data event approved pada JSON berikut; jangan mengarang event, tanggal, lokasi, atau detail apapun. Jika tidak ada kecocokan, katakan tidak menemukan event yang cocok.

ATURAN FORMAT JAWABAN (wajib diikuti):
- Beri pengantar singkat satu kalimat yang relevan dengan pertanyaan.
- Sajikan SEMUA event yang relevan dengan nomor urut. Contoh: 1. Nama Event
- Untuk setiap event, tuliskan detail pada baris baru:
   - Tanggal: [tanggal]
   - Waktu: [waktu mulai - selesai]
   - Lokasi: [lokasi]
- JANGAN gunakan format tebal/markdown seperti ** atau __ sama sekali.
- Jangan potong atau hentikan daftar di tengah jalan; tampilkan semua event yang relevan sampai selesai.
- Di akhir, cantumkan Sumber ID dari event yang disebutkan. Contoh: Sumber ID: event-id-1, event-id-2

Preferensi pengguna: ${JSON.stringify({
      interests: profile.interests || [],
      hobbies: profile.hobbies || [],
      activityTypes: profile.activityTypes || [],
      freeTime: profile.freeTime || [],
    })}.
Pertanyaan: ${question}

EVENT APPROVED:
${JSON.stringify(context)}`;

    const candidateModels = [defaultModel].filter(Boolean);

    let lastError = null;
    let successfulPayload = null;
    let usedModel = defaultModel;

    for (const model of candidateModels) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), modelTimeoutMs);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
            }),
            signal: controller.signal,
          }
        ).finally(() => clearTimeout(timeout));

        const payload = await response.json();

        if (!response.ok) {
          console.warn(`[Campus AI] Model ${model} merespons ${response.status}: ${payload.error?.message || 'Error'}`);
          lastError = new Error(payload.error?.message || `Google API error: ${response.status}`);
          break;
        }

        const candidate = payload.candidates?.[0];
        const text = candidate?.content?.parts?.map((part) => part.text || '').join('');
        if (candidate?.finishReason === 'MAX_TOKENS') {
          console.warn(`[Campus AI] Model ${model} mencapai batas output; respons mungkin terpotong.`);
        }
        if (!text) {
          lastError = new Error('Model mengembalikan jawaban kosong.');
          continue;
        }

        successfulPayload = text;
        usedModel = model;
        break; // berhasil mendapatkan jawaban
      } catch (err) {
        console.warn(`[Campus AI] Model ${model} gagal: ${err.message}`);
        lastError = err;
        break;
      }
    }

    if (!successfulPayload) {
      return json(res, 503, {
        error: lastError?.name === 'AbortError'
          ? 'Gemini tidak merespons dalam batas waktu. Silakan coba kembali sesaat lagi.'
          : (lastError?.message || 'Proxy AI gagal memproses permintaan.'),
      });
    }

    const ids = context.filter((event) => successfulPayload.includes(event.id)).map((event) => event.id);
    return json(res, 200, { text: successfulPayload, eventIds: ids, model: usedModel });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Terjadi kesalahan internal pada server AI.' });
  }
});

server.listen(port, () => {
  console.log(`Campus AI proxy aktif di http://localhost:${port} (Model default: ${defaultModel})`);
  if (!env.GEMINI_API_KEY) {
    console.warn('PERINGATAN: GEMINI_API_KEY kosong. Isi file .env lalu restart npm run api.');
  }
});
