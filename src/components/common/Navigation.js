/**
 * Navigation Component
 * Menu de navegação responsivo e acessível
 */

export class Navigation {
  /**
   * Cria instância do Navigation
   * @param {string} selector - Seletor CSS do elemento nav
   * @param {Object} options - Opções de configuração
   */
  constructor(selector, options = {}) {
    this.nav = document.querySelector(selector);
    this.options = {
      mobileBreakpoint: 768,
      closeOnNavigation: true,
      ...options,
    };
    this.isOpen = false;
    this.init();
  }

  /**
   * Inicializa o componente
   * @private
   */
  init() {
    if (!this.nav) {
      console.error('Navigation element not found');
      return;
    }

    this.menuToggle = this.nav.querySelector('.menu-toggle');
    this.navList = this.nav.querySelector('.nav-list');
    this.navItems = this.nav.querySelectorAll('.nav-list a');

    this.setupEventListeners();
    this.setupAccessibility();
    this.handleResize();
  }

  /**
   * Configura event listeners
   * @private
   */
  setupEventListeners() {
    // Toggle menu mobile
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggle());
    }

    // Fecha menu ao clicar em link (mobile)
    if (this.options.closeOnNavigation) {
      this.navItems.forEach((item) => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= this.options.mobileBreakpoint) {
            this.close();
          }
        });
      });
    }

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.nav.contains(e.target)) {
        this.close();
      }
    });

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Gerencia resize
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Configura acessibilidade
   * @private
   */
  setupAccessibility() {
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-label', 'Menu de navegação');
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-controls', 'nav-list');
    }

    if (this.navList) {
      this.navList.setAttribute('id', 'nav-list');
    }
  }

  /**
   * Abre o menu
   * @public
   */
  open() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.navList.classList.add('nav-list-open');
    this.menuToggle.classList.add('menu-toggle-active');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fecha o menu
   * @public
   */
  close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.navList.classList.remove('nav-list-open');
    this.menuToggle.classList.remove('menu-toggle-active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /**
   * Alterna estado do menu
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
   * Gerencia mudança de tamanho da tela
   * @private
   */
  handleResize() {
    if (window.innerWidth > this.options.mobileBreakpoint) {
      this.close();
    }
  }

  /**
   * Adiciona indicador de página ativa
   * @param {string} currentPath - URL da página atual
   * @public
   */
  setActivePage(currentPath) {
    this.navItems.forEach((item) => {
      const href = item.getAttribute('href');
      if (href === currentPath) {
        item.classList.add('nav-item-active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('nav-item-active');
        item.removeAttribute('aria-current');
      }
    });
  }
}

/**
 * Factory function para criar navegação
 * @param {string} selector - Seletor CSS
 * @param {Object} options - Opções
 * @returns {Navigation}
 */
export function createNavigation(selector, options = {}) {
  return new Navigation(selector, options);
}
