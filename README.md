# UNKLAB HUB

Front-end React untuk menemukan agenda akademik dan kegiatan kampus UNKLAB. Data kegiatan yang tersedia di `db.json` adalah seed simulasi; tampilan memberi label **Data Simulasi** dan tidak menganggapnya sebagai jadwal resmi.

## Menjalankan di Visual Studio Code

1. Buka folder proyek ini di Visual Studio Code.
2. Pastikan Node.js dan npm tersedia di komputer.
3. Buka Terminal di VS Code, lalu jalankan:

   ```bash
   npm install
   ```

4. Jalankan JSON Server pada terminal pertama:

   ```bash
   npm run server
   ```

5. Jalankan React + Vite pada terminal kedua:

   ```bash
   npm run dev
   ```

6. Buka alamat lokal yang ditampilkan Vite (biasanya `http://localhost:5173`).

Aplikasi memakai JSON Server lokal sebagai mode demo default. Firebase Authentication/Firestore tetap tersedia sebagai opsi jika seluruh variabel `VITE_FIREBASE_*` diisi; tidak ada kredensial Firebase yang disimpan di source code.

## Menghubungkan Firebase

1. Buat proyek di Firebase Console, aktifkan **Authentication → Email/Password** dan buat database **Cloud Firestore**.
2. Salin `.env.example` menjadi `.env`, lalu isi nilainya dari **Project settings → Your apps → Web app**. Restart Vite setelah mengubah `.env`.
3. Deploy aturan keamanan dari root proyek dengan Firebase CLI: `firebase deploy --only firestore:rules` (login dan pilih proyek Firebase terlebih dahulu).
4. Buat akun melalui Firebase Authentication. Untuk setiap akun, buat dokumen `users/{UID}` di Firestore dengan minimal `name`, `email`, `role`, dan `profileCompleted`. Nilai `role` harus `mahasiswa`, `dosen`, atau `admin`.
5. Buat dokumen koleksi `categories` dan `events` untuk data awal. Pakai ID dokumen sama dengan nilai `id` yang dipakai aplikasi. Event publik harus berstatus `approved`; pengajuan Mahasiswa dimulai dengan `pending`.

Profil awal (termasuk admin pertama) perlu dibuat dari Firebase Console atau Admin SDK tepercaya; jangan menaruh kredensial Admin SDK di aplikasi browser. Aturan Firestore membatasi profil, bookmark, jadwal, dan pengajuan berdasarkan UID pengguna.

Saat dibuka tanpa sesi login, aplikasi menampilkan halaman login terlebih dahulu. Pengunjung tetap dapat membuka Kalender atau Jelajahi event melalui tautan publik di halaman login.

## Akun demo lokal

Semua akun memakai domain `@unklab.ac.id`; role dibaca dari record akun, bukan dari pilihan pengguna di form login.

| Role | Email | Password |
|---|---|---|
| Mahasiswa | `mahasiswa.demo@unklab.ac.id` | `Mahasiswa123!` |
| Dosen / Staff | `dosen.demo@unklab.ac.id` | `Dosen123!` |
| Admin | `admin.demo@unklab.ac.id` | `Admin123!` |

Mahasiswa dapat membuat pengajuan event. Dosen/Staff hanya melihat halaman Event Request. Admin melihat antrean pending dan dapat menyetujui/menolak. Event baru tetap `pending` dan baru masuk kalender publik setelah `approved`.

## Campus AI / Gemini

Campus AI memakai proxy backend `server.mjs` dengan model `gemini-3.5-flash`. API key tidak pernah masuk ke bundle frontend.

1. Salin `.env.example` menjadi `.env`.
2. Isi `GEMINI_API_KEY` dari Google AI Studio. Opsional: ubah `GEMINI_MODEL`, default `gemini-3.5-flash`.
3. Jalankan `npm run api` pada terminal terpisah.

Jika key belum diisi, halaman Campus AI tetap terbuka dan menampilkan pesan konfigurasi yang jelas. Konteks yang dikirim ke Gemini hanya event berstatus `approved`, tanpa password atau data sensitif.

## Struktur

- `src/main.jsx` — komponen React dan alur interaksi
- `src/ai.js` — client untuk proxy Campus AI
- `server.mjs` — backend/API proxy Gemini
- `src/styles.css` — sistem visual responsif
- `db.json` — data demo dan resource JSON Server
- `PRD-UNKLAB-HUB.md` — requirement produk utama
- `UNKLAB-MASTER-DATA-README.md` — aturan penggunaan data seed

## Menjalankan lengkap

```bash
npm install
npm run server   # JSON Server: http://localhost:3001
npm run api      # Gemini proxy: http://localhost:3002 (opsional untuk Campus AI)
npm run dev      # Vite frontend: http://localhost:5173
```

Seed event berlabel **Data Simulasi** dan bukan jadwal akademik resmi. Data jadwal pribadi dan bookmark disimpan di resource JSON Server berdasarkan `userId`, sehingga tetap ada setelah refresh dan terpisah antar akun.

