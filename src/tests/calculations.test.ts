import { test, expect } from '@playwright/test';

function validateDates(start: string, end: string): boolean {
    return new Date(end) > new Date(start);
}

function validatePositiveNumber(value: number): boolean {
    return value >= 0;
}

test.describe('Расчёты и валидация', () => {
    test('дата окончания должна быть позже даты начала', () => {
        expect(validateDates('2025-12-15', '2025-12-16')).toBe(true);
        expect(validateDates('2025-12-16', '2025-12-15')).toBe(false);
    });

    test('пробег и стоимость не могут быть отрицательными', () => {
        expect(validatePositiveNumber(100)).toBe(true);
        expect(validatePositiveNumber(0)).toBe(true);
        expect(validatePositiveNumber(-50)).toBe(false);
    });
});