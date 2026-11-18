import { test, expect } from '@playwright/test';

test('halaman login menampilkan akses akun demo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Masuk ke UNKLAB HUB').first()).toBeVisible();
  await expect(page.getByText('Akun Demo — Klik untuk Langsung Masuk')).toBeVisible();
  await expect(page.getByRole('button', { name: /mahasiswa/i }).first()).toBeVisible();
});

test('akun demo mahasiswa dapat masuk ke workspace', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /mahasiswa/i }).first().click();
  await expect(page.getByText(/Kenalan dulu dengan kami/i)).toBeVisible();
  await page.getByRole('button', { name: /Teknologi/i }).click();
  await page.getByRole('button', { name: /Simpan & masuk ke dashboard/i }).click();
  await expect(page.getByText(/Campus life, connected\./i).first()).toBeVisible();
  await expect(page.getByText(/Rekomendasi untukmu/i)).toBeVisible();
});
