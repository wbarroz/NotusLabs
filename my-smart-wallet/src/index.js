// index.js

// Mantemos o EOA_ADDRESS e account importados, mas apenas para uso em funções
// FUTURAS que exijam assinatura (ex: enviar UserOperation) ou para referência.
// O comando '--create' não usará EOA_ADDRESS como padrão.
// import { EOA_ADDRESS, account } from './config.js';
import { registerSmartWallet } from './register-wallet.js';
import { checkSmartWalletStatus } from './check-wallet.js';

// 2. Análise dos Argumentos de Linha de Comando
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log("Comandos disponíveis:");
		// O log reflete o formato exigido pelo usuário:
		console.log("  --create <EOA_ADDRESS>: Cria/registra a Smart Wallet para o EOA fornecido.");
		console.log("  --check <SMART_WALLET_ADDRESS>: Verifica o status de uma Smart Wallet (deploy, saldo, etc.).");
		return;
	}

	const command = args[0];
	const address = args[1];

	switch (command) {
		case '--create':
			// Regra estrita: O endereço EOA é obrigatório.
			if (!address || !address.startsWith('0x') || address.length !== 42) {
				console.error("❌ ERRO: O endereço EOA é **obrigatório** e deve ser válido para o comando '--create'.");
				console.log("Uso: node index.js --create 0x...SEU_ENDERECO_EOA...");
				return;
			}

			// O endereço EOA é sempre o argumento fornecido.
			const targetEoa = address;
			console.log(`Usando EOA para criação/registro: ${targetEoa}`);
			await registerSmartWallet(targetEoa);
			break;

		case '--check':
			if (!address || !address.startsWith('0x') || address.length !== 42) {
				console.error("❌ ERRO: O endereço da Smart Wallet (--check) é obrigatório e deve ser válido.");
				return;
			}
			await checkSmartWalletStatus(address);
			break;

		default:
			console.error(`Comando desconhecido: ${command}`);
			main();
	}
}

main().catch(console.error);
