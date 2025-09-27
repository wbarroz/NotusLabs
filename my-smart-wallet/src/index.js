#!/usr/bin/env node

import { validateConfig } from './config.js';
import { SmartWalletManager } from './wallet.js';
import { 
  parseArguments, 
  validateEthereumAddress, 
  showHelp, 
  formatDate, 
  truncateAddress 
} from './utils.js';

/**
 * Função principal do CLI
 */
async function main() {
  try {
    // Validar configurações do ambiente
    validateConfig();

    // Parse dos argumentos da linha de comando
    const options = parseArguments(process.argv);

    // Mostrar ajuda se solicitado
    if (options.help) {
      showHelp();
      process.exit(0);
    }

    // Validar endereço fornecido
    if (!options.address) {
      console.error('Erro: Endereço EOA é obrigatório.');
      console.error('Use --help para ver as opções disponíveis.');
      process.exit(1);
    }

    const addressValidation = validateEthereumAddress(options.address);
    if (!addressValidation.valid) {
      console.error(`Erro: ${addressValidation.error}`);
      process.exit(1);
    }

    // Inicializar o gerenciador de Smart Wallet
    const walletManager = new SmartWalletManager();

    console.log('Smart Wallet CLI - API Notus');
    console.log('==============================');
    console.log('');

    if (options.verbose) {
      console.log('Configurações:');
      console.log(`  EOA: ${options.address}`);
      console.log(`  Salt: ${options.salt}`);
      console.log(`  Modo: ${options.check ? 'Verificação apenas' : 'Verificar + Registrar'}`);
      console.log('');
    }

    // Processar a Smart Wallet
    const result = await walletManager.processWallet(
      options.address,
      options.salt,
      options.check,
      options.verbose
    );

    // Exibir resultado
    displayResult(result, options);

  } catch (error) {
    console.error('Erro inesperado:', error.message);
    if (options?.verbose) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

/**
 * Exibe o resultado formatado
 */
function displayResult(result, options) {
  if (!result.success) {
    console.error('✗ Erro ao processar Smart Wallet');
    console.error(`  ${result.error}`);
    process.exit(1);
  }

  if (result.exists) {
    // Smart Wallet já existia
    console.log('✓ Smart Wallet encontrada!');
    displayWalletInfo(result.wallet, options);
  } else if (result.registered) {
    // Smart Wallet foi registrada agora
    console.log('✓ Smart Wallet registrada com sucesso!');
    displayWalletInfo(result.wallet, options);
  } else {
    // Smart Wallet não existe e modo check-only
    console.log('⚠ Smart Wallet não encontrada.');
    console.log('  Use o comando sem --check para registrar uma nova Smart Wallet.');
  }
}

/**
 * Exibe informações da Smart Wallet
 */
function displayWalletInfo(wallet, options) {
  console.log('');
  console.log('Informações da Smart Wallet:');
  console.log(`  EOA: ${wallet.eoa}`);
  
  if (options.verbose) {
    console.log(`  Smart Wallet: ${wallet.smartWallet}`);
  } else {
    console.log(`  Smart Wallet: ${truncateAddress(wallet.smartWallet)}`);
  }
  
  console.log(`  Factory: ${wallet.factory}`);
  console.log(`  Salt: ${wallet.salt}`);
  console.log(`  Rede: ${wallet.network} (${wallet.chainId})`);
  console.log(`  Registrada em: ${formatDate(wallet.registeredAt)}`);
  
  if (options.verbose) {
    console.log('');
    console.log('Informações técnicas:');
    console.log(`  Endereço completo: ${wallet.smartWallet}`);
    console.log('  Status: Deploy será feito na primeira transação');
  }
  
  console.log('');
  console.log('Próximos passos:');
  console.log('  - A Smart Wallet será deployada automaticamente na primeira transação');
  console.log('  - Use este endereço para operações via API Notus');
}

// Executar o programa principal
main();