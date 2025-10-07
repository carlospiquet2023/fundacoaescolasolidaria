/**
 * Painel Admin - Gestão de Alunos
 * JavaScript para gerenciar todas as funcionalidades do painel
 */

// Importar módulo de autenticação
import * as apiAuth from '../src/utils/api-auth.js';

// ============================================================================
// ESTADO GLOBAL
// ============================================================================

let paginaAtual = 1;
const limite = 10;
let totalPaginas = 1;

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!apiAuth.isAuthenticated()) {
        window.location.href = '../src/pages/admin-login.html';
        return;
    }
    
    // Verificar se é admin
    if (!apiAuth.isAdmin()) {
        mostrarToast('Acesso negado! Apenas administradores podem acessar.', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        return;
    }
    
    // Carregar dados iniciais
    await carregarDadosDashboard();
    await carregarAlunos();
    
    // Atualizar nome do admin
    const usuario = apiAuth.getUsuarioLocal();
    if (usuario) {
        document.getElementById('adminName').textContent = usuario.nome || 'Administrador';
    }
    
    // Atualizar data atual
    atualizarDataAtual();
    
    // Event listeners para busca
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            buscarAlunos();
        }
    });
});

// ============================================================================
// NAVEGAÇÃO E UI
// ============================================================================

/**
 * Mostrar seção específica
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
function showSection(sectionName, event) {
    // Esconder todas as seções
    document.querySelectorAll('[id^="section-"]').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar seção selecionada
    document.getElementById(`section-${sectionName}`).classList.remove('hidden');
    
    // Atualizar sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (event) {
        event.target.closest('.sidebar-link').classList.add('active');
    }
    
    // Atualizar título
    const titulos = {
        dashboard: { titulo: 'Dashboard', subtitulo: 'Visão geral do sistema' },
        alunos: { titulo: 'Gestão de Alunos', subtitulo: 'Gerenciar alunos cadastrados' },
        fichas: { titulo: 'Fichas de Pré-Matrícula', subtitulo: 'Visualizar e aprovar fichas' },
        documentos: { titulo: 'Documentos', subtitulo: 'Gerenciar documentos enviados' },
        carteirinhas: { titulo: 'Carteirinhas', subtitulo: 'Gerar e exportar carteirinhas' }
    };
    
    if (titulos[sectionName]) {
        document.getElementById('pageTitle').textContent = titulos[sectionName].titulo;
        document.getElementById('pageSubtitle').textContent = titulos[sectionName].subtitulo;
    }
    
    // Carregar dados da seção
    if (sectionName === 'alunos') {
        carregarAlunos();
    }
}

/**
 * Atualizar data atual
 */
function atualizarDataAtual() {
    const agora = new Date();
    const opcoes = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dataFormatada = agora.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('currentDate').textContent = dataFormatada;
}

/**
 * Mostrar toast notification
 */
function mostrarToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${mensagem}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ============================================================================
// DASHBOARD
// ============================================================================

/**
 * Carregar dados do dashboard
 */
async function carregarDadosDashboard() {
    try {
        const resultado = await apiAuth.obterEstatisticas();
        
        if (resultado.sucesso) {
            const stats = resultado.estatisticas;
            
            document.getElementById('stat-total').textContent = stats.total || 0;
            document.getElementById('stat-ativos').textContent = stats.ativos || 0;
            document.getElementById('stat-fichas').textContent = stats.progresso?.fichasPreenchidas || 0;
            document.getElementById('stat-carteirinhas').textContent = stats.progresso?.carteirinhasEmitidas || 0;
        }
    } catch (error) {
        // Erro ao carregar estatísticas - tratamento silencioso
        if (error instanceof Error) {
            mostrarToast('Erro ao carregar estatísticas', 'error');
        }
    }
}

// ============================================================================
// GESTÃO DE ALUNOS
// ============================================================================

/**
 * Carregar lista de alunos
 */
async function carregarAlunos() {
    const tbody = document.getElementById('alunosTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="px-6 py-12 text-center">
                <div class="loading mx-auto"></div>
                <p class="text-gray-500 mt-4">Carregando alunos...</p>
            </td>
        </tr>
    `;
    
    try {
        const busca = document.getElementById('searchInput')?.value || '';
        const status = document.getElementById('filterStatus')?.value || '';
        
        const resultado = await apiAuth.listarAlunos(paginaAtual, limite, busca, status);
        
        if (resultado.sucesso) {
            totalPaginas = resultado.paginacao.totalPaginas;
            
            renderizarTabelaAlunos(resultado.dados);
            atualizarPaginacao();
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-red-500">
                        <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                        <p>${resultado.mensagem || 'Erro ao carregar alunos'}</p>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        // Erro ao carregar alunos - mostra mensagem na tabela
        if (error instanceof Error) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-red-500">
                        <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                        <p>Erro ao conectar com o servidor</p>
                    </td>
                </tr>
            `;
        }
    }
}

/**
 * Renderizar tabela de alunos
 */
function renderizarTabelaAlunos(alunos) {
    const tbody = document.getElementById('alunosTableBody');
    
    if (alunos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-users text-5xl mb-4 opacity-30"></i>
                    <p>Nenhum aluno encontrado</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = alunos.map(aluno => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ${aluno.numeroMatricula || 'Sem matrícula'}
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold mr-3">
                        ${aluno.nomeCompleto.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${aluno.nomeCompleto}</div>
                        <div class="text-sm text-gray-500">${aluno.email || 'Sem email'}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
                ${aluno.cpf}
            </td>
            <td class="px-6 py-4">
                <span class="badge ${getBadgeClass(aluno.status)}">
                    ${aluno.status}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                    <button onclick="verDetalhesAluno('${aluno._id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition" title="Ver Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editarAluno('${aluno._id}')" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="resetarSenhaAluno('${aluno._id}', '${aluno.nomeCompleto}')" class="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition" title="Resetar Senha">
                        <i class="fas fa-key"></i>
                    </button>
                    <button onclick="desativarAluno('${aluno._id}', '${aluno.nomeCompleto}', ${aluno.ativo})" class="px-3 py-1 ${aluno.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition" title="${aluno.ativo ? 'Desativar' : 'Reativar'}">
                        <i class="fas fa-${aluno.ativo ? 'ban' : 'check'}"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Obter classe do badge baseado no status
 */
function getBadgeClass(status) {
    const classes = {
        'Matriculado': 'badge-success',
        'Pré-Matrícula': 'badge-warning',
        'Inativo': 'badge-danger',
        'Cancelado': 'badge-danger'
    };
    return classes[status] || 'badge-info';
}

/**
 * Buscar alunos
 */
function buscarAlunos() {
    paginaAtual = 1;
    carregarAlunos();
}

/**
 * Paginação
 */
function atualizarPaginacao() {
    document.getElementById('paginaAtual').textContent = paginaAtual;
    document.getElementById('totalPaginas').textContent = totalPaginas;
    
    document.getElementById('btnPaginaAnterior').disabled = paginaAtual === 1;
    document.getElementById('btnProximaPagina').disabled = paginaAtual === totalPaginas;
}

// Função chamada via onclick no HTML
// eslint-disable-next-line no-unused-vars
function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarAlunos();
    }
}

// Função chamada via onclick no HTML
// eslint-disable-next-line no-unused-vars
function proximaPagina() {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarAlunos();
    }
}

// ============================================================================
// MODAIS
// ============================================================================

/**
 * Abrir modal novo aluno
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
function abrirModalNovoAluno() {
    document.getElementById('modalNovoAluno').classList.add('active');
    document.getElementById('formNovoAluno').reset();
}

/**
 * Fechar modal
 */
function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

/**
 * Cadastrar novo aluno
 * Função chamada via onsubmit no HTML
 */
// eslint-disable-next-line no-unused-vars
async function cadastrarAluno(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const dados = {
        usuario: formData.get('usuario'),
        senha: formData.get('senha'),
        nomeCompleto: formData.get('nomeCompleto'),
        cpf: formData.get('cpf'),
        dataNascimento: formData.get('dataNascimento'),
        sexo: formData.get('sexo'),
        email: formData.get('email') || undefined,
        telefone: formData.get('telefone') || undefined
    };
    
    try {
        const resultado = await apiAuth.registrarAluno(dados);
        
        if (resultado.sucesso) {
            mostrarToast('Aluno cadastrado com sucesso!', 'success');
            fecharModal('modalNovoAluno');
            await carregarAlunos();
            await carregarDadosDashboard();
        } else {
            mostrarToast(resultado.mensagem || 'Erro ao cadastrar aluno', 'error');
        }
    } catch (error) {
        // Erro ao cadastrar aluno
        if (error instanceof Error) {
            mostrarToast('Erro ao conectar com o servidor', 'error');
        }
    }
}

// ============================================================================
// AÇÕES DOS ALUNOS
// ============================================================================

/**
 * Ver detalhes do aluno
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
async function verDetalhesAluno(id) {
    try {
        const resultado = await apiAuth.obterAluno(id);
        
        if (resultado.sucesso) {
            const aluno = resultado.aluno;
            alert(`
DETALHES DO ALUNO

Nome: ${aluno.nomeCompleto}
CPF: ${aluno.cpf}
Matrícula: ${aluno.numeroMatricula || 'Sem matrícula'}
Status: ${aluno.status}
Email: ${aluno.email || 'Não informado'}
Telefone: ${aluno.telefone || 'Não informado'}
Data de Nascimento: ${new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
Ficha Preenchida: ${aluno.fichaPreenchida ? 'Sim' : 'Não'}
Documentos Enviados: ${aluno.documentosEnviados ? 'Sim' : 'Não'}
            `);
        }
    } catch (error) {
        // Erro ao obter detalhes do aluno
        mostrarToast('Erro ao carregar detalhes do aluno', 'error');
    }
}

/**
 * Editar aluno
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
function editarAluno(_id) {
    mostrarToast('Funcionalidade de edição em desenvolvimento...', 'info');
}

/**
 * Resetar senha do aluno
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
async function resetarSenhaAluno(id, nome) {
    const novaSenha = prompt(`Resetar senha de ${nome}\n\nDigite a nova senha (mínimo 6 caracteres):`);
    
    if (!novaSenha) {
        return;
    }
    
    if (novaSenha.length < 6) {
        mostrarToast('Senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    try {
        const resultado = await apiAuth.resetarSenhaAluno(id, novaSenha);
        
        if (resultado.sucesso) {
            mostrarToast('Senha resetada com sucesso!', 'success');
        } else {
            mostrarToast(resultado.mensagem || 'Erro ao resetar senha', 'error');
        }
    } catch (error) {
        // Erro ao resetar senha
        mostrarToast('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Desativar/Reativar aluno
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
async function desativarAluno(id, nome, ativo) {
    const acao = ativo ? 'desativar' : 'reativar';
    const confirmar = confirm(`Tem certeza que deseja ${acao} o aluno ${nome}?`);
    
    if (!confirmar) {
        return;
    }
    
    try {
        const resultado = ativo 
            ? await apiAuth.desativarAluno(id)
            : await apiAuth.reativarAluno(id);
        
        if (resultado.sucesso) {
            mostrarToast(resultado.mensagem || `Aluno ${acao === 'desativar' ? 'desativado' : 'reativado'} com sucesso!`, 'success');
            await carregarAlunos();
            await carregarDadosDashboard();
        } else {
            mostrarToast(resultado.mensagem || `Erro ao ${acao} aluno`, 'error');
        }
    } catch (error) {
        // Erro ao desativar/reativar aluno
        mostrarToast('Erro ao conectar com o servidor', 'error');
    }
}

// ============================================================================
// OUTRAS FUNCIONALIDADES
// ============================================================================

/**
 * Exportar relatório
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
function exportarRelatorio() {
    mostrarToast('Funcionalidade de exportação em desenvolvimento...', 'info');
}

/**
 * Fazer logout
 * Função chamada via onclick no HTML
 */
// eslint-disable-next-line no-unused-vars
async function fazerLogout() {
    const confirmar = confirm('Tem certeza que deseja sair?');
    
    if (confirmar) {
        await apiAuth.logout();
        window.location.href = '../src/pages/admin-login.html';
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
