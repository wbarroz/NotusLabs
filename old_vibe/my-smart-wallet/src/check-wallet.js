// src/smart-wallet/check-wallet.js

import { NOTUS_CONFIG } from './config.js';

/**
 * Verifica o status de uma Smart Wallet existente.
 * @param {string} smartWalletAddress - O endereço da Smart Wallet a ser verificado.
 */
export async function checkSmartWalletStatus(smartWalletAddress) {
	console.log(`\n--- Verificando Status da Smart Wallet: ${smartWalletAddress} ---`);

	try {
		const res = await fetch(`${NOTUS_CONFIG.BASE_URL}/wallets/${smartWalletAddress}`, {
			method: 'GET',
			headers: { 'x-api-key': NOTUS_CONFIG.API_KEY },
		});

		const data = await res.json();

		if (res.ok) {
			console.log(`✅ Sucesso! Dados da Smart Wallet obtidos.`);
			console.log(`   EOA Controller: ${data.wallet.externallyOwnedAccount}`);
			console.log(`   Status de Deploy: ${data.wallet.deployed ? 'IMPLANTADA (on-chain)' : 'NÃO IMPLANTADA (somente endereço calculado)'}`);
			console.log(`   Chain ID: ${data.wallet.chainId}`);
			// Exibir mais informações úteis se disponíveis (ex: Factory, Salt)
			return data.wallet;
		} else {
			// Se o endereço não for reconhecido pela Notus
			console.error(`❌ ERRO ao consultar Smart Wallet: ${data.message || 'Erro de API desconhecido'}`);
			console.log("   Dica: Certifique-se de que este endereço foi gerado via Notus API.");
		}
	} catch (error) {
		console.error(`❌ Erro de rede/processamento: ${error.message}`);
	}
}
