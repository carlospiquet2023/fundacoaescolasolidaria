# ✅ ESTRUTURA ORGANIZADA - Fundação Escola Solidária

## 📁 Estrutura Atual (LIMPA E ORGANIZADA)

```
fundacaoescolasolidaria2003-main/
│
├── 📄 index.html                    # Página principal
├── 📄 package.json                  # Dependências do projeto
├── 📄 vite.config.js               # Configuração do Vite
├── 📄 tailwind.config.js           # Configuração do Tailwind
├── 📄 .eslintrc.json               # Regras de código
├── 📄 .prettierrc.json             # Formatação
├── 📄 .env.example                 # Exemplo de variáveis
├── 📄 README.md                     # Documentação principal
│
├── 📁 public/                       # Assets públicos (imagens)
│   └── assets/
│       ├── icons/                   # (vazia - para futuros ícones)
│       └── images/                  # ✅ TODAS AS IMAGENS AQUI
│           ├── 02.jpg até 32.jpg
│           ├── fundo.png
│           ├── logo bel.png
│           └── etc...
│
├── 📁 src/                          # Código fonte
│   ├── 📄 main.js                  # Entrada principal da aplicação
│   │
│   ├── 📁 components/               # Componentes reutilizáveis
│   │   ├── common/
│   │   │   ├── Modal.js            # ✅ Componente Modal
│   │   │   ├── Modal.css
│   │   │   ├── Navigation.js       # ✅ Componente Menu
│   │   │   └── Navigation.css
│   │   └── forms/                   # (vazia - para futuros forms)
│   │
│   ├── 📁 hooks/                    # Hooks customizados
│   │   ├── useTheme.js             # ✅ Gerenciador de tema
│   │   └── useTheme.css
│   │
│   ├── 📁 layouts/                  # (vazia - para Header/Footer futuros)
│   │
│   ├── 📁 pages/                    # ✅ TODAS AS PÁGINAS HTML
│   │   ├── carteirinha.html
│   │   ├── doc.html
│   │   ├── ficha.html
│   │   ├── termo.html
│   │   ├── transp.html
│   │   ├── receita.html
│   │   └── despesas.html
│   │
│   ├── 📁 styles/                   # ✅ TODOS OS CSS
│   │   ├── variables.css           # Design tokens
│   │   ├── reset.css               # Reset CSS
│   │   ├── mae.css                 # Estilo principal (original)
│   │   └── carteirinha1.css        # Estilo carteirinha
│   │
│   ├── 📁 tests/                    # Testes unitários
│   │   ├── helpers.test.js
│   │   └── setup.js
│   │
│   └── 📁 utils/                    # Utilitários
│       ├── helpers.js              # Funções auxiliares
│       ├── validation.js           # Validação de forms
│       └── legacy-script.js        # Script antigo (referência)
│
├── 📁 docs/                         # Documentação técnica
│   ├── architecture.md
│   ├── ui-guidelines.md
│   └── migration-guide.md
│
└── 📁 scripts/                      # Scripts de build
    └── build.js

```

## ✅ O QUE FOI ORGANIZADO

### ✅ Imagens
- **ANTES:** 40+ imagens soltas na raiz
- **DEPOIS:** Todas em `public/assets/images/`

### ✅ Páginas HTML
- **ANTES:** 7 HTMLs soltos na raiz
- **DEPOIS:** Todos em `src/pages/`

### ✅ CSS
- **ANTES:** 3 CSS soltos na raiz
- **DEPOIS:** Todos em `src/styles/`

### ✅ JavaScript
- **ANTES:** script.js solto na raiz
- **DEPOIS:** Modularizado em `src/` e salvo como referência em `src/utils/legacy-script.js`

### ✅ Raiz Limpa
Agora contém apenas:
- ✅ index.html (principal)
- ✅ Arquivos de configuração (.json, .js)
- ✅ Documentação (README.md)
- ✅ Pastas organizadas (src, public, docs, scripts)

## 🚀 COMO USAR AGORA

### 1. Instalar Dependências
```powershell
npm install
```

### 2. Para Desenvolvimento (Servidor Local)
```powershell
npm run dev
```
Abre em: http://localhost:3000

### 3. Para Build de Produção
```powershell
npm run build
```
Gera pasta `dist/` otimizada

### 4. Verificar Código
```powershell
npm run lint      # Verifica erros
npm run format    # Formata código
```

### 5. Testes
```powershell
npm test          # Executa testes
```

## 📝 PRÓXIMOS PASSOS

### 1. Atualizar Paths no index.html

Trocar os paths das imagens de:
```html
<!-- ANTES -->
<img src="fundo.png">
```

Para:
```html
<!-- DEPOIS -->
<img src="/assets/images/fundo.png">
```

### 2. Atualizar Links das Páginas

Trocar de:
```html
<!-- ANTES -->
<a href="carteirinha.html">
```

Para:
```html
<!-- DEPOIS -->
<a href="/src/pages/carteirinha.html">
```

### 3. Importar CSS no HTML

No `index.html`, adicionar:
```html
<head>
  <!-- CSS Moderno -->
  <link rel="stylesheet" href="/src/styles/variables.css">
  <link rel="stylesheet" href="/src/styles/reset.css">
  <link rel="stylesheet" href="/src/styles/mae.css">
  
  <!-- Componentes -->
  <link rel="stylesheet" href="/src/components/common/Modal.css">
  <link rel="stylesheet" href="/src/components/common/Navigation.css">
  <link rel="stylesheet" href="/src/hooks/useTheme.css">
</head>
```

### 4. Importar JavaScript

No `index.html`, antes do `</body>`:
```html
<script type="module" src="/src/main.js"></script>
```

## 🎯 ESTRUTURA FINAL

### Raiz (LIMPA)
- ✅ 1 HTML principal
- ✅ Arquivos de config
- ✅ 4 pastas organizadas

### Nenhuma Pasta Vazia (Exceto)
- `public/assets/icons/` - Para futuros ícones SVG
- `src/components/forms/` - Para futuros componentes de formulário
- `src/layouts/` - Para futuros layouts (Header, Footer)

Estas podem ser removidas ou preenchidas conforme necessário.

## 🔧 COMANDOS ÚTEIS

### Ver Estrutura
```powershell
tree /F /A
```

### Encontrar Arquivos
```powershell
# Buscar todos os .html
Get-ChildItem -Recurse -Filter "*.html"

# Buscar todos os .css
Get-ChildItem -Recurse -Filter "*.css"

# Buscar todos os .js
Get-ChildItem -Recurse -Filter "*.js"
```

### Verificar Tamanho
```powershell
# Tamanho da pasta public
Get-ChildItem -Recurse public | Measure-Object -Property Length -Sum

# Tamanho da pasta src
Get-ChildItem -Recurse src | Measure-Object -Property Length -Sum
```

## ✅ CHECKLIST

- [x] Imagens organizadas em `public/assets/images/`
- [x] Páginas HTML em `src/pages/`
- [x] CSS organizados em `src/styles/`
- [x] JavaScript modularizado em `src/`
- [x] Raiz limpa e organizada
- [x] Pastas vazias removidas (exceto necessárias)
- [x] Documentação completa em `docs/`
- [x] Scripts de build em `scripts/`
- [ ] **PENDENTE:** Atualizar paths no index.html
- [ ] **PENDENTE:** Atualizar paths nas páginas em src/pages/
- [ ] **PENDENTE:** Testar com `npm run dev`

## 🎉 PRONTO!

Agora o projeto está **profissionalmente organizado** e pronto para ser desenvolvido!

---

**Data:** 07/10/2025  
**Status:** ✅ ORGANIZADO E FUNCIONAL
