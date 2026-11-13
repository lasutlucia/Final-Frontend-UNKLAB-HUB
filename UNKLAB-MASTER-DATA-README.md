# UNKLAB HUB — Master Data & Dummy Event Schedule

**Versi:** 1.1  
**Tanggal pembaruan:** 10 November 2026  
**Format data:** JSON Server (`db.json` compatible)  
**Zona waktu:** Asia/Makassar (WITA)

## Tujuan

File `db.json` dan `UNKLAB-MASTER-DATA.json` menyediakan data referensi untuk mengembangkan dan mendemonstrasikan UNKLAB HUB. Nama organisasi, choir, dan asrama mengikuti daftar yang diberikan tim. Jadwal organisasi dan choir yang sudah ada dipertahankan. Bagian kegiatan asrama diperbarui sesuai pola hari yang diberikan, dan ditambahkan jadwal ibadah rutin Midweek, Vesper, serta Sabbath.

**Penting:** nama organisasi, choir, dan asrama adalah data referensi dari tim. Tanggal, jam, dan lokasi event seed tetap merupakan data simulasi, bukan jadwal resmi.

## Resource JSON Server

| Resource | Isi |
|---|---|
| `categories` | Kalender akademik, organisasi, choir, asrama, kegiatan kerohanian, fakultas, seminar, kegiatan kampus, dan pengumuman |
| `organizations` | 13 organisasi/komunitas, termasuk pola meeting Kamis yang sudah ada |
| `choirs` | 6 choir dan jenis event umum |
| `dormitories` | 8 nama asrama resmi sesuai daftar tim |
| `dormitoryActivities` | 5 jenis kegiatan asrama dengan pola hari yang diperbarui |
| `worshipSchedules` | 3 jadwal rutin ibadah: Midweek, Vesper, dan Sabbath |
| `audienceGroups` | Label sasaran peserta: penghuni asrama, outsider dekat, outsider jauh, dan mahasiswa |
| `events` | Event dummy organisasi, choir, kegiatan asrama, dan ibadah |
| `users` | Array kosong untuk akun demo |
| `bookmarks` | Array kosong untuk bookmark |
| `mySchedule` | Array kosong untuk agenda pribadi |

## Jadwal yang dipertahankan

### Organisasi

- Nama dan jadwal dummy organisasi yang sudah ada dipertahankan.
- Mayoritas organisasi memiliki contoh pola meeting hari Kamis, sesuai data yang sudah ada.
- **UVICS (Unklab Virtue in Computer Science)** ditambahkan ke daftar organisasi. Karena tim belum memberikan hari dan jam meeting UVICS secara spesifik, tidak dibuatkan jadwal meeting dummy baru untuk UVICS.
- GENBI ditampilkan sebagai **GENBI (Generasi Baru Indonesia)**. Jadwal dummy yang sebelumnya sudah ada tetap dipertahankan.

### Choir

Daftar choir tetap sama dan seluruh contoh jadwal event choir yang sudah ada tidak diubah:

1. TUC (The Unklab Choir)
2. TUFC (The Unklab FEB Choir)
3. VOCS choir unklab
4. The Unklab Echo Choir (TUEC)
5. The Unklab Nursing Choir
6. TOT (teachers of tomorrow)

Jenis kegiatan contoh choir: anniversary, homecoming, pelayanan di dalam UNKLAB, dan pelayanan di luar UNKLAB. Tidak semua choir diasumsikan memiliki seluruh jenis kegiatan tersebut.

## Daftar asrama

Daftar nama asrama yang diberikan tim:

1. JASMINE 1
2. JASMINE 2
3. GUEST HOUSE
4. GENZET
5. ANNEX
6. BOUGENVILE
7. CRYSTAL
8. EDELWEIS

Penulisan nama dipertahankan sesuai daftar tim; jangan mengoreksi ejaan secara otomatis.

## Pola kegiatan asrama

| Kegiatan | Pola hari | Catatan |
|---|---|---|
| OPEN HOUSE | Sabbath / Sabtu | Pola hari kegiatan; tidak otomatis berarti setiap Sabtu |
| OLAHRAGA BERSAMA ANTAR ASRAMA | Minggu | Tanggal dan frekuensi setiap pelaksanaan perlu dikonfirmasi |
| MIX FORMAL | Kamis | Tanggal dan frekuensi setiap pelaksanaan perlu dikonfirmasi |
| IBADAH WORSHIP BERSAMA DENGAN ASRAMA LAIN | Kamis | Kegiatan khusus ini berbeda dari ibadah rutin Midweek, Vesper, dan Sabbath |
| WAKTU UNTUK STUDY DI (ASRAMA/DINING) | Setiap Senin dan Selasa | Pola rutin mingguan sesuai informasi tim |

## Jadwal ibadah rutin

| Ibadah | Hari | Sasaran peserta | Aturan |
|---|---|---|---|
| IBADAH MIDWEEK | Setiap Rabu | Semua penghuni asrama dan outsider dekat | Jadwal rutin mingguan |
| IBADAH VESPER | Setiap Jumat | Semua penghuni asrama dan outsider dekat | Jadwal rutin mingguan |
| IBADAH SABBATH | Setiap Sabbath / Sabtu | Semua penghuni asrama, outsider dekat, dan outsider jauh | Tidak dijadwalkan pada long weekend; harus mengikuti Kalender Akademik UNKLAB 2026 |

### Aturan long weekend untuk ibadah Sabbath

- Jadwal Sabbath harus diperiksa terhadap dokumen Kalender Akademik UNKLAB 2026.
- Jika tanggal Sabbath termasuk periode long weekend sesuai kalender akademik, occurrence ibadah Sabbath **tidak boleh dibuat/ditampilkan sebagai jadwal berlangsung**.
- Jika Kalender Akademik 2026 belum tersedia, status pemeriksaan long weekend adalah `pending_academic_calendar_2026`.
- Event Sabbath seed yang sudah ada hanya contoh untuk demo dan belum menyatakan bahwa tanggal tersebut bebas dari long weekend.
- Jangan meminta AI menebak atau menyimpulkan long weekend tanpa sumber kalender akademik.

## Aturan data dummy

1. Seluruh event seed memakai `isDummy: true` dan `sourceType: "demo_seed"`.
2. `status: "approved"` hanya supaya event seed tampil di demo lokal. Ini bukan bukti persetujuan atau jadwal resmi.
3. Jam dan lokasi event organisasi, choir, kegiatan asrama, serta ibadah yang tidak diberikan tim adalah placeholder simulasi.
4. Event organisasi dan choir yang sudah ada tidak diubah pada pembaruan ini.
5. Event kegiatan asrama diperbarui agar contoh tanggal sesuai pola hari yang diberikan.
6. Jadwal ibadah rutin ditambahkan sebagai definisi pola dan beberapa occurrence dummy.
7. Tidak ada agenda Kalender Akademik 2026 di data ini. Agenda akademik hanya boleh dimasukkan dari dokumen resmi yang diberikan tim.
8. Semua data dummy harus ditampilkan dengan label visual **Data Simulasi**.

## Cara menggunakan dengan JSON Server

1. Letakkan `db.json` pada root proyek.
2. Jalankan JSON Server sesuai versi package yang digunakan, misalnya:

   ```bash
   npx json-server --watch db.json --port 3001
   ```

3. Endpoint utama:
   - `http://localhost:3001/events`
   - `http://localhost:3001/organizations`
   - `http://localhost:3001/choirs`
   - `http://localhost:3001/dormitories`
   - `http://localhost:3001/dormitoryActivities`
   - `http://localhost:3001/worshipSchedules`
   - `http://localhost:3001/categories`
   - `http://localhost:3001/audienceGroups`

4. Frontend menampilkan event seed yang `status: "approved"`, tetapi wajib memberi penanda **Data Simulasi**.
5. Pertahankan `isDummy` dan `sourceType` selama pengembangan.

## Petunjuk khusus untuk AI Coding Agent

- Gunakan `PRD-UNKLAB-HUB.md` sebagai sumber requirement utama dan file ini sebagai panduan data.
- Pertahankan jadwal event organisasi dan choir yang sudah ada; jangan menggeser atau membuat ulang tanggal/jamnya.
- Gunakan jadwal kegiatan asrama sesuai tabel pola hari di atas.
- Perlakukan `dormitories` sebagai daftar nama referensi asrama.
- Tampilkan tiga jenis ibadah rutin sebagai event/agenda yang berbeda dari kegiatan asrama khusus.
- Untuk ibadah Sabbath, lakukan pengecekan long weekend berdasarkan `academic-calendar-2026`. Jika kalender belum tersedia, tandai status sebagai belum diverifikasi dan jangan klaim tanggal Sabbath seed pasti berlangsung.
- Jangan mengasumsikan semua kegiatan selain Study Time berlangsung setiap minggu.
- Jangan membuat jadwal rutin UVICS tanpa data dari tim.
- Jangan menambah organisasi, choir, atau asrama baru tanpa persetujuan tim.
- Jangan menambah tanggal kalender akademik dari asumsi atau generasi AI.
- Pastikan semua event simulasi memiliki label **Data Simulasi**.

## Validasi data

- Semua ID resource harus unik.
- Format tanggal event: `YYYY-MM-DD`.
- `startTime` harus lebih awal daripada `endTime`.
- Setiap event seed harus memiliki `isDummy: true`, `sourceType: "demo_seed"`, dan `status: "approved"`.
- Tanggal contoh kegiatan asrama harus sesuai dengan hari pada `schedulePattern.daysOfWeek`.
- Tanggal contoh ibadah harus sesuai dengan hari pada `worshipSchedules.schedulePattern.dayOfWeek`.
- Untuk `IBADAH SABBATH`, `skipIfLongWeekend: true` dan status pemeriksaan kalender harus dipertahankan sampai kalender akademik tersedia.
- Nama asrama, choir, dan organisasi dipertahankan persis sesuai master data.
