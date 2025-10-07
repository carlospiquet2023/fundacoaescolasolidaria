/**
 * Controller de Alunos
 * Gerencia operações CRUD de alunos
 */

import { Aluno, FichaPreMatricula, Documento, Carteirinha } from '../models/index.js';

/**
 * @route   GET /api/alunos
 * @desc    Listar todos os alunos (admin)
 * @access  Private/Admin
 */
const listarAlunos = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, busca = '', status = '' } = req.query;
        
        // Construir query
        const query = { role: 'aluno' };
        
        if (busca) {
            query.$or = [
                { nomeCompleto: { $regex: busca, $options: 'i' } },
                { usuario: { $regex: busca, $options: 'i' } },
                { cpf: { $regex: busca, $options: 'i' } },
                { numeroMatricula: { $regex: busca, $options: 'i' } }
            ];
        }
        
        if (status) {
            query.status = status;
        }
        
        // Paginação
        const skip = (pagina - 1) * limite;
        
        const alunos = await Aluno.find(query)
            .select('-senha')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limite));
        
        const total = await Aluno.countDocuments(query);
        
        res.status(200).json({
            sucesso: true,
            dados: alunos,
            paginacao: {
                total,
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                totalPaginas: Math.ceil(total / limite)
            }
        });
        
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar alunos.',
            erro: error.message
        });
    }
};

/**
 * @route   GET /api/alunos/:id
 * @desc    Obter detalhes de um aluno
 * @access  Private
 */
const obterAluno = async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id).select('-senha');
        
        if (!aluno) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Aluno não encontrado.'
            });
        }
        
        // Buscar dados relacionados
        const ficha = await FichaPreMatricula.findOne({ aluno: aluno._id });
        const documentos = await Documento.find({ aluno: aluno._id, ativo: true });
        const carteirinha = await Carteirinha.findOne({ aluno: aluno._id });
        
        res.status(200).json({
            sucesso: true,
            aluno,
            ficha,
            documentos: documentos.map(doc => ({
                id: doc._id,
                tipo: doc.tipo,
                nome: doc.nome,
                status: doc.status,
                createdAt: doc.createdAt
            })),
            carteirinha: carteirinha ? {
                numero: carteirinha.numeroCarteirinha,
                dataEmissao: carteirinha.dataEmissao,
                dataValidade: carteirinha.dataValidade,
                status: carteirinha.status
            } : null
        });
        
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao obter aluno.',
            erro: error.message
        });
    }
};

/**
 * @route   PUT /api/alunos/:id
 * @desc    Atualizar dados do aluno
 * @access  Private
 */
const atualizarAluno = async (req, res) => {
    try {
        const {
            nomeCompleto,
            email,
            telefone,
            celular,
            endereco,
            tipoSanguineo,
            status
        } = req.body;
        
        const aluno = await Aluno.findById(req.params.id);
        
        if (!aluno) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Aluno não encontrado.'
            });
        }
        
        // Verificar permissão (admin pode atualizar qualquer um, aluno só a si mesmo)
        if (req.role !== 'admin' && req.usuarioId.toString() !== aluno._id.toString()) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Sem permissão para atualizar este aluno.'
            });
        }
        
        // Atualizar campos permitidos
        if (nomeCompleto) aluno.nomeCompleto = nomeCompleto;
        if (email) aluno.email = email;
        if (telefone) aluno.telefone = telefone;
        if (celular) aluno.celular = celular;
        if (endereco) aluno.endereco = { ...aluno.endereco, ...endereco };
        if (tipoSanguineo) aluno.tipoSanguineo = tipoSanguineo;
        
        // Apenas admin pode mudar status
        if (status && req.role === 'admin') {
            aluno.status = status;
        }
        
        await aluno.save();
        
        res.status(200).json({
            sucesso: true,
            mensagem: 'Aluno atualizado com sucesso!',
            aluno: aluno.toJSON()
        });
        
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar aluno.',
            erro: error.message
        });
    }
};

/**
 * @route   DELETE /api/alunos/:id
 * @desc    Desativar aluno (soft delete)
 * @access  Private/Admin
 */
const desativarAluno = async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        
        if (!aluno) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Aluno não encontrado.'
            });
        }
        
        aluno.ativo = false;
        aluno.status = 'Inativo';
        await aluno.save();
        
        res.status(200).json({
            sucesso: true,
            mensagem: `Aluno ${aluno.nomeCompleto} desativado com sucesso!`
        });
        
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao desativar aluno.',
            erro: error.message
        });
    }
};

/**
 * @route   PUT /api/alunos/:id/reativar
 * @desc    Reativar aluno
 * @access  Private/Admin
 */
const reativarAluno = async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        
        if (!aluno) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Aluno não encontrado.'
            });
        }
        
        aluno.ativo = true;
        aluno.status = 'Matriculado';
        await aluno.save();
        
        res.status(200).json({
            sucesso: true,
            mensagem: `Aluno ${aluno.nomeCompleto} reativado com sucesso!`
        });
        
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao reativar aluno.',
            erro: error.message
        });
    }
};

/**
 * @route   GET /api/alunos/estatisticas
 * @desc    Estatísticas gerais (admin)
 * @access  Private/Admin
 */
const obterEstatisticas = async (req, res) => {
    try {
        const totalAlunos = await Aluno.countDocuments({ role: 'aluno' });
        const alunosAtivos = await Aluno.countDocuments({ role: 'aluno', ativo: true });
        const alunosInativos = await Aluno.countDocuments({ role: 'aluno', ativo: false });
        
        const preMatricula = await Aluno.countDocuments({ role: 'aluno', status: 'Pré-Matrícula' });
        const matriculados = await Aluno.countDocuments({ role: 'aluno', status: 'Matriculado' });
        
        const fichasPreenchidas = await Aluno.countDocuments({ role: 'aluno', fichaPreenchida: true });
        const documentosEnviados = await Aluno.countDocuments({ role: 'aluno', documentosEnviados: true });
        const carteirinhasEmitidas = await Carteirinha.countDocuments();
        
        res.status(200).json({
            sucesso: true,
            estatisticas: {
                total: totalAlunos,
                ativos: alunosAtivos,
                inativos: alunosInativos,
                porStatus: {
                    preMatricula,
                    matriculados
                },
                progresso: {
                    fichasPreenchidas,
                    documentosEnviados,
                    carteirinhasEmitidas: carteirinhasEmitidas
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao obter estatísticas.',
            erro: error.message
        });
    }
};

export {
    listarAlunos,
    obterAluno,
    atualizarAluno,
    desativarAluno,
    reativarAluno,
    obterEstatisticas
};
