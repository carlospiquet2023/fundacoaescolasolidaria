# 🚀 Como Criar as Tabelas no MongoDB

## ✅ Passo a Passo Completo

### **1️⃣ Configurar MongoDB no Railway (PRIMEIRO)**

Sem o MongoDB configurado, NADA funciona! Escolha uma opção:

#### **Opção A: Plugin MongoDB Railway** ⚡ (Mais Rápido)
1. No Railway, clique **+ New** → **Database** → **Add MongoDB**
2. Aguarde 1-2 minutos
3. Vá em seu serviço → **Variables**
4. Adicione:
   ```
   MONGODB_URI = ${{MongoDB.MONGO_URL}}
   JWT_SECRET = fundacao_escola_solidaria_secret_2024
   NODE_ENV = production
   ```

#### **Opção B: MongoDB Atlas** 🌐 (Recomendado)
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie cluster FREE
3. Configure usuário e IP `0.0.0.0/0`
4. Copie string de conexão
5. No Railway → Variables → adicione `MONGODB_URI`

---

### **2️⃣ Aguardar Redeploy e Verificar Conexão**

1. Railway vai fazer redeploy automático
2. Vá em **Logs**
3. Procure por: `✅ MongoDB conectado: cluster0...`

**Se ver isso, está conectado! Pode prosseguir** ✅

---

### **3️⃣ Inicializar o Banco de Dados**

Agora que o MongoDB está conectado, você pode criar as tabelas de 2 formas:

#### **Forma 1: API Endpoint** (Recomendado) ✨

**Passo 1:** Verificar se já foi inicializado
```
GET https://fundacoaescolasolidaria-production.up.railway.app/api/setup/status
```

**Passo 2:** Inicializar (se necessário)
```
POST https://fundacoaescolasolidaria-production.up.railway.app/api/setup/init
```

**Você pode usar:**
- Navegador (cole a URL do POST)
- Postman
- Thunder Client (VS Code)
- Ou simplesmente:

```bash
curl -X POST https://fundacoaescolasolidaria-production.up.railway.app/api/setup/init
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Banco de dados inicializado com sucesso!",
  "data": {
    "adminEmail": "admin@fundacao.com",
    "adminPassword": "Admin@123456",
    "homeContentCreated": true
  }
}
```

---

#### **Forma 2: Script Manual** (Terminal)

Se preferir rodar localmente com MongoDB local:

```bash
cd "C:\Users\pique\OneDrive\Área de Trabalho\fundacaoescolasolidaria2003-main"
node server/init-database.js
```

⚠️ **Mas isso só funciona se você tiver MongoDB instalado localmente!**

---

### **4️⃣ Verificar se Funcionou**

Depois de inicializar, teste o login:

1. Acesse: `https://fundacoaescolasolidaria-production.up.railway.app/admin`
2. Use as credenciais:
   - **Email:** `admin@fundacao.com`
   - **Senha:** `Admin@123456`
3. Se logar com sucesso = **TUDO CERTO!** 🎉

---

## 📊 O Que Será Criado

Ao inicializar, estas collections (tabelas) serão criadas:

### **1. users**
- Usuário admin padrão
- Email: `admin@fundacao.com`
- Senha: `Admin@123456`

### **2. homecontents**
- Conteúdo padrão da página inicial
- Seções: hero, about, programs, gallery, contact

### **3. receitas**
- Vazio inicialmente
- Para gerenciar receitas financeiras

### **4. alunos** (criado automaticamente quando necessário)
- Para gerenciar alunos

---

## 🔍 Troubleshooting

### Erro: "Cannot connect to MongoDB"
❌ **Causa:** Variável `MONGODB_URI` não configurada no Railway
✅ **Solução:** Volte ao Passo 1 e configure o MongoDB

### Erro: "Banco já foi inicializado"
❌ **Causa:** Você já rodou o init antes
✅ **Solução:** Está tudo certo! Use as credenciais de admin

### Erro: "Invalid credentials"
❌ **Causa:** Banco não foi inicializado ou senha incorreta
✅ **Solução:** Rode o `/api/setup/init` novamente ou verifique a senha

---

## 📋 Checklist Rápido

- [ ] MongoDB configurado no Railway (variável `MONGODB_URI`)
- [ ] Logs mostram "MongoDB conectado"
- [ ] Rodou `POST /api/setup/init`
- [ ] Recebeu resposta de sucesso
- [ ] Consegue fazer login no `/admin`

**Tudo marcado? Parabéns! Seu sistema está funcionando!** 🎉

---

## 💡 Próximos Passos

Após tudo funcionar:

1. **Altere a senha do admin** (primeira coisa!)
2. Configure conteúdo da home
3. Cadastre alunos
4. Configure receitas

**Boa sorte!** 🚀
