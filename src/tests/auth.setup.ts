// src/tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';  // Путь к файлу с сессией

setup('authenticate as admin', async ({ page }) => {
    // Переходим на страницу логина
    await page.goto('/auth');

    // Заполняем форму логина (используйте реальные тестовые credentials!)
    await page.getByLabel('Логин').fill('Admin1');          // Замените на ваш тестовый логин
    await page.getByLabel('Пароль').fill('Admin1');      // Замените на тестовый пароль
    await page.getByRole('button', { name: 'Войти' }).click();

    // Ждём редиректа на дашборд (или любую защищённую страницу)
    await page.waitForURL('/dashboard');

    // Проверяем, что залогинились (например, по тексту пользователя)
    await expect(page.getByText('admin')).toBeVisible();  // Или другой индикатор

    // Сохраняем состояние аутентификации (cookies, localStorage)
    await page.context().storageState({ path: authFile });
});