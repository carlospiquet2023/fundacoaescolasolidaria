/**
 * Build Script
 * Script auxiliar para otimizar o processo de build
 */

import { build } from 'vite';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BUILD_DIR = 'dist';

/**
 * Limpa diretório de build
 */
function cleanBuildDir() {
  console.log('🧹 Limpando diretório de build...');
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  console.log('✅ Diretório limpo!');
}

/**
 * Executa lint
 */
function runLint() {
  console.log('🔍 Executando ESLint...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ Lint passou!');
  } catch (error) {
    console.error('❌ Erros de lint encontrados!');
    process.exit(1);
  }
}

/**
 * Executa build do Vite
 */
async function runBuild() {
  console.log('📦 Buildando projeto...');
  try {
    await build();
    console.log('✅ Build concluído!');
  } catch (error) {
    console.error('❌ Erro no build:', error);
    process.exit(1);
  }
}

/**
 * Gera relatório de build
 */
function generateBuildReport() {
  console.log('📊 Gerando relatório de build...');
  
  const distPath = path.resolve(BUILD_DIR);
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ Diretório dist não encontrado!');
    return;
  }

  let totalSize = 0;
  const files = [];

  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else {
        const size = stat.size;
        totalSize += size;
        files.push({
          path: path.relative(distPath, fullPath),
          size: (size / 1024).toFixed(2) + ' KB',
        });
      }
    });
  }

  walkDir(distPath);

  console.log('\n📁 Arquivos gerados:');
  files
    .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
    .slice(0, 10)
    .forEach((file) => {
      console.log(`   ${file.path}: ${file.size}`);
    });

  console.log(`\n📦 Tamanho total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📄 Total de arquivos: ${files.length}\n`);
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Iniciando processo de build...\n');

  const startTime = Date.now();

  cleanBuildDir();
  runLint();
  await runBuild();
  generateBuildReport();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✨ Build concluído com sucesso em ${duration}s!`);
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
