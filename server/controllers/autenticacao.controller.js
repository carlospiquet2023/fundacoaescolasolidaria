/**
 * Controller de Autenticação
 * Gerencia login, registro e operações de autenticação
 */

import { Aluno } from '../models/index.js';
import { gerarToken } from '../middleware/autenticacao.js';

/**
 * @route   POST /api/auth/login
 * @desc    Login de aluno ou admin
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { usuario, senha } = req.body;
        
        // Validar campos
        if (!usuario || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Por favor, forneça usuário e senha.'
            });
        }
        
        // Buscar usuário
        const aluno = await Aluno.findOne({ usuario: usuario.toLowerCase() });
        
        if (!aluno) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário ou senha incorretos.'
            });
        }
        
        // Verificar se está ativo
        if (!aluno.ativo) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Conta desativada. Entre em contato com o administrador.'
            });
        }
        
        // Comparar senha
        const senhaCorreta = await aluno.compararSenha(senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário ou senha incorretos.'
            });
        }
        
        // Atualizar primeiro acesso
        if (aluno.primeiroAcesso) {
            aluno.primeiroAcesso = false;
            await aluno.save();
        }
        
        // Gerar token
        const token = gerarToken(aluno._id);
        
        // Configurar cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };
        
        res.cookie('token', token, cookieOptions);
        
        // Retornar dados (sem senha)
        const alunoData = aluno.toJSON();
        
        res.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: alunoData._id,
                usuario: alunoData.usuario,
                nome: alunoData.nomeCompleto,
                role: alunoData.role,
                primeiroAcesso: aluno.primeiroAcesso,
                fichaPreenchida: alunoData.fichaPreenchida,
                documentosEnviados: alunoData.documentosEnviados
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao realizar login.',
            erro: error.message
        });
    }
};

/**
 * @route   POST /api/auth/registrar
 * @desc    Registrar novo aluno (apenas admin)
 * @access  Private/Admin
 */
const registrar = async (req, res) => {
    try {
        const {
            usuario,
            senha,
            nomeCompleto,
            cpf,
            dataNascimento,
            sexo,
            email,
            telefone
        } = req.body;
        
        // Validar campos obrigatórios
        if (!usuario || !senha || !nomeCompleto || !cpf || !dataNascimento || !sexo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Por favor, preencha todos os campos obrigatórios.'
            });
        }
        
        // Verificar se usuário já existe
        const usuarioExiste = await Aluno.findOne({ usuario: usuario.toLowerCase() });
        
        if (usuarioExiste) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Usuário já cadastrado.'
            });
        }
        
        // Verificar se CPF já existe
        const cpfExiste = await Aluno.findOne({ cpf });
        
        if (cpfExiste) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'CPF já cadastrado.'
            });
        }
        
        // Criar aluno
        const novoAluno = new Aluno({
            usuario: usuario.toLowerCase(),
            senha,
            nomeCompleto,
            cpf,
            dataNascimento,
            sexo,
            email,
            telefone,
            role: 'aluno'
        });
        
        // Gerar matrícula
        novoAluno.gerarMatricula();
        
        // Salvar
        await novoAluno.save();
        
        // Retornar dados (sem senha)
        const alunoData = novoAluno.toJSON();
        
        res.status(201).json({
            sucesso: true,
            mensagem: 'Aluno cadastrado com sucesso!',
            aluno: {
                id: alunoData._id,
                usuario: alunoData.usuario,
                nome: alunoData.nomeCompleto,
                matricula: alunoData.numeroMatricula,
                cpf: alunoData.cpf
            }
        });
        
    } catch (error) {
        console.error('Erro ao registrar:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar aluno.',
            erro: error.message
        });
    }
};

/**
 * @route   GET /api/auth/eu
 * @desc    Obter dados do usuário logado
 * @access  Private
 */
const obterUsuarioLogado = async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.usuarioId).select('-senha');
        
        if (!aluno) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.'
            });
        }
        
        res.status(200).json({
            sucesso: true,
            usuario: aluno
        });
        
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao obter dados do usuário.',
            erro: error.message
        });
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (limpar cookie)
 * @access  Private
 */
const logout = async (req, res) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000), // 10 segundos
            httpOnly: true
        });
        
        res.status(200).json({
            sucesso: true,
            mensagem: 'Logout realizado com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao realizar logout.',
            erro: error.message
        });
    }
};

/**
 * @route   PUT /api/auth/trocar-senha
 * @desc    Trocar senha do usuário logado
 * @access  Private
 */
const trocarSenha = async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;
        
        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Por favor, forneça senha atual e nova senha.'
            });
        }
        
        if (novaSenha.length < 6) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nova senha deve ter no mínimo 6 caracteres.'
            });
        }
        
        // Buscar usuário com senha
        const aluno = await Aluno.findById(req.usuarioId);
        
        // Verificar senha atual
        const senhaCorreta = await aluno.compararSenha(senhaAtual);
        
        if (!senhaCorreta) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Senha atual incorreta.'
            });
        }
        
        // Atualizar senha
        aluno.senha = novaSenha;
        await aluno.save();
        
        res.status(200).json({
            sucesso: true,
            mensagem: 'Senha alterada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao trocar senha:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao trocar senha.',
            erro: error.message
        });
    }
};

/**
 * @route   POST /api/auth/resetar-senha/:id
 * @desc    Admin reseta senha de um aluno
 * @access  Private/Admin
 */
const resetarSenha = async (req, res) => {
    try {
        const { novaSenha } = req.body;
        const { id } = req.params;
        
        if (!novaSenha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Por favor, forneça a nova senha.'
            });
        }
        
        if (novaSenha.length < 6) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Senha deve ter no mínimo 6 caracteres.'
            });
        }
        
        const aluno = await Aluno.findById(id);
        
        if (!aluno) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Aluno não encontrado.'
            });
        }
        
        // Resetar senha
        aluno.senha = novaSenha;
        aluno.primeiroAcesso = true;
        await aluno.save();
        
        res.status(200).json({
            sucesso: true,
            mensagem: `Senha do aluno ${aluno.nomeCompleto} resetada com sucesso!`
        });
        
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao resetar senha.',
            erro: error.message
        });
    }
};

export {
    login,
    registrar,
    obterUsuarioLogado,
    logout,
    trocarSenha,
    resetarSenha
};
