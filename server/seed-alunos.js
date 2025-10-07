/**
 * Script de Seed - Popular banco de dados com dados iniciais
 */

const mongoose = require('mongoose');
const { Aluno } = require('./models');

// Conectar ao MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fundacao-escola-solidaria';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB conectado para seed');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error.message);
        process.exit(1);
    }
};

// Criar admin padrão
const criarAdminPadrao = async () => {
    try {
        const adminExiste = await Aluno.findOne({ usuario: 'admin' });
        
        if (adminExiste) {
            console.log('⚠️  Admin já existe');
            return;
        }
        
        const admin = new Aluno({
            usuario: 'admin',
            senha: 'escolasolidaria2024',
            nomeCompleto: 'Administrador do Sistema',
            cpf: '000.000.000-00',
            dataNascimento: new Date('1990-01-01'),
            sexo: 'Outro',
            role: 'admin',
            status: 'Matriculado',
            fichaPreenchida: true,
            documentosEnviados: true,
            primeiroAcesso: false
        });
        
        admin.gerarMatricula();
        await admin.save();
        
        console.log('✅ Admin criado com sucesso');
        console.log('   Usuário: admin');
        console.log('   Senha: escolasolidaria2024');
        
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error.message);
    }
};

// Criar alunos de teste
const criarAlunosTeste = async () => {
    try {
        const alunos = [
            {
                usuario: 'joao.silva',
                senha: 'senha123',
                nomeCompleto: 'João da Silva Santos',
                cpf: '123.456.789-10',
                dataNascimento: new Date('2010-05-15'),
                sexo: 'Masculino',
                email: 'joao.silva@email.com',
                telefone: '(21) 98765-4321',
                tipoSanguineo: 'O+',
                endereco: {
                    cep: '20000-000',
                    logradouro: 'Rua das Flores',
                    numero: '123',
                    bairro: 'Centro',
                    cidade: 'Rio de Janeiro',
                    estado: 'RJ'
                }
            },
            {
                usuario: 'maria.santos',
                senha: 'senha123',
                nomeCompleto: 'Maria Santos Oliveira',
                cpf: '987.654.321-00',
                dataNascimento: new Date('2011-08-20'),
                sexo: 'Feminino',
                email: 'maria.santos@email.com',
                telefone: '(21) 91234-5678',
                tipoSanguineo: 'A+',
                endereco: {
                    cep: '21000-000',
                    logradouro: 'Avenida Brasil',
                    numero: '456',
                    bairro: 'Centro',
                    cidade: 'Rio de Janeiro',
                    estado: 'RJ'
                }
            },
            {
                usuario: 'pedro.costa',
                senha: 'senha123',
                nomeCompleto: 'Pedro Costa Lima',
                cpf: '456.789.123-00',
                dataNascimento: new Date('2012-03-10'),
                sexo: 'Masculino',
                email: 'pedro.costa@email.com',
                telefone: '(21) 97777-8888',
                tipoSanguineo: 'B+',
                endereco: {
                    cep: '22000-000',
                    logradouro: 'Rua do Sol',
                    numero: '789',
                    bairro: 'Copacabana',
                    cidade: 'Rio de Janeiro',
                    estado: 'RJ'
                }
            }
        ];
        
        for (const alunoData of alunos) {
            const alunoExiste = await Aluno.findOne({ usuario: alunoData.usuario });
            
            if (!alunoExiste) {
                const aluno = new Aluno(alunoData);
                aluno.gerarMatricula();
                await aluno.save();
                console.log(`✅ Aluno criado: ${aluno.nomeCompleto} (${aluno.usuario})`);
            } else {
                console.log(`⚠️  Aluno já existe: ${alunoData.usuario}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao criar alunos de teste:', error.message);
    }
};

// Executar seed
const executarSeed = async () => {
    console.log('');
    console.log('🌱 ========================================');
    console.log('   INICIANDO SEED DO BANCO DE DADOS');
    console.log('🌱 ========================================');
    console.log('');
    
    await connectDB();
    await criarAdminPadrao();
    await criarAlunosTeste();
    
    console.log('');
    console.log('✅ ========================================');
    console.log('   SEED CONCLUÍDO COM SUCESSO!');
    console.log('✅ ========================================');
    console.log('');
    console.log('📋 Credenciais criadas:');
    console.log('');
    console.log('👨‍💼 ADMIN:');
    console.log('   Usuário: admin');
    console.log('   Senha: escolasolidaria2024');
    console.log('');
    console.log('👨‍🎓 ALUNOS DE TESTE:');
    console.log('   1. Usuário: joao.silva | Senha: senha123');
    console.log('   2. Usuário: maria.santos | Senha: senha123');
    console.log('   3. Usuário: pedro.costa | Senha: senha123');
    console.log('');
    
    await mongoose.connection.close();
    process.exit(0);
};

// Executar
executarSeed().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
