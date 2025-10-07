/**
 * Script para testar login do admin
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Aluno, User } from './models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Verificando usuários admin no banco...\n');

const checkAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB conectado!\n');
        
        // Buscar usuários admin na coleção User
        console.log('📋 Buscando na coleção Users:');
        const users = await User.find({ role: 'admin' });
        console.log(`   Encontrados: ${users.length} usuários admin`);
        users.forEach(user => {
            console.log(`   - Email: ${user.email}`);
            console.log(`     Nome: ${user.name}`);
            console.log(`     Role: ${user.role}`);
        });
        
        console.log('\n📋 Buscando na coleção Alunos:');
        const alunos = await Aluno.find({ role: 'admin' });
        console.log(`   Encontrados: ${alunos.length} alunos admin`);
        alunos.forEach(aluno => {
            console.log(`   - Usuário: ${aluno.usuario}`);
            console.log(`     Nome: ${aluno.nomeCompleto}`);
            console.log(`     Role: ${aluno.role}`);
            console.log(`     Email: ${aluno.email}`);
        });
        
        // Tentar fazer login com o admin
        console.log('\n🔐 Testando login com admin@fundacao.com:');
        const adminUser = await User.findOne({ email: 'admin@fundacao.com' });
        if (adminUser) {
            console.log('   ✅ Usuário encontrado!');
            const senhaCorreta = await adminUser.comparePassword('admin123');
            console.log(`   Senha correta: ${senhaCorreta ? '✅ SIM' : '❌ NÃO'}`);
        } else {
            console.log('   ❌ Usuário não encontrado na coleção Users');
        }
        
        console.log('\n🔐 Testando login com carlos.admin:');
        const adminAluno = await Aluno.findOne({ usuario: 'carlos.admin' });
        if (adminAluno) {
            console.log('   ✅ Aluno admin encontrado!');
            const senhaCorreta = await adminAluno.compararSenha('admin123');
            console.log(`   Senha correta: ${senhaCorreta ? '✅ SIM' : '❌ NÃO'}`);
        } else {
            console.log('   ❌ Aluno admin não encontrado');
        }
        
        console.log('\n💡 DICA:');
        console.log('   A página de admin-login usa a rota /api/autenticacao/login');
        console.log('   Esta rota busca na coleção Alunos, não Users!');
        console.log('\n   Para fazer login como admin use:');
        console.log('   - Usuário: carlos.admin');
        console.log('   - Senha: admin123');
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Conexão fechada.\n');
        process.exit(0);
    }
};

checkAdmin();
