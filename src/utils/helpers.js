/**
 * Utility Functions
 * Funções auxiliares reutilizáveis seguindo princípios DRY
 * @module utils/helpers
 */

/**
 * Formata valor monetário para BRL
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado
 * @example
 * formatCurrency(1500.50) // "R$ 1.500,50"
 */
export function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formata data para padrão brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @param {boolean} includeTime - Incluir hora (default: false)
 * @returns {string} Data formatada
 * @example
 * formatDate(new Date()) // "07/10/2025"
 * formatDate(new Date(), true) // "07/10/2025 14:30"
 */
export function formatDate(date, includeTime = false) {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return dateObj.toLocaleString('pt-BR', options);
}

/**
 * Debounce function para otimizar performance
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função debounced
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function para limitar execuções
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Limite em ms
 * @returns {Function} Função throttled
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} true se válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} true se válido
 */
export function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false;
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
    return false;
  }

  return true;
}

/**
 * Formata CPF
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 * @example
 * formatCPF("12345678900") // "123.456.789-00"
 */
export function formatCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata telefone
 * @param {string} phone - Telefone sem formatação
 * @returns {string} Telefone formatado
 */
export function formatPhone(phone) {
  phone = phone.replace(/[^\d]/g, '');
  
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Sanitiza string para prevenir XSS
 * @param {string} str - String a ser sanitizada
 * @returns {string} String segura
 */
export function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Gera ID único
 * @returns {string} ID único
 */
export function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Copia texto para clipboard
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>} true se copiado com sucesso
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Scroll suave para elemento
 * @param {string|HTMLElement} target - Seletor ou elemento
 * @param {number} offset - Offset em pixels (default: 0)
 */
export function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (!element) {
    return;
  }

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
}

/**
 * Detecta se dispositivo é mobile
 * @returns {boolean} true se mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detecta preferência de tema do sistema
 * @returns {string} 'dark' ou 'light'
 */
export function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Aguarda tempo especificado
 * @param {number} ms - Milissegundos
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Carrega imagem com lazy loading
 * @param {HTMLImageElement} img - Elemento img
 * @returns {Promise<void>}
 */
export function lazyLoadImage(img) {
  return new Promise((resolve, reject) => {
    if (!img) {
      reject(new Error('Image element not provided'));
      return;
    }

    const src = img.dataset.src || img.src;
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      resolve();
    };
    
    tempImg.onerror = reject;
    tempImg.src = src;
  });
}

/**
 * Trunca texto
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @param {string} suffix - Sufixo (default: '...')
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength, suffix = '...') {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}
