# ============================================================================
# GUIA COMPLETO DE DEPLOY NO RAILWAY
# Sistema CMS - Fundação Escola Solidária
# ============================================================================

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Configurar MongoDB Atlas](#configurar-mongodb-atlas)
3. [Deploy no Railway](#deploy-no-railway)
4. [Configurar Variáveis de Ambiente](#configurar-variáveis-de-ambiente)
5. [Configurar Domínios](#configurar-domínios)
6. [Primeiro Acesso](#primeiro-acesso)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Pré-requisitos

- [ ] Conta no Railway (https://railway.app)
- [ ] Conta no MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- [ ] Conta no GitHub (para conectar repositório)
- [ ] Git instalado na máquina

---

## 📦 1. Configurar MongoDB Atlas

### Passo 1: Criar Conta e Cluster

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Clique em **"Build a Database"**
4. Escolha o plano **FREE (M0 Sandbox)**
5. Selecione uma região próxima (ex: São Paulo, AWS)
6. Clique em **"Create Cluster"**

### Passo 2: Configurar Acesso

1. Em **Security > Database Access**:
   - Clique em **"Add New Database User"**
   - Username: `admin-fundacao`
   - Password: **Gere uma senha forte** (copie e salve!)
   - Database User Privileges: `Atlas Admin`
   - Clique em **"Add User"**

2. Em **Security > Network Access**:
   - Clique em **"Add IP Address"**
   - Selecione **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Clique em **"Confirm"**

### Passo 3: Obter Connection String

1. Volte para **Databases**
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copie a **Connection String**:
   ```
   mongodb+srv://admin-fundacao:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Substitua `<password>` pela senha real que você criou**
7. Adicione o nome do banco no final:
   ```
   mongodb+srv://admin-fundacao:SUA_SENHA@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority
   ```

✅ **Salve esta Connection String - você vai usar no Railway!**

---

## 🚀 2. Deploy no Railway

### Opção A: Deploy via GitHub (Recomendado)

1. **Criar repositório no GitHub**:
   ```powershell
   cd "c:\Users\pique\OneDrive\Área de Trabalho\fundacaoescolasolidaria2003-main"
   git init
   git add .
   git commit -m "Initial commit - CMS Fundação Escola Solidária"
   ```

2. No GitHub, crie um novo repositório (https://github.com/new):
   - Nome: `fundacao-escola-solidaria-cms`
   - Privado ou Público (sua escolha)
   - **NÃO** inicialize com README

3. Conecte e envie o código:
   ```powershell
   git remote add origin https://github.com/SEU-USUARIO/fundacao-escola-solidaria-cms.git
   git branch -M main
   git push -u origin main
   ```

4. **No Railway**:
   - Acesse: https://railway.app
   - Clique em **"New Project"**
   - Escolha **"Deploy from GitHub repo"**
   - Selecione seu repositório
   - Aguarde o deploy automático

### Opção B: Deploy via CLI do Railway

```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy
railway up
```

---

## ⚙️ 3. Configurar Variáveis de Ambiente

No Railway, acesse seu projeto e vá em **Variables**:

```env
# Ambiente
NODE_ENV=production

# MongoDB Atlas (cole sua connection string aqui!)
MONGODB_URI=mongodb+srv://admin-fundacao:SUA_SENHA@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority

# JWT Secret (gere uma chave segura)
JWT_SECRET=sua_chave_super_secreta_aqui_use_gerador_online
JWT_EXPIRE=7d

# Admin padrão (primeira execução)
ADMIN_EMAIL=admin@fundacao.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Administrador

# URLs (preencher após gerar domínios)
FRONTEND_URL=https://seu-projeto.up.railway.app
ADMIN_URL=https://seu-projeto.up.railway.app/admin

# Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=5
AUTH_RATE_LIMIT_WINDOW_MS=900000
```

### 🔐 Como gerar JWT_SECRET forte

Opção 1 - Usando Node.js:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Opção 2 - Online:
- Acesse: https://www.grc.com/passwords.htm
- Copie a chave gerada de 63 caracteres

---

## 🌐 4. Configurar Domínios

### Opção A: Usar Domínio do Railway (Grátis)

Após o deploy, o Railway gera um domínio automático:
- **Site público**: `https://seu-projeto.up.railway.app`
- **Painel admin**: `https://seu-projeto.up.railway.app/admin`

### Opção B: Usar Domínio Próprio

1. No Railway, vá em **Settings > Domains**
2. Clique em **"Add Custom Domain"**
3. Digite seu domínio (ex: `fundacao.com.br`)
4. Copie o **CNAME** fornecido pelo Railway
5. No seu provedor de DNS, adicione:
   ```
   Tipo: CNAME
   Nome: @ (ou www)
   Valor: seu-projeto.up.railway.app
   ```

Para ter **duas URLs separadas** (site e admin):

**Site principal**: `fundacao.com.br`
```
CNAME @ → seu-projeto.up.railway.app
```

**Admin**: `admin.fundacao.com.br`
```
CNAME admin → seu-projeto.up.railway.app
```

Depois, atualize as variáveis de ambiente:
```env
FRONTEND_URL=https://fundacao.com.br
ADMIN_URL=https://admin.fundacao.com.br
```

---

## 🎉 5. Primeiro Acesso

### Acesso ao Site Público

Abra: `https://seu-projeto.up.railway.app`

### Acesso ao Painel Admin

1. Abra: `https://seu-projeto.up.railway.app/admin`
2. Use as credenciais configuradas:
   - **Email**: admin@fundacao.com
   - **Senha**: Admin@123456

⚠️ **IMPORTANTE**: Altere a senha imediatamente após primeiro login!

### Criar Usuário Admin (Alternativa)

Se o usuário padrão não funcionar, você pode criar via MongoDB Compass:

1. Instale MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Conecte usando sua Connection String
3. Navegue até a coleção `users`
4. Execute o seed script:

```powershell
# No seu terminal local
node server/seed.js
```

---

## 📡 6. Testar API

### Verificar Status da API

```bash
curl https://seu-projeto.up.railway.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-XX...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Testar Login

```bash
curl -X POST https://seu-projeto.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fundacao.com","password":"Admin@123456"}'
```

---

## 🐛 7. Troubleshooting

### Problema: Erro ao conectar MongoDB

**Sintoma**: `MongoServerError: Authentication failed`

**Solução**:
1. Verifique se a senha na Connection String está correta
2. Verifique se o IP 0.0.0.0/0 está permitido em Network Access
3. Verifique se o usuário tem permissões corretas

### Problema: Página 404 no admin

**Sintoma**: Admin não carrega, erro 404

**Solução**:
1. Verifique se os arquivos estão na pasta `/admin`
2. Verifique logs do Railway: `railway logs`
3. Confirme que o build foi concluído

### Problema: CORS Error

**Sintoma**: `Access-Control-Allow-Origin` error

**Solução**:
Atualize variáveis de ambiente com URLs corretas:
```env
FRONTEND_URL=https://seu-dominio-exato.com
ADMIN_URL=https://admin.seu-dominio-exato.com
ALLOWED_ORIGINS=https://seu-dominio-exato.com,https://admin.seu-dominio-exato.com
```

### Problema: Build falhou

**Solução**:
```powershell
# Testar build localmente
npm install
npm run build

# Ver logs do Railway
railway logs
```

### Problema: Senha admin não funciona

**Solução**:
1. Verifique variável `ADMIN_PASSWORD` no Railway
2. Delete o usuário existente no MongoDB
3. Redeploy o projeto (cria novo usuário)

---

## 📞 Suporte Adicional

### Logs do Servidor

No Railway:
```
Menu > Deployments > Ver logs
```

Ou via CLI:
```powershell
railway logs
```

### Reiniciar Servidor

```powershell
railway restart
```

### Backup do Banco de Dados

No MongoDB Atlas:
1. Cluster > ... (três pontos)
2. **"Take Snapshot Now"**
3. Escolha frequência de backups automáticos

---

## ✅ Checklist Final

- [ ] MongoDB Atlas configurado e acessível
- [ ] Connection String salva e testada
- [ ] Projeto no Railway criado
- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET gerado (forte e único)
- [ ] Build concluído com sucesso
- [ ] Domínio configurado (ou usando domínio Railway)
- [ ] Admin acessível e login funcionando
- [ ] Site público carregando
- [ ] API respondendo (`/api/health`)
- [ ] Senha do admin alterada

---

## 🎓 Próximos Passos

1. **Personalizar Conteúdo**:
   - Acesse o admin
   - Edite a página inicial
   - Adicione receitas

2. **Configurar Backups**:
   - Ative backups automáticos no MongoDB Atlas
   - Considere exportar dados periodicamente

3. **Monitoramento**:
   - Configure alertas no Railway
   - Monitore logs regularmente

4. **Segurança**:
   - Altere todas as senhas padrão
   - Mantenha JWT_SECRET privado
   - Ative 2FA no MongoDB e Railway

---

**🎉 Parabéns! Seu CMS está no ar!** 🚀

Para qualquer dúvida, consulte:
- Documentação Railway: https://docs.railway.app
- Documentação MongoDB Atlas: https://docs.atlas.mongodb.com
- Repositório do projeto: [adicione aqui]
