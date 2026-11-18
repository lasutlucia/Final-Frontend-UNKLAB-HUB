import assert from 'node:assert/strict';
import test from 'node:test';
import { validateEventRequest } from '../src/masterData.js';

const categories = [
  { id: 'cat-organization', slug: 'organization' },
  { id: 'cat-choir', slug: 'choir' },
  { id: 'cat-dormitory', slug: 'dormitory' },
];

const base = {
  title: 'Kegiatan kampus', description: 'Deskripsi kegiatan', date: '2026-12-01',
  startTime: '09:00', endTime: '10:00', location: 'Kampus',
  categoryId: 'cat-organization', organizerId: 'org-1', organizerRole: 'Anggota',
};

test('organization and choir requests require an organizer', () => {
  assert.equal(validateEventRequest({ ...base, organizerId: '' }, 'mahasiswa', categories).organizerId !== undefined, true);
  assert.equal(validateEventRequest({ ...base, categoryId: 'cat-choir', organizerId: '' }, 'mahasiswa', categories).organizerId !== undefined, true);
});

test('dormitory requests require a dormitory and other role requires custom text', () => {
  const errors = validateEventRequest({ ...base, categoryId: 'cat-dormitory', organizerId: '', dormitoryId: '', organizerRole: 'Lainnya' }, 'mahasiswa', categories);
  assert.equal(errors.dormitoryId, 'Asrama terkait wajib dipilih.');
  assert.equal(errors.organizerRoleOther, 'Jelaskan jabatan/peran lainnya.');
});

test('requests reject invalid time order and official calendar category', () => {
  const errors = validateEventRequest({ ...base, startTime: '11:00', endTime: '10:00' }, 'mahasiswa', categories);
  assert.equal(errors.time, 'Waktu selesai harus setelah waktu mulai.');
  assert.equal(validateEventRequest({ ...base, categoryId: 'academic-calendar' }, 'mahasiswa', categories).categoryId !== undefined, true);
});
