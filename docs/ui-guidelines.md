# 🎨 UI/UX Guidelines - Design System

## Introdução

Este documento define os padrões visuais e de interação do sistema institucional da Fundação Escola Solidária. Todos os componentes devem seguir estas diretrizes para garantir consistência e qualidade.

## Princípios de Design

### 1. Simplicidade
- Interface limpa e intuitiva
- Hierarquia visual clara
- Remover elementos desnecessários

### 2. Consistência
- Componentes reutilizáveis
- Padrões visuais uniformes
- Comportamento previsível

### 3. Acessibilidade
- WCAG 2.1 Level AA
- Navegação por teclado
- Alto contraste
- Screen reader friendly

### 4. Responsividade
- Mobile First
- Adaptável a todos os dispositivos
- Touch-friendly

## Paleta de Cores

### Primária (Azul)
Representa confiança, estabilidade e profissionalismo.

```css
--color-primary-50: #e3f0ff   /* Backgrounds */
--color-primary-500: #0762d9  /* Principal */
--color-primary-600: #0553b8  /* Hover/Active */
--color-primary-900: #012654  /* Text em fundos claros */
```

**Uso:**
- Botões primários
- Links
- Ícones importantes
- Headers

### Secundária (Verde)
Representa crescimento, esperança e solidariedade.

```css
--color-secondary-400: #30d979  /* Principal */
--color-secondary-500: #26b662  /* Hover */
```

**Uso:**
- Call-to-actions de doação
- Indicadores de sucesso
- Destaques positivos

### Acento (Vermelho)
Representa urgência e atenção.

```css
--color-accent-400: #e74c3c    /* Principal */
--color-accent-500: #c0392b    /* Hover */
```

**Uso:**
- Erros e alertas
- Botões de cancelar/fechar
- Badges importantes

### Neutros
Para textos, backgrounds e elementos secundários.

```css
--color-neutral-50: #fafafa    /* Backgrounds leves */
--color-neutral-900: #171717   /* Texto principal */
```

### Semânticas

```css
--color-success: #10b981   /* Sucesso */
--color-warning: #f59e0b   /* Aviso */
--color-error: #ef4444     /* Erro */
--color-info: #3b82f6      /* Informação */
```

## Tipografia

### Fontes

**Display (Títulos):**
- Família: Roboto
- Peso: 700-900 (Bold-Black)
- Uso: H1, H2, H3, títulos importantes

**Body (Corpo):**
- Família: Nunito
- Peso: 300-600 (Light-SemiBold)
- Uso: Parágrafos, labels, textos gerais

### Scale

```css
--font-size-xs: 0.75rem    /* 12px - Labels pequenos */
--font-size-sm: 0.875rem   /* 14px - Texto secundário */
--font-size-base: 1rem     /* 16px - Texto principal */
--font-size-lg: 1.125rem   /* 18px - Texto destacado */
--font-size-xl: 1.25rem    /* 20px - Subtítulos */
--font-size-2xl: 1.5rem    /* 24px - H3 */
--font-size-3xl: 1.875rem  /* 30px - H2 */
--font-size-4xl: 2.25rem   /* 36px - H1 */
--font-size-5xl: 3rem      /* 48px - Hero titles */
```

### Hierarquia

```html
<h1>Título Principal</h1>       <!-- 36-48px, Bold -->
<h2>Título de Seção</h2>        <!-- 30px, Bold -->
<h3>Subtítulo</h3>              <!-- 24px, Bold -->
<p>Parágrafo normal</p>         <!-- 16px, Regular -->
<small>Texto pequeno</small>    <!-- 14px, Regular -->
```

### Line Height

```css
--line-height-tight: 1.25    /* Títulos */
--line-height-normal: 1.5    /* Texto normal */
--line-height-relaxed: 1.75  /* Parágrafos longos */
```

## Espaçamento

### Scale (Sistema de 4px)

```css
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
```

### Aplicação

**Entre elementos relacionados:** `--spacing-2` a `--spacing-3`  
**Entre componentes:** `--spacing-6` a `--spacing-8`  
**Entre seções:** `--spacing-12` a `--spacing-16`

## Bordas e Raios

### Border Radius

```css
--radius-sm: 0.25rem     /* 4px - Badges */
--radius-base: 0.5rem    /* 8px - Inputs */
--radius-md: 0.75rem     /* 12px - Cards pequenos */
--radius-lg: 1rem        /* 16px - Cards */
--radius-xl: 1.5rem      /* 24px - Modais */
--radius-2xl: 2rem       /* 32px - Hero sections */
--radius-full: 9999px    /* Circular - Botões pill */
```

### Uso

- **Botões primários:** `--radius-full`
- **Cards:** `--radius-lg` ou `--radius-xl`
- **Inputs:** `--radius-base`
- **Imagens:** `--radius-md`

## Sombras

### Elevação

```css
/* Suave - Cards, inputs */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1)

/* Base - Botões, dropdowns */
--shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1)

/* Média - Cards elevados */
--shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1)

/* Forte - Modais, tooltips */
--shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.1)

/* Customizada (com cor primária) */
--shadow-soft: 0 2px 12px rgba(7, 98, 217, 0.1)
```

## Componentes

### Botões

#### Primário
```html
<button class="btn btn-primary">
  Ação Principal
</button>
```

**Características:**
- Background: `--color-primary-500`
- Cor: Branco
- Padding: `1em 2.2em`
- Border-radius: `--radius-full`
- Hover: Eleva e muda para secondary

#### Secundário
```html
<button class="btn btn-secondary">
  Ação Secundária
</button>
```

**Características:**
- Background: `--color-secondary-400`
- Cor: Branco
- Mesmo padding e radius

#### Outline
```html
<button class="btn btn-outline">
  Ação Terciária
</button>
```

**Características:**
- Background: Transparente
- Border: 2px solid primary
- Cor: primary

### Estados dos Botões

```css
/* Normal */
button { opacity: 1; }

/* Hover */
button:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: var(--shadow-md);
}

/* Active */
button:active {
  transform: translateY(0) scale(0.98);
}

/* Disabled */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Focus */
button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3>Título do Card</h3>
  </div>
  <div class="card-body">
    <p>Conteúdo do card...</p>
  </div>
  <div class="card-footer">
    <button>Ação</button>
  </div>
</div>
```

**Características:**
- Background: `--background-primary`
- Border-radius: `--radius-lg`
- Padding: `--spacing-6`
- Box-shadow: `--shadow-soft`

### Formulários

#### Input
```html
<div class="form-group">
  <label for="nome">Nome Completo</label>
  <input 
    type="text" 
    id="nome" 
    name="nome"
    placeholder="Digite seu nome"
    aria-required="true"
  />
  <span class="error-message">Mensagem de erro</span>
</div>
```

**Características:**
- Padding: `--spacing-3` `--spacing-4`
- Border: 1px solid `--border-color`
- Border-radius: `--radius-base`
- Focus: Border azul 2px

#### Estados

```css
/* Normal */
input { border: 1px solid var(--border-color); }

/* Focus */
input:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-color: var(--color-primary-500);
}

/* Error */
input.field-error {
  border-color: var(--color-error);
  background: rgba(239, 68, 68, 0.05);
}

/* Success */
input.field-success {
  border-color: var(--color-success);
}

/* Disabled */
input:disabled {
  background: var(--color-neutral-100);
  cursor: not-allowed;
  opacity: 0.6;
}
```

### Modais

```html
<div class="modal" id="modal-example">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Título do Modal</h2>
      <button class="modal-close" aria-label="Fechar">&times;</button>
    </div>
    <div class="modal-body">
      <p>Conteúdo...</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancelar</button>
      <button class="btn btn-primary">Confirmar</button>
    </div>
  </div>
</div>
```

**Características:**
- Backdrop: `rgba(0, 0, 0, 0.6)` com blur
- Content: Max-width 600px, padding 2rem
- Animação: Fade in + slide up
- Z-index: `--z-modal`

## Animações

### Transições

```css
/* Rápida - Hover, focus */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)

/* Base - Mudanças gerais */
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1)

/* Lenta - Animações complexas */
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Easing Functions

```css
/* Eases */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in: cubic-bezier(0.4, 0, 1, 1)
```

### Keyframes Comuns

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

## Ícones

### Biblioteca
Font Awesome 5.15.4

### Tamanhos

```css
.icon-sm { font-size: 1rem; }      /* 16px */
.icon-md { font-size: 1.5rem; }    /* 24px */
.icon-lg { font-size: 2rem; }      /* 32px */
.icon-xl { font-size: 3rem; }      /* 48px */
```

### Uso

```html
<i class="fas fa-heart icon-md"></i>
```

## Responsividade

### Breakpoints

```css
/* Mobile */
@media (max-width: 639px) { /* Estilos mobile */ }

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) { /* Estilos tablet */ }

/* Desktop */
@media (min-width: 1024px) { /* Estilos desktop */ }

/* Wide */
@media (min-width: 1280px) { /* Estilos wide */ }
```

### Mobile First

```css
/* Base (Mobile) */
.component {
  padding: var(--spacing-4);
}

/* Tablet+ */
@media (min-width: 640px) {
  .component {
    padding: var(--spacing-6);
  }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-8);
  }
}
```

## Dark Mode

### Cores

```css
.dark-mode {
  --background-primary: #1a1a1a;
  --background-secondary: #262626;
  --text-primary: #f5f5f5;
  --text-secondary: #d4d4d4;
}
```

### Implementação

Todos os componentes devem ter estilos dark mode:

```css
.component {
  background: var(--background-primary);
  color: var(--text-primary);
}

.dark-mode .component {
  /* Ajustes específicos se necessário */
}
```

## Acessibilidade

### Contraste

- Texto normal: Mínimo 4.5:1
- Texto grande (18px+): Mínimo 3:1
- Elementos interativos: Mínimo 3:1

### Focus Visible

```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### ARIA

Sempre adicionar:
- `aria-label` em ícones sem texto
- `aria-describedby` para helper text
- `aria-invalid` em campos com erro
- `role` apropriado
- `aria-modal="true"` em modais

## Grid e Layout

### Container

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}
```

### Grid

```css
.grid {
  display: grid;
  gap: var(--spacing-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

## Checklist de Componentes

Ao criar um novo componente, verificar:

- [ ] Segue paleta de cores
- [ ] Usa variáveis CSS
- [ ] Responsivo (mobile first)
- [ ] Acessível (WCAG AA)
- [ ] Animações suaves
- [ ] Dark mode funcional
- [ ] Focus visível
- [ ] Estados (hover, active, disabled)
- [ ] Documentado
- [ ] Testado

## Exemplos de Uso

### Seção Hero

```html
<section class="hero">
  <div class="container">
    <h1 class="hero-title">Bem-vindo</h1>
    <p class="hero-subtitle">Transformando vidas</p>
    <button class="btn btn-primary btn-lg">Saiba Mais</button>
  </div>
</section>
```

### Card Grid

```html
<div class="container">
  <div class="grid">
    <div class="card">...</div>
    <div class="card">...</div>
    <div class="card">...</div>
  </div>
</div>
```

## Recursos

- **Figma:** [Link para protótipo]
- **Ícones:** Font Awesome
- **Fontes:** Google Fonts (Roboto, Nunito)
- **Referências:** Material Design, TailwindCSS

---

**Última atualização:** Outubro 2025  
**Versão:** 2.0.0
