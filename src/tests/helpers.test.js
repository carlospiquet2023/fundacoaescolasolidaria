/**
 * Test Suite - Helpers
 * Testes unitários para funções utilitárias
 */

import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  validateEmail,
  validateCPF,
  formatCPF,
  formatPhone,
  debounce,
  throttle,
  sanitizeHTML,
} from '../utils/helpers.js';

describe('formatCurrency', () => {
  it('should format number to BRL currency', () => {
    expect(formatCurrency(1500.5)).toBe('R$ 1.500,50');
    expect(formatCurrency(100)).toBe('R$ 100,00');
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  it('should handle invalid input', () => {
    expect(formatCurrency('invalid')).toBe('R$ 0,00');
    expect(formatCurrency(NaN)).toBe('R$ 0,00');
    expect(formatCurrency(null)).toBe('R$ 0,00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-R$ 100,00');
  });
});

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2025-10-07T12:00:00');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/07\/10\/2025/);
  });

  it('should format date string', () => {
    const formatted = formatDate('2025-10-07');
    expect(formatted).toMatch(/07\/10\/2025/);
  });

  it('should include time when requested', () => {
    const date = new Date('2025-10-07T14:30:00');
    const formatted = formatDate(date, true);
    expect(formatted).toMatch(/14:30/);
  });

  it('should handle invalid date', () => {
    expect(formatDate('invalid')).toBe('Data inválida');
  });
});

describe('validateEmail', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
  });
});

describe('validateCPF', () => {
  it('should validate correct CPFs', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('should reject invalid CPFs', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('123.456.789-00')).toBe(false);
    expect(validateCPF('12345678900')).toBe(false);
  });

  it('should reject malformed CPFs', () => {
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF('abcdefghijk')).toBe(false);
  });
});

describe('formatCPF', () => {
  it('should format CPF', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  it('should clean and format', () => {
    expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
  });
});

describe('formatPhone', () => {
  it('should format 11-digit phone', () => {
    expect(formatPhone('21987654321')).toBe('(21) 98765-4321');
  });

  it('should format 10-digit phone', () => {
    expect(formatPhone('2133334444')).toBe('(21) 3333-4444');
  });

  it('should handle already formatted phone', () => {
    expect(formatPhone('(21) 98765-4321')).toBe('(21) 98765-4321');
  });
});

describe('debounce', () => {
  it('should debounce function calls', (done) => {
    let counter = 0;
    const increment = debounce(() => {
      counter++;
    }, 100);

    increment();
    increment();
    increment();

    setTimeout(() => {
      expect(counter).toBe(1);
      done();
    }, 150);
  });
});

describe('throttle', () => {
  it('should throttle function calls', (done) => {
    let counter = 0;
    const increment = throttle(() => {
      counter++;
    }, 100);

    increment();
    increment();
    increment();

    expect(counter).toBe(1);

    setTimeout(() => {
      increment();
      expect(counter).toBe(2);
      done();
    }, 150);
  });
});

describe('sanitizeHTML', () => {
  it('should sanitize HTML', () => {
    const dirty = '<script>alert("xss")</script>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('&lt;script&gt;');
  });

  it('should preserve text content', () => {
    const text = 'Hello World';
    expect(sanitizeHTML(text)).toBe('Hello World');
  });
});
