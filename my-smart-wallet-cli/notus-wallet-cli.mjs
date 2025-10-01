#!/usr/bin/env node
// CLI para integração com Notus API
// Comandos:
//   register  --eoa <EOA> --salt <n>
//   list
//   portfolio --wallet <SMART_WALLET_ADDR>

import fetch from "node-fetch";
import { argv, exit } from "process";

const BASE_URL = process.env.NOTUS_BASE_URL ?? "https://api.notus.team/api/v1";
const API_KEY = process.env.NOTUS_API_KEY;

// factory do tipo "Light Account" (default da Notus)
const FACTORY_LIGHT_ACCOUNT = "0x0000000000400CdFef5E2714E63d8040b700BC24";

if (!API_KEY) {
	console.error("Erro: defina NOTUS_API_KEY com sua API key.");
	process.exit(2);
}

function usage() {
	console.log(`
Uso:
  register  --eoa <EOA> --salt <n>
  list
  portfolio --wallet <SMART_WALLET_ADDR>
`);
}

function parseArgs() {
	const args = argv.slice(2);
	const out = { cmd: null, opts: {} };
	if (args.length === 0) {
		usage();
		exit(0);
	}
	out.cmd = args[0];
	for (let i = 1; i < args.length; i++) {
		const a = args[i];
		if (a === "--eoa") { out.opts.eoa = args[++i]; continue; }
		if (a === "--salt") { out.opts.salt = args[++i]; continue; }
		if (a === "--wallet") { out.opts.wallet = args[++i]; continue; }
		if (a === "--help" || a === "-h") { usage(); exit(0); }
		console.warn("Argumento desconhecido:", a);
	}
	return out;
}

// 1) Registrar smart wallet
async function registerSmartWallet({ eoa, salt }) {
	if (!eoa || salt === undefined) {
		throw new Error("Uso: register --eoa <EOA> --salt <n>");
	}
	const body = {
		externallyOwnedAccount: eoa,
		factory: FACTORY_LIGHT_ACCOUNT,
		salt: String(salt),
	};
	const res = await fetch(`${BASE_URL}/wallets/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
		},
		body: JSON.stringify(body),
	});
	const txt = await res.text();
	if (!res.ok) throw new Error(`Falha register: ${txt}`);
	const data = JSON.parse(txt);
	console.log(JSON.stringify(data, null, 2));
	console.log("Smart wallet:", data?.wallet?.accountAbstraction);
}

// 2) Listar carteiras do projeto
async function listWallets() {
	const res = await fetch(`${BASE_URL}/wallets`, {
		headers: { "x-api-key": API_KEY },
	});
	const txt = await res.text();
	if (!res.ok) throw new Error(`Falha list wallets: ${txt}`);
	console.log(txt);
}

// 3) Consultar portfolio
async function getWalletPortfolio(wallet) {
	if (!wallet) throw new Error("Uso: portfolio --wallet <SMART_WALLET_ADDR>");
	const res = await fetch(`${BASE_URL}/wallets/${wallet}/portfolio`, {
		headers: { "x-api-key": API_KEY },
	});
	const txt = await res.text();
	if (!res.ok) throw new Error(`Falha portfolio: ${txt}`);
	console.log(txt);
}

(async () => {
	try {
		const parsed = parseArgs();
		if (parsed.cmd === "register") {
			await registerSmartWallet(parsed.opts);
		} else if (parsed.cmd === "list") {
			await listWallets();
		} else if (parsed.cmd === "portfolio") {
			await getWalletPortfolio(parsed.opts.wallet);
		} else {
			usage();
			exit(2);
		}
	} catch (err) {
		console.error("Erro:", err.message ?? err);
		process.exit(1);
	}
})();
