/**
 * Admin Panel JavaScript
 * @description Lógica completa do painel administrativo
 */

// ============================================================================
// CONFIGURAÇÃO E CONSTANTES
// ============================================================================

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : '/api';

let authToken = localStorage.getItem('adminToken');
let currentUser = null;

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Fazer requisição HTTP autenticada
 */
async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
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
 * Mostrar toast notification
 */
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-xl"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Mostrar/esconder loading overlay
 */
function toggleLoading(show = true) {
  const overlay = document.getElementById('loadingOverlay');
  if (show) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  } else {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }
}

/**
 * Formatar data
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formatar moeda
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

/**
 * Fazer login
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  const errorMessage = document.getElementById('loginErrorMessage');

  toggleLoading(true);
  errorDiv.classList.add('hidden');

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    authToken = data.data.token;
    currentUser = data.data.user;
    localStorage.setItem('adminToken', authToken);
    localStorage.setItem('adminUser', JSON.stringify(currentUser));

    showToast('Login realizado com sucesso!', 'success');
    showDashboard();
  } catch (error) {
    errorMessage.textContent = error.message || 'Erro ao fazer login';
    errorDiv.classList.remove('hidden');
  } finally {
    toggleLoading(false);
  }
}

/**
 * Fazer logout
 */
function handleLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  authToken = null;
  currentUser = null;
  
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  
  showToast('Logout realizado com sucesso', 'info');
}

/**
 * Verificar autenticação ao carregar
 */
async function checkAuth() {
  if (authToken) {
    try {
      const data = await apiRequest('/auth/me');
      currentUser = data.data.user;
      showDashboard();
    } catch (error) {
      handleLogout();
    }
  }
}

// ============================================================================
// NAVEGAÇÃO
// ============================================================================

/**
 * Mostrar dashboard
 */
function showDashboard() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  // Atualizar info do usuário
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
  }

  // Carregar página inicial
  loadPage('dashboard');
}

/**
 * Carregar página do dashboard
 */
async function loadPage(pageName) {
  const content = document.getElementById('dashboardContent');
  toggleLoading(true);

  try {
    switch (pageName) {
      case 'dashboard':
        await loadDashboardHome();
        break;
      case 'home':
        await loadHomeEditor();
        break;
      case 'receitas':
        await loadReceitasManager();
        break;
      case 'galeria':
        await loadGaleriaManager();
        break;
      case 'stats':
        await loadStatistics();
        break;
      default:
        content.innerHTML = '<p>Página não encontrada</p>';
    }

    // Atualizar links ativos
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageName) {
        link.classList.add('active');
      }
    });
  } catch (error) {
    showToast('Erro ao carregar página: ' + error.message, 'error');
    content.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-red-700 font-semibold">Erro ao carregar conteúdo</p>
        <p class="text-red-600 text-sm mt-2">${error.message}</p>
      </div>
    `;
  } finally {
    toggleLoading(false);
  }
}

// ============================================================================
// DASHBOARD HOME
// ============================================================================

async function loadDashboardHome() {
  const content = document.getElementById('dashboardContent');

  try {
    // Buscar estatísticas
    const statsData = await apiRequest('/receitas/stats/all?ano=' + new Date().getFullYear());
    const stats = statsData.data.geral;

    content.innerHTML = `
      <div class="space-y-8">
        <!-- Header -->
        <div>
          <h2 class="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo, ${currentUser.name}! 👋
          </h2>
          <p class="text-gray-600">Aqui está um resumo do seu sistema</p>
        </div>

        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm mb-1">Total Arrecadado</p>
                <h3 class="text-3xl font-bold">${formatCurrency(stats.totalGeral || 0)}</h3>
              </div>
              <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                <i class="fas fa-dollar-sign text-3xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm mb-1">Total de Receitas</p>
                <h3 class="text-3xl font-bold">${stats.totalReceitas || 0}</h3>
              </div>
              <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                <i class="fas fa-receipt text-3xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm mb-1">Média por Receita</p>
                <h3 class="text-3xl font-bold">${formatCurrency(stats.mediaReceita || 0)}</h3>
              </div>
              <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                <i class="fas fa-chart-line text-3xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm mb-1">Maior Receita</p>
                <h3 class="text-3xl font-bold">${formatCurrency(stats.maiorReceita || 0)}</h3>
              </div>
              <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                <i class="fas fa-trophy text-3xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">
            <i class="fas fa-bolt text-yellow-500 mr-2"></i>
            Ações Rápidas
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onclick="loadPage('home')" class="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition text-left">
              <i class="fas fa-edit text-2xl mb-2"></i>
              <p class="font-semibold">Editar Home</p>
              <p class="text-sm text-blue-600">Modificar conteúdo da página inicial</p>
            </button>

            <button onclick="loadPage('receitas')" class="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition text-left">
              <i class="fas fa-plus text-2xl mb-2"></i>
              <p class="font-semibold">Nova Receita</p>
              <p class="text-sm text-green-600">Adicionar nova entrada financeira</p>
            </button>

            <button onclick="loadPage('galeria')" class="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition text-left">
              <i class="fas fa-images text-2xl mb-2"></i>
              <p class="font-semibold">Gerenciar Galeria</p>
              <p class="text-sm text-purple-600">Upload e organização de imagens</p>
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    throw error;
  }
}

// ============================================================================
// HOME EDITOR
// ============================================================================

async function loadHomeEditor() {
  const content = document.getElementById('dashboardContent');

  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">Editor da Página Inicial</h2>
          <p class="text-gray-600 mt-1">Personalize o conteúdo do seu site</p>
        </div>
        <button onclick="saveHomeContent()" class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          <i class="fas fa-save mr-2"></i>Salvar Alterações
        </button>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p class="text-yellow-700">
          <i class="fas fa-info-circle mr-2"></i>
          <strong>Dica:</strong> Esta funcionalidade carregará o conteúdo atual da API e permitirá edição completa.
        </p>
      </div>

      <div id="homeEditorContent" class="bg-white rounded-xl shadow-md p-6">
        <p class="text-gray-500 text-center">Carregando editor...</p>
      </div>
    </div>
  `;

  // Carregar conteúdo da API
  try {
    const data = await apiRequest('/home/admin');
    renderHomeEditor(data.data);
  } catch (error) {
    showToast('Erro ao carregar conteúdo do home', 'error');
  }
}

function renderHomeEditor(homeData) {
  const container = document.getElementById('homeEditorContent');
  
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Hero Section -->
      <div class="border-b pb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          <i class="fas fa-star text-yellow-500 mr-2"></i>Seção Hero (Destaque)
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
            <input type="text" id="heroTitle" value="${homeData.hero?.title || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
            <input type="text" id="heroSubtitle" value="${homeData.hero?.subtitle || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo (URL)</label>
            <input type="text" id="heroImage" value="${homeData.hero?.backgroundImage || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div>
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          <i class="fas fa-phone text-green-500 mr-2"></i>Informações de Contato
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" id="contactEmail" value="${homeData.contact?.email || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input type="tel" id="contactPhone" value="${homeData.contact?.phone || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
            <input type="tel" id="contactWhatsapp" value="${homeData.contact?.whatsapp || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <input type="text" id="contactAddress" value="${homeData.contact?.address || ''}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>
  `;
}

async function saveHomeContent() {
  toggleLoading(true);

  try {
    const updatedData = {
      hero: {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        backgroundImage: document.getElementById('heroImage').value,
      },
      contact: {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        address: document.getElementById('contactAddress').value,
      },
      isPublished: true,
    };

    await apiRequest('/home', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });

    showToast('Conteúdo salvo com sucesso!', 'success');
  } catch (error) {
    showToast('Erro ao salvar: ' + error.message, 'error');
  } finally {
    toggleLoading(false);
  }
}

// ============================================================================
// RECEITAS MANAGER
// ============================================================================

async function loadReceitasManager() {
  const content = document.getElementById('dashboardContent');
  
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">Gerenciar Receitas</h2>
          <p class="text-gray-600 mt-1">Controle financeiro completo</p>
        </div>
        <button onclick="showNovaReceitaModal()" class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          <i class="fas fa-plus mr-2"></i>Nova Receita
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div id="receitasTable">
          <p class="text-center text-gray-500">Carregando receitas...</p>
        </div>
      </div>
    </div>
  `;

  loadReceitasTable();
}

async function loadReceitasTable() {
  try {
    const data = await apiRequest('/receitas/admin/all?limit=50');
    const receitas = data.data;

    const tableHTML = `
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Categoria</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valor</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${receitas.map(receita => `
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-700">${formatDate(receita.dataReceita)}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${receita.titulo}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${receita.categoria}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm font-bold text-green-600">${formatCurrency(receita.valor)}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                    receita.status === 'confirmado' ? 'bg-green-100 text-green-800' : 
                    receita.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }">
                    ${receita.status}
                  </span>
                </td>
                <td class="px-4 py-3 text-center space-x-2">
                  <button onclick="editReceita('${receita._id}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="deleteReceita('${receita._id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('receitasTable').innerHTML = tableHTML;
  } catch (error) {
    showToast('Erro ao carregar receitas', 'error');
  }
}

function showNovaReceitaModal() {
  showToast('Modal de nova receita em desenvolvimento', 'info');
}

async function deleteReceita(id) {
  if (!confirm('Tem certeza que deseja excluir esta receita?')) return;

  toggleLoading(true);
  try {
    await apiRequest(`/receitas/${id}`, { method: 'DELETE' });
    showToast('Receita excluída com sucesso!', 'success');
    loadReceitasTable();
  } catch (error) {
    showToast('Erro ao excluir receita', 'error');
  } finally {
    toggleLoading(false);
  }
}

// ============================================================================
// GALERIA MANAGER
// ============================================================================

async function loadGaleriaManager() {
  const content = document.getElementById('dashboardContent');
  
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">Gerenciar Galeria</h2>
          <p class="text-gray-600 mt-1">Upload e organização de imagens</p>
        </div>
        <button onclick="uploadImage()" class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          <i class="fas fa-upload mr-2"></i>Fazer Upload
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div id="galeriaGrid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <p class="col-span-full text-center text-gray-500">Carregando imagens...</p>
        </div>
      </div>
    </div>
  `;

  loadGaleriaImages();
}

async function loadGaleriaImages() {
  try {
    const data = await apiRequest('/upload/images');
    const images = data.data;

    const gridHTML = images.map(img => `
      <div class="relative group">
        <img src="${img.url}" alt="${img.filename}" class="w-full h-32 object-cover rounded-lg" />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button onclick="deleteImage('${img.filename}')" class="bg-red-500 text-white px-3 py-2 rounded-lg">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    document.getElementById('galeriaGrid').innerHTML = gridHTML || '<p class="col-span-full text-center text-gray-500">Nenhuma imagem encontrada</p>';
  } catch (error) {
    showToast('Erro ao carregar galeria', 'error');
  }
}

function uploadImage() {
  showToast('Função de upload em desenvolvimento', 'info');
}

async function deleteImage(filename) {
  if (!confirm('Excluir esta imagem?')) return;

  toggleLoading(true);
  try {
    await apiRequest(`/upload/images/${filename}`, { method: 'DELETE' });
    showToast('Imagem excluída!', 'success');
    loadGaleriaImages();
  } catch (error) {
    showToast('Erro ao excluir imagem', 'error');
  } finally {
    toggleLoading(false);
  }
}

// ============================================================================
// STATISTICS
// ============================================================================

async function loadStatistics() {
  const content = document.getElementById('dashboardContent');
  content.innerHTML = `
    <div class="space-y-6">
      <h2 class="text-3xl font-bold text-gray-800">Estatísticas Financeiras</h2>
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-gray-600">Gráficos e relatórios detalhados virão aqui...</p>
      </div>
    </div>
  `;
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);

  // Logout button
  document.getElementById('logoutButton').addEventListener('click', handleLogout);

  // User menu toggle
  document.getElementById('userMenuButton').addEventListener('click', () => {
    document.getElementById('userMenu').classList.toggle('hidden');
  });

  // Sidebar toggle (mobile)
  document.getElementById('toggleSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
  });

  // Sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        loadPage(page);
        // Fechar sidebar no mobile
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar').classList.remove('lg:-translate-x-full');
      }
    });
  });

  // Check auth on load
  checkAuth();
});

// Expor funções globalmente para uso inline
window.loadPage = loadPage;
window.saveHomeContent = saveHomeContent;
window.showNovaReceitaModal = showNovaReceitaModal;
window.deleteReceita = deleteReceita;
window.uploadImage = uploadImage;
window.deleteImage = deleteImage;
