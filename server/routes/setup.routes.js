/**
 * Rotas de Setup - Inicialização do Banco de Dados
 * @description Endpoints para inicializar collections e dados padrão
 */

import express from 'express';
import User from '../models/User.js';
import HomeContent from '../models/HomeContent.js';
import Receita from '../models/Receita.js';

const router = express.Router();

/**
 * GET /api/setup/status
 * @description Verifica se o banco já foi inicializado
 */
router.get('/status', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    const homeExists = await HomeContent.findOne();
    
    res.json({
      success: true,
      initialized: !!(adminExists && homeExists),
      data: {
        hasAdmin: !!adminExists,
        hasHomeContent: !!homeExists,
        adminEmail: adminExists ? adminExists.email : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error.message
    });
  }
});

/**
 * POST /api/setup/init
 * @description Inicializa o banco de dados com dados padrão
 * @security Só funciona se não houver admin cadastrado
 */
router.post('/init', async (req, res) => {
  try {
    // Verificar se já foi inicializado
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Banco de dados já foi inicializado',
        data: {
          adminEmail: adminExists.email
        }
      });
    }

    // Criar usuário admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@fundacao.com',
      password: 'Admin@123456',
      role: 'admin',
      isActive: true,
    });

    // Criar conteúdo padrão do home
    const homeContent = await HomeContent.create({
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
          'Educação de qualidade',
          'Respeito e inclusão',
          'Compromisso social',
          'Transparência',
          'Trabalho em equipe'
        ],
        image: '/assets/images/002.png',
      },
      programs: [
        {
          title: 'Educação Infantil',
          description: 'Desenvolvimento integral das crianças através de metodologias ativas.',
          icon: '🎨',
          image: '/assets/images/02.jpg',
        },
        {
          title: 'Ensino Fundamental',
          description: 'Base sólida de conhecimento com foco no desenvolvimento crítico.',
          icon: '📚',
          image: '/assets/images/03.jpg',
        },
        {
          title: 'Atividades Complementares',
          description: 'Esportes, artes e cultura para desenvolvimento de talentos.',
          icon: '⚽',
          image: '/assets/images/04.jpg',
        },
      ],
      gallery: [
        { url: '/assets/images/05.jpg', caption: 'Atividades em sala' },
        { url: '/assets/images/06.jpg', caption: 'Recreação' },
        { url: '/assets/images/07.jpg', caption: 'Projetos especiais' },
        { url: '/assets/images/08.jpg', caption: 'Eventos' },
      ],
      contact: {
        phone: '(21) 97308-0269',
        email: 'contato@fundacao.com',
        address: 'Rua Exemplo, 123 - São Paulo, SP',
        socialMedia: {
          facebook: 'https://facebook.com/fundacao',
          instagram: 'https://instagram.com/fundacao',
        },
      },
      isPublished: true,
    });

    res.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      data: {
        adminEmail: admin.email,
        adminPassword: 'Admin@123456',
        homeContentCreated: true,
        note: 'IMPORTANTE: Altere a senha do admin após o primeiro login!'
      }
    });

  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao inicializar banco de dados',
      error: error.message
    });
  }
});

export default router;
