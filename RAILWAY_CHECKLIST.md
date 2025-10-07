# ⚡ Checklist Rápido - Deploy Railway

## 🔥 PROBLEMA ATUAL
Erro: `ECONNREFUSED 127.0.0.1:27017` - MongoDB não configurado!

## ✅ SOLUÇÃO RÁPIDA

### 1️⃣ Criar MongoDB Atlas (5 minutos)
- [ ] Acesse: https://www.mongodb.com/cloud/atlas
- [ ] Crie conta gratuita
- [ ] Crie cluster FREE (M0)
- [ ] Crie usuário do banco
- [ ] Permita IP: `0.0.0.0/0`
- [ ] Copie string de conexão

### 2️⃣ Configurar Railway (2 minutos)
- [ ] Abra seu projeto: https://railway.app
- [ ] Vá em **Variables**
- [ ] Adicione:
  ```
  MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority
  ```
- [ ] Adicione também:
  ```
  JWT_SECRET=fundacao_escola_solidaria_secret_key_2024_super_segura_railway
  NODE_ENV=production
  ```

### 3️⃣ Verificar (1 minuto)
- [ ] Aguarde redeploy automático
- [ ] Vá em **Logs**
- [ ] Procure por: `✅ MongoDB conectado`

## 📚 Guia Completo
Veja o guia detalhado em: `docs/CONFIGURAR_MONGODB_RAILWAY.md`

## 🆘 Alternativa Rápida
Use o MongoDB Plugin do Railway:
1. Clique em **+ New** > **Database** > **MongoDB**
2. Configure `MONGODB_URI=${{MongoDB.MONGO_URL}}`
3. Pronto! ✅
