/* eslint-disable no-console */
/**
 * Script de Inicialização Completa do Banco de Dados
 * Cria todas as coleções e dados iniciais
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { 
    Aluno, 
    User, 
    FichaPreMatricula, 
    Documento, 
    Carteirinha, 
    HomeContent, 
    Receita 
} from './models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🚀 ========================================');
console.log('   Inicializando Banco de Dados Completo');
console.log('🚀 ========================================\n');

// Conectar ao MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB conectado com sucesso!\n');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error.message);
        process.exit(1);
    }
};

// Limpar banco de dados
const clearDatabase = async () => {
    try {
        console.log('🧹 Limpando banco de dados...');
        await Aluno.deleteMany({});
        await User.deleteMany({});
        await FichaPreMatricula.deleteMany({});
        await Documento.deleteMany({});
        await Carteirinha.deleteMany({});
        await HomeContent.deleteMany({});
        await Receita.deleteMany({});
        console.log('✅ Banco de dados limpo!\n');
    } catch (error) {
        console.error('❌ Erro ao limpar banco:', error.message);
    }
};

// Criar usuário administrador
const createAdmin = async () => {
    try {
        console.log('👤 Criando usuário administrador...');
        
        const admin = await User.create({
            name: 'Administrador',
            email: 'admin@fundacao.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('   Email: admin@fundacao.com');
        console.log('   Senha: admin123\n');
        
        return admin;
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error.message);
    }
};

// Criar alunos de exemplo
const createAlunos = async () => {
    try {
        console.log('👨‍🎓 Criando alunos de exemplo...');

        const alunos = [
            {
                usuario: 'joao.silva',
                senha: '123456',
                nomeCompleto: 'João Silva Santos',
                cpf: '123.456.789-00',
                dataNascimento: new Date('2010-05-15'),
                sexo: 'Masculino',
                email: 'joao.silva@email.com',
                telefone: '(11) 98765-4321',
                role: 'aluno',
                ativo: true,
                primeiroAcesso: false,
                endereco: {
                    cep: '01234-567',
                    rua: 'Rua das Flores',
                    numero: '123',
                    bairro: 'Centro',
                    cidade: 'São Paulo',
                    estado: 'SP'
                }
            },
            {
                usuario: 'maria.santos',
                senha: '123456',
                nomeCompleto: 'Maria Santos Oliveira',
                cpf: '987.654.321-00',
                dataNascimento: new Date('2012-08-20'),
                sexo: 'Feminino',
                email: 'maria.santos@email.com',
                telefone: '(11) 98765-1234',
                role: 'aluno',
                ativo: true,
                primeiroAcesso: false,
                endereco: {
                    cep: '01234-890',
                    rua: 'Avenida Principal',
                    numero: '456',
                    bairro: 'Jardim das Acácias',
                    cidade: 'São Paulo',
                    estado: 'SP'
                }
            },
            {
                usuario: 'pedro.costa',
                senha: '123456',
                nomeCompleto: 'Pedro Costa Lima',
                cpf: '111.222.333-44',
                dataNascimento: new Date('2011-03-10'),
                sexo: 'Masculino',
                email: 'pedro.costa@email.com',
                telefone: '(11) 98765-5678',
                role: 'aluno',
                ativo: true,
                primeiroAcesso: true,
                endereco: {
                    cep: '01234-111',
                    rua: 'Rua do Sol',
                    numero: '789',
                    bairro: 'Vila Esperança',
                    cidade: 'São Paulo',
                    estado: 'SP'
                }
            },
            {
                usuario: 'ana.ferreira',
                senha: '123456',
                nomeCompleto: 'Ana Ferreira Rodrigues',
                cpf: '555.666.777-88',
                dataNascimento: new Date('2013-11-25'),
                sexo: 'Feminino',
                email: 'ana.ferreira@email.com',
                telefone: '(11) 98765-9012',
                role: 'aluno',
                ativo: true,
                primeiroAcesso: false,
                endereco: {
                    cep: '01234-222',
                    rua: 'Rua da Paz',
                    numero: '321',
                    bairro: 'Jardim Solidário',
                    cidade: 'São Paulo',
                    estado: 'SP'
                }
            },
            {
                usuario: 'carlos.admin',
                senha: 'admin123',
                nomeCompleto: 'Carlos Administrador',
                cpf: '999.888.777-66',
                dataNascimento: new Date('1990-01-01'),
                sexo: 'Masculino',
                email: 'carlos.admin@fundacao.com',
                telefone: '(11) 98765-0000',
                role: 'admin',
                ativo: true,
                primeiroAcesso: false
            }
        ];

        const alunosCriados = await Aluno.insertMany(alunos);
        console.log(`✅ ${alunosCriados.length} alunos criados com sucesso!\n`);
        
        return alunosCriados;
    } catch (error) {
        console.error('❌ Erro ao criar alunos:', error.message);
        return [];
    }
};

// Criar carteirinhas para os alunos
const createCarteirinhas = async (alunos) => {
    try {
        console.log('🆔 Criando carteirinhas...');

        const carteirinhas = alunos.slice(0, 3).map((aluno, index) => ({
            aluno: aluno._id,
            numeroMatricula: `2024${String(index + 1).padStart(4, '0')}`,
            anoLetivo: 2024,
            curso: 'Ensino Fundamental',
            turma: `${6 + index}º Ano`,
            turno: index % 2 === 0 ? 'manhã' : 'tarde',
            dataEmissao: new Date(),
            dataValidade: new Date('2024-12-31'),
            foto: '/assets/images/avatar-placeholder.png',
            status: 'ativa'
        }));

        const carteirinhasCriadas = await Carteirinha.insertMany(carteirinhas);
        console.log(`✅ ${carteirinhasCriadas.length} carteirinhas criadas!\n`);
        
        return carteirinhasCriadas;
    } catch (error) {
        console.error('❌ Erro ao criar carteirinhas:', error.message);
        return [];
    }
};

// Criar conteúdo da home
const createHomeContent = async () => {
    try {
        console.log('🏠 Criando conteúdo da página inicial...');

        const homeContent = await HomeContent.create({
            hero: {
                title: 'Fundação Escola Solidária',
                subtitle: 'Transformando vidas através da educação e solidariedade',
                backgroundImage: '/assets/images/hero-bg.jpg'
            },
            about: {
                title: 'Sobre Nós',
                description: 'A Fundação Escola Solidária é uma instituição dedicada à promoção da educação e inclusão social.',
                mission: 'Promover educação de qualidade e inclusão social',
                vision: 'Ser referência em educação solidária'
            },
            programs: [],
            gallery: [],
            testimonials: [],
            contact: {
                phone: '(11) 1234-5678',
                email: 'contato@fundacaoescolasolidaria.org.br',
                address: 'Rua da Solidariedade, 123 - São Paulo, SP'
            },
            isPublished: true
        });

        console.log('✅ Conteúdo da home criado!\n');
        return homeContent;
    } catch (error) {
        console.error('❌ Erro ao criar conteúdo da home:', error.message);
    }
};

// Criar receitas de exemplo
const createReceitas = async () => {
    try {
        console.log('💰 Criando receitas de exemplo...');

        const receitas = [
            {
                titulo: 'Doação - Empresa XYZ',
                descricao: 'Doação mensal da empresa XYZ para manutenção',
                categoria: 'doacao',
                valor: 5000.00,
                dataReceita: new Date('2024-01-15'),
                status: 'confirmado',
                recorrente: true,
                observacoes: 'Doação mensal estabelecida em contrato'
            },
            {
                titulo: 'Evento Beneficente - Festa Junina',
                descricao: 'Arrecadação da festa junina 2024',
                categoria: 'evento',
                valor: 3500.00,
                dataReceita: new Date('2024-06-20'),
                status: 'confirmado'
            },
            {
                titulo: 'Doação Individual - Maria Silva',
                descricao: 'Doação pontual de colaboradora',
                categoria: 'doacao',
                valor: 500.00,
                dataReceita: new Date('2024-02-10'),
                status: 'confirmado'
            }
        ];

        const receitasCriadas = await Receita.insertMany(receitas);
        console.log(`✅ ${receitasCriadas.length} receitas criadas!\n`);
        
        return receitasCriadas;
    } catch (error) {
        console.error('❌ Erro ao criar receitas:', error.message);
        return [];
    }
};

// Executar inicialização
const init = async () => {
    try {
        await connectDB();
        await clearDatabase();
        
        await createAdmin();
        const alunos = await createAlunos();
        const carteirinhas = await createCarteirinhas(alunos);
        await createHomeContent();
        const receitas = await createReceitas();

        console.log('\n🎉 ========================================');
        console.log('   Banco de Dados Inicializado!');
        console.log('🎉 ========================================\n');

        console.log('📊 Resumo:');
        console.log(`   - ${alunos.length} alunos criados`);
        console.log(`   - ${carteirinhas.length} carteirinhas criadas`);
        console.log(`   - ${receitas.length} receitas criadas`);
        console.log(`   - 1 admin criado`);
        console.log(`   - 1 conteúdo home criado\n`);

        console.log('🔐 Credenciais de Acesso:');
        console.log('\n👤 ADMIN:');
        console.log('   Email: admin@fundacao.com');
        console.log('   Senha: admin123');
        
        console.log('\n👨‍🎓 ALUNOS (todos com senha: 123456):');
        alunos.forEach(aluno => {
            if (aluno.role === 'aluno') {
                console.log(`   - ${aluno.usuario} (${aluno.nomeCompleto})`);
            }
        });

        console.log('\n✅ Você já pode fazer login no sistema!\n');

    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Conexão com MongoDB fechada.\n');
        process.exit(0);
    }
};

// Executar
init();
