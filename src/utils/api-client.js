/**
 * API Client - Integração do Frontend com Backend
 * @description Conecta o site público com a API para carregar conteúdo dinâmico
 */

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const API_BASE_URL = window.location.hostname === 'localhost' && window.location.port === '5173'
  ? 'http://localhost:3001/api'
  : '/api';

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Fazer requisição HTTP
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Mostrar loading
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    `;
  }
}

/**
 * Mostrar erro
 */
function showError(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <span>${message}</span>
      </div>
    `;
  }
}

// ============================================================================
// CARREGAR CONTEÚDO DO HOME
// ============================================================================

/**
 * Carregar e renderizar conteúdo dinâmico da página inicial
 */
async function loadHomeContent() {
  try {
    const response = await apiRequest('/home');
    const homeData = response.data;

    // Atualizar Hero Section
    updateHeroSection(homeData.hero);

    // Atualizar Contato
    updateContactInfo(homeData.contact);

    // Atualizar Estatísticas
    if (homeData.stats && homeData.stats.length > 0) {
      updateStats(homeData.stats);
    }

    // Atualizar SEO
    updateSEO(homeData.seo);

    console.log('✅ Conteúdo carregado da API com sucesso');
  } catch (error) {
    console.warn('⚠️ Erro ao carregar conteúdo da API, usando conteúdo estático:', error);
    // Manter conteúdo estático do HTML em caso de erro
  }
}

/**
 * Atualizar seção Hero
 */
function updateHeroSection(hero) {
  if (!hero) return;

  // Título principal
  const titleElement = document.querySelector('.hero-title, h1');
  if (titleElement && hero.title) {
    titleElement.textContent = hero.title;
  }

  // Subtítulo
  const subtitleElement = document.querySelector('.hero-subtitle');
  if (subtitleElement && hero.subtitle) {
    subtitleElement.textContent = hero.subtitle;
  }

  // Imagem de fundo
  const heroSection = document.querySelector('.hero-section, section:first-of-type');
  if (heroSection && hero.backgroundImage) {
    heroSection.style.backgroundImage = `url('${hero.backgroundImage}')`;
  }
}

/**
 * Atualizar informações de contato
 */
function updateContactInfo(contact) {
  if (!contact) return;

  // Email
  const emailElements = document.querySelectorAll('[data-contact="email"], .contact-email');
  emailElements.forEach(el => {
    if (contact.email) {
      el.textContent = contact.email;
      if (el.tagName === 'A') {
        el.href = `mailto:${contact.email}`;
      }
    }
  });

  // Telefone
  const phoneElements = document.querySelectorAll('[data-contact="phone"], .contact-phone');
  phoneElements.forEach(el => {
    if (contact.phone) {
      el.textContent = contact.phone;
      if (el.tagName === 'A') {
        el.href = `tel:${contact.phone.replace(/\D/g, '')}`;
      }
    }
  });

  // WhatsApp
  const whatsappElements = document.querySelectorAll('[data-contact="whatsapp"], .contact-whatsapp');
  whatsappElements.forEach(el => {
    if (contact.whatsapp) {
      el.textContent = contact.whatsapp;
      if (el.tagName === 'A') {
        el.href = `https://wa.me/55${contact.whatsapp.replace(/\D/g, '')}`;
      }
    }
  });

  // Endereço
  const addressElements = document.querySelectorAll('[data-contact="address"], .contact-address');
  addressElements.forEach(el => {
    if (contact.address) {
      el.textContent = contact.address;
    }
  });
}

/**
 * Atualizar estatísticas
 */
function updateStats(stats) {
  const statsContainer = document.getElementById('statsContainer');
  if (!statsContainer) return;

  statsContainer.innerHTML = stats.map(stat => `
    <div class="stat-card bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition">
      <div class="text-4xl mb-2">${stat.icon || '📊'}</div>
      <div class="text-3xl font-bold text-blue-600 mb-2">${stat.number}</div>
      <div class="text-gray-600">${stat.label}</div>
    </div>
  `).join('');
}

/**
 * Atualizar meta tags SEO
 */
function updateSEO(seo) {
  if (!seo) return;

  // Meta Title
  if (seo.metaTitle) {
    document.title = seo.metaTitle;
    updateMetaTag('og:title', seo.metaTitle);
    updateMetaTag('twitter:title', seo.metaTitle);
  }

  // Meta Description
  if (seo.metaDescription) {
    updateMetaTag('description', seo.metaDescription);
    updateMetaTag('og:description', seo.metaDescription);
    updateMetaTag('twitter:description', seo.metaDescription);
  }

  // Meta Keywords
  if (seo.metaKeywords && seo.metaKeywords.length > 0) {
    updateMetaTag('keywords', seo.metaKeywords.join(', '));
  }

  // OG Image
  if (seo.ogImage) {
    updateMetaTag('og:image', seo.ogImage);
    updateMetaTag('twitter:image', seo.ogImage);
  }
}

/**
 * Atualizar meta tag específica
 */
function updateMetaTag(name, content) {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

// ============================================================================
// CARREGAR RECEITAS
// ============================================================================

/**
 * Carregar e exibir receitas na página de receitas
 */
async function loadReceitas(page = 1, filters = {}) {
  const containerId = 'receitasContainer';
  showLoading(containerId);

  try {
    const params = new URLSearchParams({
      page,
      limit: 10,
      ...filters,
    });

    const response = await apiRequest(`/receitas?${params}`);
    const { data: receitas, pagination } = response;

    renderReceitas(receitas, pagination);
  } catch (error) {
    showError(containerId, 'Erro ao carregar receitas. Tente novamente mais tarde.');
  }
}

/**
 * Renderizar lista de receitas
 */
function renderReceitas(receitas, pagination) {
  const container = document.getElementById('receitasContainer');
  if (!container) return;

  if (receitas.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">Nenhuma receita encontrada</p>
      </div>
    `;
    return;
  }

  const html = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${receitas.map(receita => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-800">${receita.titulo}</h3>
              ${receita.destaque ? '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Destaque</span>' : ''}
            </div>
            
            <p class="text-gray-600 mb-4 line-clamp-2">${receita.descricao}</p>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-bold text-green-600">${formatCurrency(receita.valor)}</span>
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${receita.categoria}</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-500">
              <i class="fas fa-calendar mr-2"></i>
              ${formatDate(receita.dataReceita)}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    ${renderPagination(pagination)}
  `;

  container.innerHTML = html;
}

/**
 * Renderizar paginação
 */
function renderPagination(pagination) {
  if (!pagination || pagination.pages <= 1) return '';

  const { page, pages } = pagination;
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = Math.min(pages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const buttons = [];
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(`
      <button 
        onclick="loadReceitas(${i})"
        class="px-4 py-2 rounded-lg ${i === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}"
      >
        ${i}
      </button>
    `);
  }

  return `
    <div class="flex justify-center items-center space-x-2 mt-8">
      ${page > 1 ? `
        <button onclick="loadReceitas(${page - 1})" class="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100">
          <i class="fas fa-chevron-left"></i>
        </button>
      ` : ''}
      
      ${buttons.join('')}
      
      ${page < pages ? `
        <button onclick="loadReceitas(${page + 1})" class="px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100">
          <i class="fas fa-chevron-right"></i>
        </button>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// ESTATÍSTICAS
// ============================================================================

/**
 * Carregar e exibir estatísticas financeiras
 */
async function loadEstatisticas() {
  try {
    const ano = new Date().getFullYear();
    const response = await apiRequest(`/receitas/stats/all?ano=${ano}`);
    const { geral, porCategoria, porMes } = response.data;

    // Renderizar estatísticas gerais
    renderEstatisticasGerais(geral);

    // Renderizar gráficos (se tiver biblioteca de gráficos)
    if (window.Chart) {
      renderCharts(porCategoria, porMes);
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

/**
 * Renderizar estatísticas gerais
 */
function renderEstatisticasGerais(stats) {
  const container = document.getElementById('statsGeneralContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80 mb-2">Total Arrecadado</div>
        <div class="text-3xl font-bold">${formatCurrency(stats.totalGeral)}</div>
      </div>
      
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80 mb-2">Total de Receitas</div>
        <div class="text-3xl font-bold">${stats.totalReceitas}</div>
      </div>
      
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80 mb-2">Média por Receita</div>
        <div class="text-3xl font-bold">${formatCurrency(stats.mediaReceita)}</div>
      </div>
      
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div class="text-sm opacity-80 mb-2">Maior Receita</div>
        <div class="text-3xl font-bold">${formatCurrency(stats.maiorReceita)}</div>
      </div>
    </div>
  `;
}

// ============================================================================
// FORMATADORES
// ============================================================================

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

/**
 * Inicializar quando DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar qual página está ativa
  const currentPage = window.location.pathname;

  if (currentPage === '/' || currentPage === '/index.html') {
    // Página inicial - carregar conteúdo dinâmico
    loadHomeContent();
  } else if (currentPage.includes('receita')) {
    // Página de receitas - carregar lista
    loadReceitas();
  }

  console.log('🚀 API Client inicializado');
});

// Expor funções globalmente
window.loadReceitas = loadReceitas;
window.loadEstatisticas = loadEstatisticas;
