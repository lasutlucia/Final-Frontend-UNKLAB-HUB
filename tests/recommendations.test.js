import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getRecommendationGroups,
  getRecommendations,
  recommendationReason,
} from '../src/recommendations.js';

const events = [
  {
    id: 'technology',
    title: 'Workshop Pengembangan Web',
    date: '2026-12-10',
    tags: ['coding'],
  },
  {
    id: 'unrelated',
    title: 'Pertemuan Organisasi',
    description: 'Kegiatan rutin mahasiswa',
    date: '2026-12-08',
  },
  {
    id: 'music',
    title: 'Latihan Paduan Suara',
    date: '2026-12-09',
  },
];

test('only recommends events matching a selected interest', () => {
  const result = getRecommendations(events, {
    interests: ['Teknologi'],
    hobbies: ['Musik'],
  });

  assert.deepEqual(result.map(event => event.id), ['music', 'technology']);
});

test('uses hobbies when building recommendations', () => {
  const result = getRecommendations(events, {
    interests: [],
    hobbies: ['Musik'],
  });

  assert.deepEqual(result.map(event => event.id), ['music']);
});

test('shows every matching event across multiple selected interests', () => {
  const manyInterestEvents = [
    { id: 'technology-1', title: 'Kelas coding', date: '2026-12-10' },
    { id: 'technology-2', title: 'Workshop software', date: '2026-12-11' },
    { id: 'technology-3', title: 'Seminar teknologi', date: '2026-12-12' },
    { id: 'technology-4', title: 'Pengenalan AI', date: '2026-12-13' },
    { id: 'music-1', title: 'Latihan paduan suara', date: '2026-12-14' },
  ];

  const result = getRecommendations(manyInterestEvents, {
    interests: ['Teknologi', 'Musik'],
  });

  assert.deepEqual(
    result.map(event => event.id),
    ['technology-1', 'technology-2', 'technology-3', 'technology-4', 'music-1']
  );
});

test('creates a recommendation group for every selected interest', () => {
  const groups = getRecommendationGroups(events, {
    interests: ['Teknologi', 'Musik', 'Lingkungan'],
  });

  assert.deepEqual(
    groups.map(group => [group.interest, group.events.map(event => event.id)]),
    [
      ['Teknologi', ['technology']],
      ['Musik', ['music']],
      ['Lingkungan', []],
    ]
  );
});

test('matches category names and avoids partial-word matches', () => {
  const result = getRecommendations(
    [
      { id: 'ai', title: 'Pengenalan AI', date: '2026-12-10' },
      { id: 'main', title: 'Main bersama komunitas', date: '2026-12-09' },
      {
        id: 'category',
        title: 'Kelas pengembangan',
        categoryId: 'technology',
        date: '2026-12-11',
      },
    ],
    { interests: ['Teknologi'] },
    [{ id: 'technology', name: 'Teknologi & Inovasi' }]
  );

  assert.deepEqual(result.map(event => event.id), ['ai', 'category']);
  assert.equal(
    recommendationReason(events[2], { interests: ['Musik'] }),
    'Cocok dengan Musik'
  );
});

test('falls back to the nearest events when no interest is selected', () => {
  const result = getRecommendations(events, { interests: [] }, [], 2);

  assert.deepEqual(result.map(event => event.id), ['unrelated', 'music']);
});

test('returns no unrelated recommendations when interests have no matches', () => {
  const result = getRecommendations(events, { interests: ['Lingkungan'] });

  assert.deepEqual(result, []);
});
