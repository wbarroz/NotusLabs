// src/smart-wallet/register-wallet.js

import { NOTUS_CONFIG } from './config.js';

/**
 * Registra a Smart Wallet associada a um Externally Owned Account (EOA).
 * @param {string} externallyOwnedAccount - O endereço EOA que controlará a Smart Wallet.
 */
export async function registerSmartWallet(externallyOwnedAccount) {
	// Usamos um 'salt' fixo ('0') por padrão para garantir um endereço determinístico
	const salt = '0';

	console.log(`\n--- Tentando Registrar Smart Wallet para EOA: ${externallyOwnedAccount} ---`);

	try {
		const res = await fetch(`${NOTUS_CONFIG.BASE_URL}/wallets/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': NOTUS_CONFIG.API_KEY,
			},
			body: JSON.stringify({
				externallyOwnedAccount,
				factory: NOTUS_CONFIG.FACTORY_ADDRESS,
				salt: salt,
			}),
		});

		const data = await res.json();

		if (res.ok) {
			const smartWalletAddress = data.wallet.accountAbstraction;
			console.log(`✅ Sucesso! Smart Wallet registrada/consultada.`);
			console.log(`   Endereço Smart Wallet: ${smartWalletAddress}`);
			console.log(`   Status de Deploy: ${data.wallet.deployed ? 'Implantada' : 'Não Implantada (será na 1ª transação)'}`);
			return smartWalletAddress;
		} else {
			console.error(`❌ ERRO ao registrar/consultar Smart Wallet: ${data.message || 'Erro de API desconhecido'}`);
		}
	} catch (error) {
		console.error(`❌ Erro de rede/processamento: ${error.message}`);
	}
}
