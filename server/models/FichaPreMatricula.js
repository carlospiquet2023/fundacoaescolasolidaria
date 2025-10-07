import mongoose from 'mongoose';

const fichaPreMatriculaSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true,
        unique: true
    },
    
    // Dados do Aluno (complementares)
    nomeSocial: String,
    nacionalidade: {
        type: String,
        default: 'Brasileira'
    },
    naturalidade: String,
    estadoCivil: {
        type: String,
        enum: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Outro']
    },
    
    // Documentos
    certidaoNascimento: String,
    tituloEleitor: String,
    carteiraTrabalho: String,
    
    // Filiação
    nomeMae: {
        type: String,
        required: [true, 'Nome da mãe é obrigatório']
    },
    cpfMae: String,
    nomePai: String,
    cpfPai: String,
    
    // Dados Escolares
    escolaridade: {
        type: String,
        enum: [
            'Fundamental Incompleto',
            'Fundamental Completo',
            'Médio Incompleto',
            'Médio Completo',
            'Superior Incompleto',
            'Superior Completo',
            'Pós-graduação'
        ]
    },
    escolaAnterior: String,
    anoEscolar: String,
    turno: {
        type: String,
        enum: ['Manhã', 'Tarde', 'Noite', 'Integral']
    },
    
    // Dados de Saúde
    tipoSanguineo: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não informado']
    },
    alergias: String,
    medicamentosContinuos: String,
    necessidadesEspeciais: String,
    planoDeSaude: {
        possui: Boolean,
        nome: String,
        numero: String
    },
    
    // Dados Socioeconômicos
    rendaFamiliar: {
        type: String,
        enum: [
            'Até 1 salário mínimo',
            '1 a 2 salários mínimos',
            '2 a 3 salários mínimos',
            '3 a 5 salários mínimos',
            'Acima de 5 salários mínimos'
        ]
    },
    beneficioSocial: {
        possui: Boolean,
        qual: String
    },
    
    // Transporte
    necessitaTransporte: {
        type: Boolean,
        default: false
    },
    tipoTransporte: String,
    
    // Dados para Carteirinha
    foto: {
        type: String, // Base64 da foto
        required: false
    },
    dataEmissaoCarteirinha: Date,
    validadeCarteirinha: Date,
    
    // Emergência
    contatoEmergencia: {
        nome: {
            type: String,
            required: [true, 'Nome do contato de emergência é obrigatório']
        },
        parentesco: String,
        telefone: {
            type: String,
            required: [true, 'Telefone do contato de emergência é obrigatório']
        },
        celular: String
    },
    
    // Autorização
    autorizacaoImagem: {
        type: Boolean,
        default: false
    },
    autorizacaoSaida: {
        type: Boolean,
        default: false
    },
    
    // Observações
    observacoes: String,
    
    // Status
    status: {
        type: String,
        enum: ['Em Preenchimento', 'Aguardando Aprovação', 'Aprovada', 'Rejeitada'],
        default: 'Em Preenchimento'
    },
    motivoRejeicao: String,
    
    // Controle
    dataEnvio: Date,
    dataAprovacao: Date,
    aprovadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno'
    }
}, {
    timestamps: true
});

// Atualizar status do aluno quando ficha for enviada
fichaPreMatriculaSchema.post('save', async function(doc) {
    if (doc.status === 'Aguardando Aprovação') {
        await mongoose.model('Aluno').findByIdAndUpdate(doc.aluno, {
            fichaPreenchida: true
        });
    }
});

const FichaPreMatricula = mongoose.model('FichaPreMatricula', fichaPreMatriculaSchema);

export default FichaPreMatricula;
