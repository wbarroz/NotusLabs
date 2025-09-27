import { NOTUS_CONFIG, NETWORK_CONFIG, WALLET_SEARCH_CONFIG } from './config.js';

/**
 * Classe para gerenciar Smart Wallets via API Notus
 */
export class SmartWalletManager {
  constructor() {
    this.baseUrl = NOTUS_CONFIG.BASE_URL;
    this.apiKey = NOTUS_CONFIG.API_KEY;
    this.factoryAddress = NETWORK_CONFIG.LIGHT_ACCOUNT_FACTORY;
  }

  /**
   * Faz requisição para a API Notus
   */
  async makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      // Se não for ok, ainda tentamos fazer parse para pegar detalhes do erro
      const data = await response.json();
      
      return {
        ok: response.ok,
        status: response.status,
        data
      };
    } catch (error) {
      throw new Error(`Erro na requisição para ${endpoint}: ${error.message}`);
    }
  }

  /**
   * Verifica se uma Smart Wallet já existe
   */
  async checkWalletExists(eoaAddress, salt = '0') {
    const params = new URLSearchParams({
      externallyOwnedAccount: eoaAddress,
      factory: this.factoryAddress,
      salt: salt
    });

    const endpoint = `wallets/address?${params}`;
    return await this.makeRequest(endpoint);
  }

  /**
   * Registra uma nova Smart Wallet
   */
  async registerWallet(eoaAddress, salt = '0') {
    const body = {
      externallyOwnedAccount: eoaAddress,
      factory: this.factoryAddress,
      salt: salt
    };

    return await this.makeRequest('wallets/register', 'POST', body);
  }

  /**
   * Busca todas as Smart Wallets de um EOA (diferentes salts)
   */
  async findAllWallets(eoaAddress, maxSalt = WALLET_SEARCH_CONFIG.MAX_SALT_SEARCH) {
    const wallets = [];
    const errors = [];

    console.log(`Buscando Smart Wallets para EOA: ${eoaAddress}`);
    console.log(`Factory: ${this.factoryAddress}`);
    console.log(`Rede: ${NETWORK_CONFIG.NETWORK_NAME} (${NETWORK_CONFIG.CHAIN_ID})`);
    console.log(`Verificando salts de 0 até ${maxSalt - 1}...`);
    console.log('');

    for (let salt = 0; salt < maxSalt; salt++) {
      try {
        const result = await this.checkWalletExists(eoaAddress, salt.toString());
        
        if (result.ok) {
          const wallet = result.data.wallet;
          wallets.push({
            eoa: eoaAddress,
            smartWallet: wallet.accountAbstraction,
            registeredAt: wallet.registeredAt,
            salt: salt.toString(),
            factory: 'LightAccount',
            network: NETWORK_CONFIG.NETWORK_NAME,
            chainId: NETWORK_CONFIG.CHAIN_ID,
            exists: true
          });
        }
      } catch (error) {
        errors.push({ salt: salt.toString(), error: error.message });
      }
    }

    return { wallets, errors };
  }

  /**
   * Processa uma Smart Wallet específica (verificar + registrar se necessário)
   */
  async processSingleWallet(eoaAddress, salt = '0', checkOnly = false) {
    console.log(`Processando Smart Wallet para EOA: ${eoaAddress}`);
    console.log(`Factory: ${this.factoryAddress}`);
    console.log(`Salt: ${salt}`);
    console.log(`Rede: ${NETWORK_CONFIG.NETWORK_NAME} (${NETWORK_CONFIG.CHAIN_ID})`);
    console.log(`Modo: ${checkOnly ? 'Verificação apenas' : 'Verificar + Registrar'}`);
    console.log('');

    try {
      // Primeiro, verifica se já existe
      const checkResult = await this.checkWalletExists(eoaAddress, salt);
      
      console.log(`Status da verificação para salt ${salt}: ${checkResult.status}`);

      // Se a verificação foi bem-sucedida, a wallet já existe
      if (checkResult.ok) {
        const wallet = checkResult.data.wallet;
        
        return {
          success: true,
          exists: true,
          wallet: {
            eoa: eoaAddress,
            smartWallet: wallet.accountAbstraction,
            registeredAt: wallet.registeredAt,
            salt: salt,
            factory: 'LightAccount',
            network: NETWORK_CONFIG.NETWORK_NAME,
            chainId: NETWORK_CONFIG.CHAIN_ID
          }
        };
      }

      // Se chegou aqui, a wallet não existe
      if (checkOnly) {
        return {
          success: true,
          exists: false,
          wallet: null
        };
      }

      // Tentar registrar a wallet
      console.log(`Smart Wallet com salt ${salt} não encontrada. Tentando registrar...`);

      const registerResult = await this.registerWallet(eoaAddress, salt);

      if (registerResult.ok) {
        const wallet = registerResult.data.wallet;
        
        return {
          success: true,
          exists: false,
          registered: true,
          wallet: {
            eoa: eoaAddress,
            smartWallet: wallet.accountAbstraction,
            registeredAt: new Date().toISOString(), // Recém registrada
            salt: salt,
            factory: 'LightAccount',
            network: NETWORK_CONFIG.NETWORK_NAME,
            chainId: NETWORK_CONFIG.CHAIN_ID
          }
        };
      } else {
        throw new Error(`Falha ao registrar wallet: ${registerResult.data?.message || 'Erro desconhecido'}`);
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}