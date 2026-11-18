# UNKLAB HUB — Capability Map Final

Status: revised after user review; no implementation changes are authorized by this map alone.  
Date: 19 November 2026.

## Boundary decisions

- Master Development Prompt terbaru menjadi pembaruan terhadap PRD jika keduanya bertentangan.
- Mahasiswa tetap dapat mengajukan event sesuai kategori yang diizinkan.
- Dosen/Staff dapat mengajukan event dengan kategori terbatas.
- Tidak membuat sistem Firebase Authentication baru, real SSO, atau provider auth baru. Integrasi Firebase yang sudah ada hanya dipertahankan dan diperjelas batasnya.
- Gambar referensi desain tidak dipakai sebagai foto login.
- Foto login khusus adalah file `.webp` yang diberikan user dan hanya akan digunakan setelah disalin ke asset project.
- `db.json` dipertahankan. Perubahan data harus incremental; tidak boleh mengganti atau menghapus seed lama.
- Playwright tetap target QA. Dependency/config hanya ditambahkan setelah availability dan install constraint dilaporkan.

## Modules, acceptance criteria, files, and verification

| Module ID | Tanggung jawab | Depends on | Acceptance criteria | Likely files | Verification |
|---|---|---|---|---|---|
| `master-data` | Fakultas, program studi, organisasi, choir, asrama, kategori, target peserta, struktur data yang bisa diperbarui | — | Semua pilihan form berasal dari satu sumber master; target bertingkat dapat memuat fakultas/prodi/organisasi/choir/asrama; data yang belum terkonfirmasi diberi status jelas; data lama tetap ada | `db.json` (incremental only), `UNKLAB-MASTER-DATA.json`, `UNKLAB-MASTER-DATA-README.md`, `src/main.jsx`, kemungkinan `src/masterData.js` | Unit test normalisasi/validasi master dan snapshot shape; build |
| `identity-profile` | Login demo, Firebase boundary, session, onboarding, profile, role matrix | `master-data` | Tiga akun demo tetap bekerja; nama awal Ungke/Enrico/Admin UNKLAB; role berasal dari record akun; onboarding muncul hanya saat belum lengkap; Firebase tidak menambah auth/SSO baru | `src/main.jsx`, `src/firebase.js`, `firestore.rules`, `db.json` (users only, incremental), `README.md` | Unit test role permission; manual login tiga akun; build |
| `event-request` | Pengajuan Mahasiswa/Dosen, kategori khusus, organizer/choir/asrama, jabatan/peran, target peserta, status | `identity-profile`, `master-data` | Mahasiswa hanya melihat field relevan kategori; Dosen hanya dapat memilih kategori terbatas; agenda akademik resmi tidak dapat dibuat dari form; validasi required berjalan; request awal `pending` | `src/main.jsx`, `src/recommendations.js` jika relevan, `db.json` fixtures incremental, `tests/role-permissions.test.js`, `tests/event-request-validation.test.js` | Unit tests role/category; manual form matrix; build |
| `calendar-schedule` | Calendar, event detail, saved events, My Schedule, conflict detection | `identity-profile`, `master-data` | Hanya event approved/published tampil publik; overlap memakai `startA < endB && startB < endA`; boundary-touch tidak conflict; kedua jadwal conflict tetap terlihat dan dapat dibuka; karakter dekoratif anomali dihapus | `src/main.jsx`, `src/styles.css`, `tests/schedule-conflict.test.js` | Unit tests conflict; manual calendar/schedule; responsive check |
| `admin-workspace` | Dashboard Admin, request metrics, approval/rejection, event management, category/master/calendar management | `identity-profile`, `event-request`, `calendar-schedule`, `master-data` | Dashboard Admin berbeda dari student; metrics dihitung dari database; reject wajib alasan; publish hanya setelah approval; delete/cancel memakai konfirmasi; Admin tidak diberi duplicate personal schedule/recommendation | `src/main.jsx`, `src/styles.css`, `server.mjs`/API boundary jika diperlukan, `firestore.rules`, tests admin permission | Unit/integration permission tests; manual admin CRUD; build |
| `ai-integration` | Gemini proxy, role-aware context, fallback, output validation | `identity-profile`, `master-data`, event data | API key tetap server-only; konteks disaring sesuai role dan event approved; AI tidak dapat approve; fallback lokal tetap informatif; output event IDs divalidasi | `src/ai.js`, `server.mjs`, `tests/ai-contract.test.js` | API contract tests with mocked response; manual API failure fallback |
| `visual-foundation` | Fondasi layout: top navigation, profile placement, login photo composition, tokens, responsive shell | `identity-profile` | Top nav/profile hierarchy konsisten; foto login berbeda dari referensi desain; palet UNKLAB tetap; layout tidak horizontal overflow pada 360/768/1440 | `public/<login-photo>.webp`, `src/main.jsx`, `src/styles.css`, `index.html` | Build; manual visual checks at target viewports |
| `visual-polish` | Penyempurnaan seluruh halaman, spacing, hierarchy, micro-interaction, accessibility, anomaly cleanup | semua fitur utama stabil | Dashboard/calendar/profile/request terasa satu produk; icon/label konsisten; focus/aria/alt text memadai; tidak ada simbol anomali; feedback loading/error/pressed tersedia | `src/main.jsx`, `src/styles.css`, asset files only if needed | Browser/manual QA, accessibility pass, responsive pass |
| `qa-documentation` | Unit/integration/Playwright, test scripts, AGENTS.md, README | semua module | Test file/script diverifikasi sebelum command; Playwright disiapkan jika environment mengizinkan; hasil pass/fail dilaporkan apa adanya; docs sesuai package scripts | `package.json`, `package-lock.json`, `playwright.config.*`, `tests/`, `e2e/`, `AGENTS.md`, `README.md` | `npm run build`, available unit tests, Playwright report, manual checklist |

## Build order

`master-data` → `identity-profile` → `event-request` → `calendar-schedule` → `admin-workspace` → `ai-integration` → `visual-foundation` → `visual-polish` → `qa-documentation`

Catatan: `visual-foundation` boleh dimulai setelah fondasi `identity-profile` stabil; `visual-polish` menunggu fitur utama stabil. QA berjalan sebagai gate kecil di setiap modul, bukan hanya di akhir.

## First Implementation Slice — pekerjaan kecil dan independen

### Slice 0 — QA/tooling inventory

- Acceptance: file test dan script yang akan dijalankan terdeteksi; status Playwright tercatat; tidak ada dependency yang dipasang diam-diam.
- Files: `package.json`, `package-lock.json`, `tests/` (read-only initially).
- Verification: availability checks; belum menjalankan command test yang file/script-nya belum terverifikasi.
- Current result: hanya `tests/recommendations.test.js` dan `node --test` yang tersedia; Playwright package/config belum tersedia.

### Slice 1 — Master-data contract

- Acceptance: daftar organisasi, choir, asrama, kategori, program studi, dan target peserta memiliki shape yang terdokumentasi; tidak ada data lama yang dihapus.
- Files: `UNKLAB-MASTER-DATA-README.md`, kemungkinan `src/masterData.js`; `db.json` hanya jika perlu penambahan incremental.
- Verification: unit test validasi master-data dan `npm run build` setelah script diverifikasi.

### Slice 2 — Role permission tests

- Acceptance: matrix Mahasiswa/Dosen/Admin untuk login, request, approval, calendar, saved events, dan schedule terdokumentasi sebagai assertions.
- Files: `tests/role-permissions.test.js`.
- Verification: `node --test tests/role-permissions.test.js` setelah file dibuat.

### Slice 3 — Event request validation tests

- Acceptance: aturan kategori Mahasiswa/Dosen, required organizer/choir/asrama, role field, target peserta, dan larangan academic calendar diuji tanpa UI.
- Files: `tests/event-request-validation.test.js`, kemungkinan `src/eventRequestRules.js`.
- Verification: `node --test tests/event-request-validation.test.js` setelah file/script diverifikasi.

### Slice 4 — Login asset only

- Acceptance: foto khusus login disalin ke `public/`, diberi nama aman, memiliki `alt`, dan tidak memakai tiga screenshot referensi sebagai asset login.
- Files: `public/<login-photo>.webp`, `src/main.jsx`, `src/styles.css`.
- Verification: asset existence check, build, visual/manual login check.

### Slice 5 — Login/profile copy alignment

- Acceptance: label akun demo dan nama awal mengikuti prompt terbaru; tidak mengubah mekanisme Firebase atau menambah SSO.
- Files: `src/main.jsx`, tests terkait identity.
- Verification: unit/manual demo login checks, build.

Setiap slice harus selesai dan diverifikasi sebelum slice berikutnya dimulai.

## Design reference analysis

### Reference 1 — dashboard composition

- Diadopsi: composition asimetris yang punya satu focal area, whitespace besar, grouping informasi berdasarkan prioritas, dan panel aksen untuk informasi penting.
- Adaptasi UNKLAB HUB: dashboard memakai hero/summary utama, rekomendasi event sebagai konten utama, dan panel kalender/AI sebagai secondary rail. Warna tetap ungu/gold/neutral UNKLAB; tidak menyalin ilustrasi atau bentuk kartu mentah.

### Reference 2 — photo-led visual

- Diadopsi: satu foto landscape sebagai visual utama dengan overlay teks/form yang punya kontras kuat dan ruang bernapas.
- Adaptasi UNKLAB HUB: hanya foto khusus dari user yang digunakan di halaman login; tiga screenshot referensi tidak akan disalin menjadi background atau asset login. Overlay akan menjaga form tetap terbaca dan tidak mengorbankan aksesibilitas.

### Reference 3 — top navigation and information hierarchy

- Diadopsi: top navigation ringan, profil/avatar mudah ditemukan, konten utama dimulai dari heading yang jelas, dan panel detail diberi penekanan visual.
- Adaptasi UNKLAB HUB: navigasi utama akan diarahkan ke top navigation secara bertahap tanpa menghapus akses mobile; profil, role, dan aksi account ditempatkan dekat area atas; kalender memakai hierarki tanggal → agenda → detail.

## Explicit non-goals for the first slice

- Tidak melakukan rewrite seluruh `main.jsx`.
- Tidak mengganti React/Vite/JSON Server/Firebase.
- Tidak menambah Firebase Authentication/SSO baru.
- Tidak menimpa `db.json`.
- Tidak memasang Playwright sebelum hasil availability/install constraint dilaporkan.
