/**
 * Configuração do MongoDB
 * @description Conexão com MongoDB Atlas/Local usando Mongoose
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Usar MongoDB Atlas (cloud) se disponível, senão local
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fundacao-escola-solidaria';

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log('');
    console.log('✅ ========================================');
    console.log(`   MongoDB conectado: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log('✅ ========================================');
    console.log('');

    // Eventos de conexão
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconectado');
    });

  } catch (error) {
    console.error('');
    console.error('❌ ========================================');
    console.error('   Erro ao conectar MongoDB:');
    console.error(`   ${error.message}`);
    console.error('❌ ========================================');
    console.error('');
    
    // Retry após 5 segundos
    console.log('🔄 Tentando reconectar em 5 segundos...');
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
