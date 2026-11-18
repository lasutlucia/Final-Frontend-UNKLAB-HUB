import assert from 'node:assert/strict';
import test from 'node:test';
import { isRequestCategoryAllowed } from '../src/masterData.js';

const categories = [
  { id: 'cat-academic-calendar', slug: 'academic-calendar' },
  { id: 'cat-faculty', slug: 'faculty' },
  { id: 'cat-organization', slug: 'organization' },
  { id: 'cat-seminar', slug: 'seminar-workshop-competition' },
];

test('mahasiswa can request non-official categories but never official academic calendar', () => {
  assert.equal(isRequestCategoryAllowed('mahasiswa', 'cat-organization', categories), true);
  assert.equal(isRequestCategoryAllowed('mahasiswa', 'cat-academic-calendar', categories), false);
});

test('dosen is limited to faculty and seminar-style requests', () => {
  assert.equal(isRequestCategoryAllowed('dosen', 'cat-faculty', categories), true);
  assert.equal(isRequestCategoryAllowed('dosen', 'cat-seminar', categories), true);
  assert.equal(isRequestCategoryAllowed('dosen', 'cat-organization', categories), false);
});

test('admin does not use the request submission flow', () => {
  assert.equal(isRequestCategoryAllowed('admin', 'cat-faculty', categories), false);
});
