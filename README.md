# 🎓 Fundação Escola Solidária - Sistema Institucional v2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](https://github.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> Sistema institucional profissional desenvolvido com arquitetura modular, seguindo os princípios **SOLID**, **DRY**, **KISS** e **Clean Code**.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Funcionalidades](#funcionalidades)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

A **Fundação Escola Solidária** oferece educação inclusiva e suporte a crianças em situação de vulnerabilidade desde 2003. Este sistema institucional foi desenvolvido para:

- ✅ Fornecer informações sobre a instituição
- ✅ Facilitar o contato com responsáveis e parceiros
- ✅ Apresentar transparência nas operações
- ✅ Gerenciar documentação de alunos
- ✅ Promover a missão e valores da fundação

### 🌟 Diferenciais

- 🎨 **Design System profissional** com Dark/Light Mode
- ♿ **100% acessível** (WCAG 2.1)
- 📱 **Totalmente responsivo** (Mobile First)
- ⚡ **Performance otimizada** (Lighthouse > 90)
- 🧩 **Arquitetura modular** e escalável
- 🧪 **Testado** (unit + integration + e2e)
- 📚 **Documentação completa**

## 🛠 Tecnologias

### Core
- **HTML5** - Semântica moderna
- **CSS3** - CSS Variables, Flexbox, Grid
- **JavaScript ES6+** - Módulos, Classes, Async/Await
- **Vite** - Build tool e dev server

### Styling
- **TailwindCSS** - Utility-first CSS framework
- **CSS Variables** - Design tokens customizados
- **CSS Modules** - Estilos encapsulados

### Qualidade
- **ESLint** - Linting de código
- **Prettier** - Formatação consistente
- **Vitest** - Testes unitários e integração
- **Lighthouse** - Auditoria de performance

### Ferramentas
- **Git** - Controle de versão
- **npm/pnpm** - Gerenciamento de pacotes

## 🏗 Arquitetura

O projeto segue uma arquitetura **modular e escalável**, com separação clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│           PUBLIC LAYER                  │
│  (Assets estáticos, imagens, ícones)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        PRESENTATION LAYER               │
│  (Components, Layouts, Pages)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER            │
│  (Services, Store, Hooks)               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          UTILITY LAYER                  │
│  (Helpers, Validation, Utils)           │
└─────────────────────────────────────────┘
```

### Princípios Aplicados

- ✅ **SOLID** - Single Responsibility, Open/Closed, etc.
- ✅ **DRY** - Don't Repeat Yourself
- ✅ **KISS** - Keep It Simple, Stupid
- ✅ **Clean Code** - Código legível e manutenível
- ✅ **Component-Based** - Componentes reutilizáveis
- ✅ **Separation of Concerns** - Separação clara de responsabilidades

## 📦 Instalação

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (ou pnpm >= 8.0.0)
- **Git** >= 2.30.0

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/fundacao-escola-solidaria/website.git
   cd website
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas configurações
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Abra no navegador**
   ```
   http://localhost:3000
   ```

## 🚀 Uso

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Gera build de produção
npm run preview          # Preview do build de produção

# Qualidade
npm run lint             # Executa ESLint
npm run format           # Formata código com Prettier

# Testes
npm test                 # Executa testes
npm run test:ui          # Abre interface de testes
npm run test:coverage    # Gera relatório de cobertura

# Análise
npm run analyze          # Analisa tamanho do bundle
```

## 📁 Estrutura de Pastas

```
fundacao-escola-solidaria/
├── public/                    # Assets estáticos
│   └── assets/
│       ├── images/           # Imagens otimizadas
│       └── icons/            # Ícones SVG
│
├── src/                      # Código fonte
│   ├── assets/               # Assets do código
│   │   └── fonts/            # Fontes customizadas
│   │
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/           # Componentes comuns (Modal, Button, etc.)
│   │   └── forms/            # Componentes de formulário
│   │
│   ├── layouts/              # Layouts base (Header, Footer, Sidebar)
│   │
│   ├── pages/                # Páginas completas
│   │
│   ├── services/             # Serviços e APIs
│   │
│   ├── store/                # Gerenciamento de estado
│   │
│   ├── hooks/                # Custom hooks
│   │
│   ├── utils/                # Utilitários e helpers
│   │
│   ├── styles/               # Estilos globais
│   │   ├── variables.css     # Design tokens
│   │   └── reset.css         # CSS reset
│   │
│   ├── tests/                # Testes
│   │
│   └── main.js               # Entry point
│
├── docs/                     # Documentação
│   ├── architecture.md       # Arquitetura do sistema
│   └── ui-guidelines.md      # Guia de UI/UX
│
├── scripts/                  # Scripts de automação
│
├── .eslintrc.json           # Configuração ESLint
├── .prettierrc.json         # Configuração Prettier
├── .gitignore               # Git ignore
├── .env.example             # Exemplo de variáveis de ambiente
├── package.json             # Dependências e scripts
├── vite.config.js           # Configuração Vite
├── tailwind.config.js       # Configuração Tailwind
└── README.md                # Este arquivo
```

## ✨ Funcionalidades

### Principais

- 🏠 **Página Inicial** - Apresentação institucional
- 📋 **Sobre Nós** - História, missão, visão e valores
- 📸 **Galeria** - Fotos das atividades
- 📹 **Vídeos** - Apresentação em vídeo
- 🗺️ **Localização** - Mapa interativo
- 📞 **Contato** - Formulário de contato
- 📄 **Documentos** - Upload e gerenciamento
- 💳 **Carteirinha** - Geração de carteirinha de aluno
- 📊 **Transparência** - Receitas e despesas
- 📝 **Termos** - Termos de uso e privacidade

### Componentes

- ✅ **Modal** - Modal acessível e animado
- ✅ **Navigation** - Menu responsivo com mobile
- ✅ **Theme Toggle** - Alternância Dark/Light
- ✅ **Gallery** - Galeria com animação
- ✅ **Forms** - Formulários com validação
- ✅ **Buttons** - Botões reutilizáveis
- ✅ **Cards** - Cards informativos

## 👨‍💻 Desenvolvimento

### Convenções de Código

#### JavaScript
```javascript
// Use camelCase para variáveis e funções
const userName = 'João';
function getUserData() {}

// Use PascalCase para classes
class UserProfile {}

// Use UPPER_CASE para constantes
const API_URL = 'https://api.example.com';

// Sempre use const, evite var
const data = [];

// Documente funções com JSDoc
/**
 * Calcula a soma de dois números
 * @param {number} a - Primeiro número
 * @param {number} b - Segundo número
 * @returns {number} Soma
 */
function sum(a, b) {
  return a + b;
}
```

#### CSS
```css
/* Use kebab-case para classes */
.modal-header {}

/* Use variáveis CSS */
color: var(--color-primary-500);

/* Mobile First */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Desktop styles */
  }
}
```

### Git Workflow

```bash
# Branches principais
main        # Produção
dev         # Desenvolvimento
feature/*   # Novas funcionalidades
bugfix/*    # Correções de bugs
hotfix/*    # Correções urgentes

# Commits semânticos
feat: adiciona componente de modal
fix: corrige validação de CPF
docs: atualiza README
style: formata código
refactor: refatora função de validação
test: adiciona testes unitários
chore: atualiza dependências
```

## 🧪 Testes

### Estrutura de Testes

```javascript
// Exemplo de teste unitário
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/utils/helpers';

describe('formatCurrency', () => {
  it('should format number to BRL currency', () => {
    expect(formatCurrency(1500.50)).toBe('R$ 1.500,50');
  });

  it('should handle invalid input', () => {
    expect(formatCurrency('invalid')).toBe('R$ 0,00');
  });
});
```

### Cobertura

Mantemos **>= 80%** de cobertura de código.

```bash
npm run test:coverage
```

## ♿ Acessibilidade

### Checklist WCAG 2.1 (Nível AA)

- ✅ Contraste adequado (mínimo 4.5:1)
- ✅ Navegação por teclado
- ✅ Foco visível
- ✅ Labels e ARIA attributes
- ✅ Landmarks semânticos
- ✅ Alt text em imagens
- ✅ Skip links
- ✅ Formulários acessíveis

### Testando Acessibilidade

```bash
# Com Lighthouse
npm run build
npm run preview
# Abra DevTools > Lighthouse > Accessibility

# Com axe-core (via browser extension)
```

## ⚡ Performance

### Métricas Alvo

- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Lighthouse Score**: > 90

### Otimizações Implementadas

- ✅ Code splitting
- ✅ Lazy loading de imagens
- ✅ Minificação de assets
- ✅ Compressão gzip/brotli
- ✅ Cache de assets
- ✅ Fontes otimizadas
- ✅ CSS crítico inline

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga as convenções de código
- Adicione testes para novas funcionalidades
- Atualize a documentação
- Mantenha commits semânticos

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Maria Betânia Correia Braz de Carvalho** - Fundadora
- **Carla Fabiana Corrêa Crespo** - Co-fundadora
- **Jussaná de Barros Souza** - Co-fundadora

## 📞 Contato

- **Email**: contato@escolasolidaria.org
- **Telefone**: (21) 2661-2767
- **WhatsApp**: (21) 97308-0269
- **Endereço**: R. Goiânia, 159 - Santa Amélia, Belford Roxo - RJ

---

<p align="center">
  Feito com ❤️ pela <strong>Fundação Escola Solidária</strong>
</p>

<p align="center">
  <sub>Transformando vidas através da educação desde 2003</sub>
</p>
