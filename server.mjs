import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import dns from 'node:dns';
import nodemailer from 'nodemailer';

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
const fallbackModel = env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite';
const modelTimeoutMs = Number(env.GEMINI_TIMEOUT_MS || 90000);

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
    return json(res, 200, {
      status: 'ok',
      activeModel: defaultModel,
      hasKey: Boolean(env.GEMINI_API_KEY),
      smtpConfigured: Boolean(env.SMTP_USER && env.SMTP_PASS),
      smtpUser: env.SMTP_USER || null,
    });
  }

  // Endpoint Kirim Notifikasi Event via Gmail SMTP
  if (req.method === 'POST' && req.url === '/api/email/notify-event') {
    const currentEnv = loadEnv();
    if (!currentEnv.SMTP_USER || !currentEnv.SMTP_PASS) {
      return json(res, 400, {
        error: 'Konfigurasi Gmail SMTP belum lengkap di file .env. Pastikan SMTP_USER dan SMTP_PASS sudah diisi.',
      });
    }

    try {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const { targetEmail, recipientName, event } = JSON.parse(raw || '{}');

      if (!targetEmail || !targetEmail.includes('@')) {
        return json(res, 400, { error: 'Alamat email penerima tidak valid.' });
      }
      if (!event || !event.title) {
        return json(res, 400, { error: 'Data event tidak lengkap atau tidak valid.' });
      }

      const cleanUser = currentEnv.SMTP_USER.trim();
      const cleanPass = currentEnv.SMTP_PASS.replace(/\s+/g, '');

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: cleanUser,
          pass: cleanPass,
        },
      });
      const mailOptions = {
        from: `"UNKLAB HUB Campus" <${cleanUser}>`,
        to: targetEmail.trim(),
        subject: `[Pengingat Agenda] ${event.title} - UNKLAB HUB`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; color: #2d3748;">
            <div style="background-color: #402155; padding: 24px 20px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">UNIVERSITAS KLABAT</h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #d8c2e6;">UNKLAB HUB · Pengingat Agenda Kampus</p>
            </div>
            <div style="padding: 24px;">
              <h2 style="font-size: 18px; color: #1a202c; margin-top: 0;">Halo, ${recipientName || 'Teman UNKLAB'}!</h2>
              <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                Anda telah mendaftarkan / menyimpan agenda berikut ke dalam jadwal kegiatan Anda di <strong>UNKLAB HUB</strong>:
              </p>
              <div style="background-color: #faf7fc; border: 1px solid #f0e6f5; border-left: 4px solid #56366f; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="margin: 0 0 12px; color: #352041; font-size: 17px;">${event.title}</h3>
                <table style="width: 100%; font-size: 13.5px; color: #4a5568; line-height: 1.8;">
                  <tr>
                    <td style="width: 120px; font-weight: 600; color: #56366f;">Penyelenggara</td>
                    <td>: ${event.organizerName || 'Universitas Klabat'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #56366f;">Tanggal</td>
                    <td>: ${event.date || '-'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #56366f;">Waktu</td>
                    <td>: ${event.startTime || 'Sesuai jadwal'} ${event.endTime ? `– ${event.endTime}` : ''} WITA</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #56366f;">Lokasi</td>
                    <td>: ${event.location || 'Kampus UNKLAB'}</td>
                  </tr>
                  ${event.description ? `
                  <tr>
                    <td style="font-weight: 600; color: #56366f; vertical-align: top;">Deskripsi</td>
                    <td style="vertical-align: top;">: ${event.description}</td>
                  </tr>` : ''}
                </table>
              </div>
              <p style="color: #718096; font-size: 13px; line-height: 1.6;">
                Pastikan Anda hadir tepat waktu. Informasi perubahan kegiatan akan selalu diperbarui di aplikasi UNKLAB HUB.
              </p>
            </div>
            <div style="background-color: #f7fafc; padding: 16px 20px; text-align: center; border-top: 1px solid #edf2f7; font-size: 11.5px; color: #a0aec0;">
              Pesan ini dikirimkan otomatis oleh sistem UNKLAB HUB menggunakan integrasi Gmail SMTP.<br/>
              &copy; 2026 UNKLAB HUB · Airmadidi, Minahasa Utara, Sulawesi Utara.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return json(res, 200, {
        success: true,
        message: `Email notifikasi berhasil dikirimkan ke ${targetEmail.trim()}`,
      });
    } catch (err) {
      console.error('[SMTP Error]', err);
      return json(res, 500, {
        error: `Gagal mengirim email: ${err.message || 'Periksa koneksi atau kredensial SMTP Anda.'}`,
      });
    }
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

    const candidateModels = [...new Set([defaultModel, fallbackModel])].filter(Boolean);

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
          // Model dapat berubah status atau terkena rate limit; coba fallback.
          continue;
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
        const message = err.name === 'AbortError'
          ? `Timeout setelah ${Math.round(modelTimeoutMs / 1000)} detik`
          : err.message;
        console.warn(`[Campus AI] Model ${model} gagal: ${message}`);
        lastError = err;
        // Coba model cadangan jika model utama timeout atau gagal di level jaringan.
        continue;
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
  console.log(`Campus AI proxy & Email service aktif di http://localhost:${port} (Model default: ${defaultModel})`);
  if (!env.GEMINI_API_KEY) {
    console.warn('PERINGATAN: GEMINI_API_KEY kosong. Isi file .env lalu restart npm run api.');
  }
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('PERINGATAN: SMTP_USER atau SMTP_PASS belum diset di .env. Notifikasi email Gmail SMTP belum aktif.');
  } else {
    console.log(`Layanan Notifikasi Gmail SMTP siap (${env.SMTP_USER}).`);
  }
});
