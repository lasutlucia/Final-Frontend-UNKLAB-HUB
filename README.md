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

Aplikasi memakai Firebase Authentication dan Cloud Firestore jika variabel Firebase di `.env` diisi. Tanpa konfigurasi tersebut, aplikasi memakai JSON Server lokal seperti sebelumnya.

## Menghubungkan Firebase

1. Buat proyek di Firebase Console, aktifkan **Authentication → Email/Password** dan buat database **Cloud Firestore**.
2. Salin `.env.example` menjadi `.env`, lalu isi nilainya dari **Project settings → Your apps → Web app**. Restart Vite setelah mengubah `.env`.
3. Deploy aturan keamanan dari root proyek dengan Firebase CLI: `firebase deploy --only firestore:rules` (login dan pilih proyek Firebase terlebih dahulu).
4. Buat akun melalui Firebase Authentication. Untuk setiap akun, buat dokumen `users/{UID}` di Firestore dengan minimal `name`, `email`, `role`, dan `profileCompleted`. Nilai `role` harus `mahasiswa`, `dosen`, `organisasi`, atau `admin`.
5. Buat dokumen koleksi `categories` dan `events` untuk data awal. Pakai ID dokumen sama dengan nilai `id` yang dipakai aplikasi. Event publik harus berstatus `approved`; pengajuan organisasi dimulai dengan `pending`.

Profil awal (termasuk admin pertama) perlu dibuat dari Firebase Console atau Admin SDK tepercaya; jangan menaruh kredensial Admin SDK di aplikasi browser. Aturan Firestore membatasi profil, bookmark, jadwal, dan pengajuan berdasarkan UID pengguna.

Saat dibuka tanpa sesi login, aplikasi menampilkan halaman login terlebih dahulu. Pengunjung tetap dapat membuka Kalender atau Jelajahi event melalui tautan publik di halaman login.

## Mode demo

- Dalam mode JSON Server, role Mahasiswa menyediakan akun demo lokal jika resource `users` kosong. Dalam mode Firebase, autentikasi dilakukan oleh Firebase Authentication dan profilnya diambil dari Firestore.
- Untuk mencoba role Dosen/Staff, Organisasi, atau Admin, tambahkan user dengan `role` sesuai nilai `dosen`, `organisasi`, atau `admin` ke resource `users` di `db.json` (atau buat melalui endpoint JSON Server). Akun tersimpan memvalidasi email, password, dan role.
- Alur pengajuan tersedia untuk role Organisasi; review approve/reject tersedia untuk Admin.
- Campus AI pada versi ini mencari dan merangkum event yang sudah disetujui secara lokal. Integrasi Gemini belum diaktifkan karena memerlukan backend untuk menjaga API key tetap privat.

## Struktur

- `src/main.jsx` — komponen React dan alur interaksi
- `src/styles.css` — sistem visual responsif
- `db.json` — data demo dan resource JSON Server
- `PRD-UNKLAB-HUB.md` — requirement produk utama
- `UNKLAB-MASTER-DATA-README.md` — aturan penggunaan data seed

