/**
 * Script de Inicialização do Banco de Dados
 * @description Cria todas as collections necessárias e popula com dados de exemplo
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import HomeContent from './models/HomeContent.js';
import Receita from './models/Receita.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fundacao-escola-solidaria';

async function initDatabase() {
  try {
    console.log('🚀 ========================================');
    console.log('   Inicializando Banco de Dados');
    console.log('🚀 ========================================\n');

    // Conectar ao MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB\n');

    // ============================================================================
    // 1. CRIAR COLLECTIONS (TABELAS)
    // ============================================================================
    
    console.log('📊 Criando Collections...\n');

    // Collection: users
    const userCollection = mongoose.connection.db.collection('users');
    await userCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Collection "users" criada com índice em email');

    // Collection: homecontents
    const homeCollection = mongoose.connection.db.collection('homecontents');
    await homeCollection.createIndex({ isPublished: 1 });
    await homeCollection.createIndex({ updatedAt: -1 });
    console.log('✅ Collection "homecontents" criada com índices');

    // Collection: receitas
    const receitaCollection = mongoose.connection.db.collection('receitas');
    await receitaCollection.createIndex({ dataReceita: -1 });
    await receitaCollection.createIndex({ categoria: 1, status: 1 });
    await receitaCollection.createIndex({ status: 1, visivel: 1 });
    await receitaCollection.createIndex({ destaque: 1 });
    await receitaCollection.createIndex(
      { 'origem.nome': 'text', titulo: 'text', descricao: 'text' }
    );
    console.log('✅ Collection "receitas" criada com índices\n');

    // ============================================================================
    // 2. CRIAR USUÁRIO ADMINISTRADOR
    // ============================================================================
    
    console.log('👤 Criando usuário administrador...\n');
    
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@fundacao.com' });
    
    if (!adminExists) {
      const admin = await User.create({
        name: process.env.ADMIN_NAME || 'Administrador',
        email: process.env.ADMIN_EMAIL || 'admin@fundacao.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Usuário admin criado:', admin.email);
    } else {
      console.log('ℹ️  Usuário admin já existe:', adminExists.email);
    }

    // ============================================================================
    // 3. CRIAR CONTEÚDO PADRÃO DO HOME
    // ============================================================================
    
    console.log('\n📄 Criando conteúdo padrão da página inicial...\n');
    
    const homeExists = await HomeContent.findOne();
    
    if (!homeExists) {
      const defaultHome = await HomeContent.create({
        hero: {
          title: 'Fundação Escola Solidária',
          subtitle: 'Transformando vidas através da educação',
          backgroundImage: '/assets/images/fundo.png',
          ctaButton: {
            text: 'Saiba Mais',
            link: '#sobre',
            visible: true,
          },
        },
        about: {
          title: 'Sobre a Fundação',
          description: 'A Fundação Escola Solidária atua há anos transformando vidas através da educação de qualidade e acolhimento.',
          mission: 'Nossa missão é proporcionar educação de qualidade, promovendo o desenvolvimento integral de crianças e jovens.',
          vision: 'Ser referência em educação solidária, reconhecida pela excelência e compromisso com a transformação social.',
          values: [
            {
              icon: '❤️',
              title: 'Solidariedade',
              description: 'Acolhimento e apoio às famílias',
            },
            {
              icon: '📚',
              title: 'Educação',
              description: 'Ensino de qualidade para todos',
            },
            {
              icon: '🤝',
              title: 'Compromisso',
              description: 'Dedicação à comunidade',
            },
          ],
        },
        stats: [
          { number: '500+', label: 'Alunos Atendidos', icon: '👨‍🎓' },
          { number: '15', label: 'Anos de História', icon: '📅' },
          { number: '50+', label: 'Projetos Realizados', icon: '🎯' },
          { number: '100%', label: 'Dedicação', icon: '❤️' },
        ],
        contact: {
          title: 'Entre em Contato',
          email: 'contato@fundacao.com',
          phone: '(11) 1234-5678',
          whatsapp: '11987654321',
          address: 'Rua Exemplo, 123 - São Paulo/SP',
          socialMedia: {
            facebook: 'https://facebook.com/fundacao',
            instagram: 'https://instagram.com/fundacao',
          },
        },
        footer: {
          logo: '/assets/images/logo bel.png',
          description: 'Transformando vidas através da educação',
          copyrightText: '© 2024 Fundação Escola Solidária. Todos os direitos reservados.',
        },
        seo: {
          metaTitle: 'Fundação Escola Solidária - Educação que Transforma',
          metaDescription: 'A Fundação Escola Solidária atua na transformação de vidas através da educação de qualidade e solidária.',
          metaKeywords: ['educação', 'fundação', 'solidariedade', 'escola', 'crianças'],
        },
        isPublished: true,
        publishedAt: new Date(),
      });
      console.log('✅ Conteúdo padrão do Home criado');
    } else {
      console.log('ℹ️  Conteúdo do Home já existe');
    }

    // ============================================================================
    // 4. CRIAR RECEITAS DE EXEMPLO
    // ============================================================================
    
    console.log('\n💰 Criando receitas de exemplo...\n');
    
    const receitasExemplo = [
      {
        titulo: 'Doação Mensal - Empresa Parceira',
        descricao: 'Doação regular recebida de empresa parceira do projeto',
        categoria: 'doacao',
        valor: 5000.00,
        dataReceita: new Date('2024-01-15'),
        origem: {
          nome: 'Empresa Parceira LTDA',
          tipo: 'pessoa_juridica',
        },
        transacao: {
          tipo: 'transferencia',
          numeroRecibo: 'REC-001/2024',
          observacoes: 'Doação mensal regular',
        },
        status: 'confirmado',
        visivel: true,
        destaque: true,
      },
      {
        titulo: 'Evento Beneficente - Bazar Solidário',
        descricao: 'Arrecadação do bazar beneficente realizado na comunidade',
        categoria: 'evento',
        valor: 3200.50,
        dataReceita: new Date('2024-02-10'),
        origem: {
          nome: 'Bazar Solidário 2024',
          tipo: 'organizacao',
        },
        transacao: {
          tipo: 'dinheiro',
          numeroRecibo: 'REC-002/2024',
          observacoes: 'Evento realizado no salão comunitário',
        },
        status: 'confirmado',
        visivel: true,
        destaque: false,
      },
      {
        titulo: 'Patrocínio Projeto Educacional',
        descricao: 'Patrocínio para projeto de reforço escolar',
        categoria: 'patrocinio',
        valor: 10000.00,
        dataReceita: new Date('2024-03-05'),
        origem: {
          nome: 'Instituto Educação para Todos',
          tipo: 'organizacao',
        },
        transacao: {
          tipo: 'transferencia',
          numeroRecibo: 'REC-003/2024',
          observacoes: 'Patrocínio para ano letivo 2024',
        },
        projetoRelacionado: {
          nome: 'Reforço Escolar 2024',
          codigo: 'PROJ-RE-2024',
        },
        status: 'confirmado',
        visivel: true,
        destaque: true,
      },
      {
        titulo: 'Doação Individual',
        descricao: 'Doação de pessoa física para manutenção',
        categoria: 'doacao',
        valor: 500.00,
        dataReceita: new Date('2024-03-20'),
        origem: {
          nome: 'Doador Anônimo',
          tipo: 'pessoa_fisica',
        },
        transacao: {
          tipo: 'pix',
          numeroRecibo: 'REC-004/2024',
        },
        status: 'confirmado',
        visivel: true,
        destaque: false,
      },
      {
        titulo: 'Venda de Produtos Solidários',
        descricao: 'Venda de produtos artesanais feitos pelos alunos',
        categoria: 'venda',
        valor: 1500.75,
        dataReceita: new Date('2024-04-01'),
        origem: {
          nome: 'Feira de Artesanato',
          tipo: 'organizacao',
        },
        transacao: {
          tipo: 'dinheiro',
          numeroRecibo: 'REC-005/2024',
          observacoes: 'Feira realizada na escola',
        },
        status: 'confirmado',
        visivel: true,
        destaque: false,
      },
    ];

    const receitaCount = await Receita.countDocuments();
    
    if (receitaCount === 0) {
      for (const receitaData of receitasExemplo) {
        await Receita.create(receitaData);
      }
      console.log(`✅ ${receitasExemplo.length} receitas de exemplo criadas`);
    } else {
      console.log(`ℹ️  ${receitaCount} receitas já existem no banco`);
    }

    // ============================================================================
    // 5. ESTATÍSTICAS FINAIS
    // ============================================================================
    
    console.log('\n📊 Estatísticas do Banco de Dados:\n');
    
    const userCount = await User.countDocuments();
    const homeCount = await HomeContent.countDocuments();
    const receitasCount = await Receita.countDocuments();
    const totalArrecadado = await Receita.aggregate([
      { $match: { status: 'confirmado' } },
      { $group: { _id: null, total: { $sum: '$valor' } } },
    ]);

    console.log(`   👥 Usuários: ${userCount}`);
    console.log(`   📄 Conteúdo Home: ${homeCount}`);
    console.log(`   💰 Receitas: ${receitasCount}`);
    console.log(`   💵 Total Arrecadado: R$ ${totalArrecadado[0]?.total.toFixed(2) || '0.00'}`);

    console.log('\n✅ ========================================');
    console.log('   Banco de Dados Inicializado!');
    console.log('✅ ========================================\n');

    console.log('🔐 Credenciais de Acesso:\n');
    console.log(`   📧 Email: ${process.env.ADMIN_EMAIL || 'admin@fundacao.com'}`);
    console.log(`   🔑 Senha: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');

    console.log('🌐 Acesse o painel admin em:\n');
    console.log('   Local: http://localhost:3001/admin');
    console.log('   Produção: https://seu-projeto.up.railway.app/admin\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('   Erro ao inicializar banco de dados:');
    console.error(`   ${error.message}`);
    console.error('❌ ========================================\n');
    console.error(error);
    process.exit(1);
  }
}

// Executar inicialização
initDatabase();
