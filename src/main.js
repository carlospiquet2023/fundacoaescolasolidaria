/**
 * Main Application Entry Point
 * Fundação Escola Solidária - Sistema Institucional v2.0
 * 
 * @description Ponto de entrada principal da aplicação
 * Inicializa componentes, serviços e configurações
 * 
 * @author Fundação Escola Solidária
 * @version 2.0.0
 * @license MIT
 */

// === IMPORTS === //
import './styles/variables.css';
import './styles/reset.css';
import './components/common/Modal.css';
import './components/common/Navigation.css';
import './hooks/useTheme.css';

import { createModal } from './components/common/Modal.js';
import { createNavigation } from './components/common/Navigation.js';
import { useTheme, createThemeToggle } from './hooks/useTheme.js';
import { smoothScrollTo } from './utils/helpers.js';

/**
 * Classe principal da aplicação
 */
class App {
  constructor() {
    this.modals = new Map();
    this.navigation = null;
    this.themeManager = null;
    this.init();
  }

  /**
   * Inicializa a aplicação
   * @private
   */
  async init() {
    try {
      // Aguarda DOM estar pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        await this.setup();
      }
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showErrorNotification('Erro ao inicializar aplicação');
    }
  }

  /**
   * Configura componentes e funcionalidades
   * @private
   */
  async setup() {
    // Inicializa gerenciador de tema
    this.setupTheme();

    // Inicializa navegação
    this.setupNavigation();

    // Inicializa modais
    this.setupModals();

    // Configura scroll suave
    this.setupSmoothScroll();

    // Configura lazy loading de imagens
    this.setupLazyLoading();

    // Configura animações de scroll
    this.setupScrollAnimations();

    // Event listeners gerais
    this.setupEventListeners();

    // Performance monitoring
    this.logPerformanceMetrics();

    console.log('✅ Application initialized successfully');
  }

  /**
   * Configura gerenciador de tema
   * @private
   */
  setupTheme() {
    this.themeManager = useTheme({
      autoDetect: true,
      defaultTheme: 'light',
    });

    // Cria botão de toggle
    createThemeToggle('body', this.themeManager);

    // Log de mudanças de tema
    this.themeManager.onChange((newTheme, oldTheme) => {
      console.log(`Theme changed: ${oldTheme} → ${newTheme}`);
    });
  }

  /**
   * Configura navegação
   * @private
   */
  setupNavigation() {
    const navElement = document.querySelector('nav');
    if (!navElement) {
      console.warn('Navigation element not found');
      return;
    }

    this.navigation = createNavigation('nav', {
      mobileBreakpoint: 768,
      closeOnNavigation: true,
    });

    // Marca página ativa
    const currentPath = window.location.pathname;
    this.navigation.setActivePage(currentPath);
  }

  /**
   * Configura modais
   * @private
   */
  setupModals() {
    // Encontra todos os modais no DOM
    const modalElements = document.querySelectorAll('.modal');
    
    modalElements.forEach((modalEl) => {
      const modalId = modalEl.id;
      if (!modalId) {
        console.warn('Modal without ID found:', modalEl);
        return;
      }

      const modal = createModal(modalId, {
        closeOnEscape: true,
        closeOnBackdrop: true,
        onOpen: () => console.log(`Modal opened: ${modalId}`),
        onClose: () => console.log(`Modal closed: ${modalId}`),
      });

      this.modals.set(modalId, modal);
    });

    // Configura botões que abrem modais
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach((trigger) => {
      const modalId = trigger.dataset.modal;
      trigger.addEventListener('click', () => {
        const modal = this.modals.get(modalId);
        if (modal) {
          modal.open();
        }
      });
    });
  }

  /**
   * Configura scroll suave para âncoras
   * @private
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        if (href === '#') {
          return;
        }

        e.preventDefault();
        smoothScrollTo(href, 80);
      });
    });
  }

  /**
   * Configura lazy loading de imagens
   * @private
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src || img.src;
            
            if (src) {
              img.src = src;
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Configura animações ao fazer scroll
   * @private
   */
  setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animateObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        {
          threshold: 0.1,
        }
      );

      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        animateObserver.observe(el);
      });
    }
  }

  /**
   * Configura event listeners gerais
   * @private
   */
  setupEventListeners() {
    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    // Botões WhatsApp
    document.querySelectorAll('.whatsapp-button, .donate-whatsapp-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
      });
    });
  }

  /**
   * Gerencia envio de formulário de contato
   * @param {Event} e - Evento de submit
   * @private
   */
  handleContactSubmit(e) {
    e.preventDefault();
    
    // Aqui você implementaria a lógica de envio
    console.log('Contact form submitted');
    
    this.showSuccessNotification('Mensagem enviada com sucesso!');
  }

  /**
   * Mostra notificação de sucesso
   * @param {string} message - Mensagem
   * @private
   */
  showSuccessNotification(message) {
    // Implementação simplificada - pode ser expandida
    alert(message);
  }

  /**
   * Mostra notificação de erro
   * @param {string} message - Mensagem
   * @private
   */
  showErrorNotification(message) {
    // Implementação simplificada - pode ser expandida
    console.error(message);
  }

  /**
   * Log de métricas de performance
   * @private
   */
  logPerformanceMetrics() {
    if ('performance' in window && performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;

          console.log('📊 Performance Metrics:');
          console.log(`   Page Load Time: ${pageLoadTime}ms`);
          console.log(`   Connect Time: ${connectTime}ms`);
          console.log(`   Render Time: ${renderTime}ms`);
        }, 0);
      });
    }
  }
}

// Inicializa aplicação
const app = new App();

// Export para uso externo se necessário
export default app;
