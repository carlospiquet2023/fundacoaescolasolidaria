/**
 * Script de Seed - Criar dados iniciais
 * @description Cria usuário admin e conteúdo padrão
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import HomeContent from './models/HomeContent.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fundacao-escola-solidaria';

async function seed() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');

    // Criar usuário admin
    console.log('\n📝 Criando usuário administrador...');
    await User.createDefaultAdmin();

    // Criar conteúdo padrão do home
    console.log('📝 Criando conteúdo padrão...');
    await HomeContent.createDefault();

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n🔐 Credenciais de acesso:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@fundacao.com'}`);
    console.log(`   Senha: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seed();
