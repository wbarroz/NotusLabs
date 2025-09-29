#!/usr/bin/env node
// CLI simples para smart wallets Notus
// Comandos:
//   register  --eoa <EOA> [--salt <n>] [--factory <addr>]
//   check     --eoa <EOA> [--salt <n>] [--factory <addr>]
//   portfolio --wallet <SMART_WALLET_ADDR>

import { argv, exit } from "process";

const BASE_URL = process.env.NOTUS_BASE_URL ?? "https://api.notus.team/api/v1";
const API_KEY = process.env.NOTUS_API_KEY;
const DEFAULT_FACTORY =
	process.env.NOTUS_FACTORY ??
	"0x0000000000400CdFef5E2714E63d8040b700BC24"; // doc default

if (!API_KEY) {
	console.error("Erro: defina NOTUS_API_KEY com sua API key.");
	process.exit(2);
}

function usage() {
	console.log(`
Uso:
  register  --eoa <EOA_address> [--salt <salt>] [--factory <factory_address>]
  check     --eoa <EOA_address> [--salt <salt>] [--factory <factory_address>]
  portfolio --wallet <smart_wallet_address>
`);
}

function parseArgs() {
	const args = argv.slice(2);
	const out = { cmd: null, opts: {} };
	if (args.length === 0) { usage(); exit(0); }
	out.cmd = args[0];
	for (let i = 1; i < args.length; i++) {
		const a = args[i];
		if (a === "--eoa") { out.opts.eoa = args[++i]; continue; }
		if (a === "--salt") { out.opts.salt = args[++i]; continue; }
		if (a === "--factory") { out.opts.factory = args[++i]; continue; }
		if (a === "--wallet") { out.opts.wallet = args[++i]; continue; }
		if (a === "--help" || a === "-h") { usage(); exit(0); }
		console.warn("Argumento desconhecido:", a);
	}
	return out;
}

async function registerSmartWallet({ eoa, salt = "0", factory }) {
	if (!eoa) throw new Error("--eoa obrigatório.");
	const body = {
		externallyOwnedAccount: eoa,
		factory: factory ?? DEFAULT_FACTORY,
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
	const smart = data?.wallet?.accountAbstraction;
	if (smart) console.log("Smart wallet:", smart);
}

async function getSmartWalletAddress({ eoa, salt = "0", factory }) {
	if (!eoa) throw new Error("--eoa obrigatório.");
	const url = new URL(`${BASE_URL}/wallets/address`);
	url.searchParams.set("externallyOwnedAccount", eoa);
	url.searchParams.set("factory", factory ?? DEFAULT_FACTORY);
	url.searchParams.set("salt", String(salt));

	const res = await fetch(url, {
		method: "GET",
		headers: { "x-api-key": API_KEY },
	});
	const txt = await res.text();
	if (!res.ok) throw new Error(`Falha check: ${txt}`);
	const data = JSON.parse(txt);
	console.log(JSON.stringify(data, null, 2));
	const smart = data?.wallet?.accountAbstraction;
	if (smart) console.log("Smart wallet:", smart);
}

async function getWalletPortfolio(walletAddress) {
	if (!walletAddress) throw new Error("--wallet obrigatório.");
	const url = `${BASE_URL}/wallets/${walletAddress}/portfolio`;
	const res = await fetch(url, {
		method: "GET",
		headers: { "x-api-key": API_KEY },
	});
	const txt = await res.text();
	if (!res.ok) throw new Error(`Falha portfolio: ${txt}`);
	const data = JSON.parse(txt);
	console.log(JSON.stringify(data, null, 2));
}

(async () => {
	try {
		const parsed = parseArgs();
		if (parsed.cmd === "register") {
			await registerSmartWallet(parsed.opts);
		} else if (parsed.cmd === "check") {
			await getSmartWalletAddress(parsed.opts);
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
