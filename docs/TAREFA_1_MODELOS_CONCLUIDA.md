# 📚 DOCUMENTAÇÃO - MODELOS DE DADOS

## ✅ Tarefa 1 Concluída: MongoDB e Modelos de Dados

### 🗄️ Modelos Criados

#### 1. **Aluno** (`server/models/Aluno.js`)
Modelo principal para gerenciar alunos e admins.

**Campos Principais:**
- **Acesso**: `usuario`, `senha` (com hash bcrypt), `role` (aluno/admin)
- **Pessoais**: `nomeCompleto`, `cpf`, `rg`, `dataNascimento`, `sexo`
- **Matrícula**: `numeroMatricula` (auto-gerado), `dataMatricula`, `status`
- **Contato**: `email`, `telefone`, `celular`, `endereco` (objeto)
- **Carteirinha**: `fotoUrl`, `tipoSanguineo`
- **Responsável**: `responsavel` (objeto para menores)
- **Status**: `fichaPreenchida`, `documentosEnviados`, `ativo`, `primeiroAcesso`

**Métodos:**
- `compararSenha(senha)`: Valida senha informada
- `gerarMatricula()`: Gera matrícula única (ex: 20240123)
- `toJSON()`: Remove senha ao retornar objeto

---

#### 2. **FichaPreMatricula** (`server/models/FichaPreMatricula.js`)
Armazena dados completos da pré-matrícula.

**Campos Principais:**
- **Referência**: `aluno` (ObjectId)
- **Dados Complementares**: `nomeSocial`, `nacionalidade`, `naturalidade`
- **Documentos**: `certidaoNascimento`, `tituloEleitor`, `carteiraTrabalho`
- **Filiação**: `nomeMae`, `cpfMae`, `nomePai`, `cpfPai`
- **Escolares**: `escolaridade`, `escolaAnterior`, `anoEscolar`, `turno`
- **Saúde**: `tipoSanguineo`, `alergias`, `medicamentosContinuos`, `planoDeSaude`
- **Socioeconômicos**: `rendaFamiliar`, `beneficioSocial`
- **Transporte**: `necessitaTransporte`, `tipoTransporte`
- **Carteirinha**: `foto` (Base64), `dataEmissaoCarteirinha`
- **Emergência**: `contatoEmergencia` (objeto)
- **Status**: `status` (Em Preenchimento, Aguardando Aprovação, Aprovada, Rejeitada)

**Hooks:**
- Atualiza `aluno.fichaPreenchida = true` quando status = "Aguardando Aprovação"

---

#### 3. **Documento** (`server/models/Documento.js`)
Gerencia upload de documentos dos alunos.

**Campos Principais:**
- **Referência**: `aluno` (ObjectId)
- **Tipo**: RG, CPF, Certidão, Comprovante Residência, Histórico Escolar, Foto 3x4, etc.
- **Arquivo**: `dados` (Base64), `mimeType`, `tamanho` (máx 5MB)
- **Status**: Pendente, Aprovado, Rejeitado, Substituído
- **Aprovação**: `analisadoPor`, `dataAnalise`, `motivoRejeicao`

**Validação:**
- Aceita apenas: JPG, PNG, PDF
- Máximo 5MB por arquivo

**Hooks:**
- Atualiza `aluno.documentosEnviados = true` quando documentos obrigatórios estão enviados

**Métodos:**
- `getArquivo()`: Retorna objeto com dados do arquivo

---

#### 4. **Carteirinha** (`server/models/Carteirinha.js`)
Armazena dados da carteirinha estudantil.

**Campos Principais:**
- **Referência**: `aluno` (ObjectId - unique)
- **Identificação**: `numeroCarteirinha` (auto-gerado, ex: CART202412345)
- **Dados**: `foto`, `nomeCompleto`, `dataNascimento`, `cpf`, `rg`, `tipoSanguineo`, `numeroMatricula`
- **Validade**: `dataEmissao`, `dataValidade` (1 ano)
- **Emergência**: `contatoEmergencia` (objeto)
- **Status**: Ativa, Vencida, Cancelada, Suspensa
- **Controle**: `versao`, `pdfUrl`, `qrCode`

**Hooks:**
- Gera `numeroCarteirinha` automaticamente
- Define `dataValidade` automaticamente (+1 ano)

**Métodos:**
- `verificarValidade()`: Atualiza status se vencida
- `sincronizarComAluno(alunoId)`: Sincroniza dados do aluno com carteirinha

---

### 📦 Pacotes Instalados

```bash
npm install mongoose bcrypt jsonwebtoken multer
```

- **mongoose**: ORM para MongoDB
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT
- **multer**: Upload de arquivos

---

### 🔧 Configuração

#### Arquivo `.env.example` atualizado:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fundacao-escola-solidaria
# Ou Atlas: mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/fundacao-escola-solidaria

# JWT
JWT_SECRET=fundacao_escola_solidaria_secret_key_2024_super_segura
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
```

---

### 🌱 Script de Seed

Criado `server/seed-alunos.js` para popular banco com dados iniciais:

**Credenciais criadas:**

👨‍💼 **ADMIN:**
- Usuário: `admin`
- Senha: `escolasolidaria2024`

👨‍🎓 **ALUNOS DE TESTE:**
1. Usuário: `joao.silva` | Senha: `senha123`
2. Usuário: `maria.santos` | Senha: `senha123`
3. Usuário: `pedro.costa` | Senha: `senha123`

**Executar seed:**
```bash
node server/seed-alunos.js
```

---

### 📋 Páginas HTML Existentes

✅ **ficha.html** (1313 linhas) - Formulário de pré-matrícula com design colorido
✅ **carteirinha.html** (524 linhas) - Formulário para gerar carteirinha estudantil
✅ **doc.html** - Upload de documentos
✅ **admin-login.html** - Login administrativo
✅ **financeiro.html** - Gestão financeira (receitas/despesas)
✅ **transp.html** - Transparência

---

### 🔄 Integração Necessária (Próximas Tarefas)

#### Atualizar `ficha.html`:
- Conectar ao MongoDB via API POST `/api/aluno/ficha`
- Buscar dados do aluno logado
- Validação de campos obrigatórios
- Feedback visual de salvamento

#### Atualizar `carteirinha.html`:
- Buscar dados automaticamente via API GET `/api/aluno/dados`
- Gerar carteirinha sem formulário manual
- Download em PDF com jsPDF
- Sincronização com ficha

#### Atualizar `doc.html`:
- Upload via API POST `/api/aluno/documentos`
- Listar documentos enviados
- Status de aprovação
- Permitir exclusão/substituição

---

### ✅ Status da Tarefa 1

**CONCLUÍDO:**
- ✅ 4 modelos Mongoose criados
- ✅ Validações e hooks implementados
- ✅ Métodos auxiliares criados
- ✅ Bcrypt para hash de senhas
- ✅ Script de seed com dados de teste
- ✅ Configuração do MongoDB atualizada
- ✅ Índice de modelos criado

**PRÓXIMO PASSO:**
➡️ **Tarefa 2: Sistema de autenticação completo (JWT)**

---

### 📊 Diagrama de Relacionamento

```
┌─────────────┐
│    Aluno    │ ◄─────┐
└─────────────┘       │
       │              │
       │ 1:1          │ N:1
       ▼              │
┌─────────────────┐   │
│ FichaPreMatricula│   │
└─────────────────┘   │
                      │
┌─────────────┐       │
│  Documento  │───────┘
└─────────────┘
       ▲
       │ N:1
       │
┌─────────────┐
│ Carteirinha │
└─────────────┘
```

---

### 🎯 Como Usar

1. **Instalar MongoDB** localmente ou criar conta no MongoDB Atlas
2. **Configurar** `.env` com string de conexão
3. **Executar seed**: `node server/seed-alunos.js`
4. **Testar conexão**: Rodar servidor e verificar log de conexão

---

**Data de Criação:** 07/10/2025
**Versão:** 1.0.0
**Status:** ✅ Concluído
