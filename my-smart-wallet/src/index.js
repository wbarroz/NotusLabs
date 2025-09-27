#!/usr/bin/env node

import { validateConfig } from './config.js';
import { SmartWalletManager } from './wallet.js';
import { 
  parseArguments, 
  validateEthereumAddress, 
  showHelp, 
  formatDate
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

    console.log('Smart Wallet CLI - API Notus (Polygon Network)');
    console.log('==============================================');
    console.log('');

    // Se salt específico foi fornecido, processar apenas essa wallet
    if (options.salt !== null) {
      const result = await walletManager.processSingleWallet(
        options.address,
        options.salt,
        options.check
      );

      displaySingleWalletResult(result, options);
    } else {
      // Buscar todas as wallets do EOA
      const result = await walletManager.findAllWallets(options.address);
      displayAllWalletsResult(result, options);
    }

  } catch (error) {
    console.error('Erro inesperado:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

/**
 * Exibe resultado de uma wallet específica
 */
function displaySingleWalletResult(result, options) {
  if (!result.success) {
    console.error('✗ Erro ao processar Smart Wallet');
    console.error(`  ${result.error}`);
    process.exit(1);
  }

  if (result.exists) {
    console.log('✓ Smart Wallet encontrada!');
    displayDetailedWalletInfo(result.wallet);
  } else if (result.registered) {
    console.log('✓ Smart Wallet registrada com sucesso!');
    displayDetailedWalletInfo(result.wallet);
  } else {
    console.log('⚠ Smart Wallet não encontrada.');
    console.log('  Use o comando sem --check para registrar uma nova Smart Wallet.');
  }
}

/**
 * Exibe resultado da busca de todas as wallets
 */
function displayAllWalletsResult(result, options) {
  const { wallets, errors } = result;

  if (wallets.length === 0) {
    console.log('⚠ Nenhuma Smart Wallet encontrada para este EOA.');
    
    if (!options.check) {
      console.log('');
      console.log('Registrando Smart Wallet com salt 0...');
      
      // Registrar wallet padrão com salt 0
      registerDefaultWallet(options.address);
    } else {
      console.log('  Use o comando sem --check para registrar uma nova Smart Wallet.');
    }
    return;
  }

  console.log(`✓ Encontradas ${wallets.length} Smart Wallet(s) para este EOA:`);
  console.log('');

  // Exibir todas as wallets encontradas
  wallets.forEach((wallet, index) => {
    console.log(`[${index + 1}] Smart Wallet - Salt ${wallet.salt}:`);
    displayDetailedWalletInfo(wallet, '  ');
    console.log('');
  });

  // Exibir erros se houver
  if (errors.length > 0) {
    console.log('Erros durante a busca:');
    errors.forEach(err => {
      console.log(`  Salt ${err.salt}: ${err.error}`);
    });
    console.log('');
  }

  // Resumo final
  console.log('Resumo:');
  console.log(`  Total de Smart Wallets: ${wallets.length}`);
  console.log(`  EOA: ${wallets[0]?.eoa}`);
  console.log(`  Factory: ${wallets[0]?.factory}`);
  console.log(`  Rede: ${wallets[0]?.network} (${wallets[0]?.chainId})`);
}

/**
 * Registra wallet padrão com salt 0
 */
async function registerDefaultWallet(eoaAddress) {
  try {
    const walletManager = new SmartWalletManager();
    const result = await walletManager.processSingleWallet(eoaAddress, '0', false);
    
    console.log('');
    if (result.success && result.registered) {
      console.log('✓ Smart Wallet padrão criada!');
      displayDetailedWalletInfo(result.wallet);
    } else {
      console.error('✗ Falha ao criar Smart Wallet padrão');
    }
  } catch (error) {
    console.error('Erro ao registrar wallet padrão:', error.message);
  }
}

/**
 * Exibe informações detalhadas da Smart Wallet (sempre verbose)
 */
function displayDetailedWalletInfo(wallet, indent = '') {
  console.log(`${indent}EOA: ${wallet.eoa}`);
  console.log(`${indent}Smart Wallet: ${wallet.smartWallet}`);
  console.log(`${indent}Factory: ${wallet.factory}`);
  console.log(`${indent}Salt: ${wallet.salt}`);
  console.log(`${indent}Rede: ${wallet.network} (${wallet.chainId})`);
  console.log(`${indent}Registrada em: ${formatDate(wallet.registeredAt)}`);
  console.log(`${indent}Status: Deploy será feito na primeira transação`);
  
  if (!indent) {
    console.log('');
    console.log('Próximos passos:');
    console.log('  - A Smart Wallet será deployada automaticamente na primeira transação');
    console.log('  - Use este endereço para operações via API Notus');
  }
}

// Executar o programa principal
main();