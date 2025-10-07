/**
 * Form Validation Utilities
 * Funções para validação robusta de formulários
 * @module utils/validation
 */

/**
 * Classe para gerenciar validação de formulários
 */
export class FormValidator {
  /**
   * @param {HTMLFormElement} form - Formulário a ser validado
   * @param {Object} rules - Regras de validação
   */
  constructor(form, rules = {}) {
    this.form = form;
    this.rules = rules;
    this.errors = {};
  }

  /**
   * Valida campo individual
   * @param {string} fieldName - Nome do campo
   * @param {any} value - Valor do campo
   * @returns {string|null} Mensagem de erro ou null
   */
  validateField(fieldName, value) {
    const fieldRules = this.rules[fieldName];
    
    if (!fieldRules) {
      return null;
    }

    // Required
    if (fieldRules.required && !value.trim()) {
      return fieldRules.messages?.required || 'Este campo é obrigatório';
    }

    // Min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      return (
        fieldRules.messages?.minLength ||
        `Mínimo de ${fieldRules.minLength} caracteres`
      );
    }

    // Max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      return (
        fieldRules.messages?.maxLength ||
        `Máximo de ${fieldRules.maxLength} caracteres`
      );
    }

    // Email
    if (fieldRules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return fieldRules.messages?.email || 'Email inválido';
      }
    }

    // Custom validator
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value);
      if (customError) {
        return customError;
      }
    }

    // Pattern
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      return fieldRules.messages?.pattern || 'Formato inválido';
    }

    return null;
  }

  /**
   * Valida todos os campos
   * @returns {boolean} true se válido
   */
  validate() {
    this.errors = {};
    let isValid = true;

    for (const fieldName in this.rules) {
      const field = this.form.elements[fieldName];
      if (!field) {
        continue;
      }

      const value = field.value;
      const error = this.validateField(fieldName, value);

      if (error) {
        this.errors[fieldName] = error;
        this.showError(field, error);
        isValid = false;
      } else {
        this.clearError(field);
      }
    }

    return isValid;
  }

  /**
   * Mostra erro no campo
   * @param {HTMLElement} field - Campo do formulário
   * @param {string} message - Mensagem de erro
   */
  showError(field, message) {
    field.classList.add('field-error');
    field.setAttribute('aria-invalid', 'true');

    let errorElement = field.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  /**
   * Limpa erro do campo
   * @param {HTMLElement} field - Campo do formulário
   */
  clearError(field) {
    field.classList.remove('field-error');
    field.setAttribute('aria-invalid', 'false');

    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Limpa todos os erros
   */
  clearAllErrors() {
    this.errors = {};
    const fields = this.form.querySelectorAll('.field-error');
    fields.forEach((field) => this.clearError(field));
  }

  /**
   * Adiciona validação em tempo real
   */
  enableRealTimeValidation() {
    for (const fieldName in this.rules) {
      const field = this.form.elements[fieldName];
      if (!field) {
        continue;
      }

      field.addEventListener('blur', () => {
        const error = this.validateField(fieldName, field.value);
        if (error) {
          this.showError(field, error);
        } else {
          this.clearError(field);
        }
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('field-error')) {
          const error = this.validateField(fieldName, field.value);
          if (!error) {
            this.clearError(field);
          }
        }
      });
    }
  }
}

/**
 * Validadores customizados prontos para uso
 */
export const validators = {
  /**
   * Valida CPF
   */
  cpf: (value) => {
    const cpf = value.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return 'CPF inválido';
    }

    let sum = 0;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return 'CPF inválido';
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return 'CPF inválido';
    }

    return null;
  },

  /**
   * Valida telefone brasileiro
   */
  phone: (value) => {
    const phone = value.replace(/[^\d]/g, '');
    if (phone.length < 10 || phone.length > 11) {
      return 'Telefone inválido';
    }
    return null;
  },

  /**
   * Valida data no formato DD/MM/YYYY
   */
  date: (value) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(value)) {
      return 'Data inválida. Use o formato DD/MM/AAAA';
    }

    const [, day, month, year] = value.match(dateRegex);
    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== parseInt(day) ||
      date.getMonth() !== parseInt(month) - 1 ||
      date.getFullYear() !== parseInt(year)
    ) {
      return 'Data inválida';
    }

    return null;
  },

  /**
   * Valida senha forte
   */
  strongPassword: (value) => {
    if (value.length < 8) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Senha deve conter ao menos uma letra maiúscula';
    }
    if (!/[a-z]/.test(value)) {
      return 'Senha deve conter ao menos uma letra minúscula';
    }
    if (!/[0-9]/.test(value)) {
      return 'Senha deve conter ao menos um número';
    }
    if (!/[!@#$%^&*]/.test(value)) {
      return 'Senha deve conter ao menos um caractere especial (!@#$%^&*)';
    }
    return null;
  },
};

/**
 * Factory function para criar validador
 * @param {HTMLFormElement} form - Formulário
 * @param {Object} rules - Regras
 * @returns {FormValidator}
 */
export function createValidator(form, rules) {
  return new FormValidator(form, rules);
}
