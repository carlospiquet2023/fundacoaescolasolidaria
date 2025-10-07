# 🔐 DOCUMENTAÇÃO - SISTEMA DE AUTENTICAÇÃO JWT

## ✅ Tarefa 2 Concluída: Sistema de Autenticação Completo

### 🎯 O que foi implementado

#### 1. **Middleware de Autenticação** (`server/middleware/autenticacao.js`)

**Funções principais:**

- `autenticar()` - Valida token JWT e adiciona usuário ao request
- `autorizarAdmin()` - Verifica se usuário é admin (usar após autenticar)
- `autorizarAluno()` - Verifica se usuário é aluno (usar após autenticar)
- `autenticarOpcional()` - Autenticação opcional (não bloqueia sem token)
- `gerarToken(id)` - Gera token JWT válido por 7 dias

**Suporte a:**
- Bearer Token no header `Authorization`
- Cookies httpOnly
- Verificação de conta ativa
- Tratamento de erros (token inválido, expirado, etc)

---

#### 2. **Controller de Autenticação** (`server/controllers/autenticacao.controller.js`)

**Rotas implementadas:**

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| POST | `/api/autenticacao/login` | Login de aluno/admin | Público |
| POST | `/api/autenticacao/registrar` | Criar novo aluno | Admin |
| GET | `/api/autenticacao/eu` | Dados do usuário logado | Autenticado |
| POST | `/api/autenticacao/logout` | Logout (limpa cookie) | Autenticado |
| PUT | `/api/autenticacao/trocar-senha` | Trocar própria senha | Autenticado |
| POST | `/api/autenticacao/resetar-senha/:id` | Admin reseta senha de aluno | Admin |

**Recursos:**
- Hash de senhas com bcrypt (automático no modelo)
- Cookies httpOnly para segurança
- Atualiza flag `primeiroAcesso` no primeiro login
- Remove senha do response (método `toJSON()`)

---

#### 3. **Controller de Alunos** (`server/controllers/alunos.controller.js`)

**Rotas implementadas:**

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| GET | `/api/alunos` | Listar todos os alunos (paginado, com busca) | Admin |
| GET | `/api/alunos/:id` | Detalhes de um aluno (+ ficha, docs, carteirinha) | Autenticado |
| PUT | `/api/alunos/:id` | Atualizar dados do aluno | Próprio aluno ou Admin |
| DELETE | `/api/alunos/:id` | Desativar aluno (soft delete) | Admin |
| PUT | `/api/alunos/:id/reativar` | Reativar aluno | Admin |
| GET | `/api/alunos/admin/estatisticas` | Estatísticas gerais | Admin |

**Recursos:**
- Paginação com `pagina`, `limite`, `busca`, `status`
- Busca por nome, usuário, CPF ou matrícula
- Retorna dados relacionados (ficha, documentos, carteirinha)
- Soft delete (marca como inativo, não deleta)

---

#### 4. **Rotas** (`server/routes/`)

**`autenticacao.routes.js`:**
```javascript
POST   /api/autenticacao/login          // Login
GET    /api/autenticacao/eu             // Usuário logado
POST   /api/autenticacao/logout         // Logout
PUT    /api/autenticacao/trocar-senha   // Trocar senha
POST   /api/autenticacao/registrar      // Criar aluno (admin)
POST   /api/autenticacao/resetar-senha/:id  // Resetar senha (admin)
```

**`alunos.routes.js`:**
```javascript
GET    /api/alunos                    // Listar (admin)
GET    /api/alunos/:id                // Detalhes
PUT    /api/alunos/:id                // Atualizar
DELETE /api/alunos/:id                // Desativar (admin)
PUT    /api/alunos/:id/reativar       // Reativar (admin)
GET    /api/alunos/admin/estatisticas // Estatísticas (admin)
```

---

#### 5. **Cliente API Frontend** (`src/utils/api-auth.js`)

**Classe `APIAuth` com métodos:**

```javascript
// Autenticação
await apiAuth.login(usuario, senha)
await apiAuth.logout()
await apiAuth.obterUsuarioLogado()
await apiAuth.trocarSenha(senhaAtual, novaSenha)

// Admin - Gestão de alunos
await apiAuth.registrarAluno(dadosAluno)
await apiAuth.listarAlunos(pagina, limite, busca, status)
await apiAuth.obterAluno(id)
await apiAuth.atualizarAluno(id, dados)
await apiAuth.desativarAluno(id)
await apiAuth.reativarAluno(id)
await apiAuth.resetarSenhaAluno(id, novaSenha)
await apiAuth.obterEstatisticas()

// Utilitários
apiAuth.isAuthenticated()  // Verifica se tem token
apiAuth.isAdmin()           // Verifica se é admin
apiAuth.getUsuarioLocal()   // Dados do localStorage
```

**Recursos:**
- Gerencia token automaticamente
- Salva usuário no localStorage
- Inclui credentials (cookies)
- Headers com Authorization Bearer

---

### 📦 Pacotes Instalados

```bash
npm install cookie-parser
```

**Já instalados anteriormente:**
- `mongoose` - ORM MongoDB
- `bcrypt` - Hash de senhas
- `jsonwebtoken` - Tokens JWT
- `multer` - Upload de arquivos

---

### 🔧 Configuração

#### `.env` necessário:

```env
# JWT
JWT_SECRET=fundacao_escola_solidaria_secret_key_2024_super_segura
JWT_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/fundacao-escola-solidaria

# Server
PORT=3001
NODE_ENV=development
```

#### Servidor atualizado (`server/server.js`):

✅ Importado `cookie-parser`
✅ Middleware `app.use(cookieParser())`
✅ Rotas `/api/autenticacao` adicionadas
✅ Rotas `/api/alunos` adicionadas

---

### 🔒 Segurança Implementada

#### 1. **Tokens JWT**
- Expiração configurável (padrão 7 dias)
- Armazenados em cookies httpOnly
- Verificação em cada request protegido

#### 2. **Senhas**
- Hash com bcrypt (10 rounds)
- Nunca retornadas nas responses
- Validação de força mínima (6 caracteres)

#### 3. **Cookies**
- httpOnly: protege contra XSS
- secure: apenas HTTPS em produção
- sameSite: 'strict' - protege CSRF

#### 4. **Autorização**
- Middleware `autorizarAdmin` para rotas admin
- Verificação de permissões antes de cada ação
- Alunos só editam próprios dados

#### 5. **Rate Limiting**
- Já configurado no servidor
- Login: 5 tentativas / 15 minutos
- API geral: 100 requests / 15 minutos

---

### 📝 Exemplos de Uso

#### **Frontend - Login:**

```javascript
// HTML
<form id="loginForm">
    <input type="text" id="usuario" required>
    <input type="password" id="senha" required>
    <button type="submit">Entrar</button>
</form>

// JavaScript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    try {
        const result = await apiAuth.login(usuario, senha);
        
        if (result.sucesso) {
            // Redirecionar baseado no role
            if (result.usuario.role === 'admin') {
                window.location.href = '/admin/dashboard.html';
            } else {
                window.location.href = '/aluno/dashboard.html';
            }
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});
```

#### **Frontend - Verificar autenticação:**

```javascript
// Proteger página
if (!apiAuth.isAuthenticated()) {
    window.location.href = '/login.html';
}

// Verificar se é admin
if (!apiAuth.isAdmin()) {
    alert('Acesso negado!');
    window.location.href = '/aluno/dashboard.html';
}

// Obter dados do usuário
const usuario = apiAuth.getUsuarioLocal();
document.getElementById('nomeUsuario').textContent = usuario.nome;
```

#### **Frontend - Listar alunos (Admin):**

```javascript
async function carregarAlunos() {
    try {
        const result = await apiAuth.listarAlunos(1, 20, '', 'Matriculado');
        
        if (result.sucesso) {
            const tbody = document.getElementById('tabelaAlunos');
            tbody.innerHTML = '';
            
            result.dados.forEach(aluno => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${aluno.numeroMatricula}</td>
                    <td>${aluno.nomeCompleto}</td>
                    <td>${aluno.cpf}</td>
                    <td>${aluno.status}</td>
                    <td>
                        <button onclick="editarAluno('${aluno._id}')">Editar</button>
                        <button onclick="desativarAluno('${aluno._id}')">Desativar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        alert('Erro ao carregar alunos: ' + error.message);
    }
}
```

---

### 🧪 Testando a API

#### **Com cURL:**

```bash
# Login
curl -X POST http://localhost:3001/api/autenticacao/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"escolasolidaria2024"}' \
  -c cookies.txt

# Obter usuário logado
curl http://localhost:3001/api/autenticacao/eu \
  -b cookies.txt

# Listar alunos (admin)
curl http://localhost:3001/api/alunos \
  -b cookies.txt

# Registrar novo aluno (admin)
curl -X POST http://localhost:3001/api/autenticacao/registrar \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "usuario":"teste.aluno",
    "senha":"senha123",
    "nomeCompleto":"Teste Aluno Silva",
    "cpf":"111.222.333-44",
    "dataNascimento":"2010-01-01",
    "sexo":"Masculino"
  }'
```

#### **Com Postman:**

1. POST `http://localhost:3001/api/autenticacao/login`
   - Body: `{"usuario":"admin","senha":"escolasolidaria2024"}`
   - Copiar o `token` da response

2. GET `http://localhost:3001/api/autenticacao/eu`
   - Header: `Authorization: Bearer {token}`

3. GET `http://localhost:3001/api/alunos`
   - Header: `Authorization: Bearer {token}`

---

### 🚀 Próximas Integrações

#### **Tarefa 3: Painel Admin**
- Interface para criar/editar/listar alunos
- Gerenciar fichas e documentos
- Exportar carteirinhas

#### **Tarefa 4: Painel do Aluno**
- Dashboard pessoal
- Preencher ficha
- Upload de documentos
- Gerar carteirinha

#### **Tarefa 5-7: Integração com páginas existentes**
- `ficha.html` → salvar via API
- `carteirinha.html` → buscar dados via API
- `doc.html` → upload via API

---

### ✅ Checklist de Conclusão

- [x] Middleware de autenticação JWT criado
- [x] Suporte a cookies httpOnly
- [x] Controller de autenticação completo
- [x] Controller de alunos (CRUD)
- [x] Rotas configuradas
- [x] Cliente API para frontend
- [x] Integração com servidor Express
- [x] Hash de senhas com bcrypt
- [x] Autorização baseada em roles (admin/aluno)
- [x] Documentação completa

---

**Data de Criação:** 07/10/2025  
**Versão:** 1.0.0  
**Status:** ✅ Concluído  
**Próxima Tarefa:** Painel Admin - Gestão de Alunos
