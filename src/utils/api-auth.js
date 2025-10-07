/* eslint-disable no-console */
/**
 * Cliente API - Autenticação JWT
 * Gerencia chamadas autenticadas à API
 */

class APIAuth {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = localStorage.getItem('token');
    }
    
    /**
     * Configurar headers com autenticação
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    /**
     * Salvar token no localStorage
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    
    /**
     * Remover token
     */
    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
    
    /**
     * Verificar se está autenticado
     */
    isAuthenticated() {
        return !!this.token;
    }
    
    /**
     * LOGIN
     * @param {string} usuario 
     * @param {string} senha 
     */
    async login(usuario, senha) {
        try {
            const response = await fetch(`${this.baseURL}/autenticacao/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha }),
                credentials: 'include' // Incluir cookies
            });
            
            const data = await response.json();
            
            if (response.ok && data.sucesso) {
                if (data.token) {
                    this.setToken(data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    return data;
                } else {
                    throw new Error('Token não recebido do servidor');
                }
            } else {
                return {
                    sucesso: false,
                    mensagem: data.mensagem || 'Usuário ou senha incorretos'
                };
            }
            
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                sucesso: false,
                mensagem: error.message || 'Erro ao conectar com o servidor'
            };
        }
    }
    
    /**
     * LOGIN ADMIN (usa email ao invés de usuário)
     * @param {string} email 
     * @param {string} senha 
     */
    async loginAdmin(email, senha) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: senha }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Extrair user e token dos dados aninhados
                const user = data.data?.user || data.user;
                const token = data.data?.token || data.token;
                
                if (token) {
                    this.setToken(token);
                    localStorage.setItem('usuario', JSON.stringify(user));
                    return { sucesso: true, usuario: user, token: token };
                } else {
                    throw new Error('Token não recebido do servidor');
                }
            } else {
                return {
                    sucesso: false,
                    mensagem: data.message || data.mensagem || 'E-mail ou senha incorretos'
                };
            }
            
        } catch (error) {
            console.error('Erro no login admin:', error);
            return {
                sucesso: false,
                mensagem: error.message || 'Erro ao conectar com o servidor'
            };
        }
    }
    
    /**
     * LOGOUT
     */
    async logout() {
        try {
            await fetch(`${this.baseURL}/autenticacao/logout`, {
                method: 'POST',
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            this.removeToken();
            localStorage.removeItem('usuario');
            
        } catch (error) {
            console.error('Erro no logout:', error);
            // Limpar mesmo se houver erro
            this.removeToken();
            localStorage.removeItem('usuario');
        }
    }
    
    /**
     * OBTER USUÁRIO LOGADO
     */
    async obterUsuarioLogado() {
        try {
            const response = await fetch(`${this.baseURL}/autenticacao/eu`, {
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                return data.usuario;
            } else {
                throw new Error(data.mensagem);
            }
            
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            throw error;
        }
    }
    
    /**
     * TROCAR SENHA
     */
    async trocarSenha(senhaAtual, novaSenha) {
        try {
            const response = await fetch(`${this.baseURL}/autenticacao/trocar-senha`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ senhaAtual, novaSenha }),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao trocar senha:', error);
            throw error;
        }
    }
    
    /**
     * REGISTRAR NOVO ALUNO (Admin only)
     */
    async registrarAluno(dadosAluno) {
        try {
            const response = await fetch(`${this.baseURL}/autenticacao/registrar`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(dadosAluno),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao registrar aluno:', error);
            throw error;
        }
    }
    
    /**
     * LISTAR ALUNOS (Admin only)
     */
    async listarAlunos(pagina = 1, limite = 10, busca = '', status = '') {
        try {
            const params = new URLSearchParams({ pagina, limite, busca, status });
            
            const response = await fetch(`${this.baseURL}/alunos?${params}`, {
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao listar alunos:', error);
            throw error;
        }
    }
    
    /**
     * OBTER DETALHES DE UM ALUNO
     */
    async obterAluno(id) {
        try {
            const response = await fetch(`${this.baseURL}/alunos/${id}`, {
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao obter aluno:', error);
            throw error;
        }
    }
    
    /**
     * ATUALIZAR ALUNO
     */
    async atualizarAluno(id, dados) {
        try {
            const response = await fetch(`${this.baseURL}/alunos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(dados),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            throw error;
        }
    }
    
    /**
     * DESATIVAR ALUNO (Admin only)
     */
    async desativarAluno(id) {
        try {
            const response = await fetch(`${this.baseURL}/alunos/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao desativar aluno:', error);
            throw error;
        }
    }
    
    /**
     * REATIVAR ALUNO (Admin only)
     */
    async reativarAluno(id) {
        try {
            const response = await fetch(`${this.baseURL}/alunos/${id}/reativar`, {
                method: 'PUT',
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao reativar aluno:', error);
            throw error;
        }
    }
    
    /**
     * RESETAR SENHA (Admin only)
     */
    async resetarSenhaAluno(id, novaSenha) {
        try {
            const response = await fetch(`${this.baseURL}/autenticacao/resetar-senha/${id}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ novaSenha }),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            throw error;
        }
    }
    
    /**
     * ESTATÍSTICAS (Admin only)
     */
    async obterEstatisticas() {
        try {
            const response = await fetch(`${this.baseURL}/alunos/admin/estatisticas`, {
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await response.json();
            
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }
    
    /**
     * Obter dados do usuário do localStorage
     */
    getUsuarioLocal() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }
    
    /**
     * Verificar se é admin
     */
    isAdmin() {
        const usuario = this.getUsuarioLocal();
        return usuario && usuario.role === 'admin';
    }
}

// Criar instância global
const apiAuth = new APIAuth();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiAuth;
}
