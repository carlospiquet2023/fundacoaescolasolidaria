# 🚀 INÍCIO RÁPIDO - Sistema CMS Fundação Escola Solidária

## 📦 O que foi criado?

✅ **Backend completo** (Node.js + Express + MongoDB)
✅ **Painel administrativo** moderno e responsivo
✅ **API REST** com autenticação JWT
✅ **Integração frontend-backend**
✅ **Configuração para Railway** (deploy em produção)
✅ **Documentação completa** (2500+ linhas)

---

## ⚡ Instalação em 5 Passos

### 1️⃣ Instalar Dependências

```powershell
cd "c:\Users\pique\OneDrive\Área de Trabalho\fundacaoescolasolidaria2003-main"
npm install
```

Isso instalará:
- Express, Mongoose, JWT (backend)
- Bcrypt, Helmet, CORS (segurança)
- Multer (upload de arquivos)
- Vite, TailwindCSS (frontend)

### 2️⃣ Configurar MongoDB

**Opção A - MongoDB Atlas (Recomendado para produção)**

1. Criar conta gratuita: https://www.mongodb.com/cloud/atlas/register
2. Criar cluster M0 (grátis)
3. Adicionar usuário em **Database Access**
4. Permitir IP 0.0.0.0/0 em **Network Access**
5. Copiar **Connection String**

**Opção B - MongoDB Local (Para desenvolvimento)**

1. Instalar MongoDB Community: https://www.mongodb.com/try/download/community
2. Iniciar serviço: `mongod`

### 3️⃣ Criar Arquivo .env

Copie `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

Edite `.env` com suas configurações:

```env
NODE_ENV=development
PORT=3001

# MongoDB Atlas (substitua com sua Connection String)
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority

# OU MongoDB Local
# MONGODB_URI=mongodb://localhost:27017/fundacao-escola-solidaria

# JWT Secret (gere uma chave forte)
JWT_SECRET=gere_uma_chave_secreta_forte_aqui_64_caracteres_minimo
JWT_EXPIRE=7d

# Admin padrão
ADMIN_EMAIL=admin@fundacao.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Administrador
```

**⚠️ IMPORTANTE: Gerar JWT_SECRET forte:**

```powershell
# Opção 1 - Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opção 2 - Online
# Acesse: https://www.grc.com/passwords.htm
```

### 4️⃣ Popular Banco de Dados

```powershell
npm run seed
```

Isso criará:
- ✅ Usuário administrador padrão
- ✅ Conteúdo inicial da página home
- ✅ Estrutura do banco de dados

Você verá:
```
✅ Conectado ao MongoDB
📝 Criando usuário administrador...
✅ Usuário admin padrão criado: admin@fundacao.com
📝 Criando conteúdo padrão...
✅ Conteúdo padrão do Home criado

✅ Seed concluído com sucesso!

🔐 Credenciais de acesso:
   Email: admin@fundacao.com
   Senha: Admin@123456

⚠️  IMPORTANTE: Altere a senha após o primeiro login!
```

### 5️⃣ Iniciar Aplicação

```powershell
npm run dev
```

Isso iniciará:
- 🖥️ **Servidor backend**: http://localhost:3001
- 🌐 **Frontend (Vite)**: http://localhost:5173

---

## 🎯 Acessar o Sistema

### Site Público
👉 http://localhost:5173

### Painel Administrativo
👉 http://localhost:3001/admin

**Login:**
- **Email**: admin@fundacao.com
- **Senha**: Admin@123456

### API REST
👉 http://localhost:3001/api

**Health Check**: http://localhost:3001/api/health

---

## 📱 Funcionalidades do Admin

Após fazer login no painel admin, você terá acesso a:

### 1. Dashboard
- ✅ Estatísticas financeiras em tempo real
- ✅ Total arrecadado, receitas, médias
- ✅ Ações rápidas

### 2. Editor da Página Inicial
- ✅ Alterar título e subtítulo do Hero
- ✅ Modificar imagem de fundo
- ✅ Editar informações de contato (email, telefone, WhatsApp, endereço)
- ✅ Publicar/despublicar conteúdo
- ✅ **Todas as mudanças aparecem automaticamente no site!**

### 3. Gestão de Receitas
- ✅ Ver todas as receitas em tabela
- ✅ Adicionar nova receita
- ✅ Editar receita existente
- ✅ Excluir receita
- ✅ Filtrar por categoria, status, data
- ✅ Ver estatísticas

### 4. Galeria de Imagens
- ✅ Upload de imagens
- ✅ Visualizar todas as fotos
- ✅ Excluir imagens
- ✅ Organização em grid

---

## 🧪 Testar Funcionalidades

### 1. Teste a API

```powershell
# Health check
curl http://localhost:3001/api/health

# Login (copie o token da resposta)
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@fundacao.com\",\"password\":\"Admin@123456\"}"

# Obter conteúdo do home (público)
curl http://localhost:3001/api/home

# Listar receitas (público)
curl http://localhost:3001/api/receitas
```

### 2. Teste o Admin

1. Abra: http://localhost:3001/admin
2. Faça login
3. Edite o título no "Editor da Página Inicial"
4. Clique em "Salvar Alterações"
5. Abra o site público: http://localhost:5173
6. **Veja a mudança aplicada instantaneamente!**

### 3. Teste Receitas

1. No admin, vá em "Receitas"
2. Clique em "Nova Receita"
3. Preencha os dados:
   - Título: "Doação Empresa X"
   - Descrição: "Doação mensal"
   - Valor: 5000
   - Categoria: Doação
   - Data: Hoje
4. Salve
5. Verifique a tabela atualizada

---

## 🚀 Deploy no Railway (Produção)

Quando estiver pronto para colocar no ar:

### Guia Completo
👉 Leia: `docs/DEPLOY_RAILWAY.md` (2000+ linhas detalhadas)

### Resumo Rápido

1. **MongoDB Atlas** (obrigatório para produção)
   - Criar cluster M0 (grátis)
   - Copiar Connection String

2. **GitHub** (enviar código)
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - CMS Fundação"
   git remote add origin https://github.com/SEU-USUARIO/fundacao-cms.git
   git push -u origin main
   ```

3. **Railway** (deploy automático)
   - Criar conta: https://railway.app
   - New Project → Deploy from GitHub
   - Selecionar seu repositório
   - Configurar variáveis de ambiente

4. **Variáveis de Ambiente no Railway**
   ```env
   NODE_ENV=production
   MONGODB_URI=sua_connection_string_do_atlas
   JWT_SECRET=sua_chave_secreta_forte
   ADMIN_EMAIL=admin@fundacao.com
   ADMIN_PASSWORD=Admin@123456
   FRONTEND_URL=https://seu-projeto.up.railway.app
   ADMIN_URL=https://seu-projeto.up.railway.app/admin
   ```

5. **Acessar Online**
   - 🌐 Site: `https://seu-projeto.up.railway.app`
   - 🔐 Admin: `https://seu-projeto.up.railway.app/admin`

---

## 📁 Estrutura do Projeto

```
fundacaoescolasolidaria2003-main/
├── server/                    # 🔧 Backend
│   ├── server.js             # Servidor Express
│   ├── seed.js               # Popular banco
│   ├── config/               # Configurações
│   ├── models/               # Models MongoDB
│   ├── controllers/          # Lógica de negócio
│   ├── routes/               # Rotas da API
│   └── middleware/           # Autenticação, erros
│
├── admin/                     # 🎨 Painel Admin
│   ├── index.html            # Interface
│   └── admin.js              # Lógica do painel
│
├── src/                       # 🌐 Frontend Público
│   ├── pages/                # Páginas HTML
│   ├── styles/               # CSS
│   ├── utils/                # Utilitários (api-client.js)
│   └── main.js               # Entry point
│
├── public/assets/images/      # 🖼️ Imagens
├── docs/                      # 📚 Documentação
├── .env.example              # 🔒 Template variáveis
├── package.json              # 📦 Dependências
├── railway.json              # 🚂 Config Railway
└── README_CMS.md             # 📖 Documentação principal
```

---

## 🔧 Scripts Disponíveis

```powershell
# Desenvolvimento
npm run dev              # Servidor + Frontend (ambos)
npm run server:dev       # Apenas servidor backend
npm run client:dev       # Apenas frontend Vite

# Produção
npm start                # Iniciar servidor produção
npm run build            # Build do frontend

# Utilitários
npm run seed             # Popular banco de dados
npm run lint             # Verificar código (ESLint)
npm run format           # Formatar código (Prettier)
npm test                 # Executar testes
npm run test:coverage    # Cobertura de testes
```

---

## 🐛 Problemas Comuns

### ❌ MongoDB não conecta

```
MongoServerError: Authentication failed
```

**Solução:**
1. Verifique `.env` → `MONGODB_URI`
2. Confirme usuário/senha no MongoDB Atlas
3. Verifique se IP 0.0.0.0/0 está permitido

### ❌ npm install falha

**Solução:**
```powershell
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

### ❌ Porta 3001 em uso

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solução:**
```powershell
# Encontrar processo usando porta 3001
netstat -ano | findstr :3001

# Matar processo (substitua PID)
taskkill /PID <número> /F

# Ou mudar porta no .env
PORT=3002
```

### ❌ Admin não carrega

**Solução:**
1. Verificar se servidor está rodando: http://localhost:3001/api/health
2. Limpar cache: Ctrl+Shift+Delete
3. Abrir DevTools (F12) e ver erros no console

### ❌ Senha admin não funciona

**Solução:**
```powershell
# Recriar usuário admin
npm run seed
```

---

## 📖 Documentação Completa

- **README_CMS.md** - Guia principal do CMS
- **DEPLOY_RAILWAY.md** - Deploy detalhado (2000+ linhas)
- **PAINEL_ADMIN_COMPLETO.md** - Resumo das funcionalidades
- **architecture.md** - Documentação técnica
- **ui-guidelines.md** - Design system

---

## ✅ Checklist Pós-Instalação

- [ ] `npm install` concluído sem erros
- [ ] `.env` criado e configurado
- [ ] MongoDB conectado (Atlas ou local)
- [ ] `npm run seed` executado com sucesso
- [ ] `npm run dev` rodando
- [ ] Site público acessível (localhost:5173)
- [ ] Admin acessível (localhost:3001/admin)
- [ ] Login funcionando
- [ ] Consegue editar conteúdo do home
- [ ] Consegue adicionar receita
- [ ] API respondendo (/api/health)

---

## 🎉 Pronto!

Agora você tem um **CMS completo e profissional** rodando!

### O que você pode fazer:

✅ **Editar todo o conteúdo do site** sem mexer no código
✅ **Gerenciar receitas** financeiras
✅ **Fazer upload de imagens**
✅ **Ver estatísticas** em tempo real
✅ **Tudo remotamente** através do painel admin

### Duas URLs separadas (após deploy):

🌐 **Site público**: Para seus visitantes
🔐 **Painel admin**: Apenas para você gerenciar

### Próximo passo:

👉 Siga `docs/DEPLOY_RAILWAY.md` para colocar no ar!

---

## 📞 Precisa de Ajuda?

1. Leia a documentação em `docs/`
2. Verifique os logs: `npm run server:dev`
3. Teste a API: `curl http://localhost:3001/api/health`
4. Use MongoDB Compass para ver o banco de dados

---

**🚀 Desenvolvido com ❤️ para facilitar a gestão da Fundação Escola Solidária!**
