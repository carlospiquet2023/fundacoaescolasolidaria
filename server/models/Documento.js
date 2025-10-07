import mongoose from 'mongoose';

const documentoSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true
    },
    
    tipo: {
        type: String,
        enum: [
            'RG',
            'CPF',
            'Certidão de Nascimento',
            'Comprovante de Residência',
            'Histórico Escolar',
            'Foto 3x4',
            'Declaração de Escolaridade',
            'Atestado Médico',
            'Cartão de Vacina',
            'Outro'
        ],
        required: [true, 'Tipo do documento é obrigatório']
    },
    
    nome: {
        type: String,
        required: [true, 'Nome do arquivo é obrigatório']
    },
    
    descricao: String,
    
    // Armazenamento do arquivo
    arquivo: {
        // Base64 para arquivos pequenos (até 1MB)
        dados: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true,
            enum: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
        },
        tamanho: {
            type: Number,
            required: true,
            max: [5242880, 'Arquivo muito grande. Máximo 5MB'] // 5MB em bytes
        }
    },
    
    // Status
    status: {
        type: String,
        enum: ['Pendente', 'Aprovado', 'Rejeitado', 'Substituído'],
        default: 'Pendente'
    },
    
    motivoRejeicao: String,
    
    // Aprovação
    analisadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno'
    },
    dataAnalise: Date,
    
    // Controle
    ativo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices para melhor performance
documentoSchema.index({ aluno: 1, tipo: 1 });
documentoSchema.index({ status: 1 });

// Atualizar status do aluno quando documento for enviado
documentoSchema.post('save', async function(doc) {
    // Verificar se o aluno já enviou os documentos obrigatórios
    const documentosObrigatorios = ['RG', 'CPF', 'Comprovante de Residência', 'Foto 3x4'];
    
    const documentosAluno = await mongoose.model('Documento').find({
        aluno: doc.aluno,
        ativo: true,
        tipo: { $in: documentosObrigatorios }
    });
    
    if (documentosAluno.length >= documentosObrigatorios.length) {
        await mongoose.model('Aluno').findByIdAndUpdate(doc.aluno, {
            documentosEnviados: true
        });
    }
});

// Método para converter Base64 de volta para arquivo
documentoSchema.methods.getArquivo = function() {
    return {
        nome: this.nome,
        tipo: this.arquivo.mimeType,
        dados: this.arquivo.dados,
        tamanho: this.arquivo.tamanho
    };
};

const Documento = mongoose.model('Documento', documentoSchema);

export default Documento;
