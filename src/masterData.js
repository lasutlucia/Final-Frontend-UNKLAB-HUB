export const PROGRAM_STUDIES = [
  { level: 'D3', name: 'Sekretari' },
  ...['Manajemen', 'Akuntansi', 'Bisnis Internasional', 'Informatika', 'Sistem Informasi', 'Teknologi Informasi', 'Pendidikan Agama', 'Pendidikan Bahasa Inggris', 'Pendidikan Ekonomi', 'Pendidikan Luar Sekolah', 'Ilmu Keperawatan', 'Agroteknologi', 'Ilmu Filsafat', 'Kedokteran'].map(name => ({ level: 'S1', name })),
  ...['Ners', 'Pendidikan Profesi Dokter'].map(name => ({ level: 'Profesi', name })),
  ...['Manajemen', 'Teologi', 'Magister Sistem Informasi'].map(name => ({ level: 'S2', name })),
];

export const TARGET_AUDIENCE_OPTIONS = [
  { value: 'all_civitas', label: 'Semua Civitas Akademika' },
  { value: 'all_students', label: 'Semua Mahasiswa' },
  { value: 'faculty_students', label: 'Mahasiswa Fakultas' },
  { value: 'study_program_students', label: 'Mahasiswa Program Studi' },
  { value: 'organization', label: 'Organisasi tertentu' },
  { value: 'choir', label: 'Choir tertentu' },
  { value: 'dormitory', label: 'Penghuni Asrama' },
  { value: 'faculty_staff', label: 'Dosen/Staff' },
  { value: 'custom_group', label: 'Kelompok gabungan' },
];

export const ORGANIZER_ROLE_OPTIONS = [
  'Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara',
  'Koordinator', 'Ketua Panitia', 'Anggota', 'Lainnya',
];

export const DOSEN_REQUEST_CATEGORY_SLUGS = [
  'faculty',
  'seminar-workshop-competition',
  'announcement',
  'academic-activity',
  'staff-activity',
];

export const roleNames = { mahasiswa: 'Mahasiswa', dosen: 'Dosen / Staff', admin: 'Admin' };
export const demoDisplayNames = { mahasiswa: 'Ungke', dosen: 'Enrico', admin: 'Admin UNKLAB' };

export function categorySlug(categoryOrSlug, categories = []) {
  if (!categoryOrSlug) return '';
  const category = categories.find(item => item.id === categoryOrSlug || item.slug === categoryOrSlug);
  return category?.slug || String(categoryOrSlug).toLowerCase();
}

export function isRequestCategoryAllowed(role, categoryOrSlug, categories = []) {
  const slug = categorySlug(categoryOrSlug, categories);
  if (slug === 'academic-calendar') return false;
  if (role === 'mahasiswa') return true;
  if (role === 'dosen') return DOSEN_REQUEST_CATEGORY_SLUGS.includes(slug);
  return false;
}

export function validateEventRequest(form, role, categories = []) {
  const errors = {};
  const slug = categorySlug(form.categoryId, categories);
  if (!isRequestCategoryAllowed(role, form.categoryId, categories)) errors.categoryId = 'Role ini tidak dapat mengajukan kategori tersebut.';
  if (!form.title?.trim()) errors.title = 'Nama kegiatan wajib diisi.';
  if (!form.description?.trim()) errors.description = 'Deskripsi wajib diisi.';
  if (!form.date) errors.date = 'Tanggal wajib diisi.';
  if (!form.startTime || !form.endTime) errors.time = 'Waktu mulai dan selesai wajib diisi.';
  if (form.startTime && form.endTime && form.endTime <= form.startTime) errors.time = 'Waktu selesai harus setelah waktu mulai.';
  if (!form.location?.trim()) errors.location = 'Lokasi wajib diisi.';
  if (slug === 'organization' && !form.organizerId) errors.organizerId = 'Organisasi penyelenggara wajib dipilih.';
  if (slug === 'choir' && !form.organizerId) errors.organizerId = 'Choir penyelenggara wajib dipilih.';
  if (slug === 'dormitory' && !form.dormitoryId) errors.dormitoryId = 'Asrama terkait wajib dipilih.';
  if (form.organizerRole === 'Lainnya' && !form.organizerRoleOther?.trim()) errors.organizerRoleOther = 'Jelaskan jabatan/peran lainnya.';
  return errors;
}
