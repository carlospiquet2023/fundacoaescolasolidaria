/* eslint-disable no-console, no-undef, no-unused-vars, curly */
/**
 * Dashboard do Aluno - JavaScript
 * Gerencia todas as funcionalidades do painel do aluno
 */

// ============================================================================
// VARIÁVEIS GLOBAIS
// ============================================================================

let dadosAluno = null;
// apiAuth já está disponível globalmente de api-auth.js (carregado antes deste script)

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!apiAuth.isAuthenticated()) {
        window.location.href = 'aluno-login.html';
        return;
    }
    
    // Verificar se é aluno (não admin)
    const usuario = apiAuth.getUsuarioLocal();
    if (usuario && usuario.role === 'admin') {
        window.location.href = '../../admin/gestao-alunos.html';
        return;
    }
    
    // Carregar dados do aluno
    await carregarDadosAluno();
    
    // Esconder loading
    document.getElementById('loadingScreen').style.display = 'none';
});

// ============================================================================
// CARREGAR DADOS
// ============================================================================

/**
 * Carregar dados completos do aluno
 */
async function carregarDadosAluno() {
    try {
        const resultado = await apiAuth.obterUsuarioLogado();
        
        if (resultado.sucesso) {
            dadosAluno = resultado.usuario;
            renderizarDadosAluno();
            atualizarProgresso();
            verificarPrimeiroAcesso();
        } else {
            mostrarToast('Erro ao carregar dados do aluno', 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarToast('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Renderizar dados do aluno na interface
 */
function renderizarDadosAluno() {
    if (!dadosAluno) return;
    
    // Header
    document.getElementById('nomeAluno').textContent = dadosAluno.nomeCompleto || 'Aluno';
    document.getElementById('numeroMatricula').textContent = dadosAluno.numeroMatricula || 'Aguardando';
    
    // Status
    const status = dadosAluno.status || 'Pré-Matrícula';
    const statusBadge = document.getElementById('statusMatricula');
    statusBadge.textContent = status;
    
    if (status === 'Matriculado') {
        statusBadge.className = 'status-badge status-ativo';
    } else if (status === 'Pré-Matrícula') {
        statusBadge.className = 'status-badge status-pendente';
    } else {
        statusBadge.className = 'status-badge status-inativo';
    }
    
    // Ativo/Inativo
    const ativo = dadosAluno.ativo !== false;
    document.getElementById('statusAtivo').innerHTML = ativo 
        ? '<i class="fas fa-circle text-green-500"></i> Sim'
        : '<i class="fas fa-circle text-red-500"></i> Não';
    
    // Data de cadastro
    if (dadosAluno.createdAt) {
        const data = new Date(dadosAluno.createdAt);
        document.getElementById('dataCadastro').textContent = data.toLocaleDateString('pt-BR');
    }
    
    // Dados pessoais
    document.getElementById('cpfAluno').textContent = dadosAluno.cpf || 'Não informado';
    
    if (dadosAluno.dataNascimento) {
        const dataNasc = new Date(dadosAluno.dataNascimento);
        document.getElementById('dataNascimento').textContent = dataNasc.toLocaleDateString('pt-BR');
    } else {
        document.getElementById('dataNascimento').textContent = 'Não informado';
    }
    
    document.getElementById('emailAluno').textContent = dadosAluno.email || 'Não informado';
}

/**
 * Atualizar barra de progresso
 */
function atualizarProgresso() {
    if (!dadosAluno) return;
    
    let etapasCompletas = 0;
    const totalEtapas = 3;
    
    // Etapa 1: Ficha preenchida
    const fichaCompleta = dadosAluno.fichaPreenchida === true;
    if (fichaCompleta) {
        etapasCompletas++;
        atualizarCardEtapa('Ficha', 'completed', true);
    } else {
        atualizarCardEtapa('Ficha', 'pending', true);
    }
    
    // Etapa 2: Documentos enviados
    const docsEnviados = dadosAluno.documentosEnviados === true;
    if (docsEnviados) {
        etapasCompletas++;
        atualizarCardEtapa('Documentos', 'completed', true);
    } else if (fichaCompleta) {
        atualizarCardEtapa('Documentos', 'pending', true);
    } else {
        atualizarCardEtapa('Documentos', 'blocked', false);
    }
    
    // Etapa 3: Carteirinha emitida
    const carteirinhaEmitida = dadosAluno.carteirinhaEmitida === true;
    if (carteirinhaEmitida) {
        etapasCompletas++;
        atualizarCardEtapa('Carteirinha', 'completed', true);
    } else if (docsEnviados) {
        atualizarCardEtapa('Carteirinha', 'pending', false);
        document.getElementById('btnCarteirinha').innerHTML = '<i class="fas fa-hourglass-half mr-2"></i>Aguardando Aprovação';
    } else {
        atualizarCardEtapa('Carteirinha', 'blocked', false);
    }
    
    // Calcular porcentagem
    const porcentagem = Math.round((etapasCompletas / totalEtapas) * 100);
    
    // Atualizar círculo de progresso
    const progressCircle = document.getElementById('progressCircle');
    progressCircle.style.setProperty('--progress', `${porcentagem}%`);
    document.getElementById('progressPercent').textContent = `${porcentagem}%`;
    
    // Atualizar texto de progresso
    const progressText = document.getElementById('progressText');
    if (porcentagem === 0) {
        progressText.textContent = 'Comece preenchendo a ficha!';
    } else if (porcentagem === 33) {
        progressText.textContent = 'Agora envie seus documentos';
    } else if (porcentagem === 66) {
        progressText.textContent = 'Aguardando aprovação...';
    } else if (porcentagem === 100) {
        progressText.textContent = 'Cadastro completo! 🎉';
    }
}

/**
 * Atualizar visual dos cards de etapas
 */
function atualizarCardEtapa(etapa, status, habilitado) {
    const iconId = `icon${etapa}`;
    const btnId = `btn${etapa}`;
    const icon = document.getElementById(iconId);
    const btn = document.getElementById(btnId);
    
    if (!icon || !btn) return;
    
    // Remover classes antigas
    icon.classList.remove('step-completed', 'step-pending', 'step-blocked');
    
    // Adicionar nova classe
    if (status === 'completed') {
        icon.classList.add('step-completed');
        icon.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.remove('bg-gray-400', 'bg-purple-600', 'bg-green-600');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        btn.classList.remove('cursor-not-allowed');
        btn.disabled = false;
        
        if (etapa === 'Ficha') {
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Ficha Preenchida';
        } else if (etapa === 'Documentos') {
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Documentos Enviados';
        } else if (etapa === 'Carteirinha') {
            btn.innerHTML = '<i class="fas fa-download mr-2"></i>Baixar Carteirinha';
        }
    } else if (status === 'pending') {
        icon.classList.add('step-pending');
        btn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        btn.classList.add('bg-purple-600', 'hover:bg-purple-700');
        btn.disabled = !habilitado;
        
        if (!habilitado) {
            btn.classList.add('bg-gray-400', 'cursor-not-allowed');
            btn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
        }
    } else {
        icon.classList.add('step-blocked');
        btn.classList.add('bg-gray-400', 'cursor-not-allowed');
        btn.disabled = true;
    }
}

/**
 * Verificar se é primeiro acesso
 */
function verificarPrimeiroAcesso() {
    if (dadosAluno && dadosAluno.primeiroAcesso === true) {
        document.getElementById('avisosPrimeiroAcesso').style.display = 'block';
    }
}

// ============================================================================
// NAVEGAÇÃO
// ============================================================================

/**
 * Ir para página de ficha
 */
function irParaFicha() {
    if (!dadosAluno) return;
    
    if (dadosAluno.fichaPreenchida) {
        if (confirm('Você já preencheu a ficha. Deseja visualizá-la?')) {
            window.location.href = 'ficha.html';
        }
    } else {
        window.location.href = 'ficha.html';
    }
}

/**
 * Ir para página de documentos
 */
function irParaDocumentos() {
    if (!dadosAluno) return;
    
    if (!dadosAluno.fichaPreenchida) {
        mostrarToast('Complete a ficha de pré-matrícula primeiro!', 'error');
        return;
    }
    
    window.location.href = 'doc.html';
}

/**
 * Ver carteirinha
 */
function verCarteirinha() {
    if (!dadosAluno) return;
    
    if (!dadosAluno.carteirinhaEmitida) {
        mostrarToast('Sua carteirinha ainda não foi emitida', 'info');
        return;
    }
    
    window.location.href = 'carteirinha.html';
}

// ============================================================================
// AÇÕES
// ============================================================================

/**
 * Trocar senha
 */
async function trocarSenha() {
    const senhaAtual = prompt('Digite sua senha atual:');
    if (!senhaAtual) return;
    
    const novaSenha = prompt('Digite a nova senha (mínimo 6 caracteres):');
    if (!novaSenha) return;
    
    if (novaSenha.length < 6) {
        mostrarToast('A senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    const confirmarSenha = prompt('Confirme a nova senha:');
    if (novaSenha !== confirmarSenha) {
        mostrarToast('As senhas não coincidem', 'error');
        return;
    }
    
    try {
        const resultado = await apiAuth.trocarSenha(senhaAtual, novaSenha);
        
        if (resultado.sucesso) {
            mostrarToast('Senha alterada com sucesso!', 'success');
        } else {
            mostrarToast(resultado.mensagem || 'Erro ao trocar senha', 'error');
        }
    } catch (error) {
        console.error('Erro ao trocar senha:', error);
        mostrarToast('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Editar perfil
 */
function editarPerfil() {
    mostrarToast('Funcionalidade em desenvolvimento...', 'info');
}

/**
 * Ver histórico
 */
function verHistorico() {
    mostrarToast('Funcionalidade em desenvolvimento...', 'info');
}

/**
 * Fazer logout
 */
async function fazerLogout() {
    const confirmar = confirm('Tem certeza que deseja sair?');
    
    if (confirmar) {
        await apiAuth.logout();
        window.location.href = 'aluno-login.html';
    }
}

// ============================================================================
// UTILIDADES
// ============================================================================

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
