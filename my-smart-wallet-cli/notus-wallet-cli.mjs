#!/usr/bin/env node

// notus-wallet-cli.mjs
// CLI mínimo para registrar e checar smart wallets via Notus API
// Usage:
//   node notus-wallet-cli.mjs register --eoa 0x... [--salt 0]
//   node notus-wallet-cli.mjs check --wallet 0x... [--portfolio]

import { argv, exit } from "process";
// import { fileURLToPath } from "url";

const BASE_URL = process.env.NOTUS_BASE_URL ?? "https://api.notus.team/api/v1";
const API_KEY = process.env.NOTUS_API_KEY;
const DEFAULT_FACTORY = "0x0000000000400CdFef5E2714E63d8040b700BC24"; // doc example; override with NOTUS_FACTORY if needed

if (!API_KEY) {
	console.error("Erro: defina a variável de ambiente NOTUS_API_KEY com sua API Key.");
	process.exit(2);
}

function usage() {
	console.log(`
Uso:
  register --eoa <EOA_address> [--salt <salt>] [--factory <factory_address>]
    Ex: node notus-wallet-cli.mjs register --eoa 0xabc... --salt 0

  check --wallet <smart_wallet_address> [--portfolio]
    Ex: node notus-wallet-cli.mjs check --wallet 0xdef... --portfolio

Variáveis de ambiente:
  NOTUS_API_KEY    seu api key (obrigatório)
  NOTUS_BASE_URL   base url da api (opcional, default: https://api.notus.team/api/v1)
  NOTUS_FACTORY    factory address (opcional; default do exemplo usado na doc)
`);
}

function parseArgs() {
	const args = argv.slice(2);
	const out = { cmd: null, opts: {} };
	if (args.length === 0) { usage(); exit(0); }
	out.cmd = args[0];
	for (let i = 1; i < args.length; i++) {
		const a = args[i];
		if (a === "--eoa" || a === "-k") { out.opts.eoa = args[++i]; continue; }
		if (a === "--salt") { out.opts.salt = args[++i]; continue; }
		if (a === "--factory") { out.opts.factory = args[++i]; continue; }
		if (a === "--wallet") { out.opts.wallet = args[++i]; continue; }
		if (a === "--portfolio") { out.opts.portfolio = true; continue; }
		if (a === "--help" || a === "-h") { usage(); exit(0); }
		console.warn("Argumento desconhecido:", a);
	}
	return out;
}

async function registerSmartWallet({ eoa, salt = "0", factory }) {
	if (!eoa) throw new Error("Parâmetro --eoa obrigatório para 'register'.");
	const body = {
		externallyOwnedAccount: eoa,
		factory: factory ?? process.env.NOTUS_FACTORY ?? DEFAULT_FACTORY,
		salt: String(salt)
	};

	const res = await fetch(`${BASE_URL}/wallets/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY
		},
		body: JSON.stringify(body)
	});

	const txt = await res.text();
	if (!res.ok) {
		throw new Error(`Registro falhou (status ${res.status}): ${txt}`);
	}
	const data = JSON.parse(txt);
	// a doc mostra data.wallet.accountAbstraction
	const smartWallet = data?.wallet?.accountAbstraction ?? data?.wallet?.address ?? null;
	console.log("Resposta completa:", JSON.stringify(data, null, 2));
	if (smartWallet) {
		console.log("\nSmart wallet registrada (accountAbstraction):", smartWallet);
	} else {
		console.log("\nRegistro concluído, mas não foi possível localizar 'wallet.accountAbstraction' no retorno.");
	}
}

async function getWalletInfo(walletAddress) {
	if (!walletAddress) throw new Error("Parâmetro --wallet obrigatório para 'check'.");

	const url = `${BASE_URL}/wallets/${walletAddress}`;
	const res = await fetch(url, {
		method: "GET",
		headers: { "x-api-key": API_KEY }
	});

	const txt = await res.text();
	if (!res.ok) {
		throw new Error(`GET wallet falhou (status ${res.status}): ${txt}`);
	}
	const data = JSON.parse(txt);
	console.log("Wallet info:", JSON.stringify(data, null, 2));
}

async function getWalletPortfolio(walletAddress) {
	const url = `${BASE_URL}/wallets/${walletAddress}/portfolio`;
	const res = await fetch(url, {
		method: "GET",
		headers: { "x-api-key": API_KEY }
	});
	const txt = await res.text();
	if (!res.ok) {
		throw new Error(`GET portfolio falhou (status ${res.status}): ${txt}`);
	}
	const data = JSON.parse(txt);
	console.log("Portfolio:", JSON.stringify(data, null, 2));
}

(async () => {
	try {
		const parsed = parseArgs();
		const cmd = parsed.cmd;
		if (cmd === "register") {
			await registerSmartWallet(parsed.opts);
		} else if (cmd === "check") {
			const w = parsed.opts.wallet;
			if (!w) throw new Error("Use --wallet <walletAddress> para check.");
			await getWalletInfo(w);
			if (parsed.opts.portfolio) {
				await getWalletPortfolio(w);
			}
		} else {
			console.error("Comando desconhecido:", cmd);
			usage();
			exit(2);
		}
	} catch (err) {
		console.error("Erro:", err.message ? err.message : err);
		process.exit(1);
	}
})();
