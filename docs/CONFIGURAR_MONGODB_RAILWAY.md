# 🔧 Como Configurar MongoDB no Railway

## ❌ Problema Atual

Você está vendo este erro nos logs do Railway:
```
Erro ao conectar MongoDB:
connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**Causa:** A aplicação está tentando conectar ao MongoDB local (localhost:27017), mas no Railway você precisa de um banco de dados cloud.

---

## ✅ Soluções

### **Opção 1: MongoDB Atlas (Recomendado) - Gratuito**

#### Passo 1: Criar conta no MongoDB Atlas
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Clique em "Try Free"
3. Crie sua conta (pode usar Google/GitHub)

#### Passo 2: Criar um Cluster Gratuito
1. Após o login, clique em "Build a Database"
2. Escolha o plano **FREE** (M0 Sandbox)
3. Escolha a região mais próxima (ex: São Paulo - aws/sa-east-1)
4. Clique em "Create Cluster"

#### Passo 3: Configurar Acesso
1. **Criar usuário do banco:**
   - Username: `fundacao-admin`
   - Password: (gere uma senha forte e **SALVE em local seguro**)
   - Clique em "Create User"

2. **Permitir acesso de qualquer IP:**
   - Em "Network Access" > "Add IP Address"
   - Clique em "Allow Access from Anywhere"
   - IP: `0.0.0.0/0`
   - Clique em "Confirm"

#### Passo 4: Obter String de Conexão
1. Volte para "Database" > Clique em "Connect"
2. Escolha "Connect your application"
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copie a string de conexão, algo como:
   ```
   mongodb+srv://fundacao-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANTE:** Substitua `<password>` pela senha real do usuário
6. Adicione o nome do banco ao final: `/fundacao-escola-solidaria`
   ```
   mongodb+srv://fundacao-admin:SuaSenha123@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority
   ```

#### Passo 5: Configurar no Railway
1. Abra seu projeto no Railway
2. Clique no serviço "fundacaoescolasolidaria"
3. Vá em **"Variables"** (aba superior)
4. Clique em **"+ New Variable"**
5. Adicione:
   - **Variable:** `MONGODB_URI`
   - **Value:** (cole a string de conexão completa do Atlas)
6. Clique em "Add"
7. O Railway irá fazer **redeploy automático**

#### Passo 6: Verificar
1. Vá em **"Deployments"**
2. Aguarde o novo deploy terminar
3. Vá em **"Logs"** e procure por:
   ```
   ✅ MongoDB conectado: cluster0-xxxxx.mongodb.net
   ```

---

### **Opção 2: MongoDB Plugin do Railway**

#### Passo 1: Adicionar Plugin
1. No seu projeto Railway
2. Clique em **"+ New"** (canto superior direito)
3. Selecione **"Database"**
4. Escolha **"Add MongoDB"**
5. Aguarde a criação (1-2 minutos)

#### Passo 2: Conectar ao Serviço
1. O Railway criará automaticamente uma variável `MONGO_URL`
2. Você precisa renomeá-la ou criar uma nova:
   - Vá no serviço "fundacaoescolasolidaria"
   - Em "Variables", adicione:
     - **Variable:** `MONGODB_URI`
     - **Value:** `${{MongoDB.MONGO_URL}}`
   - Isso faz referência à URL do MongoDB plugin

#### Passo 3: Verificar
1. Aguarde o redeploy
2. Verifique os logs para confirmar conexão

---

## 🔍 Variáveis de Ambiente Necessárias no Railway

Configure **TODAS** estas variáveis no Railway:

```bash
# MongoDB (OBRIGATÓRIO)
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority

# JWT (OBRIGATÓRIO)
JWT_SECRET=fundacao_escola_solidaria_secret_key_2024_super_segura_railway
JWT_EXPIRES_IN=7d

# Porta (Railway configura automaticamente, mas pode adicionar)
PORT=3000

# Node Environment
NODE_ENV=production
```

---

## ✅ Checklist de Verificação

Após configurar, verifique:

- [ ] Variável `MONGODB_URI` está configurada no Railway
- [ ] String de conexão está correta (sem `<password>` ou `<username>`)
- [ ] IP 0.0.0.0/0 está permitido no MongoDB Atlas (se usar Atlas)
- [ ] Deploy foi realizado com sucesso
- [ ] Logs mostram "✅ MongoDB conectado"
- [ ] Aplicação está rodando sem erros

---

## 🆘 Problemas Comuns

### Erro: "Authentication failed"
- Verifique se a senha na string de conexão está correta
- Senha especiais precisam ser URL-encoded (use: https://www.urlencoder.org/)

### Erro: "Could not connect to any servers"
- Verifique se o IP 0.0.0.0/0 está permitido no MongoDB Atlas
- Aguarde 1-2 minutos para propagação das configurações

### Erro: "ECONNREFUSED"
- A variável `MONGODB_URI` não está configurada
- Verifique se não tem espaços extras na variável

---

## 📞 Precisa de Ajuda?

Se continuar com problemas:
1. Tire um print das variáveis configuradas no Railway
2. Copie os logs de erro completos
3. Verifique se o MongoDB Atlas está online (Dashboard do Atlas)
