# Fundação Escola Solidária - CMS Completo 🚀

Sistema de gerenciamento de conteúdo (CMS) profissional para a Fundação Escola Solidária, com painel administrativo e API REST completa.

## 🎯 Funcionalidades

### ✨ Painel Administrativo
- 🔐 **Autenticação segura** com JWT e controle de acesso
- 📝 **Editor visual** para página inicial (hero, sobre, contato, etc.)
- 💰 **Gestão completa de receitas** financeiras
- 📊 **Dashboard** com estatísticas e relatórios
- 🖼️ **Gerenciador de galeria** com upload de imagens
- 📱 **Interface responsiva** e moderna (TailwindCSS)

### 🔌 API REST
- **Autenticação**: `/api/auth` - Login, perfil, logout
- **Home**: `/api/home` - CRUD do conteúdo da página inicial
- **Receitas**: `/api/receitas` - Gestão financeira completa
- **Upload**: `/api/upload` - Upload e gerenciamento de imagens
- **Health Check**: `/api/health` - Status do servidor

### 🛡️ Segurança
- ✅ Autenticação JWT com tokens seguros
- ✅ Rate limiting contra brute force
- ✅ Proteção CSRF e XSS
- ✅ Sanitização de dados (MongoDB injection)
- ✅ Headers de segurança (Helmet)
- ✅ CORS configurado
- ✅ HTTPS enforced em produção

### 📦 Banco de Dados
- **MongoDB** com Mongoose ORM
- **Models completos**:
  - `User` - Usuários administradores
  - `HomeContent` - Conteúdo da página inicial
  - `Receita` - Gestão financeira
- **Validações** automáticas
- **Timestamps** e auditoria

## 🏗️ Arquitetura

```
fundacaoescolasolidaria2003-main/
├── server/                    # Backend Node.js
│   ├── config/               # Configurações
│   │   └── database.js       # Conexão MongoDB
│   ├── models/               # Models Mongoose
│   │   ├── User.js           # Usuários admin
│   │   ├── HomeContent.js    # Conteúdo do site
│   │   └── Receita.js        # Receitas financeiras
│   ├── controllers/          # Lógica de negócio
│   │   ├── auth.controller.js
│   │   ├── home.controller.js
│   │   └── receitas.controller.js
│   ├── routes/               # Rotas da API
│   │   ├── auth.routes.js
│   │   ├── home.routes.js
│   │   ├── receitas.routes.js
│   │   └── upload.routes.js
│   ├── middleware/           # Middlewares
│   │   ├── auth.js           # Autenticação JWT
│   │   ├── errorHandler.js   # Tratamento de erros
│   │   └── upload.js         # Upload de arquivos
│   ├── server.js             # Servidor Express
│   └── seed.js               # Script de dados iniciais
├── admin/                     # Painel administrativo
│   ├── index.html            # Interface do admin
│   └── admin.js              # Lógica do painel
├── public/                    # Arquivos públicos
│   └── assets/images/        # Imagens do site
├── src/                       # Frontend público
│   ├── pages/                # Páginas HTML
│   ├── styles/               # CSS
│   ├── components/           # Componentes JS
│   └── main.js               # Entry point
├── docs/                      # Documentação
│   └── DEPLOY_RAILWAY.md     # Guia completo de deploy
├── .env.example              # Exemplo de variáveis
├── package.json              # Dependências
├── railway.json              # Config Railway
└── README_CMS.md             # Este arquivo
```

## 🚀 Instalação Local

### 1. Pré-requisitos

- Node.js 18+ (https://nodejs.org)
- MongoDB local OU MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- Git

### 2. Clonar e Instalar

```powershell
# Clonar repositório
cd "c:\Users\pique\OneDrive\Área de Trabalho\fundacaoescolasolidaria2003-main"

# Instalar dependências
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz:

```env
# Ambiente
NODE_ENV=development

# Servidor
PORT=3001

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/fundacao-escola-solidaria

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRE=7d

# Admin padrão
ADMIN_EMAIL=admin@fundacao.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Administrador
```

### 4. Iniciar MongoDB Local (Opcional)

Se estiver usando MongoDB local:

```powershell
# Instalar MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Iniciar serviço
mongod
```

Ou use MongoDB Atlas (veja [guia de deploy](docs/DEPLOY_RAILWAY.md)).

### 5. Popular Banco de Dados

```powershell
npm run seed
```

### 6. Iniciar Aplicação

```powershell
# Desenvolvimento (servidor + frontend)
npm run dev

# Apenas servidor
npm run server:dev

# Apenas frontend
npm run client:dev
```

Acesse:
- **Site público**: http://localhost:5173
- **API**: http://localhost:3001/api
- **Admin**: http://localhost:3001/admin

### 7. Login no Admin

- **URL**: http://localhost:3001/admin
- **Email**: admin@fundacao.com
- **Senha**: Admin@123456

⚠️ **Altere a senha após primeiro acesso!**

## 📡 Endpoints da API

### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@fundacao.com",
  "password": "Admin@123456"
}
```

### Obter Conteúdo do Home

```http
GET /api/home
```

### Atualizar Conteúdo do Home (Requer Auth)

```http
PUT /api/home
Authorization: Bearer {token}
Content-Type: application/json

{
  "hero": {
    "title": "Novo Título",
    "subtitle": "Novo Subtítulo"
  }
}
```

### Listar Receitas

```http
GET /api/receitas?page=1&limit=10&categoria=doacao
```

### Criar Receita (Requer Auth)

```http
POST /api/receitas
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Doação Empresa X",
  "descricao": "Doação mensal",
  "categoria": "doacao",
  "valor": 5000,
  "dataReceita": "2024-01-15"
}
```

## 🌐 Deploy no Railway

Consulte o **[Guia Completo de Deploy](docs/DEPLOY_RAILWAY.md)** para instruções detalhadas.

### Resumo Rápido

1. **Criar conta** no Railway e MongoDB Atlas
2. **Configurar MongoDB Atlas**:
   - Criar cluster gratuito
   - Adicionar usuário e permitir acesso (0.0.0.0/0)
   - Copiar Connection String
3. **Deploy no Railway**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU-USUARIO/fundacao-cms.git
   git push -u origin main
   ```
4. **Configurar variáveis** no Railway (ver `.env.example`)
5. **Acessar**:
   - Site: `https://seu-projeto.up.railway.app`
   - Admin: `https://seu-projeto.up.railway.app/admin`

## 📚 Documentação Adicional

- **[Guia de Deploy Railway](docs/DEPLOY_RAILWAY.md)** - Deploy completo passo a passo
- **[Arquitetura do Sistema](docs/architecture.md)** - Documentação técnica detalhada
- **[Guia de UI](docs/ui-guidelines.md)** - Design system e componentes

## 🔧 Scripts Disponíveis

```powershell
# Desenvolvimento
npm run dev              # Servidor + Frontend (concorrente)
npm run server:dev       # Apenas servidor (nodemon)
npm run client:dev       # Apenas frontend (Vite)

# Produção
npm start                # Iniciar servidor produção
npm run build            # Build do frontend

# Utilitários
npm run seed             # Popular banco com dados iniciais
npm run lint             # Verificar código (ESLint)
npm run format           # Formatar código (Prettier)
npm test                 # Executar testes
npm run test:coverage    # Cobertura de testes
```

## 🧪 Testar Localmente

### 1. Teste da API

```powershell
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@fundacao.com\",\"password\":\"Admin@123456\"}"
```

### 2. Teste do Admin

1. Abra: http://localhost:3001/admin
2. Faça login com credenciais padrão
3. Teste todas as funcionalidades:
   - Dashboard com estatísticas
   - Editor da página inicial
   - Gerenciamento de receitas
   - Upload de imagens

### 3. Teste do Site Público

1. Abra: http://localhost:5173
2. Verifique se conteúdo carrega da API
3. Teste responsividade (mobile/desktop)

## 🐛 Troubleshooting

### MongoDB não conecta

```
❌ Erro: MongoServerError: Authentication failed
```

**Solução**:
1. Verifique se MongoDB está rodando: `mongod`
2. Verifique Connection String no `.env`
3. Confirme usuário/senha no MongoDB Atlas

### Erro de CORS

```
❌ Access to fetch blocked by CORS policy
```

**Solução**:
Adicione variável de ambiente:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Admin não carrega

**Solução**:
1. Verifique se servidor está rodando: http://localhost:3001/api/health
2. Limpe cache do navegador
3. Verifique console do navegador (F12)

### Senha admin não funciona

**Solução**:
```powershell
# Recriar usuário admin
npm run seed
```

## 📞 Suporte

### Logs do Servidor

```powershell
# Ver logs em tempo real
npm run server:dev
```

### Verificar Banco de Dados

Use MongoDB Compass: https://www.mongodb.com/try/download/compass

1. Conecte com sua Connection String
2. Navegue pelas coleções: `users`, `homecontents`, `receitas`

## 🎓 Próximos Passos

### Melhorias Futuras

- [ ] Dashboard com gráficos (Chart.js)
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Sistema de notificações
- [ ] Controle de permissões granular
- [ ] Multi-idioma (i18n)
- [ ] Versionamento de conteúdo
- [ ] Preview antes de publicar
- [ ] Agendamento de publicações

### Integrações

- [ ] Email (SendGrid/Mailgun)
- [ ] SMS (Twilio)
- [ ] Analytics (Google Analytics)
- [ ] Pagamentos (Stripe/PagSeguro)
- [ ] Social Login (Google/Facebook)

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Contato

Fundação Escola Solidária
- Email: contato@fundacao.com
- Website: https://seu-site.com.br

---

**Desenvolvido com ❤️ para transformar vidas através da educação**

---

## ✅ Checklist de Deploy

- [ ] Código no GitHub
- [ ] MongoDB Atlas configurado
- [ ] Railway projeto criado
- [ ] Variáveis de ambiente definidas
- [ ] Build concluído com sucesso
- [ ] Admin acessível e funcionando
- [ ] API respondendo corretamente
- [ ] Site público carregando
- [ ] Senha admin alterada
- [ ] Backups configurados
- [ ] Monitoramento ativo

🎉 **Pronto para usar!** 🚀
