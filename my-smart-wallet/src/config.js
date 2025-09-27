import dotenv from 'dotenv';

dotenv.config();

// Configurações da API Notus
export const NOTUS_CONFIG = {
  API_KEY: process.env.NOTUS_API_KEY,
  BASE_URL: process.env.NOTUS_BASE_URL || 'https://api.notus.team/api/v1'
};

// Configurações da Rede Polygon (hard-coded)
export const NETWORK_CONFIG = {
  CHAIN_ID: 137,
  NETWORK_NAME: 'Polygon',
  // LightAccount Factory Address (conforme documentação)
  LIGHT_ACCOUNT_FACTORY: '0x0000000000400CdFef5E2714E63d8040b700BC24'
};

// Configurações para busca de múltiplas carteiras
export const WALLET_SEARCH_CONFIG = {
  MAX_SALT_SEARCH: 10  // Buscar salts de 0 até 9
};

// Validação de configurações
export function validateConfig() {
  const errors = [];
  
  if (!NOTUS_CONFIG.API_KEY) {
    errors.push('NOTUS_API_KEY não encontrada no arquivo .env');
  }
  
  if (errors.length > 0) {
    console.error('Erros de configuração:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
}