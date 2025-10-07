/**
 * Model HomeContent - Conteúdo da página inicial (index.html)
 * @description Schema do Mongoose para gerenciar todo conteúdo editável do index
 */

import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema(
  {
    // Hero Section
    hero: {
      title: {
        type: String,
        required: true,
        default: 'Fundação Escola Solidária',
      },
      subtitle: {
        type: String,
        default: 'Transformando vidas através da educação',
      },
      backgroundImage: {
        type: String,
        default: '/assets/images/fundo.png',
      },
      ctaButton: {
        text: { type: String, default: 'Saiba Mais' },
        link: { type: String, default: '#sobre' },
        visible: { type: Boolean, default: true },
      },
    },

    // Sobre a Fundação
    about: {
      title: {
        type: String,
        default: 'Sobre a Fundação',
      },
      description: {
        type: String,
        default: 'A Fundação Escola Solidária atua há anos...',
      },
      mission: {
        type: String,
        default: 'Nossa missão é proporcionar educação de qualidade...',
      },
      vision: {
        type: String,
        default: 'Ser referência em educação solidária...',
      },
      values: [
        {
          icon: String,
          title: String,
          description: String,
        },
      ],
      images: [String],
    },

    // Estatísticas
    stats: [
      {
        number: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        icon: String,
      },
    ],

    // Programas e Projetos
    programs: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: String,
        link: String,
        active: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Galeria de Fotos
    gallery: {
      title: {
        type: String,
        default: 'Nossa Galeria',
      },
      images: [
        {
          url: String,
          alt: String,
          caption: String,
        },
      ],
    },

    // Depoimentos
    testimonials: [
      {
        name: {
          type: String,
          required: true,
        },
        role: String,
        message: {
          type: String,
          required: true,
        },
        avatar: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
          default: 5,
        },
      },
    ],

    // Como Ajudar
    howToHelp: {
      title: {
        type: String,
        default: 'Como Você Pode Ajudar',
      },
      description: String,
      ways: [
        {
          title: String,
          description: String,
          icon: String,
          link: String,
        },
      ],
    },

    // Contato
    contact: {
      title: {
        type: String,
        default: 'Entre em Contato',
      },
      address: String,
      phone: String,
      email: String,
      whatsapp: String,
      socialMedia: {
        facebook: String,
        instagram: String,
        youtube: String,
        twitter: String,
      },
      mapEmbedUrl: String,
    },

    // Footer
    footer: {
      logo: String,
      description: String,
      quickLinks: [
        {
          text: String,
          url: String,
        },
      ],
      copyrightText: {
        type: String,
        default: '© 2024 Fundação Escola Solidária. Todos os direitos reservados.',
      },
    },

    // SEO
    seo: {
      metaTitle: {
        type: String,
        default: 'Fundação Escola Solidária - Educação que Transforma',
      },
      metaDescription: {
        type: String,
        default: 'A Fundação Escola Solidária atua na transformação de vidas através da educação de qualidade e solidária.',
      },
      metaKeywords: [String],
      ogImage: String,
    },

    // Status
    isPublished: {
      type: Boolean,
      default: true,
    },
    lastPublishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// MÉTODOS ESTÁTICOS
// ============================================================================

/**
 * Criar conteúdo padrão inicial
 */
homeContentSchema.statics.createDefault = async function () {
  try {
    const exists = await this.findOne();
    
    if (!exists) {
      const defaultContent = await this.create({
        hero: {
          title: 'Fundação Escola Solidária',
          subtitle: 'Transformando vidas através da educação',
          backgroundImage: '/assets/images/fundo.png',
        },
        stats: [
          { number: '500+', label: 'Alunos Atendidos', icon: '👨‍🎓' },
          { number: '15', label: 'Anos de História', icon: '📅' },
          { number: '50+', label: 'Projetos Realizados', icon: '🎯' },
          { number: '100%', label: 'Dedicação', icon: '❤️' },
        ],
        contact: {
          email: 'contato@fundacao.com',
          phone: '(11) 1234-5678',
        },
      });

      console.log('✅ Conteúdo padrão do Home criado');
      return defaultContent;
    }

    return exists;
  } catch (error) {
    console.error('❌ Erro ao criar conteúdo padrão:', error.message);
    throw error;
  }
};

// ============================================================================
// ÍNDICES
// ============================================================================

homeContentSchema.index({ isPublished: 1 });
homeContentSchema.index({ updatedAt: -1 });

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;
