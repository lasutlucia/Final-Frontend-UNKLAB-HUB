# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# UNKLAB HUB — One Platform, Every Campus Activity

> **Dokumen acuan produk, desain, dan pengembangan**  
> **Versi:** 1.4 (Pembaruan pola kegiatan dan ibadah asrama)  
> **Tanggal revisi:** 10 November 2026  
> **Status:** Draft implementasi untuk proyek akhir mata kuliah Front End  
> **Platform:** Responsive web application  
> **Teknologi utama:** React  
> **Data/API prototipe:** JSON Server  
> **AI Assistant:** Google Gemini API — `gemini-3.5-flash`  
> **Nama produk:** UNKLAB HUB

---

## 1. Ringkasan Produk

### 1.1 Deskripsi

**UNKLAB HUB** adalah platform informasi kampus yang menyatukan kalender akademik dan kegiatan nonakademik Universitas Klabat dalam satu website. Informasi yang ditampilkan mencakup agenda akademik, kegiatan organisasi, choir, kegiatan asrama, kegiatan fakultas, seminar, workshop, kompetisi, dan kegiatan kampus lainnya.

Pengguna dapat melihat jadwal melalui kalender, mencari kegiatan, membuka detail event, menyimpan event, mengatur jadwal pribadi, serta bertanya kepada AI Campus Assistant. Dashboard akan menampilkan rekomendasi kegiatan yang disesuaikan dengan minat, hobi, preferensi kegiatan, dan waktu luang yang diisi pengguna setelah login.

Organisasi dapat mengajukan kegiatan melalui sistem. Semua pengajuan harus diperiksa dan divalidasi oleh Admin sebelum ditampilkan sebagai kegiatan yang disetujui. Admin juga menjadi satu-satunya role yang mengelola kalender akademik pada prototipe ini.

### 1.2 Visi Produk

Menjadi satu pusat informasi aktivitas UNKLAB yang memudahkan mahasiswa, dosen/staf, organisasi, dan admin menemukan serta mengelola informasi kegiatan kampus.

### 1.3 Masalah yang Diselesaikan

1. **Informasi tersebar:** jadwal dan kegiatan diumumkan melalui banyak kanal sehingga pengguna harus mencari informasi di berbagai tempat.
2. **Kegiatan terlewat:** pengguna tidak selalu mengetahui kegiatan yang akan datang, khususnya kegiatan dari organisasi atau unit lain.
3. **Jadwal bertabrakan:** pengguna kesulitan membandingkan agenda akademik dan nonakademik yang berlangsung pada waktu bersamaan.
4. **Pengelolaan pengajuan belum terpusat:** informasi kegiatan perlu dikumpulkan dan diperiksa sebelum dipublikasikan.

### 1.4 Tujuan Produk

- Mengumpulkan jadwal akademik dan kegiatan kampus dalam satu kalender.
- Memudahkan pengguna menemukan kegiatan berdasarkan tanggal, kategori, penyelenggara, dan kata kunci.
- Menampilkan dashboard yang relevan dengan profil dan preferensi masing-masing pengguna.
- Menyediakan AI Assistant untuk membantu pencarian dan pemahaman informasi kegiatan.
- Menyediakan alur pengajuan event oleh organisasi dan validasi oleh Admin.
- Membantu pengguna menyimpan kegiatan dan mengetahui benturan jadwal.

### 1.5 Prinsip Produk

- Informasi event harus berasal dari data sistem yang tersimpan.
- Kalender akademik harus dibedakan dari event organisasi.
- Semua pengajuan event dari organisasi harus divalidasi Admin.
- Dashboard personal harus berdasarkan preferensi yang diberikan pengguna, bukan asumsi sistem.
- Tampilan harus terasa seperti produk kampus yang dirancang dengan sengaja: sederhana, hangat, rapi, dan tidak berlebihan.

### 1.6 Indikator Keberhasilan (Success Metrics)

Target berikut digunakan untuk mengevaluasi prototipe dan demonstrasi kelas. Angka ini merupakan target pengujian proyek, bukan klaim bahwa sistem sudah mencapai hasil tersebut.

| Metrik | Target prototipe | Cara pengujian |
|---|---|---|
| Kecepatan menemukan event | Pengguna uji dapat menemukan kegiatan yang diminta dalam ≤ 10 detik untuk skenario pencarian sederhana. | Uji tugas pencarian berdasarkan judul, kategori, penyelenggara, dan tanggal. |
| Akurasi jawaban AI | Minimal 90% jawaban faktual sesuai dengan database pada 20 pertanyaan uji yang sudah disiapkan. | Cocokkan judul, tanggal, waktu, lokasi, dan penyelenggara pada jawaban AI dengan data sumber. |
| Kepatuhan hak akses | 100% skenario uji role mengikuti matriks permission. | Uji login dan akses halaman/aksi untuk keempat role. |
| Validasi pengajuan | Seluruh pengajuan organisasi memiliki status yang dapat dilihat oleh organisasi dan Admin. | Uji pengajuan baru, antrean Admin, serta hasil persetujuan/penolakan. |
| Deteksi bentrok | 100% kasus uji overlap terdeteksi dengan benar. | Uji jadwal yang beririsan dan jadwal yang hanya bersentuhan pada batas waktu. |
| Responsivitas | Tidak ada horizontal overflow pada lebar 360 px, 768 px, dan 1440 px. | Uji halaman utama, dashboard, kalender, form, dan chatbot pada viewport tersebut. |
| Kualitas teknis | Target Lighthouse ≥ 90 untuk Accessibility dan Performance pada build demo, bila lingkungan pengujian mendukung. | Jalankan Lighthouse pada build production lokal. |

---

## 2. Target Pengguna dan Hak Akses

Sistem hanya memiliki **empat role** berikut.

### 2.1 Role Pengguna

| Role | Keterangan | Kebutuhan utama |
|---|---|---|
| **Mahasiswa** | Pengguna mahasiswa UNKLAB | Melihat kalender, mencari event, menggunakan AI, mengatur preferensi, menyimpan kegiatan, dan melihat jadwal pribadi. |
| **Dosen/Staff** | Pengguna dosen atau staf UNKLAB | Melihat kalender, mencari kegiatan, menggunakan AI, dan mendapatkan dashboard sesuai preferensi. Tidak dapat mengajukan event. |
| **Organisasi** | Akun resmi organisasi/komunitas/penyelenggara yang terdaftar | Melihat kalender, menggunakan AI, dan mengajukan serta memantau event milik organisasinya. |
| **Admin** | Pengelola utama sistem sekaligus pengelola kalender akademik | Memvalidasi pengajuan, mengelola event, memasukkan dan memperbarui kalender akademik, serta mengelola kategori dan data referensi. |

### 2.2 Matriks Hak Akses

| Fitur | Mahasiswa | Dosen/Staff | Organisasi | Admin |
|---|:---:|:---:|:---:|:---:|
| Login dengan email kampus | Ya | Ya | Ya | Ya |
| Melihat dashboard | Ya | Ya | Ya | Ya |
| Mengisi/mengubah preferensi profil | Ya | Ya | Ya | Ya |
| Melihat kalender dan detail event | Ya | Ya | Ya | Ya |
| Mencari dan memfilter event | Ya | Ya | Ya | Ya |
| Menggunakan AI Campus Assistant | Ya | Ya | Ya | Ya |
| Menyimpan event dan mengelola My Schedule | Ya | Ya | Ya | Ya |
| Melihat menu **Event Request** | Tidak | Ya (read-only) | Ya | Ya |
| Mengajukan event baru | Tidak | **Tidak** | **Ya** | Dapat membuat/mengelola data secara langsung |
| Mengubah pengajuan sendiri | Tidak | Tidak | Ya, sesuai status dan kepemilikan | Ya |
| Melihat status pengajuan organisasi | Tidak | Read-only | Ya, milik organisasinya | Ya, seluruh pengajuan |
| Menyetujui/menolak pengajuan | Tidak | Tidak | Tidak | **Ya** |
| Mengelola kalender akademik | Tidak | Tidak | Tidak | **Ya** |
| Mengelola seluruh event dan kategori | Tidak | Tidak | Tidak | **Ya** |

**Aturan Event Request yang wajib diikuti:**

- Menu **Event Request** ditampilkan untuk role **Organisasi, Dosen/Staff, dan Admin**.
- Hanya role **Organisasi** yang memiliki tombol dan hak untuk mengirim pengajuan event baru.
- Role **Dosen/Staff** hanya dapat melihat halaman informasi/panduan Event Request dalam mode read-only. Tidak ada tombol submit, edit, atau pengiriman pengajuan.
- Role **Admin** dapat melihat seluruh pengajuan dan melakukan validasi. Admin juga mengelola kalender akademik.
- Setiap pengajuan event dari organisasi wajib berstatus `pending` sampai diperiksa Admin.
- Event baru hanya tampil sebagai event publik setelah Admin menyetujuinya.

---

## 3. Login dan Profil Personal

### 3.1 Login Email Kampus

Login menggunakan email kampus dengan domain **`@unklab.ac.id`**.

Form login berisi:
- Email kampus.
- Password.
- Pilihan jenis akun: Mahasiswa, Dosen/Staff, Organisasi, atau Admin.
- Tombol Login.

Ketentuan:
1. Email wajib menggunakan domain `@unklab.ac.id`.
2. Sistem memeriksa email dan password terhadap akun yang tersimpan.
3. Role akun harus sesuai dengan role yang terdaftar di data pengguna. Pilihan role pada form tidak boleh membuat pengguna memperoleh hak akses yang tidak dimilikinya.
4. Jika email tidak menggunakan domain kampus, tampilkan pesan validasi.
5. Jika kombinasi email, password, atau role tidak sesuai, tampilkan pesan login gagal yang jelas.
6. Setelah login berhasil, pengguna diarahkan ke proses pengaturan profil jika baru pertama kali masuk atau profilnya belum lengkap. Jika profil sudah lengkap, langsung tampilkan dashboard.

**Catatan implementasi proyek:** login dapat menggunakan akun yang disiapkan di JSON Server untuk demonstrasi. Validasi domain email dan role harus tetap diterapkan pada antarmuka dan alur autentikasi prototipe.

### 3.2 First Login — Personalization Setup

Pada login pertama, tampilkan halaman atau modal onboarding singkat yang menanyakan preferensi pengguna. Tujuannya agar dashboard tidak sama untuk semua orang.

Informasi yang diminta:

| Field | Bentuk input | Keterangan |
|---|---|---|
| Minat | Multi-select/chips | Contoh: teknologi, bisnis, akademik, seni, musik, olahraga, sosial, kerohanian, kepemimpinan, lingkungan. |
| Hobi | Pilihan dan/atau input teks | Pengguna dapat menulis hobi sendiri, misalnya menyanyi, membaca, fotografi, coding, atau bermain olahraga. |
| Jenis kegiatan yang disukai | Multi-select | Contoh: seminar, kompetisi, organisasi, kegiatan sosial, kegiatan rohani, pertunjukan, dan kegiatan asrama. |
| Kesibukan/waktu luang | Pilihan hari dan rentang waktu | Pengguna dapat menunjukkan hari atau waktu yang biasanya lebih luang. Isian ini bersifat opsional. |
| Program studi/fakultas/unit | Pilihan atau teks, jika relevan | Digunakan untuk menyaring kegiatan yang target pesertanya sesuai. Tidak perlu diwajibkan untuk semua role. |

Aturan onboarding:
- Onboarding muncul setelah autentikasi berhasil pada login pertama atau ketika profil belum diisi.
- Beri penjelasan singkat mengapa informasi ini ditanyakan: untuk menampilkan kegiatan yang lebih relevan.
- Pengguna dapat memilih beberapa minat dan jenis kegiatan.
- Hobi berupa teks bebas boleh dikosongkan.
- Preferensi kesibukan/waktu luang bersifat opsional.
- Sediakan tombol **Simpan Preferensi** dan pilihan **Lewati untuk Sekarang**.
- Pengguna dapat mengubah semua preferensi melalui halaman Profile.
- Jangan meminta informasi pribadi yang tidak dibutuhkan untuk rekomendasi kegiatan.

### 3.3 Cara Personalisasi Dashboard

Dashboard mengambil data dari profil pengguna dan event yang sudah disetujui.

Rekomendasi ditentukan berdasarkan:
1. Kecocokan kategori dan tag event dengan minat pengguna.
2. Kecocokan deskripsi/tag event dengan hobi yang ditulis pengguna, jika tersedia.
3. Kecocokan target peserta dengan role, fakultas, atau program studi pengguna apabila data tersebut tersedia.
4. Kecocokan tanggal dan waktu event dengan preferensi waktu luang pengguna.
5. Prioritas event yang akan datang dan belum selesai.

Setiap rekomendasi sebaiknya menampilkan alasan singkat, misalnya **“Direkomendasikan karena kamu memilih minat Musik”** atau **“Sesuai dengan waktu luang yang kamu pilih.”**

Untuk MVP, gunakan sistem pencocokan berbasis aturan sederhana, bukan machine learning. Urutan rekomendasi ditentukan oleh kecocokan minat/kategori, kecocokan hobi/tag event, target peserta yang sesuai, preferensi waktu luang, dan kedekatan tanggal event. Event yang sudah lewat, dibatalkan, atau belum disetujui tidak boleh direkomendasikan.

Personalisasi harus tetap transparan dan sederhana. Jangan membuat asumsi tentang pengguna di luar data yang mereka isi. Jika pengguna melewati onboarding, dashboard tetap berfungsi dengan menampilkan event terdekat dan kegiatan umum.

---

## 4. Ruang Lingkup Fitur

### 4.1 Prioritas Fitur

Prioritas digunakan agar tim mengerjakan kebutuhan utama terlebih dahulu dan tidak memperluas proyek di luar waktu yang tersedia.

- **P0 — Wajib untuk MVP/demo:** fitur inti yang harus berfungsi dari awal sampai akhir.
- **P1 — Setelah P0 stabil:** fitur pendukung yang meningkatkan kenyamanan, tetapi tidak boleh menghambat penyelesaian MVP.
- **P2 — Tidak direncanakan untuk proyek ini:** fitur tambahan yang tidak perlu dibangun kecuali dosen atau tim mengubah ruang lingkup secara resmi.

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Login & Role Access | Login email `@unklab.ac.id` dan empat role pengguna. | P0 |
| Personalized Profile | Pengisian minat, hobi, jenis kegiatan, dan waktu luang setelah login pertama. | P0 |
| Personalized Dashboard | Menampilkan kegiatan terdekat dan rekomendasi berdasarkan profil. | P0 |
| Centralized Campus Calendar | Kalender akademik dan kegiatan kampus dalam satu tampilan dengan beberapa mode tampilan. | P0 |
| Event Search & Filter | Pencarian berdasarkan judul, kategori, penyelenggara, lokasi, tanggal, dan target peserta. | P0 |
| Event Detail | Detail tanggal, jam, lokasi, deskripsi, penyelenggara, kategori, dan status. | P0 |
| AI Campus Assistant | Chatbot Gemini untuk mencari dan menjelaskan event dari database. | P0 |
| Event Request | Organisasi mengirim pengajuan event dan memantau status. | P0 |
| Admin Approval | Admin memeriksa, menyetujui, atau menolak setiap pengajuan. | P0 |
| Academic Calendar Management | Admin memasukkan dan memperbarui kalender akademik. | P0 |
| Saved Events | Pengguna menyimpan event yang ingin dilihat kembali. | P1 |
| My Schedule & Conflict Check | Pengguna menyusun agenda pribadi dan mendapat peringatan jika jadwal bertabrakan. | P1 |

Jika waktu pengerjaan terbatas, selesaikan semua alur P0 terlebih dahulu. Fitur P1 dapat disederhanakan, tetapi jangan mengubah atau menghapus aturan akses dan validasi Admin.

### 4.2 Centralized Campus Calendar

Kalender menampilkan dua sumber kegiatan yang dibedakan secara jelas:

1. **Kalender Akademik:** agenda akademik yang dimasukkan dan dikelola Admin berdasarkan dokumen kalender akademik.
2. **Kegiatan Kampus:** event dari organisasi, choir, asrama, fakultas, seminar, kompetisi, dan kegiatan lain yang sudah disetujui Admin.

Ketentuan tampilan kalender:
- Sediakan tampilan **Bulanan, Mingguan, Harian, dan Daftar/Agenda**. Jika pengembangan harus disederhanakan, Bulanan dan Daftar/Agenda menjadi tampilan minimum MVP; Mingguan dan Harian tetap menjadi target penyelesaian kalender.
- Sediakan tombol **Hari Ini** serta navigasi periode sebelumnya/berikutnya.
- Filter dapat digunakan berdasarkan kategori, penyelenggara, tanggal/periode, dan target peserta. Filter kategori dapat memilih lebih dari satu kategori.
- Pencarian teks mencakup judul event, nama penyelenggara, dan lokasi.
- Setiap event menampilkan judul, tanggal, waktu, kategori, dan penyelenggara.
- Klik event membuka halaman, modal, atau drawer detail event.
- Event yang waktu mulainya sudah lewat dan waktu selesainya belum lewat menampilkan indikator **Sedang Berlangsung**. Status dihitung menggunakan waktu WITA saat ini, bukan disimpan manual.
- Tampilkan badge sumber yang membedakan **Kalender Akademik/Resmi UNKLAB** dan **Event Organisasi**. Event organisasi hanya memperoleh label tersebut setelah disetujui Admin.
- Event dengan status `pending` atau `rejected` tidak boleh muncul sebagai event publik.
- Event `cancelled` tidak boleh ditampilkan sebagai agenda aktif; jika tetap terlihat pada riwayat, status pembatalannya harus jelas.
- Event dummy pada prototipe harus tetap menampilkan label **Data Simulasi**, meskipun status seed dibuat `approved` untuk kebutuhan demo.
- Kalender akademik harus memiliki label **Kalender Akademik** atau **Agenda Akademik Resmi** agar tidak tertukar dengan event organisasi.

### 4.3 Dashboard

Dashboard menampilkan informasi yang relevan tanpa membuat halaman terlalu padat.

**Untuk Mahasiswa:**
- Sapaan dan tanggal saat ini.
- Kegiatan terdekat.
- Rekomendasi berdasarkan minat, hobi, dan waktu luang.
- Agenda hari ini atau minggu ini.
- Shortcut Kalender, Jelajahi Event, My Schedule, dan AI Assistant.

**Untuk Dosen/Staff:**
- Sapaan dan tanggal saat ini.
- Agenda akademik dan kegiatan kampus terdekat.
- Rekomendasi kegiatan berdasarkan preferensi profil.
- Kegiatan yang sesuai dengan fakultas/unit jika datanya tersedia.

**Untuk Organisasi:**
- Kegiatan organisasi yang sudah dipublikasikan.
- Ringkasan pengajuan berdasarkan status: pending, approved, rejected.
- Tombol **Ajukan Event**.
- Rekomendasi agenda kampus yang relevan.

**Untuk Admin:**
- Ringkasan jumlah pengajuan yang menunggu validasi.
- Daftar pengajuan terbaru.
- Akses cepat ke Approval Queue dan pengelolaan Kalender Akademik.
- Ringkasan event yang sudah disetujui.

### 4.4 AI Campus Assistant

AI Assistant menjadi fitur utama untuk membantu pengguna bertanya tentang jadwal dan kegiatan menggunakan bahasa sehari-hari.

Contoh pertanyaan:
- “Kegiatan terdekat dari sekarang apa?”
- “Ada kegiatan apa minggu ini?”
- “Cari kegiatan choir bulan ini.”
- “Apakah ada kegiatan organisasi yang cocok dengan minat saya?”
- “Kegiatan apa yang berlangsung hari Jumat?”
- “Di mana lokasi acara ini?”
- “Jelaskan secara singkat kegiatan tersebut.”

**Ketetapan teknologi AI:**
- Provider: **Google Gemini API**.
- Model: **`gemini-3.5-flash`**.
- Gunakan opsi **Free Tier** yang tersedia untuk kebutuhan prototipe/tugas.
- Kuota dan ketentuan Free Tier mengikuti kebijakan Google yang berlaku saat implementasi; jangan mengasumsikan penggunaan gratis tanpa batas.
- Model harus diatur melalui konfigurasi agar mudah diperbarui jika ketersediaan model atau kebijakan provider berubah.

**Cara kerja yang diwajibkan:**
1. Pengguna mengirim pertanyaan melalui chat.
2. Sistem mengambil data event yang relevan dari JSON Server.
3. Sistem memprioritaskan data event `approved` dan kalender akademik yang valid.
4. Data yang diperlukan dikirim sebagai konteks ke Gemini.
5. Gemini memahami maksud pertanyaan dan menyusun jawaban dalam Bahasa Indonesia.
6. Hasil ditampilkan bersama kartu atau tautan event yang berasal dari data asli.

**Aturan jawaban AI:**
- AI hanya boleh menyebut detail event yang tersedia di database.
- AI tidak boleh mengarang nama kegiatan, tanggal, waktu, lokasi, penyelenggara, atau status.
- Event pending/rejected tidak boleh direkomendasikan kepada pengguna umum.
- Jika tidak ada hasil, AI harus mengatakan bahwa informasi belum ditemukan.
- Untuk pertanyaan “terdekat”, urutkan event berdasarkan waktu mulai setelah waktu saat ini.
- Gunakan zona waktu WITA (Asia/Makassar) untuk interpretasi jadwal.
- Jika data tidak lengkap, AI harus menjelaskan bagian yang belum tersedia.
- AI tidak memiliki kewenangan menyetujui pengajuan atau mengubah kalender.
- Jika Gemini tidak tersedia atau kuota tercapai, pengguna tetap dapat memakai pencarian dan filter biasa.
- Jangan mengirim password, token, atau informasi akun sensitif ke Gemini. Kirim hanya pertanyaan, preferensi relevan seperlunya, dan data event yang dibutuhkan.

**Contoh instruksi sistem untuk Gemini:**

> Kamu adalah UNKLAB Campus Assistant. Jawab dalam Bahasa Indonesia yang jelas dan ramah. Gunakan hanya data kegiatan yang diberikan dalam konteks aplikasi. Jangan menebak judul, tanggal, jam, lokasi, penyelenggara, target peserta, atau status event. Jika data yang dibutuhkan tidak tersedia, sampaikan bahwa informasi belum ditemukan atau belum tersedia. Untuk pertanyaan waktu relatif seperti “besok” atau “minggu ini”, gunakan tanggal dan zona waktu WITA yang diberikan aplikasi. Jangan menyetujui pengajuan, mengubah data, atau mengaku telah melakukan tindakan di dalam sistem. Bila ada event yang relevan, sebutkan event tersebut dan gunakan ID event dari konteks agar frontend dapat menampilkan kartu event sumber.

### 4.5 Event Request dan Approval

**Form pengajuan hanya dapat dikirim oleh role Organisasi.** Organisasi dapat mengajukan kegiatan yang diselenggarakan oleh organisasi tersebut.

Field form pengajuan:
- Nama kegiatan.
- Kategori kegiatan.
- Nama organisasi/penyelenggara (diambil dari organisasi yang terhubung ke akun).
- Deskripsi kegiatan.
- Tanggal kegiatan.
- Waktu mulai dan selesai.
- Lokasi.
- Target peserta.
- Poster atau gambar event (opsional bila implementasi upload tersedia).
- Tautan informasi/registrasi eksternal (opsional).

Validasi minimum pada form:
- Field wajib tidak boleh kosong.
- Waktu selesai harus lebih akhir daripada waktu mulai.
- Tautan harus memiliki format URL yang valid jika diisi.
- File poster, jika didukung, harus berupa format gambar yang diterima aplikasi dan ukuran file dibatasi.
- Sebelum submit, tampilkan ringkasan/pratinjau data agar organisasi dapat memeriksa kembali informasi.
- Sistem dapat menampilkan peringatan jika tanggal/waktu dan lokasi berpotensi bentrok dengan event lain. Peringatan ini membantu Admin; tidak otomatis menyetujui atau menolak pengajuan.

Alur pengajuan:

```text
Organisasi mengisi form event
          ↓
Validasi field wajib di frontend
          ↓
Pengajuan tersimpan dengan status PENDING
          ↓
Admin membuka Approval Queue
          ↓
Admin memeriksa kelengkapan dan kewajaran informasi
          ↓
     ┌────┴─────┐
     ↓          ↓
  APPROVED    REJECTED
     ↓          ↓
Tampil di      Tidak tampil sebagai
kalender       event publik
publik         dan alasan penolakan
```

Aturan approval:
- Semua pengajuan dari organisasi harus diperiksa Admin.
- Admin dapat menyetujui atau menolak pengajuan.
- Jika ditolak, Admin wajib menuliskan alasan singkat.
- Pengajuan berstatus `pending` tidak boleh muncul pada kalender publik.
- Setelah disetujui, event muncul pada kalender, daftar event, dashboard, dan hasil AI sesuai filter.
- Organisasi hanya dapat melihat dan mengubah pengajuan milik organisasinya sendiri.
- Hak edit setelah approval berada pada Admin; perubahan penting pada event yang sudah dipublikasikan harus diperiksa Admin sebelum data terbaru ditampilkan.
- Dosen/Staff tidak memiliki fungsi untuk membuat, mengirim, atau mengedit pengajuan event.

### 4.6 Saved Events dan My Schedule

- Pengguna yang login dapat menyimpan event sebagai **Saved Event**.
- Pengguna dapat memasukkan event ke **My Schedule**.
- Saved Event berarti event ditandai agar mudah dibuka kembali.
- My Schedule berarti event dipilih sebagai agenda pribadi.
- Sistem membandingkan tanggal dan jam event dalam My Schedule.
- Jika dua event pada tanggal yang sama saling overlap, tampilkan peringatan tanpa menghapus event secara otomatis.
- Aturan overlap: `startA < endB` dan `startB < endA`. Dua event yang hanya bersentuhan tepat di batas waktu (misalnya event pertama selesai pukul 10.00 dan event kedua dimulai pukul 10.00) tidak dianggap bentrok.

### 4.7 Di Luar Ruang Lingkup (Out of Scope)

Fitur berikut **tidak boleh dibangun untuk MVP/proyek ini**. AI Coding Agent tidak boleh menambahkannya sebagai fitur atau menu baru:

- Real Single Sign-On (SSO) UNKLAB. Login hanya berupa simulasi/prototipe dengan akun demo berdomain `@unklab.ac.id`.
- Integrasi dengan database akademik resmi UNKLAB.
- Pembayaran, transaksi, dan ticketing berbayar.
- Presensi resmi yang terhubung ke sistem kampus.
- QR check-in atau QR attendance.
- Peta lokasi kegiatan kampus.
- Event feedback, ulasan, dan rating.
- Chat antarpengguna.
- Pengiriman notifikasi melalui email atau WhatsApp.
- Push notification tingkat sistem ketika browser ditutup.
- AI yang mengambil keputusan approval secara otomatis.
- Role tambahan di luar Mahasiswa, Dosen/Staff, Organisasi, dan Admin.

Pengingat eksternal dan integrasi dengan layanan pihak ketiga tidak menjadi kebutuhan proyek. Fokus pada kalender, personalisasi, pencarian event, AI Assistant berbasis data, dan validasi Admin.

---

## 5. Daftar Kategori dan Data Awal

Daftar berikut berasal dari informasi yang diberikan tim dan menjadi data referensi awal. Nama dapat diperbarui oleh Admin jika ada perubahan resmi.

### 5.1 Kategori Event

Gunakan kategori berikut untuk mengelompokkan agenda. Kategori adalah klasifikasi event, sedangkan choir, asrama, dan organisasi juga dapat menjadi nama penyelenggara.

1. Kalender Akademik
2. Organisasi dan Komunitas
3. Choir
4. Kegiatan Asrama
5. Kegiatan Kerohanian
6. Kegiatan Fakultas/Program Studi
7. Seminar/Workshop/Kompetisi
8. Pengumuman Penting
9. Kegiatan Kampus Lainnya

Pengumuman penting dapat mencakup informasi deadline atau periode penting yang perlu diketahui sivitas kampus. Kategori ini tidak berarti sistem memproses pembayaran atau transaksi.

### 5.2 Daftar Choir dan Komunitas Choir

1. **TUC (The Unklab Choir)**
2. **TUFC (The Unklab FEB Choir)**
3. **VOCS choir unklab**
4. **The Unklab Echo Choir (TUEC)**
5. **The Unklab Nursing Choir**
6. **TOT (teachers of tomorrow)** — afiliasi FKIP

### 5.3 Daftar Asrama dan Kegiatan Asrama

**Daftar asrama yang diberikan tim:**

1. JASMINE 1
2. JASMINE 2
3. GUEST HOUSE
4. GENZET
5. ANNEX
6. BOUGENVILE
7. CRYSTAL
8. EDELWEIS

**Jenis kegiatan dan pola hari:**

| Kegiatan | Pola hari | Ketentuan |
|---|---|---|
| OPEN HOUSE | Sabbath / Sabtu | Menggunakan pola hari Sabbath; tanggal pelaksanaan mengikuti pengumuman pengelola asrama. |
| OLAHRAGA BERSAMA ANTAR ASRAMA | Minggu | Tanggal dan frekuensi setiap pelaksanaan perlu dikonfirmasi. |
| MIX FORMAL | Kamis | Tanggal dan frekuensi setiap pelaksanaan perlu dikonfirmasi. |
| IBADAH WORSHIP BERSAMA DENGAN ASRAMA LAIN | Kamis | Kegiatan khusus ini berbeda dari jadwal ibadah rutin Midweek, Vesper, dan Sabbath. |
| WAKTU UNTUK STUDY DI (ASRAMA/DINING) | Setiap Senin dan Selasa | Pola rutin mingguan sesuai informasi tim. |

**Jadwal ibadah rutin:**

| Ibadah | Hari | Sasaran peserta |
|---|---|---|
| IBADAH MIDWEEK | Setiap Rabu | Semua penghuni asrama dan outsider dekat. |
| IBADAH VESPER | Setiap Jumat | Semua penghuni asrama dan outsider dekat. |
| IBADAH SABBATH | Setiap Sabbath / Sabtu | Semua penghuni asrama, outsider dekat, dan outsider jauh. |

**Ketentuan long weekend:** ibadah Sabbath tidak dijadwalkan ketika tanggalnya termasuk long weekend. Penentuan long weekend wajib mengacu pada Kalender Akademik UNKLAB 2026. Selama kalender akademik belum tersedia, tanggal contoh Sabbath harus diberi status belum diverifikasi dan tidak boleh diklaim sebagai jadwal resmi.

Nama asrama dipertahankan sesuai daftar dari tim, termasuk penulisan **BOUGENVILE**.

### 5.4 Organisasi dan Komunitas

1. BEM Unklab
2. CSSA
3. BEM UBS
4. IKMAPAP (Ikatan Mahasisa Papua)
5. IKMAMALUT (Ikatan Mahadiswa Maluku Utara)
6. IKMAM
7. IMABAT (Ikatan Mahasiswa Batak)
8. IKMANUT (Ikatan Mahasiswa Nusa Utara)
9. Gate Ministry
10. KSPM (Kelompok Studi Pasar Modal)
11. UVICS (Unklab Virtue in Computer Science)
12. MAPALA
13. GENBI (Generasi Baru Indonesia)

**Catatan data:** kepanjangan IKMAM tidak ditambahkan karena belum diberikan oleh tim. Penulisan IKMAPAP dan IKMAMALUT dipertahankan sesuai daftar tim. Jangan mengoreksi ejaan atau menebak kepanjangan organisasi secara otomatis.

### 5.5 Pola Jadwal dan Data Dummy Awal

Untuk tahap pengembangan Front End, gunakan file pendamping `UNKLAB-MASTER-DATA.json` sebagai seed data JSON Server. File tersebut memuat daftar organisasi, choir, kegiatan asrama, kategori, dan contoh event.

**Seluruh jadwal pada seed data bersifat dummy/simulasi**, bukan jadwal resmi UNKLAB. Setiap event contoh harus memiliki `isDummy: true` dan `sourceType: "demo_seed"`. Label **Data Simulasi** harus terlihat pada event dummy di antarmuka demo.

Aturan pola jadwal untuk data simulasi:
- **Organisasi:** mayoritas organisasi diberi contoh meeting rutin setiap hari Kamis. File seed mempertahankan pola Kamis yang sudah ada. UVICS ditambahkan ke daftar organisasi, tetapi tidak diberi jadwal meeting dummy karena hari dan jamnya belum diberikan oleh tim. Jam, tanggal, dan lokasi pada pola organisasi tetap merupakan simulasi.
- **Choir:** jadwal event choir yang sudah ada dipertahankan. Data contoh mencakup anniversary, homecoming, pelayanan di dalam UNKLAB, dan pelayanan di luar UNKLAB. Tidak semua choir diasumsikan memiliki seluruh jenis kegiatan tersebut.
- **Kegiatan asrama:** OPEN HOUSE menggunakan pola Sabbath/Sabtu; olahraga bersama antar asrama hari Minggu; MIX FORMAL hari Kamis; IBADAH WORSHIP BERSAMA DENGAN ASRAMA LAIN hari Kamis; dan WAKTU UNTUK STUDY DI (ASRAMA/DINING) setiap Senin dan Selasa. Jangan mengasumsikan kegiatan yang tidak dinyatakan rutin berlangsung setiap minggu.
- **Ibadah rutin:** IBADAH MIDWEEK berlangsung setiap Rabu untuk seluruh penghuni asrama dan outsider dekat; IBADAH VESPER setiap Jumat untuk sasaran yang sama; IBADAH SABBATH setiap Sabtu untuk seluruh penghuni asrama, outsider dekat, dan outsider jauh, kecuali saat long weekend.
- **Pengecekan long weekend:** jadwal Sabbath wajib disaring menggunakan Kalender Akademik UNKLAB 2026. Jika kalender belum tersedia, tandai jadwal sebagai belum diverifikasi; jangan menebak long weekend.
- **Kalender akademik:** jangan membuat jadwal akademik dummy atau menebak tanggal akademik. Tunggu dokumen Kalender Akademik UNKLAB 2026 yang diberikan tim.

Nama organisasi, choir, dan asrama harus dipertahankan sesuai master data. Jangan membuat, mengganti, atau memperluas daftar tersebut tanpa persetujuan tim. Ejaan IKMAPAP dan IKMAMALUT mengikuti daftar yang diberikan tim dan perlu dikonfirmasi sebelum dipublikasikan sebagai data resmi.

### 5.6 Kalender Akademik 2026

Tim akan menyediakan dokumen **Kalender Akademik UNKLAB 2026** secara terpisah untuk dimasukkan sebagai data awal ketika implementasi Front End dilakukan.

Ketentuan untuk AI Coding Agent:
- Jangan membuat atau menebak tanggal kalender akademik 2026 sebelum dokumen sumber diberikan.
- Setelah dokumen diberikan, masukkan semua agenda sesuai isi dokumen, termasuk nama kegiatan, tanggal, rentang tanggal, dan keterangan jika tersedia.
- Pertahankan informasi asli dari dokumen. Jika ada bagian yang tidak terbaca atau ambigu, tandai untuk dikonfirmasi; jangan mengisi dengan asumsi.
- Simpan kalender akademik sebagai data dengan `sourceType: "academic_calendar"` dan status yang dikelola Admin.
- Pastikan data kalender dapat diperbarui Admin jika dokumen resmi mengalami revisi.

---

## 6. Struktur Halaman dan Navigasi

### 6.1 Halaman Utama

- Header dengan logo/wordmark UNKLAB HUB.
- Penjelasan singkat fungsi platform.
- Preview agenda atau kegiatan terdekat dari data yang tersedia.
- Tombol **Lihat Kalender** dan **Login**.
- Cuplikan manfaat AI Assistant.
- Jangan menampilkan statistik atau event fiktif seolah-olah data asli.

### 6.2 Halaman Login

- Email kampus.
- Password.
- Pilihan role: Mahasiswa, Dosen/Staff, Organisasi, Admin.
- Validasi domain email dan kecocokan role akun.
- Pesan error yang jelas.

### 6.3 Halaman Onboarding Profil

- Pertanyaan minat.
- Pertanyaan hobi.
- Pilihan jenis kegiatan yang disukai.
- Pilihan hari/waktu luang (opsional).
- Tombol simpan dan lewati.
- Progress atau penanda langkah yang sederhana.

### 6.4 Dashboard

- Greeting.
- Rekomendasi event personal.
- Event terdekat.
- Agenda hari ini/minggu ini.
- Shortcut ke Kalender, Explore Event, My Schedule, dan AI Assistant.
- Widget tambahan mengikuti role.

### 6.5 Calendar

- Month View, Week View, Day View, dan List/Agenda View.
- Navigasi periode sebelumnya/berikutnya dan tombol Today.
- Filter kategori, penyelenggara, target peserta, dan periode tanggal.
- Pencarian judul event, nama penyelenggara, dan lokasi.
- Penanda kalender akademik resmi dan event organisasi yang telah disetujui.
- Indikator Sedang Berlangsung untuk event yang waktunya mencakup waktu saat ini.
- Klik event untuk membuka detail.
- Pada layar mobile, List/Agenda View menjadi tampilan utama agar jadwal mudah dibaca.

### 6.6 Explore Events

- Search bar.
- Filter kategori, organisasi/penyelenggara, tanggal, dan target peserta.
- Daftar event dalam bentuk card atau list.
- Empty state jika tidak ada hasil.

### 6.7 Event Detail

- Judul dan poster jika tersedia.
- Kategori dan status.
- Tanggal dan waktu.
- Lokasi.
- Penyelenggara.
- Deskripsi.
- Target peserta.
- Tombol Save dan Add to My Schedule.
- Label sumber/verifikasi jika relevan.

### 6.8 AI Campus Assistant

- Area percakapan.
- Input chat dan tombol kirim.
- Suggested prompts.
- Loading state saat Gemini memproses pertanyaan.
- Jawaban dan kartu event yang dapat dibuka.
- Error dan retry state.

### 6.9 Event Request

- Untuk Organisasi: form pengajuan, daftar pengajuan sendiri, status, serta catatan Admin.
- Untuk Dosen/Staff: halaman read-only berisi penjelasan bahwa pengajuan event dilakukan melalui akun organisasi. Tidak boleh ada tombol pengajuan.
- Untuk Admin: Approval Queue, detail pengajuan, tombol approve/reject, dan catatan reviewer.

### 6.10 Profile

- Nama dan email kampus.
- Role pengguna.
- Minat.
- Hobi.
- Jenis kegiatan yang disukai.
- Preferensi waktu luang.
- Program studi/fakultas/unit bila diisi.
- Tombol edit profil dan logout.

---

## 7. Aturan Desain UI/UX

### 7.1 Design Direction

Arah desain UNKLAB HUB adalah **clean, modern, warm, campus-oriented, dan human-centered**. Website harus terlihat seperti produk digital kampus yang dirancang oleh tim desain, bukan hasil template AI yang generik.

Karakter tampilan:
- Putih menjadi warna dominan.
- Ungu menjadi warna identitas dan aksi utama.
- Aksen warna lain mengikuti nuansa identitas UNKLAB, tetapi digunakan seperlunya.
- Informasi dan poster kegiatan menjadi fokus.
- Layout memiliki whitespace yang cukup dan hierarki visual jelas.
- Tidak semua konten harus berbentuk card.
- Hindari dekorasi yang tidak memiliki fungsi.

### 7.2 Color Palette

Kode warna berikut merupakan **usulan token UI proyek**, bukan klaim sebagai kode HEX resmi brand guideline UNKLAB.

| Token | HEX | Penggunaan |
|---|---|---|
| `brand-purple` | `#402155` | Tombol utama, active navigation, identitas utama |
| `purple-hover` | `#56366F` | Hover/pressed tombol ungu |
| `purple-soft` | `#F1EBF5` | Selected state, chip aktif, panel lembut |
| `purple-muted` | `#80639A` | Icon dan aksen sekunder |
| `white` | `#FFFFFF` | Card, modal, form, area konten |
| `page-bg` | `#FAF9FB` | Background halaman |
| `text-primary` | `#29242E` | Heading dan body text |
| `text-secondary` | `#706A75` | Metadata dan helper text |
| `border` | `#E9E4EC` | Border/divider |
| `brand-gold` | `#D9B85F` | Aksen kecil/highlight, bukan warna dominan |
| `brand-red` | `#B94A52` | Peringatan/status penting secara terbatas |
| `success` | `#2F7757` | Status approved/success |
| `warning` | `#A66B20` | Status pending/perhatian |
| `danger` | `#B4434D` | Rejected/error |

Proporsi visual yang disarankan:
- 75–85% putih dan neutral terang.
- 10–20% ungu/lavender.
- Aksen gold, merah, dan warna status digunakan secara terbatas.

### 7.3 Typography

Gunakan satu keluarga font sans-serif yang konsisten, misalnya **Inter** atau font setara.

| Elemen | Ukuran desktop | Ukuran mobile |
|---|---:|---:|
| Hero/page title | 30–40 px | 26–32 px |
| Section heading | 20–24 px | 18–22 px |
| Card/event title | 16–18 px | 16–18 px |
| Body | 14–16 px | 14–16 px |
| Metadata | 12–13 px | 12–13 px |

Gunakan sentence case dan hindari terlalu banyak ukuran font dalam satu layar.

### 7.4 Layout dan Responsivitas

- Desktop menggunakan sidebar atau top navigation yang konsisten.
- Konten utama memiliki lebar yang nyaman dibaca dan tidak melebar berlebihan.
- Mobile menggunakan navigasi ringkas, drawer, atau bottom navigation.
- Kalender pada mobile dapat menggunakan tampilan agenda/list agar mudah dibaca.
- Form dibuat satu kolom pada layar kecil.
- Hindari horizontal scroll yang tidak diperlukan.
- Pastikan tombol dan kontrol cukup besar untuk digunakan dengan sentuhan.

### 7.5 Komponen UI Konsisten

Komponen yang perlu dibuat reusable:
- Button: primary, secondary, text, danger, disabled, loading.
- Input, textarea, select, dan search field.
- Filter chip.
- Category badge dan status badge.
- Event card dan event list item.
- Calendar cell dan calendar toolbar.
- Modal/drawer.
- Toast atau inline feedback.
- Empty state, loading skeleton, dan error state.
- Chat bubble dan AI event result card.

### 7.6 Prinsip Agar Tampilan Tidak Terasa Generik/“AI Banget”

- Jangan menggunakan gradient ungu besar di seluruh halaman.
- Hindari glassmorphism, glow, neon, shadow tebal, dan efek blur berlebihan.
- Jangan membuat setiap section menjadi kumpulan card identik.
- Hindari ilustrasi robot/AI dekoratif yang mendominasi.
- Gunakan microcopy natural dan spesifik dengan konteks kampus.
- Gunakan foto/poster kegiatan yang relevan jika aset tersedia.
- Tampilkan informasi yang benar-benar berguna; jangan menambahkan angka statistik dekoratif.
- Berikan perhatian pada detail kecil: alignment, jarak, ukuran ikon, keadaan hover, dan feedback aksi.

---

## 8. Motion, Animation, dan Micro-interaction

Tujuan animasi adalah memberi respons dan membantu pengguna memahami perubahan tampilan. Animasi tidak boleh memperlambat pekerjaan atau menjadi dekorasi berlebihan.

### 8.1 Aturan Umum

- Gunakan transisi singkat, umumnya **150–220 ms** untuk hover, focus, dan perubahan state.
- Gunakan **200–300 ms** untuk modal, drawer, dropdown, atau perpindahan panel.
- Gunakan easing yang halus seperti `ease-out` untuk masuk dan `ease-in-out` untuk perubahan posisi.
- Hindari animasi panjang, bouncing berlebihan, parallax, dan gerakan terus-menerus tanpa fungsi.
- Hormati `prefers-reduced-motion` dengan mengurangi atau menonaktifkan gerakan non-esensial.

### 8.2 Interaksi yang Harus Memiliki Feedback

| Elemen/aksi | Perilaku yang diharapkan |
|---|---|
| Button hover | Warna/background berubah halus. |
| Button click | Memiliki pressed state singkat dan feedback aksi. |
| Event card hover | Border/shadow berubah tipis atau card naik sedikit; jangan berlebihan. |
| Event card click | Membuka detail melalui navigasi, drawer, atau modal dengan transisi halus. |
| Calendar date select | Tanggal terpilih mendapat highlight yang jelas. |
| Filter select | Chip/dropdown menunjukkan state aktif. |
| Save event | Ikon berubah state dan muncul toast singkat “Event disimpan”. |
| Form submit | Tombol menunjukkan loading, lalu pesan berhasil/gagal. |
| Approve/reject | Dialog konfirmasi atau feedback agar aksi admin jelas. |
| Chat send | Pesan langsung tampil; AI menampilkan indikator sedang memproses. |
| Onboarding step | Perpindahan pertanyaan halus tanpa animasi berlebihan. |

### 8.3 Feedback State

Setiap aksi penting harus menyediakan state yang sesuai:
- **Loading:** spinner atau skeleton yang proporsional.
- **Success:** toast atau inline confirmation.
- **Error:** pesan yang menjelaskan masalah dan langkah berikutnya.
- **Empty:** penjelasan singkat dan tombol tindakan yang relevan.
- **Disabled:** tampilan jelas bahwa aksi belum tersedia.

Tidak boleh ada tombol yang terlihat aktif tetapi tidak melakukan apa pun.

---

## 9. Data dan Struktur JSON Server

JSON Server digunakan sebagai mock REST API untuk menyimpan data prototipe. Struktur dapat disesuaikan saat implementasi, tetapi nama field harus konsisten.

### 9.1 Resource Utama

- `users`
- `events`
- `bookmarks`
- `mySchedule`
- `categories`
- `organizations`
- `choirs`
- `dormitoryActivities`
- `dormitories`
- `worshipSchedules`
- `audienceGroups`

### 9.2 Contoh Data User

```json
{
  "id": "user-001",
  "name": "Nama Pengguna",
  "email": "mahasiswa@unklab.ac.id",
  "password": "demo-password",
  "role": "mahasiswa",
  "faculty": "Fakultas Ilmu Komputer",
  "studyProgram": "Sistem Informasi",
  "interests": ["teknologi", "kepemimpinan"],
  "hobbies": ["coding", "membaca"],
  "preferredEventTypes": ["seminar", "organisasi"],
  "availableSlots": ["weekday-afternoon", "weekend"],
  "profileCompleted": true
}
```

Nilai password di atas hanya contoh untuk akun demo. Jangan menyimpan password teks biasa jika autentikasi nyata diimplementasikan.

### 9.3 Contoh Data Event

```json
{
  "id": "event-demo-001",
  "title": "Meeting Rutin BEM Unklab",
  "categoryId": "cat-organization",
  "eventType": "routine_meeting",
  "organizerId": "org-bem-unklab",
  "organizerName": "BEM Unklab",
  "description": "Contoh meeting rutin untuk demonstrasi.",
  "date": "2026-11-12",
  "startTime": "16:00",
  "endTime": "17:00",
  "location": "Ruang Kegiatan Organisasi (Lokasi Simulasi)",
  "targetAudience": ["mahasiswa"],
  "tags": ["meeting", "organisasi", "kamis"],
  "sourceType": "demo_seed",
  "status": "approved",
  "isDummy": true
}
```

Contoh di atas mengikuti struktur `UNKLAB-MASTER-DATA.json`. Ini adalah event simulasi untuk lingkungan demo. `status: "approved"` hanya agar event terlihat pada prototipe; `isDummy: true` wajib dipertahankan.

### 9.4 Status Event

| Status | Arti | Ditampilkan di kalender publik? |
|---|---|---|
| `pending` | Menunggu validasi Admin | Tidak |
| `approved` | Disetujui Admin | Ya |
| `rejected` | Ditolak Admin | Tidak |
| `cancelled` | Dibatalkan setelah dibuat | Tidak sebagai agenda aktif |

### 9.5 Data Integritas

- Email pengguna harus unik.
- Role harus salah satu dari `mahasiswa`, `dosen_staff`, `organisasi`, atau `admin`.
- Event harus memiliki judul, kategori, tanggal, waktu mulai, waktu selesai, lokasi, penyelenggara, dan status.
- Waktu selesai harus lebih akhir daripada waktu mulai.
- Event organisasi yang dikirim melalui form harus memiliki `status: "pending"`.
- Hanya Admin yang dapat mengubah status approval.
- Bookmark dan My Schedule harus terhubung dengan ID pengguna dan ID event.
- Dashboard hanya boleh merekomendasikan event yang disetujui dan belum selesai/dibatalkan.
- Seed event yang hanya digunakan untuk demo harus memiliki `isDummy: true` dan `sourceType: "demo_seed"`; tampilkan label **Data Simulasi** pada UI.
- Event seed boleh memakai `status: "approved"` hanya agar terlihat dalam prototipe lokal. Status tersebut tidak berarti event telah disetujui secara nyata oleh UNKLAB.
- Jangan masukkan tanggal kalender akademik ke seed data sebelum dokumen resmi 2026 diberikan.
- Pertahankan nama organisasi, choir, asrama, dan kegiatan asrama sesuai master data pendamping; jangan melakukan koreksi/penambahan otomatis tanpa konfirmasi tim.
- Pertahankan jadwal event organisasi dan choir yang sudah tersedia. Gunakan pola hari kegiatan asrama dan ibadah sesuai bagian 5.3.
- Jangan membuat jadwal meeting UVICS sebelum hari dan jamnya diberikan oleh tim.
- Jadwal IBADAH SABBATH harus dikecualikan pada long weekend berdasarkan Kalender Akademik UNKLAB 2026. Jika kalender belum tersedia, tandai sebagai belum diverifikasi.

### 9.6 Endpoint JSON Server yang Disarankan

Endpoint berikut merupakan kontrak awal untuk menghubungkan halaman React dengan JSON Server. Sesuaikan nama resource dengan `db.json` final, tetapi pertahankan pola akses dan kepemilikan data.

| Kebutuhan | Method dan endpoint | Aturan |
|---|---|---|
| Mengambil akun berdasarkan email | `GET /users?email=:email` | Hasil harus dicocokkan dengan role akun. |
| Mengambil event publik | `GET /events?status=approved` | Hanya event approved yang ditampilkan ke pengguna umum yang login. |
| Mengambil event berdasarkan kategori | `GET /events?categoryId=:categoryId` | Dapat digabung dengan filter tanggal/penyelenggara di frontend. |
| Mengambil event milik organisasi | `GET /events?organizerId=:organizationId` | Akun organisasi hanya boleh melihat data organisasinya sendiri. |
| Mengirim pengajuan event | `POST /events` | Hanya role Organisasi; status awal wajib `pending`. |
| Memperbarui data/status event | `PATCH /events/:id` | Admin mengubah status approval; organisasi hanya mengubah pengajuannya sendiri sesuai aturan. |
| Mengambil kategori | `GET /categories` | Dibaca untuk filter dan form. |
| Mengambil master organisasi/choir/asrama | `GET /organizations`, `GET /choirs`, `GET /dormitories`, `GET /dormitoryActivities`, `GET /worshipSchedules` | Mengacu pada master data yang diberikan tim. |
| Mengambil bookmark pengguna | `GET /bookmarks?userId=:userId` | Data dibatasi berdasarkan user yang sedang login. |
| Menyimpan bookmark | `POST /bookmarks` | Simpan pasangan userId dan eventId. |
| Menghapus bookmark | `DELETE /bookmarks/:id` | Hanya pemilik bookmark. |
| Mengambil My Schedule | `GET /mySchedule?userId=:userId` | Data dibatasi berdasarkan user yang sedang login. |
| Menambahkan My Schedule | `POST /mySchedule` | Simpan pasangan userId dan eventId. |
| Menghapus item My Schedule | `DELETE /mySchedule/:id` | Hanya pemilik item jadwal. |

Catatan: JSON Server adalah mock API untuk demo, bukan backend produksi yang otomatis menyediakan keamanan role. Pemeriksaan role/ownership perlu dilakukan dalam alur aplikasi dan, bila dikembangkan menjadi sistem nyata, dipindahkan/diterapkan pada backend yang memiliki autentikasi dan otorisasi sesungguhnya.

---

## 10. Teknologi dan Integrasi

### 10.1 Teknologi Utama

| Lapisan | Pilihan yang direkomendasikan | Keterangan |
|---|---|---|
| Build tool | Vite | Menjalankan dan membangun proyek React. |
| Frontend | React | Teknologi frontend wajib sesuai brief tugas. |
| Routing | React Router | Mengatur perpindahan halaman dan proteksi route berbasis role. |
| Styling | Tailwind CSS | Gunakan satu pendekatan styling secara konsisten dan simpan warna/spacing sebagai design token. |
| State | React Context dan hooks | Cukup untuk auth, profil, dan state jadwal pada skala proyek. |
| Data/API demo | JSON Server | Mock REST API menggunakan `db.json`; diperbolehkan dalam brief tugas. |
| Tanggal | date-fns atau utilitas JavaScript yang konsisten | Pengolahan kalender, rentang tanggal, dan waktu WITA. |
| Ikon | lucide-react | Gunakan ikon yang konsisten dan tidak berlebihan. |
| AI | Google Gemini API, `gemini-3.5-flash` | AI Campus Assistant; penggunaan mengikuti Free Tier dan kuotanya. |

Library tambahan seperti Zustand, TanStack Query, atau React Hook Form bersifat opsional. Jangan menambahkan dependency hanya untuk kebutuhan yang dapat ditangani dengan React dan JavaScript biasa.

### 10.2 Arsitektur Sederhana

```text
Pengguna
   ↓
React Frontend
   ├── Login dan Role-Based Navigation
   ├── Profile & Personalization
   ├── Dashboard
   ├── Calendar & Event Discovery
   ├── Event Request & Admin Approval
   └── AI Campus Assistant
          ↓                 ↓
      JSON Server      Server/API Proxy
      (data aplikasi)       ↓
                       Gemini API
                    gemini-3.5-flash
```

### 10.3 Integrasi Gemini

- Gunakan model ID `gemini-3.5-flash`.
- API key harus diletakkan pada environment variable server, bukan ditulis langsung dalam komponen React atau file yang dikirim ke browser.
- Buat service/helper khusus untuk mengirim pertanyaan ke Gemini agar integrasi tidak tersebar di banyak komponen.
- Ambil data event yang relevan sebelum meminta Gemini menjawab.
- Jika memungkinkan, batasi konteks pada event yang sesuai tanggal/kategori/penyelenggara pertanyaan.
- Jawaban AI harus dapat dihubungkan kembali dengan event ID dari database.
- Tangani error jaringan, respons kosong, dan batas kuota.
- Free Tier memiliki ketentuan, batas penggunaan, dan kebijakan data dari Google. Periksa kembali halaman pricing dan ketentuan Google saat implementasi.

### 10.4 Rekomendasi Struktur Folder React

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── calendar/
│   ├── events/
│   └── assistant/
├── pages/
│   ├── LoginPage.jsx
│   ├── OnboardingPage.jsx
│   ├── DashboardPage.jsx
│   ├── CalendarPage.jsx
│   ├── ExploreEventsPage.jsx
│   ├── EventDetailPage.jsx
│   ├── AssistantPage.jsx
│   ├── EventRequestPage.jsx
│   ├── AdminApprovalPage.jsx
│   └── ProfilePage.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── eventService.js
│   └── geminiService.js
├── hooks/
├── context/
├── utils/
├── styles/
└── App.jsx
```

Struktur ini adalah panduan awal. AI Coding Agent boleh menyesuaikan nama atau pengelompokan file, tetapi harus tetap memisahkan komponen UI, akses data, dan logika aplikasi.

---

## 11. Non-Functional Requirements

### 11.1 Usability

- Navigasi mudah dipahami oleh pengguna yang baru pertama kali membuka website.
- Label tombol dan menu menggunakan bahasa yang jelas.
- Informasi tanggal, jam, lokasi, kategori, dan penyelenggara mudah ditemukan.
- Pengguna selalu mendapat feedback setelah melakukan aksi penting.

### 11.2 Performance

- Halaman inti tidak boleh memuat seluruh data event yang tidak diperlukan.
- Gunakan loading state ketika mengambil data.
- Hindari animasi berat dan library yang tidak diperlukan.
- Pencarian dan filter harus terasa responsif untuk ukuran data demo.

### 11.3 Security dan Permission

- Terapkan pemeriksaan role pada setiap halaman dan aksi.
- Jangan hanya menyembunyikan tombol; operasi yang tidak berhak tetap harus ditolak oleh service/API.
- API key Gemini tidak boleh terekspos di kode frontend.
- Jangan mengirim password atau data akun sensitif ke AI.
- Pastikan pengguna organisasi hanya dapat mengakses pengajuannya sendiri.
- Hanya Admin yang dapat melakukan approval dan mengelola kalender akademik.

### 11.4 Compatibility

Website harus dapat digunakan pada browser desktop modern dan browser mobile. Layout wajib diuji pada ukuran desktop, tablet, dan smartphone.

### 11.5 Accessibility Dasar

- Kontras teks dan background harus cukup.
- Form memiliki label yang jelas.
- Komponen interaktif dapat dikenali melalui focus state.
- Jangan menjadikan warna sebagai satu-satunya penanda status.
- Hormati pengaturan reduced motion.

### 11.6 Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Jawaban AI tidak sesuai dengan data | Batasi konteks AI ke event yang diambil dari JSON Server, gunakan instruksi ketat, dan tampilkan kartu event sumber. |
| Kuota Gemini Free Tier tercapai | Batasi konteks/riwayat percakapan dan sediakan pencarian serta filter manual sebagai fallback. |
| Jadwal dummy dianggap sebagai jadwal resmi | Tampilkan label **Data Simulasi** dan pertahankan `isDummy: true` pada seluruh seed event. |
| Kalender sulit digunakan di layar kecil | Sediakan List/Agenda View sebagai tampilan utama pada mobile. |
| Pengguna mengakses menu yang tidak sesuai role | Terapkan route guard dan validasi hak akses sebelum setiap aksi. |
| API key Gemini terekspos | Gunakan server/proxy untuk panggilan Gemini; jangan menaruh secret di bundle React atau repositori. |
| Scope proyek melebar | Ikuti prioritas P0/P1 dan daftar Out of Scope pada bagian 4.7. |

---

## 12. User Flow Utama

### 12.1 Login dan Personalisasi

```text
Buka website
   ↓
Masukkan email @unklab.ac.id dan password
   ↓
Pilih jenis akun
   ↓
Sistem validasi akun dan role
   ↓
Login berhasil
   ↓
Profil belum lengkap?
   ├── Ya → Isi minat, hobi, jenis kegiatan, waktu luang
   │          ↓
   │       Simpan/Lewati
   └── Tidak
          ↓
      Dashboard personal
```

### 12.2 Mahasiswa/Dosen/Staff Menemukan Event

```text
Dashboard atau Calendar
       ↓
Pilih kategori / gunakan pencarian / tanya AI
       ↓
Sistem menampilkan event yang approved
       ↓
Buka detail event
       ↓
Simpan event atau tambahkan ke My Schedule
```

### 12.3 Organisasi Mengajukan Event

```text
Login sebagai Organisasi
       ↓
Buka Event Request
       ↓
Isi form pengajuan
       ↓
Validasi form
       ↓
Kirim pengajuan
       ↓
Status PENDING
       ↓
Admin melakukan validasi
       ↓
Approved atau Rejected
       ↓
Jika Approved, event tampil di kalender publik
```

### 12.4 Admin Memvalidasi Event

```text
Login sebagai Admin
       ↓
Buka Approval Queue
       ↓
Pilih pengajuan
       ↓
Periksa detail, tanggal, waktu, lokasi, kategori, dan penyelenggara
       ↓
Approve atau Reject + alasan
       ↓
Sistem memperbarui status
       ↓
Event approved dipublikasikan
```

### 12.5 Admin Mengelola Kalender Akademik

```text
Login sebagai Admin
       ↓
Buka Academic Calendar Management
       ↓
Masukkan atau perbarui agenda dari dokumen kalender akademik
       ↓
Periksa tanggal dan keterangan
       ↓
Simpan
       ↓
Agenda tampil di kalender dengan label Kalender Akademik
```

---

## 13. Acceptance Criteria dan Pengujian

Proyek dapat dianggap memenuhi kebutuhan utama apabila skenario berikut berhasil.

### 13.1 Login dan Role

- [ ] Email di luar `@unklab.ac.id` ditolak dengan pesan validasi.
- [ ] Login berhasil dengan akun kampus yang tersedia di data demo.
- [ ] Empat role yang tersedia hanya Mahasiswa, Dosen/Staff, Organisasi, dan Admin.
- [ ] Role yang dipilih harus cocok dengan role akun.
- [ ] Menu dan hak akses sesuai matriks role.
- [ ] Dosen/Staff tidak memiliki tombol atau jalur untuk mengirim pengajuan.
- [ ] Event Request tampil read-only untuk Dosen/Staff, dan dapat digunakan untuk mengirim event hanya oleh Organisasi.

### 13.2 Personalisasi

- [ ] Pengguna baru diarahkan ke onboarding setelah login pertama.
- [ ] Pengguna dapat memilih beberapa minat dan jenis kegiatan.
- [ ] Hobi dan waktu luang dapat diisi atau dilewati.
- [ ] Preferensi tersimpan pada profil.
- [ ] Dashboard menampilkan rekomendasi yang sesuai dengan preferensi yang dipilih.
- [ ] Pengguna dapat mengubah preferensi dari Profile.
- [ ] Jika onboarding dilewati, dashboard umum tetap tampil normal.

### 13.3 Kalender dan Event

- [ ] Kalender menampilkan event akademik dan nonakademik.
- [ ] Pengguna dapat mengganti tampilan Bulanan, Mingguan, Harian, dan Daftar/Agenda.
- [ ] Tombol Hari Ini dan navigasi periode sebelumnya/berikutnya bekerja.
- [ ] Kalender akademik memiliki pembeda visual/label sumber resmi.
- [ ] Event organisasi yang telah disetujui memiliki badge sumber yang berbeda dari kalender akademik.
- [ ] Filter kategori, penyelenggara, target peserta, dan periode tanggal bekerja.
- [ ] Pencarian dapat menemukan event berdasarkan judul, penyelenggara, dan lokasi.
- [ ] Event yang sedang berlangsung menampilkan indikator yang dihitung dari waktu WITA saat ini.
- [ ] Detail event menampilkan informasi yang tersedia.
- [ ] Event pending dan rejected tidak muncul pada kalender publik.
- [ ] Event approved muncul pada kalender dan hasil pencarian.
- [ ] Event dummy selalu menampilkan label Data Simulasi.
- [ ] Daftar asrama memuat delapan nama: JASMINE 1, JASMINE 2, GUEST HOUSE, GENZET, ANNEX, BOUGENVILE, CRYSTAL, dan EDELWEIS.
- [ ] Pola kegiatan asrama sesuai ketentuan: Open House pada Sabbath/Sabtu, olahraga bersama hari Minggu, Mix Formal hari Kamis, Worship bersama hari Kamis, dan Study Time setiap Senin serta Selasa.
- [ ] IBADAH MIDWEEK tampil pada pola Rabu dan menyasar seluruh penghuni asrama serta outsider dekat.
- [ ] IBADAH VESPER tampil pada pola Jumat dan menyasar seluruh penghuni asrama serta outsider dekat.
- [ ] IBADAH SABBATH tampil pada pola Sabtu untuk seluruh penghuni asrama, outsider dekat, dan outsider jauh; tanggal yang termasuk long weekend dikecualikan berdasarkan Kalender Akademik UNKLAB 2026.
- [ ] Jika Kalender Akademik 2026 belum tersedia, status pengecekan long weekend untuk event Sabbath ditampilkan sebagai belum diverifikasi dan tidak diklaim sebagai jadwal resmi.

### 13.4 Event Request dan Approval

- [ ] Menu Event Request tampil sesuai role yang ditentukan.
- [ ] Organisasi dapat mengisi dan mengirim pengajuan.
- [ ] Dosen/Staff tidak dapat mengirim atau mengedit pengajuan.
- [ ] Pengajuan organisasi tersimpan dengan status pending.
- [ ] Admin dapat melihat seluruh pengajuan.
- [ ] Hanya Admin dapat approve/reject.
- [ ] Penolakan menyimpan alasan.
- [ ] Event baru tampil ke publik setelah disetujui Admin.

### 13.5 AI Assistant

- [ ] AI dapat menjawab pertanyaan tentang event terdekat berdasarkan data sistem.
- [ ] AI dapat membantu mencari event berdasarkan kategori atau periode.
- [ ] Jawaban menampilkan event yang benar dan dapat dibuka.
- [ ] AI tidak membuat event atau detail yang tidak ada pada database.
- [ ] AI menyatakan tidak menemukan data jika hasil kosong.
- [ ] Jika API gagal, pencarian manual tetap bisa digunakan.

### 13.6 UI dan Interaksi

- [ ] Tidak ada tombol utama yang tidak berfungsi.
- [ ] Hover, focus, pressed, loading, success, dan error state tersedia.
- [ ] Animasi terasa halus dan tidak berlebihan.
- [ ] Tidak ada horizontal overflow pada ukuran layar yang diuji.
- [ ] Warna, typography, spacing, dan komponen konsisten.

---

## 14. Prioritas Pengerjaan

Agar pengerjaan tidak melebar, implementasi disarankan mengikuti urutan berikut:

### Tahap 1 — Fondasi
- Setup React dan routing.
- Buat design tokens, layout, dan komponen dasar.
- Siapkan JSON Server dan akun empat role.
- Implementasikan login dan proteksi role.

### Tahap 2 — Profil dan Dashboard
- Buat onboarding personalisasi.
- Simpan preferensi pengguna.
- Buat dashboard sesuai role dan preferensi.

### Tahap 3 — Kalender dan Event
- Masukkan data kalender akademik setelah dokumen 2026 diberikan.
- Masukkan daftar organisasi, choir, asrama, dan kegiatan asrama.
- Buat kalender, pencarian, filter, dan detail event.

### Tahap 4 — Pengajuan dan Validasi
- Buat Event Request khusus organisasi.
- Buat tampilan read-only Event Request untuk dosen/staf.
- Buat Approval Queue khusus Admin.
- Pastikan event baru tampil setelah disetujui.

### Tahap 5 — AI Assistant
- Integrasikan Gemini `gemini-3.5-flash`.
- Hubungkan pertanyaan dengan data JSON Server.
- Tampilkan hasil dalam jawaban dan kartu event.
- Uji pertanyaan yang memiliki hasil dan yang tidak memiliki hasil.

### Tahap 6 — Penyempurnaan
- Implementasikan Saved Events dan My Schedule jika alur utama sudah stabil.
- Tambahkan deteksi benturan waktu.
- Periksa responsivitas, animasi, validasi, dan seluruh acceptance criteria.

---

## 15. Panduan Khusus untuk AI Coding Agent

Bagian ini harus disertakan ketika PRD digunakan sebagai prompt utama pengembangan website.

1. Baca seluruh PRD sebelum mulai membuat kode.
2. Gunakan React sebagai teknologi frontend utama dan JSON Server untuk data prototipe.
3. Jangan menambah role selain Mahasiswa, Dosen/Staff, Organisasi, dan Admin.
4. Admin sekaligus menjadi pengelola kalender akademik; jangan membuat role kalender akademik terpisah.
5. Dosen/Staff tidak boleh mengajukan, mengirim, atau mengedit event.
6. Menu Event Request dapat terlihat untuk Organisasi, Dosen/Staff, dan Admin. Untuk Dosen/Staff tampilkan mode read-only tanpa tombol submit.
7. Hanya Organisasi yang dapat mengirim pengajuan event. Semua pengajuan wajib divalidasi Admin.
8. Login harus memvalidasi email dengan domain `@unklab.ac.id` dan mencocokkan role dengan data akun.
9. Setelah login pertama, tampilkan onboarding minat, hobi, jenis kegiatan yang disukai, dan waktu luang. Simpan preferensi agar dashboard dapat dipersonalisasi.
10. Rekomendasi dashboard harus memiliki alasan yang dapat dipahami pengguna dan berasal dari preferensi profil serta data event.
11. Gunakan daftar organisasi, choir, asrama, dan kegiatan asrama yang tercantum pada bagian 5. Jangan menambah organisasi fiktif.
12. Kalender Akademik 2026 akan diberikan sebagai dokumen terpisah. Jangan mengarang tanggal atau agenda sebelum dokumen itu tersedia.
13. Gunakan Google Gemini API dengan model ID `gemini-3.5-flash` pada Free Tier sesuai ketersediaan kuota.
14. AI hanya menjawab berdasarkan data event dari JSON Server. Jangan mengarang detail kegiatan.
15. Simpan API key Gemini di sisi server/proxy, bukan di source code frontend.
16. Gunakan warna putih dominan dan ungu sebagai warna utama, dengan aksen identitas UNKLAB seperlunya.
17. Ikuti aturan UI, typography, spacing, responsive layout, dan animasi dalam PRD.
18. Jangan membuat tampilan generik yang penuh gradient, glow, glassmorphism, atau card dekoratif.
19. Semua tombol dan kontrol harus berfungsi. Jika suatu aksi belum tersedia, jangan tampilkan seolah-olah sudah berfungsi.
20. Kerjakan bertahap. Sebelum setiap tahap coding, tuliskan rencana file/komponen yang akan dibuat atau diubah. Jangan mengubah bagian aplikasi yang tidak terkait tanpa alasan.
21. Setelah menyelesaikan tahap, laporkan fitur yang selesai, file yang diubah, cara pengujian, serta keterbatasan yang masih ada.

---

## 16. Definisi Selesai (Definition of Done)

Proyek dinyatakan siap dipresentasikan apabila:

- [ ] Semua empat role dapat login menggunakan akun kampus demo.
- [ ] Validasi email `@unklab.ac.id` berjalan.
- [ ] Onboarding personalisasi muncul pada login pertama.
- [ ] Dashboard menampilkan rekomendasi berdasarkan preferensi pengguna.
- [ ] Kalender akademik dan event kampus dapat dilihat dalam satu platform.
- [ ] Tampilan kalender Bulanan dan Daftar/Agenda setidaknya berjalan stabil; tampilan Mingguan dan Harian diselesaikan sesuai kapasitas pengerjaan.
- [ ] Search, filter kategori/penyelenggara/target peserta, dan indikator event berlangsung bekerja.
- [ ] Data kalender akademik 2026 dimasukkan sesuai dokumen sumber yang diberikan tim.
- [ ] Daftar choir, kegiatan asrama, dan organisasi sudah tersedia sebagai data kategori/penyelenggara.
- [ ] Organisasi dapat mengirim pengajuan event.
- [ ] Dosen/Staff tidak dapat mengajukan event.
- [ ] Admin dapat memvalidasi semua pengajuan dan mengelola kalender akademik.
- [ ] Event yang belum disetujui tidak tampil sebagai event publik.
- [ ] AI Gemini dapat menjawab pertanyaan berdasarkan data sistem.
- [ ] Tampilan responsif dan interaksi utama memiliki feedback.
- [ ] Tidak ada error yang menghalangi alur demo utama.

---

## 17. Referensi dan Catatan Sumber

### Sumber internal proyek

- Dokumen konsep tim: **“Unklab Information Hub (One Platform, Every Campus Activity)”**.
- PRD pembanding yang diberikan anggota tim: **“PRD – UNKLAB Information Hub”** (versi 1.0, 10 November 2026). Bagian yang relevan diadaptasi hanya jika sesuai dengan keputusan dan ruang lingkup UNKLAB HUB.
- Revisi kebutuhan dan keputusan tim yang disampaikan pada 10 November 2026.

### Catatan revisi versi 1.3

- Menambahkan success metrics untuk evaluasi prototipe.
- Memperjelas prioritas fitur P0/P1 dan Out of Scope.
- Melengkapi spesifikasi kalender dengan tampilan bulanan/mingguan/harian/agenda, pencarian, filter, live indicator, dan badge sumber.
- Memperjelas validasi form pengajuan serta aturan rekomendasi personal.
- Menambahkan endpoint JSON Server yang disarankan, stack teknis lebih spesifik, dan tabel risiko/mitigasi.
- Memperluas acceptance criteria tanpa menambah role atau fitur yang sudah dikeluarkan dari ruang lingkup.

### Referensi teknologi AI

- Google Gemini API — Models: <https://ai.google.dev/gemini-api/docs/models>
- Google Gemini API — Pricing: <https://ai.google.dev/gemini-api/docs/pricing>

Nama model yang ditetapkan untuk proyek ini adalah `gemini-3.5-flash`. Penggunaan Free Tier mengikuti batas kuota dan ketentuan Google yang berlaku saat implementasi.

---

**Akhir dokumen — UNKLAB HUB PRD v1.3**
