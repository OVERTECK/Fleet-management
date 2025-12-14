// src/tests/forms.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Формы: Проверка расчётов и валидаций', () => {

    test('Проверка расчётов в AssignmentForm: end > start', async ({ page }) => {
        await page.goto('/assignments');  // Страница с формой назначений

        // Предполагаем, что есть кнопка "Создать" или сразу форма
        // await page.getByRole('button', { name: 'Создать назначение' }).click(); // Если модалка

        await page.getByLabel('Дата начала').fill('2025-12-15');
        await page.getByLabel('Дата окончания').fill('2025-12-16');
        await page.getByRole('button', { name: 'Создать' }).click();

        // Проверяем, что нет ошибки
        await expect(page.getByText('Дата окончания должна быть позже')).not.toBeVisible();

        // Тест на ошибку
        await page.getByLabel('Дата окончания').fill('2025-12-14');
        await page.getByRole('button', { name: 'Создать' }).click();
        await expect(page.getByText('Дата окончания должна быть позже даты начала')).toBeVisible();
    });

    test('Проверка расчётов в CarForm: totalKM >= 0', async ({ page }) => {
        await page.goto('/cars');

        // await page.getByRole('button', { name: 'Добавить автомобиль' }).click();

        await page.getByLabel('Пробег (км)').fill('100');
        await expect(page.getByText('Пробег не может быть отрицательным')).not.toBeVisible();

        await page.getByLabel('Пробег (км)').fill('-50');
        await expect(page.getByText('Пробег не может быть отрицательным')).toBeVisible();
    });

    test('Защита от двойных записей: Уникальный VIN в CarForm', async ({ page }) => {
        await page.goto('/cars');

        await page.getByLabel('VIN номер').fill('EXISTING_VIN');  // Дубликат из БД
        await page.getByRole('button', { name: 'Создать' }).click();

        // Ожидаем ошибку от бэкенда (toast или текст)
        await expect(page.getByText(/VIN уже существует/i)).toBeVisible();
    });
});