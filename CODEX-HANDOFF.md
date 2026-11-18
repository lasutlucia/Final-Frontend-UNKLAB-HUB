# UNKLAB HUB — Audit & Handoff

Tanggal audit: 19 November 2026  
Scope: audit read-only terhadap implementasi saat ini dibandingkan dengan `PRD-UNKLAB-HUB.md` yang diberikan user.

## Ringkasan eksekutif

Project berhasil ditransformasi dan dibuild dengan Vite. Test yang tersedia juga lulus, tetapi cakupannya baru untuk fungsi rekomendasi; belum ada test browser, test role/permission, test API, atau test responsive.

Implementasi saat ini adalah prototipe React monolitik dengan mode demo JSON Server sebagai default dan opsi Firebase/Gemini. Alur dasar login demo, dashboard, kalender, eksplorasi event, detail event, bookmark, My Schedule, onboarding/profile, AI fallback, event request, serta approval admin sudah tersedia secara UI. Namun ada gap P0 terhadap PRD: role Organisasi belum tersedia di login maupun permission frontend, pengajuan event masih diberikan kepada Mahasiswa, dan Admin belum memiliki UI pengelolaan kalender akademik/kategori.

Tidak ada perubahan terhadap `db.json`, `.env`, teknologi utama, atau arsitektur besar selama audit. Perubahan yang sudah ada sebelum audit pada `db.json` dibiarkan apa adanya.

## Kondisi project saat ini

- Stack: React 19, Vite 8, lucide-react, JSON Server, Firebase Auth/Firestore opsional, Node HTTP server untuk Gemini dan SMTP.
- Struktur UI utama berada di `src/main.jsx`; styling berada di `src/styles.css`. Belum ada React Router, Context auth, atau pemisahan komponen per halaman.
- Script tersedia: `dev`, `build`, `preview`, `server`, `api`, serta `start`/`dev:all` untuk menjalankan tiga service.
- `npm run build`: berhasil.
- `node --test tests/recommendations.test.js`: 6 test berhasil.
- Playwright/Cypress/Jest/Vitest tidak terpasang atau tidak ditemukan di project.
- `db.json`: 3 user demo (Mahasiswa, Dosen, Admin), 48 event, 9 kategori, 13 organisasi, 6 choir, 8 asrama, 5 aktivitas asrama, 3 jadwal ibadah, dan 4 event kalender akademik.
- `UNKLAB-MASTER-DATA.json`: 41 event dan tidak memiliki user demo.
- Semua 48 event pada `db.json` berstatus `approved`; 3 event submission sudah berada di seed sehingga belum ada fixture `pending`/`rejected` untuk menguji antrean approval secara realistis.
- File `.env` tidak ditrack oleh Git sesuai `.gitignore`. Nilai rahasia tidak disalin ke laporan.

## Fitur yang sudah tersedia

- Halaman login demo dengan akun Mahasiswa, Dosen, dan Admin.
- Fallback mode lokal jika Firebase tidak dikonfigurasi.
- Onboarding profil: nama, minat, hobi, tipe kegiatan, dan waktu luang.
- Dashboard dengan rekomendasi, agenda terdekat, mini calendar, dan Campus AI entry point.
- Kalender mode agenda/bulan, filter kategori, dan detail event.
- Explore dengan pencarian teks dan filter kategori.
- Modal detail event dengan aksi simpan dan tambah ke jadwal.
- Bookmark dan My Schedule dengan conflict warning sederhana.
- Event Request dan approval/rejection Admin pada level UI.
- Dosen melihat daftar request secara read-only.
- Gemini proxy server dengan fallback pencarian lokal di frontend.
- Endpoint health dan SMTP notification endpoint di `server.mjs`.
- Responsive CSS dan state loading/empty/error/toast sudah disiapkan.

## Bug dan risiko berdasarkan prioritas

### Critical

1. **Role Organisasi tidak dapat digunakan** — PRD mensyaratkan empat role, tetapi `main.jsx` hanya menerima `mahasiswa`, `dosen`, dan `admin`. `roleNames` juga tidak memiliki Organisasi. Jalur Firebase untuk `organisasi` ada sebagian di `src/firebase.js`, tetapi tidak pernah bisa mencapai UI.
2. **Hak submit event salah role** — `submitEvent` hanya mengizinkan `user.role === 'mahasiswa'`, sedangkan PRD menetapkan hanya Organisasi yang mengajukan event. UI Event Request juga menampilkan tombol Ajukan untuk Mahasiswa.
3. **JSON Server tidak memiliki authorization** — endpoint lokal dapat dipanggil langsung untuk membaca, menambah, mengubah, atau menghapus data tanpa validasi role/ownership. Validasi saat ini berada di React sehingga tidak cukup untuk deployment atau akses jaringan.

### High

1. **Admin calendar management belum ada** — PRD meminta Admin memasukkan/memperbarui kalender akademik, tetapi Calendar hanya tampilan baca dan tidak ada halaman/form pengelolaan.
2. **Admin category/event management belum ada** — PRD meminta pengelolaan seluruh event dan kategori, tetapi UI yang ada hanya approval event request.
3. **Routing belum memakai route guard/deep link** — `page` hanya state string di `App`; tidak ada React Router, URL route, atau guard terpusat. Refresh tidak mempertahankan halaman aktif dan akses berbasis role tidak diuji di level route.
4. **Firebase fallback dapat memberi role default Mahasiswa** — jika profil Firestore gagal dibaca/ditulis, `loginWithFirebase` membuat fallback `role: 'mahasiswa'`. Ini mengaburkan kegagalan permission/profile dan dapat memberi akses yang tidak semestinya menurut sumber role sebenarnya.
5. **Fixture approval tidak lengkap** — seluruh event seed di `db.json` berstatus approved; skenario pending/rejected/cancelled dan ownership organisasi belum cukup untuk pengujian.
6. **Conflict check hanya memberi peringatan setelah item tetap ditambahkan** — bentrok tidak dicegah dan ringkasan konflik menghitung pasangan konflik dua arah, sehingga jumlah dapat terlihat dua kali.

### Medium

1. **Data master belum dipakai penuh** — organisasi, choir, asrama, aktivitas asrama, dan jadwal ibadah tersedia di JSON, tetapi UI utama belum menyediakan filter/form/konten khusus untuk seluruh master tersebut.
2. **Search/filter belum selengkap PRD** — implementasi utama memfilter teks judul, penyelenggara, lokasi, deskripsi, dan kategori; belum ada filter eksplisit tanggal, target peserta, atau organisasi sebagai kontrol terpisah.
3. **AI proxy belum benar-benar multi-model fallback** — kode hanya memakai satu `defaultModel`; jika model gagal, frontend fallback ke pencarian lokal. Respons model juga hanya divalidasi secara longgar dan dapat terpotong saat `MAX_TOKENS`.
4. **Pengujian UI belum tersedia** — belum ada automated test untuk login tiap role, onboarding, approval, event detail, bookmark, schedule conflict, AI fallback, mobile viewport, dan permission.
5. **Aksesibilitas perlu audit lanjutan** — beberapa gambar tidak memiliki `alt`, beberapa tombol ikon bergantung pada `title`/tanpa label ARIA, dan komponen berada dalam satu file besar sehingga state/focus behavior sulit diuji.
6. **Bundle frontend besar** — build memberi warning chunk utama sekitar 937 kB sebelum gzip. Ini bukan blocker prototipe, tetapi perlu code splitting sebelum deployment publik.

### Low

1. `main.jsx` mengandung banyak komponen inline dan beberapa import yang tampak tidak dipakai, sehingga maintainability dan linting belum baik.
2. `start.mjs` menjalankan tiga proses development sekaligus, tetapi belum menyediakan health check/diagnostic output terpadu ketika salah satu service gagal.
3. Tanggal pada beberapa dekorasi/teks landing masih hard-coded untuk November 2026, bukan berasal dari data event.
4. `server.mjs` mengirim header CORS `*` dan endpoint health mengembalikan metadata SMTP user; aman untuk demo lokal terbatas, tetapi perlu dibatasi untuk lingkungan nyata.

## Keamanan dan integrasi API

- Positif: Gemini API key tidak diimport ke bundle React; pemanggilan dilakukan melalui `server.mjs`.
- Positif: `.env` di-ignore Git dan `.env.example` hanya berisi placeholder.
- Risiko: JSON Server tidak aman sebagai backend produksi karena tidak punya autentikasi/otorisasi.
- Risiko: endpoint SMTP membentuk HTML email langsung dari input event/recipient tanpa escaping HTML; data event yang mengandung markup dapat mengubah isi email.
- Risiko: CORS wildcard pada Gemini/SMTP server membuka akses lintas origin selama service dapat dijangkau.
- Risiko: fallback Firebase ke role Mahasiswa perlu diubah menjadi error terkontrol sampai profil role tervalidasi.
- Risiko operasional: kredensial SMTP/API harus diputar jika pernah terlanjur dibagikan di luar `.env`; jangan masukkan nilainya ke commit, screenshot, atau laporan.

## Ketidaksesuaian dengan PRD

- PRD mendefinisikan Mahasiswa, Dosen/Staff, Organisasi, dan Admin; implementasi hanya menyediakan tiga role demo.
- PRD menetapkan Organisasi sebagai pengaju event; implementasi menetapkan Mahasiswa sebagai pengaju.
- PRD menyebut React Router dan route guard; implementasi memakai state navigation lokal.
- PRD merekomendasikan Tailwind; implementasi memakai CSS manual di `src/styles.css`. Ini bukan bug fungsional, tetapi perlu dianggap sebagai keputusan implementasi yang berbeda.
- PRD meminta Admin mengelola kalender akademik, event, kategori, dan data referensi; implementasi baru mencakup approval event pada UI.
- PRD meminta pengujian kepatuhan hak akses 100% dan Lighthouse; belum ada bukti test tersebut di repository.
- PRD menargetkan pencarian berdasarkan judul, kategori, penyelenggara, lokasi, tanggal, dan target peserta; implementasi belum memberikan seluruh filter tersebut.

## Fitur yang perlu dikembangkan

Prioritas P0:

1. Tetapkan model role final dan implementasikan role Organisasi end-to-end.
2. Pisahkan permission submit/monitor event sesuai PRD.
3. Tambahkan route/permission guard terpusat.
4. Tambahkan admin management untuk kalender akademik, kategori, dan event.
5. Tambahkan fixture data `pending`, `rejected`, dan organisasi untuk pengujian.
6. Tambahkan validasi otorisasi di API demo atau batasi JSON Server secara eksplisit sebagai mock-only.

Prioritas P1:

1. Lengkapi filter tanggal, target peserta, organisasi, dan kategori.
2. Perbaiki conflict check agar memberi status yang jelas dan tidak menghitung ganda.
3. Validasi output AI, batasi konteks/riwayat, dan sediakan error state yang konsisten.
4. Tambahkan test browser/role matrix/responsive.
5. Perbaiki accessibility dan pecah komponen besar secara bertahap.

Prioritas P2:

1. Code splitting dan pengurangan bundle.
2. Health check terpadu untuk dev services.
3. Sanitasi HTML email dan pembatasan CORS/health metadata.
4. Penyelarasan dekorasi hard-coded dengan data atau tanggal dinamis.

## Rencana pengerjaan bertahap

### Tahap 0 — Baseline dan keputusan role

- Bekukan kontrak role dari PRD.
- Jangan mengubah `db.json` tanpa fixture/migration yang jelas.
- Tambahkan matriks test permission dan definisi acceptance criteria.

### Tahap 1 — Role dan permission

- Tambahkan role Organisasi ke model, login demo/Firebase, label, nav, dan guard.
- Pindahkan Event Request submit dari Mahasiswa ke Organisasi.
- Tetapkan akses Dosen read-only dan Admin approval/manage.
- Tambahkan test matrix untuk empat role.

### Tahap 2 — Data dan admin workflow

- Tambahkan fixture pending/rejected dan organisasi.
- Implementasikan CRUD kalender akademik/kategori/event untuk Admin.
- Pastikan publik hanya menerima event approved.

### Tahap 3 — Quality dan UX

- Tambahkan test browser untuk alur utama dan viewport 360/768/1440.
- Perbaiki conflict check, filter, feedback loading/error, dan accessibility.

### Tahap 4 — Security/integration hardening

- Validasi ownership/role di API atau dokumentasikan mock-only secara tegas.
- Sanitasi email HTML, batasi CORS, dan hilangkan metadata sensitif dari health endpoint.
- Verifikasi Gemini model aktif dan output contract.

## File yang kemungkinan perlu diperbaiki

- `src/main.jsx` — auth state, role gate, navigation, request workflow, dashboard wiring.
- `src/firebase.js` — role/profile validation dan permission fallback.
- `server.mjs` — API authorization boundary, CORS, SMTP escaping, AI response validation.
- `firestore.rules` — review ulang matrix role dan operasi event/profile.
- `db.json` — hanya setelah skema fixture disepakati; jangan overwrite seed yang ada.
- `UNKLAB-MASTER-DATA.json` — sinkronisasi data master/event jika memang menjadi source of truth.
- `src/styles.css` — accessibility/responsive refinements setelah behavior stabil.
- `tests/` — tambah role, integration, API, and browser tests.
- `package.json` / `package-lock.json` — hanya jika menambahkan test runner/browser tooling yang disepakati.

## Catatan kerja sesi berikutnya

1. Mulai dari keputusan role Organisasi vs Mahasiswa, karena ini memengaruhi auth, nav, request, seed, dan rules.
2. Jangan melakukan rewrite atau memecah semua komponen sekaligus.
3. Sebelum perubahan data, review diff `db.json` yang sudah dirty: perubahan lokal saat audit menunjukkan bookmark demo dikosongkan dan preferensi user mahasiswa berubah.
4. Jalankan kembali `npm run build` dan `node --test tests/recommendations.test.js` setelah setiap tahap.
5. Jangan menampilkan atau commit isi `.env`.
