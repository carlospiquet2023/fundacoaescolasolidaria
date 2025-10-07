/**
 * Model Receita - Conteúdo da página de receitas
 * @description Schema do Mongoose para gerenciar receitas financeiras
 */

import mongoose from 'mongoose';

const receitaSchema = new mongoose.Schema(
  {
    // Informações Básicas
    titulo: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      maxlength: [200, 'Título não pode ter mais de 200 caracteres'],
    },
    descricao: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
    },
    
    // Categoria
    categoria: {
      type: String,
      enum: ['doacao', 'patrocinio', 'evento', 'venda', 'subvencao', 'outros'],
      default: 'doacao',
    },
    
    // Valores
    valor: {
      type: Number,
      required: [true, 'Valor é obrigatório'],
      min: [0, 'Valor não pode ser negativo'],
    },
    moeda: {
      type: String,
      default: 'BRL',
    },
    
    // Datas
    dataReceita: {
      type: Date,
      required: [true, 'Data da receita é obrigatória'],
      default: Date.now,
    },
    dataRegistro: {
      type: Date,
      default: Date.now,
    },
    
    // Origem
    origem: {
      nome: String,
      tipo: {
        type: String,
        enum: ['pessoa_fisica', 'pessoa_juridica', 'governo', 'organizacao', 'anonimo'],
        default: 'anonimo',
      },
      documento: String, // CPF ou CNPJ
      contato: {
        email: String,
        telefone: String,
      },
    },
    
    // Detalhes da Transação
    transacao: {
      tipo: {
        type: String,
        enum: ['dinheiro', 'transferencia', 'pix', 'cartao', 'cheque', 'outros'],
        default: 'transferencia',
      },
      numeroRecibo: String,
      comprovante: String, // URL do arquivo
      observacoes: String,
    },
    
    // Projeto Relacionado
    projetoRelacionado: {
      nome: String,
      codigo: String,
    },
    
    // Status
    status: {
      type: String,
      enum: ['pendente', 'confirmado', 'cancelado'],
      default: 'confirmado',
    },
    
    // Publicação
    visivel: {
      type: Boolean,
      default: true,
    },
    destaque: {
      type: Boolean,
      default: false,
    },
    
    // Tags para busca
    tags: [String],
    
    // Metadados
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    atualizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// VIRTUALS
// ============================================================================

// Valor formatado em reais
receitaSchema.virtual('valorFormatado').get(function () {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: this.moeda,
  }).format(this.valor);
});

// Ano/Mês da receita
receitaSchema.virtual('anoMes').get(function () {
  const data = new Date(this.dataReceita);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
});

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Gerar tags automáticas baseadas no conteúdo
receitaSchema.pre('save', function (next) {
  if (this.isModified('titulo') || this.isModified('descricao')) {
    const palavras = `${this.titulo} ${this.descricao}`
      .toLowerCase()
      .split(/\s+/)
      .filter(p => p.length > 3);
    
    this.tags = [...new Set([...this.tags, ...palavras])].slice(0, 10);
  }
  next();
});

// ============================================================================
// MÉTODOS DA INSTÂNCIA
// ============================================================================

/**
 * Marcar como destaque
 */
receitaSchema.methods.marcarDestaque = async function () {
  this.destaque = true;
  return await this.save();
};

/**
 * Remover destaque
 */
receitaSchema.methods.removerDestaque = async function () {
  this.destaque = false;
  return await this.save();
};

/**
 * Cancelar receita
 */
receitaSchema.methods.cancelar = async function (motivo) {
  this.status = 'cancelado';
  if (!this.transacao.observacoes) {
    this.transacao.observacoes = '';
  }
  this.transacao.observacoes += `\nCancelado em ${new Date().toISOString()}: ${motivo}`;
  return await this.save();
};

// ============================================================================
// MÉTODOS ESTÁTICOS
// ============================================================================

/**
 * Buscar receitas por período
 */
receitaSchema.statics.buscarPorPeriodo = async function (dataInicio, dataFim) {
  return await this.find({
    dataReceita: {
      $gte: new Date(dataInicio),
      $lte: new Date(dataFim),
    },
    status: 'confirmado',
  }).sort({ dataReceita: -1 });
};

/**
 * Calcular total por categoria
 */
receitaSchema.statics.totalPorCategoria = async function (ano) {
  const dataInicio = new Date(ano, 0, 1);
  const dataFim = new Date(ano, 11, 31, 23, 59, 59);

  return await this.aggregate([
    {
      $match: {
        dataReceita: { $gte: dataInicio, $lte: dataFim },
        status: 'confirmado',
      },
    },
    {
      $group: {
        _id: '$categoria',
        total: { $sum: '$valor' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

/**
 * Calcular total por mês
 */
receitaSchema.statics.totalPorMes = async function (ano) {
  const dataInicio = new Date(ano, 0, 1);
  const dataFim = new Date(ano, 11, 31, 23, 59, 59);

  return await this.aggregate([
    {
      $match: {
        dataReceita: { $gte: dataInicio, $lte: dataFim },
        status: 'confirmado',
      },
    },
    {
      $group: {
        _id: {
          mes: { $month: '$dataReceita' },
          ano: { $year: '$dataReceita' },
        },
        total: { $sum: '$valor' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.ano': 1, '_id.mes': 1 },
    },
  ]);
};

/**
 * Obter estatísticas gerais
 */
receitaSchema.statics.obterEstatisticas = async function () {
  const resultado = await this.aggregate([
    {
      $match: { status: 'confirmado' },
    },
    {
      $group: {
        _id: null,
        totalGeral: { $sum: '$valor' },
        totalReceitas: { $sum: 1 },
        mediaReceita: { $avg: '$valor' },
        maiorReceita: { $max: '$valor' },
        menorReceita: { $min: '$valor' },
      },
    },
  ]);

  return resultado[0] || {
    totalGeral: 0,
    totalReceitas: 0,
    mediaReceita: 0,
    maiorReceita: 0,
    menorReceita: 0,
  };
};

// ============================================================================
// ÍNDICES
// ============================================================================

receitaSchema.index({ dataReceita: -1 });
receitaSchema.index({ categoria: 1, status: 1 });
receitaSchema.index({ status: 1, visivel: 1 });
receitaSchema.index({ destaque: 1 });
receitaSchema.index({ tags: 1 });
receitaSchema.index({ 'origem.nome': 'text', titulo: 'text', descricao: 'text' });

const Receita = mongoose.model('Receita', receitaSchema);

export default Receita;
