# 🚀 Guia Rápido de Configuração do MongoDB Atlas

## 📋 Credenciais Anotadas:
- **Username:** carlospiquet2016_db_user
- **Password:** skp8EJkyZGlmJgcw

---

## 🔗 Como Obter a String de Conexão:

1. No MongoDB Atlas, vá ao seu cluster
2. Clique no botão **"Connect"**
3. Selecione **"Drivers"** ou **"Connect your application"**
4. Escolha:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. Copie a string de conexão mostrada

A string deve ter este formato:
```
mongodb+srv://carlospiquet2016_db_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ✏️ Editar o Arquivo .env:

Após obter a string de conexão, você precisa:

1. Substituir `<password>` pela senha: `skp8EJkyZGlmJgcw`
2. Adicionar o nome do banco `/fundacao-escola-solidaria` antes do `?`

A string final deve ficar assim:
```
mongodb+srv://carlospiquet2016_db_user:skp8EJkyZGlmJgcw@cluster0.xxxxx.mongodb.net/fundacao-escola-solidaria?retryWrites=true&w=majority
```

---

## 🎯 Próximos Passos:

Depois de configurar o .env:

1. **Reiniciar o servidor:**
   ```bash
   npm start
   ```

2. **Inicializar o banco de dados:**
   ```bash
   node server/init-complete-database.js
   ```

Isso vai criar:
- ✅ 5 alunos de exemplo
- ✅ 1 usuário admin
- ✅ 3 carteirinhas
- ✅ 3 receitas
- ✅ Conteúdo da home

---

## 🔐 Credenciais de Acesso Após Inicialização:

### Admin:
- Email: `admin@fundacao.com`
- Senha: `admin123`

### Alunos (todos com senha `123456`):
- `joao.silva`
- `maria.santos`
- `pedro.costa`
- `ana.ferreira`
- `carlos.admin` (role: admin)

---

## ❓ Me envie a string de conexão do Atlas e eu configuro tudo para você!
