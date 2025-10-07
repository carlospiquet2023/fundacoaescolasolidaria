# 📦 Script de Migração de Assets

Este guia explica como migrar os assets existentes para a nova estrutura.

## Passos

### 1. Mover Imagens

Mova todas as imagens `.jpg`, `.png` para `public/assets/images/`:

```powershell
# PowerShell
Move-Item -Path "*.jpg" -Destination "public/assets/images/"
Move-Item -Path "*.png" -Destination "public/assets/images/"
```

### 2. Organizar HTMLs

Mova os HTMLs para `src/pages/` (exceto index.html):

```powershell
New-Item -ItemType Directory -Path "src/pages" -Force
Move-Item -Path "carteirinha.html" -Destination "src/pages/"
Move-Item -Path "doc.html" -Destination "src/pages/"
Move-Item -Path "ficha.html" -Destination "src/pages/"
Move-Item -Path "termo.html" -Destination "src/pages/"
Move-Item -Path "transp.html" -Destination "src/pages/"
Move-Item -Path "receita.html" -Destination "src/pages/"
Move-Item -Path "despesas.html" -Destination "src/pages/"
```

### 3. Migrar CSS

Os arquivos CSS antigos devem ser refatorados:

- `mae.css` → Dividir em componentes modulares
- `styles.css` → Migrar para `src/styles/`
- `carteirinha1.css` → `src/components/` específico

### 4. Migrar JavaScript

```powershell
# Mover script.js para análise
Move-Item -Path "script.js" -Destination "src/legacy/"
```

O conteúdo de `script.js` já foi refatorado em:
- `src/utils/helpers.js`
- `src/hooks/useTheme.js`
- `src/components/common/Modal.js`

### 5. Limpar Raiz

Após migração, a raiz deve conter apenas:

```
/
├── public/
├── src/
├── docs/
├── scripts/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .eslintrc.json
├── .prettierrc.json
├── .gitignore
├── .env.example
└── README.md
```

## Checklist

- [ ] Imagens movidas para `public/assets/images/`
- [ ] Páginas HTML movidas para `src/pages/`
- [ ] CSS refatorado e modularizado
- [ ] JavaScript refatorado em módulos ES6
- [ ] Assets legacy arquivados
- [ ] Paths atualizados em todos os arquivos
- [ ] Build testado (`npm run build`)
- [ ] Dev server testado (`npm run dev`)

## Próximos Passos

1. **Instalar dependências:**
   ```powershell
   npm install
   ```

2. **Iniciar desenvolvimento:**
   ```powershell
   npm run dev
   ```

3. **Atualizar paths nos HTMLs:**
   - Trocar `src="fundo.png"` por `src="/assets/images/fundo.png"`
   - Trocar `href="mae.css"` por imports no main.js
   - Atualizar links entre páginas

4. **Testar todas as funcionalidades:**
   - Navegação
   - Modais
   - Formulários
   - Dark mode
   - Responsividade

5. **Build de produção:**
   ```powershell
   npm run build
   npm run preview
   ```

## Troubleshooting

### Imagens não carregam
**Problema:** Paths incorretos  
**Solução:** Verificar se imagens estão em `public/assets/images/` e usar paths absolutos `/assets/images/imagem.jpg`

### CSS não aplica
**Problema:** CSS modules não importados  
**Solução:** Verificar imports no `src/main.js`

### JavaScript não funciona
**Problema:** Módulos ES6 não suportados  
**Solução:** Usar `type="module"` no script tag ou importar via main.js

## Comandos Úteis

```powershell
# Listar todos os arquivos .jpg
Get-ChildItem -Filter "*.jpg"

# Listar todos os arquivos .png
Get-ChildItem -Filter "*.png"

# Verificar estrutura de pastas
tree /F

# Verificar tamanho de imagens
Get-ChildItem public/assets/images/ | Select-Object Name, Length
```

## Observações

- **Backup:** Sempre faça backup antes de migrar
- **Git:** Commite após cada etapa
- **Testes:** Teste tudo após a migração
- **Performance:** Otimize imagens se necessário (WebP, compressão)

---

**Última atualização:** Outubro 2025
