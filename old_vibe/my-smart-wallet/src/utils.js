import { isAddress } from 'viem';

/**
 * Valida se um endereço Ethereum é válido
 */
export function validateEthereumAddress(address) {
  if (!address) {
    return { valid: false, error: 'Endereço não fornecido' };
  }
  
  if (!isAddress(address)) {
    return { valid: false, error: 'Formato de endereço inválido' };
  }
  
  return { valid: true };
}

/**
 * Formata data para exibição
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Trunca endereço para exibição (0x1234...5678)
 */
export function truncateAddress(address, startChars = 6, endChars = 4) {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Parse argumentos da linha de comando
 */
export function parseArguments(args) {
  const options = {
    address: null,
    check: false,
    salt: null,
    help: false
  };
  
  // Primeiro argumento deve ser o endereço
  if (args[2] && !args[2].startsWith('--') && !args[2].startsWith('-')) {
    options.address = args[2];
  }
  
  // Parse das flags
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--check':
      case '-c':
        options.check = true;
        break;
        
      case '--salt':
      case '-s':
        if (args[i + 1] && !args[i + 1].startsWith('-')) {
          options.salt = args[i + 1];
          i++; // Pula o próximo argumento
        }
        break;
        
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }
  
  return options;
}

/**
 * Exibe ajuda do comando
 */
export function showHelp() {
  console.log(`
Smart Wallet CLI - Notus API (Polygon Network)

Uso:
  node src/index.js <endereço-eoa> [opções]

Argumentos:
  <endereço-eoa>    Endereço da carteira EOA (obrigatório)

Opções:
  -c, --check       Apenas verificar status, não registrar
  -s, --salt VALUE  Registrar/verificar salt específico (padrão: busca todos)
  -h, --help        Mostrar esta ajuda

Exemplos:
  node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
  node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 --check
  node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 --salt 1

Comportamento:
  - Por padrão, lista TODAS as Smart Wallets do EOA (salts 0-9)
  - Com --salt, opera apenas no salt especificado
  - Com --check, não registra novas carteiras
  - Rede: Polygon (hard-coded)

Configuração:
  Crie um arquivo .env baseado no .env.example com sua NOTUS_API_KEY
  `);
}

/**
 * Função para aguardar (delay)
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}