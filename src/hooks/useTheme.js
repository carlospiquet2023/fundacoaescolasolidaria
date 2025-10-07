/**
 * Theme Manager Hook
 * Gerencia tema dark/light com persistência
 * @module hooks/useTheme
 */

export class ThemeManager {
  /**
   * Cria instância do ThemeManager
   * @param {Object} options - Opções de configuração
   */
  constructor(options = {}) {
    this.options = {
      storageKey: 'theme-preference',
      defaultTheme: 'light',
      autoDetect: true,
      ...options,
    };

    this.currentTheme = null;
    this.listeners = [];
    this.init();
  }

  /**
   * Inicializa o gerenciador de tema
   * @private
   */
  init() {
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemTheme();
    
    let initialTheme = this.options.defaultTheme;

    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (this.options.autoDetect && systemTheme) {
      initialTheme = systemTheme;
    }

    this.setTheme(initialTheme, false);
    this.watchSystemTheme();
  }

  /**
   * Obtém tema salvo no localStorage
   * @returns {string|null}
   * @private
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.options.storageKey);
    } catch (error) {
      console.warn('Failed to get saved theme:', error);
      return null;
    }
  }

  /**
   * Obtém tema do sistema
   * @returns {string}
   * @private
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Define o tema
   * @param {string} theme - 'light' ou 'dark'
   * @param {boolean} save - Salvar no localStorage (default: true)
   * @public
   */
  setTheme(theme, save = true) {
    if (theme !== 'light' && theme !== 'dark') {
      console.error(`Invalid theme: ${theme}. Use 'light' or 'dark'`);
      return;
    }

    const previousTheme = this.currentTheme;
    this.currentTheme = theme;

    // Atualiza DOM
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(`${theme}-mode`);
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);

    // Atualiza meta theme-color
    this.updateMetaThemeColor(theme);

    // Salva preferência
    if (save) {
      try {
        localStorage.setItem(this.options.storageKey, theme);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }

    // Notifica listeners
    this.notifyListeners(theme, previousTheme);
  }

  /**
   * Alterna entre light e dark
   * @public
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Obtém tema atual
   * @returns {string}
   * @public
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Verifica se está em modo escuro
   * @returns {boolean}
   * @public
   */
  isDark() {
    return this.currentTheme === 'dark';
  }

  /**
   * Atualiza meta tag theme-color
   * @param {string} theme
   * @private
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    const colors = {
      light: '#0762d9',
      dark: '#1a1a1a',
    };

    metaThemeColor.content = colors[theme];
  }

  /**
   * Observa mudanças no tema do sistema
   * @private
   */
  watchSystemTheme() {
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e) => {
      // Só aplica automaticamente se não houver preferência salva
      if (!this.getSavedTheme() && this.options.autoDetect) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    };

    // API moderna
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback para navegadores antigos
      mediaQuery.addListener(handler);
    }
  }

  /**
   * Adiciona listener para mudanças de tema
   * @param {Function} callback - Callback(newTheme, oldTheme)
   * @returns {Function} Função para remover listener
   * @public
   */
  onChange(callback) {
    if (typeof callback !== 'function') {
      console.error('onChange callback must be a function');
      return () => {};
    }

    this.listeners.push(callback);

    // Retorna função para remover listener
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifica todos os listeners
   * @param {string} newTheme
   * @param {string} oldTheme
   * @private
   */
  notifyListeners(newTheme, oldTheme) {
    this.listeners.forEach((callback) => {
      try {
        callback(newTheme, oldTheme);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  }

  /**
   * Limpa todas as preferências
   * @public
   */
  reset() {
    try {
      localStorage.removeItem(this.options.storageKey);
    } catch (error) {
      console.warn('Failed to clear theme preference:', error);
    }
    this.setTheme(this.options.defaultTheme, false);
  }
}

/**
 * Instância singleton do ThemeManager
 */
let themeManagerInstance = null;

/**
 * Hook para usar gerenciador de tema
 * @param {Object} options - Opções de configuração
 * @returns {ThemeManager}
 */
export function useTheme(options = {}) {
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager(options);
  }
  return themeManagerInstance;
}

/**
 * Cria botão de toggle de tema
 * @param {string} selector - Seletor CSS do container
 * @param {ThemeManager} themeManager - Instância do ThemeManager
 * @returns {HTMLButtonElement}
 */
export function createThemeToggle(selector, themeManager) {
  const container = document.querySelector(selector);
  
  if (!container) {
    console.error(`Container not found: ${selector}`);
    return null;
  }

  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', 'Alternar tema');
  button.setAttribute('title', 'Alternar entre modo claro e escuro');

  const updateButton = () => {
    const isDark = themeManager.isDark();
    button.innerHTML = isDark ? '🌞' : '🌜';
    button.setAttribute('aria-pressed', String(isDark));
  };

  updateButton();

  button.addEventListener('click', () => {
    themeManager.toggle();
    updateButton();
  });

  // Listener para mudanças externas
  themeManager.onChange(() => {
    updateButton();
  });

  container.appendChild(button);
  return button;
}
