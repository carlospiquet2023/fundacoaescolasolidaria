/**
 * Modal Component
 * Componente modal reutilizável e acessível
 * Segue padrões WCAG 2.1 para acessibilidade
 */

export class Modal {
  /**
   * Cria uma instância do Modal
   * @param {string} id - ID único do modal
   * @param {Object} options - Opções de configuração
   * @param {boolean} options.closeOnEscape - Fecha ao pressionar ESC (default: true)
   * @param {boolean} options.closeOnBackdrop - Fecha ao clicar no backdrop (default: true)
   * @param {Function} options.onOpen - Callback ao abrir
   * @param {Function} options.onClose - Callback ao fechar
   */
  constructor(id, options = {}) {
    this.id = id;
    this.options = {
      closeOnEscape: true,
      closeOnBackdrop: true,
      onOpen: null,
      onClose: null,
      ...options,
    };
    this.isOpen = false;
    this.modalElement = null;
    this.init();
  }

  /**
   * Inicializa o modal
   * @private
   */
  init() {
    this.modalElement = document.getElementById(this.id);
    if (!this.modalElement) {
      console.error(`Modal with id "${this.id}" not found`);
      return;
    }

    this.setupEventListeners();
    this.setupAccessibility();
  }

  /**
   * Configura event listeners
   * @private
   */
  setupEventListeners() {
    // Botão de fechar
    const closeBtn = this.modalElement.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Fechar ao clicar no backdrop
    if (this.options.closeOnBackdrop) {
      this.modalElement.addEventListener('click', (e) => {
        if (e.target === this.modalElement) {
          this.close();
        }
      });
    }

    // Fechar com ESC
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  }

  /**
   * Configura atributos de acessibilidade
   * @private
   */
  setupAccessibility() {
    this.modalElement.setAttribute('role', 'dialog');
    this.modalElement.setAttribute('aria-modal', 'true');
    this.modalElement.setAttribute('aria-hidden', 'true');
    
    const modalContent = this.modalElement.querySelector('.modal-content');
    if (modalContent) {
      modalContent.setAttribute('role', 'document');
    }
  }

  /**
   * Abre o modal
   * @public
   */
  open() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.modalElement.classList.add('modal-open');
    this.modalElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foco no primeiro elemento focável
    this.trapFocus();

    // Callback
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen();
    }

    // Animação
    requestAnimationFrame(() => {
      this.modalElement.style.display = 'flex';
      setTimeout(() => {
        this.modalElement.classList.add('modal-visible');
      }, 10);
    });
  }

  /**
   * Fecha o modal
   * @public
   */
  close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.modalElement.classList.remove('modal-visible');
    this.modalElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Callback
    if (typeof this.options.onClose === 'function') {
      this.options.onClose();
    }

    // Aguarda animação antes de ocultar
    setTimeout(() => {
      this.modalElement.style.display = 'none';
      this.modalElement.classList.remove('modal-open');
    }, 300);
  }

  /**
   * Alterna estado do modal
   * @public
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Gerencia o foco dentro do modal (trap focus)
   * @private
   */
  trapFocus() {
    const focusableElements = this.modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    this.modalElement.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') {
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Destrói o modal e remove listeners
   * @public
   */
  destroy() {
    if (this.isOpen) {
      this.close();
    }
    // Remove event listeners (implementar se necessário)
  }
}

/**
 * Factory function para criar modais
 * @param {string} id - ID do modal
 * @param {Object} options - Opções de configuração
 * @returns {Modal}
 */
export function createModal(id, options = {}) {
  return new Modal(id, options);
}
