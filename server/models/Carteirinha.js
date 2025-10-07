import mongoose from 'mongoose';

const carteirinhaSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true,
        unique: true
    },
    
    // Dados que aparecem na carteirinha
    numeroCarteirinha: {
        type: String,
        unique: true,
        required: true
    },
    
    foto: {
        type: String, // Base64 da foto
        required: true
    },
    
    // Dados pessoais (sincronizados com Aluno)
    nomeCompleto: {
        type: String,
        required: true
    },
    
    dataNascimento: {
        type: Date,
        required: true
    },
    
    cpf: {
        type: String,
        required: true
    },
    
    rg: String,
    
    tipoSanguineo: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não informado']
    },
    
    numeroMatricula: {
        type: String,
        required: true
    },
    
    // Datas
    dataEmissao: {
        type: Date,
        default: Date.now
    },
    
    dataValidade: {
        type: Date,
        required: true
    },
    
    // Contato de emergência
    contatoEmergencia: {
        nome: String,
        telefone: String
    },
    
    // QR Code (opcional - para validação)
    qrCode: String,
    
    // Status
    status: {
        type: String,
        enum: ['Ativa', 'Vencida', 'Cancelada', 'Suspensa'],
        default: 'Ativa'
    },
    
    // Controle de versão (caso aluno precise atualizar foto ou dados)
    versao: {
        type: Number,
        default: 1
    },
    
    // PDF gerado
    pdfUrl: String, // URL ou Base64 do PDF da carteirinha
    
    // Última atualização
    ultimaAtualizacao: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Gerar número de carteirinha automaticamente
carteirinhaSchema.pre('save', function(next) {
    if (!this.numeroCarteirinha) {
        const ano = new Date().getFullYear();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        this.numeroCarteirinha = `CART${ano}${random}`;
    }
    next();
});

// Definir data de validade automaticamente (1 ano)
carteirinhaSchema.pre('save', function(next) {
    if (!this.dataValidade) {
        const hoje = new Date();
        this.dataValidade = new Date(hoje.setFullYear(hoje.getFullYear() + 1));
    }
    next();
});

// Verificar status baseado na validade
carteirinhaSchema.methods.verificarValidade = function() {
    const hoje = new Date();
    if (this.dataValidade < hoje && this.status === 'Ativa') {
        this.status = 'Vencida';
        return this.save();
    }
};

// Sincronizar dados com o aluno
carteirinhaSchema.statics.sincronizarComAluno = async function(alunoId) {
    const Aluno = mongoose.model('Aluno');
    const aluno = await Aluno.findById(alunoId);
    
    if (!aluno) {
        throw new Error('Aluno não encontrado');
    }
    
    const carteirinha = await this.findOne({ aluno: alunoId });
    
    if (carteirinha) {
        // Atualizar carteirinha existente
        carteirinha.nomeCompleto = aluno.nomeCompleto;
        carteirinha.dataNascimento = aluno.dataNascimento;
        carteirinha.cpf = aluno.cpf;
        carteirinha.rg = aluno.rg;
        carteirinha.tipoSanguineo = aluno.tipoSanguineo;
        carteirinha.numeroMatricula = aluno.numeroMatricula;
        carteirinha.ultimaAtualizacao = new Date();
        carteirinha.versao += 1;
        
        return await carteirinha.save();
    }
    
    return null;
};

const Carteirinha = mongoose.model('Carteirinha', carteirinhaSchema);

export default Carteirinha;
