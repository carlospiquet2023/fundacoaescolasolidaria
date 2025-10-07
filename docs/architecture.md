# 🏗️ Arquitetura do Sistema

## Visão Geral

Este documento descreve a arquitetura do sistema institucional da Fundação Escola Solidária, detalhando decisões técnicas, padrões utilizados e fluxos de dados.

## Princípios Arquiteturais

### 1. Separation of Concerns (SoC)
- **Apresentação**: Componentes UI isolados
- **Lógica de Negócio**: Services e Store
- **Utilitários**: Helpers reutilizáveis
- **Estilização**: CSS modular e Design Tokens

### 2. SOLID Principles

#### Single Responsibility
Cada módulo tem uma única responsabilidade bem definida.
```javascript
// ✅ BOM - Responsabilidade única
class Modal {
  open() { /* abre modal */ }
  close() { /* fecha modal */ }
}

class ModalValidator {
  validate() { /* valida dados */ }
}
```

#### Open/Closed
Aberto para extensão, fechado para modificação.
```javascript
// ✅ BOM - Extensível via options
class Modal {
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }
}
```

#### Liskov Substitution
Subtipos devem ser substituíveis por seus tipos base.

#### Interface Segregation
Interfaces específicas ao invés de uma genérica.

#### Dependency Inversion
Depender de abstrações, não de implementações concretas.

### 3. DRY (Don't Repeat Yourself)
- Funções utilitárias centralizadas em `/utils`
- Componentes reutilizáveis em `/components`
- Estilos compartilhados via CSS Variables

### 4. KISS (Keep It Simple, Stupid)
- Código legível e autoexplicativo
- Evitar complexidade desnecessária
- Preferir soluções simples e diretas

## Estrutura de Camadas

```
┌──────────────────────────────────────────────┐
│            PRESENTATION LAYER                │
│  ┌────────────┐  ┌────────────┐             │
│  │ Components │  │  Layouts   │             │
│  └────────────┘  └────────────┘             │
│  ┌────────────┐                              │
│  │   Pages    │                              │
│  └────────────┘                              │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│          BUSINESS LOGIC LAYER                │
│  ┌────────────┐  ┌────────────┐             │
│  │  Services  │  │   Store    │             │
│  └────────────┘  └────────────┘             │
│  ┌────────────┐                              │
│  │   Hooks    │                              │
│  └────────────┘                              │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│             UTILITY LAYER                    │
│  ┌────────────┐  ┌────────────┐             │
│  │  Helpers   │  │ Validation │             │
│  └────────────┘  └────────────┘             │
└──────────────────────────────────────────────┘
```

## Componentes

### Component Pattern

Todos os componentes seguem o mesmo padrão:

```
Component/
├── Component.js      # Lógica do componente (classe ES6)
├── Component.css     # Estilos encapsulados
└── Component.test.js # Testes unitários
```

### Ciclo de Vida

```javascript
class Component {
  constructor(options) {
    // 1. Inicialização
    this.init();
  }

  init() {
    // 2. Setup
    this.setupEventListeners();
    this.setupAccessibility();
  }

  destroy() {
    // 3. Cleanup
    this.removeEventListeners();
  }
}
```

## Fluxo de Dados

### Unidirecional

```
User Action → Event Handler → Update State → Re-render UI
```

### Exemplo: Tema

```
┌─────────────┐
│ User clicks │
│ theme btn   │
└──────┬──────┘
       ↓
┌─────────────────┐
│ ThemeManager    │
│ .toggle()       │
└──────┬──────────┘
       ↓
┌─────────────────┐
│ Update          │
│ localStorage    │
└──────┬──────────┘
       ↓
┌─────────────────┐
│ Update DOM      │
│ classes         │
└──────┬──────────┘
       ↓
┌─────────────────┐
│ Notify          │
│ listeners       │
└─────────────────┘
```

## Estado Global

### ThemeManager
Gerencia tema dark/light com persistência.

```javascript
const theme = useTheme();
theme.setTheme('dark');
theme.onChange((newTheme) => {
  console.log(newTheme);
});
```

### Navigation State
Gerencia estado do menu mobile.

## Roteamento

### Approach: Multi-Page Application (MPA)

Por ser um site institucional relativamente simples, optamos por MPA ao invés de SPA:

**Vantagens:**
- ✅ Melhor SEO
- ✅ Menor complexidade
- ✅ Melhor performance inicial
- ✅ Funciona sem JavaScript

**Estrutura:**
```
/                    → index.html
/carteirinha         → carteirinha.html
/documentos          → doc.html
/transparencia       → transp.html
/ficha               → ficha.html
/termo               → termo.html
```

## Gerenciamento de Estado

### Local State
Gerenciado dentro de cada componente.

```javascript
class Modal {
  constructor() {
    this.isOpen = false; // Estado local
  }
}
```

### Global State
Para dados compartilhados entre componentes.

```javascript
// store/theme.js
export const themeStore = {
  currentTheme: 'light',
  listeners: [],
  // ...
};
```

## Serviços

### API Service (Placeholder)

```javascript
// services/api.js
export class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    // Implementação
  }

  async post(endpoint, data) {
    // Implementação
  }
}
```

### Email Service (Futuro)

```javascript
// services/email.js
export class EmailService {
  async sendContactForm(data) {
    // Envio via API backend
  }
}
```

## Validação

### Form Validation Flow

```
User Input → Debounce → Validate → Show Error/Success
```

### Validation Rules

```javascript
const rules = {
  email: {
    required: true,
    email: true,
    messages: {
      required: 'Email é obrigatório',
      email: 'Email inválido',
    },
  },
  cpf: {
    required: true,
    custom: validators.cpf,
  },
};
```

## Performance

### Estratégias

1. **Code Splitting**
   - Módulos ES6 com imports dinâmicos
   - Carregamento sob demanda

2. **Lazy Loading**
   - Imagens: `loading="lazy"` + IntersectionObserver
   - Componentes: Import dinâmico

3. **Caching**
   - LocalStorage para preferências
   - Service Worker (futuro)

4. **Minificação**
   - CSS e JS minificados via Vite
   - Assets otimizados

### Métricas

```javascript
// Performance monitoring
window.addEventListener('load', () => {
  const perfData = performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`Page Load: ${pageLoadTime}ms`);
});
```

## Acessibilidade

### Checklist

- ✅ Semantic HTML5
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Color contrast (WCAG AA)

### Implementação

```javascript
// Modal accessibility
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.setAttribute('aria-labelledby', 'modal-title');
```

## Segurança

### Proteções

1. **XSS Prevention**
   ```javascript
   function sanitizeHTML(str) {
     const temp = document.createElement('div');
     temp.textContent = str;
     return temp.innerHTML;
   }
   ```

2. **CSRF Protection** (Backend)
   - Tokens CSRF em formulários

3. **Input Validation**
   - Client-side e server-side

4. **HTTPS Only**
   - Forçar HTTPS em produção

## Build & Deploy

### Build Process

```bash
npm run build
# Output: dist/
```

### Deploy Pipeline

```
Code Push → GitHub Actions → Build → Test → Deploy
```

### Environments

- **Development**: `localhost:3000`
- **Staging**: `staging.escolasolidaria.org`
- **Production**: `escolasolidaria.org`

## Monitoramento

### Analytics (Futuro)
- Google Analytics
- Custom events

### Error Tracking
- Console.error com contexto
- Sentry (futuro)

### Performance
- Lighthouse CI
- Web Vitals

## Escalabilidade

### Horizontal
- CDN para assets
- Load balancer (futuro)

### Vertical
- Otimização de código
- Cache strategies

## Manutenibilidade

### Code Quality
- ESLint rules
- Prettier formatting
- JSDoc documentation

### Testing
- Unit tests (Vitest)
- Integration tests
- E2E tests (Cypress - futuro)

### Documentation
- README.md
- JSDoc inline
- Architecture docs
- UI guidelines

## Roadmap Técnico

### Fase 1 (Atual)
- ✅ Arquitetura modular
- ✅ Design system
- ✅ Componentes base
- ✅ Dark mode

### Fase 2 (Próxima)
- 🔲 API integration
- 🔲 CMS integration
- 🔲 PWA support
- 🔲 Offline mode

### Fase 3 (Futuro)
- 🔲 Multi-idioma (i18n)
- 🔲 Dashboard administrativo
- 🔲 Sistema de doações
- 🔲 Portal do aluno

## Decisões Técnicas

### Por que Vite?
- ✅ Build rápido
- ✅ HMR eficiente
- ✅ Simples configuração
- ✅ ESM nativo

### Por que não React/Vue?
- ✅ Projeto relativamente simples
- ✅ Melhor performance
- ✅ Menor bundle size
- ✅ Menor curva de aprendizado
- ✅ Vanilla JS é suficiente

### Por que TailwindCSS?
- ✅ Desenvolvimento rápido
- ✅ Consistency
- ✅ PurgeCSS integrado
- ✅ Customização via config

## Conclusão

Esta arquitetura foi projetada para ser:
- 🎯 **Simples** mas profissional
- 📈 **Escalável** para crescimento futuro
- 🛡️ **Robusta** e confiável
- ♿ **Acessível** para todos
- ⚡ **Performática** em todos os dispositivos

---

**Última atualização:** Outubro 2025  
**Versão:** 2.0.0
