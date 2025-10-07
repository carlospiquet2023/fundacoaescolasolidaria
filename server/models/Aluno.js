import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const alunoSchema = new mongoose.Schema({
    // Dados de Acesso
    usuario: {
        type: String,
        required: [true, 'Usuário é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [4, 'Usuário deve ter no mínimo 4 caracteres']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter no mínimo 6 caracteres']
    },
    
    // Dados Pessoais
    nomeCompleto: {
        type: String,
        required: [true, 'Nome completo é obrigatório'],
        trim: true
    },
    cpf: {
        type: String,
        required: [true, 'CPF é obrigatório'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || /^\d{11}$/.test(v);
            },
            message: 'CPF inválido'
        }
    },
    rg: {
        type: String,
        trim: true
    },
    dataNascimento: {
        type: Date,
        required: [true, 'Data de nascimento é obrigatória']
    },
    sexo: {
        type: String,
        enum: ['Masculino', 'Feminino', 'Outro'],
        required: true
    },
    
    // Matrícula
    numeroMatricula: {
        type: String,
        unique: true,
        sparse: true, // Permite null, mas se existir deve ser único
        trim: true
    },
    dataMatricula: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pré-Matrícula', 'Matriculado', 'Inativo', 'Cancelado'],
        default: 'Pré-Matrícula'
    },
    
    // Contato
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                if (!v) {
                    return true; // Email é opcional
                }
                return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: 'Email inválido'
        }
    },
    telefone: {
        type: String,
        trim: true
    },
    celular: {
        type: String,
        trim: true
    },
    
    // Endereço
    endereco: {
        cep: String,
        logradouro: String,
        numero: String,
        complemento: String,
        bairro: String,
        cidade: String,
        estado: String
    },
    
    // Dados para Carteirinha
    fotoUrl: {
        type: String, // URL ou Base64 da foto
        default: null
    },
    tipoSanguineo: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não informado'],
        default: 'Não informado'
    },
    
    // Responsável (para menores)
    responsavel: {
        nome: String,
        cpf: String,
        parentesco: String,
        telefone: String,
        email: String
    },
    
    // Ficha preenchida
    fichaPreenchida: {
        type: Boolean,
        default: false
    },
    documentosEnviados: {
        type: Boolean,
        default: false
    },
    
    // Tipo de usuário
    role: {
        type: String,
        enum: ['aluno', 'admin'],
        default: 'aluno'
    },
    
    // Controle
    ativo: {
        type: Boolean,
        default: true
    },
    primeiroAcesso: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Cria automaticamente createdAt e updatedAt
});

// Hash da senha antes de salvar
alunoSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar senha
alunoSchema.methods.compararSenha = async function(senhaInformada) {
    return await bcrypt.compare(senhaInformada, this.senha);
};

// Método para gerar número de matrícula automaticamente
alunoSchema.methods.gerarMatricula = function() {
    const ano = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.numeroMatricula = `${ano}${random}`;
};

// Remover senha ao retornar JSON
alunoSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.senha;
    return obj;
};

const Aluno = mongoose.model('Aluno', alunoSchema);

export default Aluno;
