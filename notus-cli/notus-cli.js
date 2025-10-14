// notus-cli.js
import 'dotenv/config'
import fs from 'fs/promises'
import { privateKeyToAccount } from 'viem/accounts'

const BASE_URL = 'https://api.notus.team/api/v1'

// === Variáveis de ambiente ===
const API_KEY = process.env.NOTUS_API_KEY
const PRIVATE_KEY = process.env.NOTUS_PRIVATE_KEY

if (!API_KEY || !PRIVATE_KEY) {
	console.error('❌ ERRO: NOTUS_API_KEY e/ou NOTUS_PRIVATE_KEY não definidas no .env')
	process.exit(1)
}

const account = privateKeyToAccount(PRIVATE_KEY)
console.log(`✅ Conta carregada (EOA): ${account.address}`)

// === Endpoints ===
const ENDPOINTS = {
	// Smart wallets
	registerWallet: '/wallets/register',

	// Fiat
	depositQuote: '/fiat/deposit/quote',
	depositOrder: '/fiat/deposit',
	withdrawQuote: '/fiat/withdraw/quote',
	withdrawOrder: '/fiat/withdraw',

	// Crypto
	transfer: '/crypto/transfer',
	swap: '/crypto/swap',
	execute: '/crypto/execute-user-op',
}

// === Utilitários ===
async function loadRequestBody(filePath) {
	try {
		const data = await fs.readFile(filePath, 'utf8')
		return JSON.parse(data)
	} catch (err) {
		console.error(`❌ Erro ao ler arquivo JSON '${filePath}':`, err.message)
		process.exit(1)
	}
}

async function postToNotus(endpoint, body) {
	const url = `${BASE_URL}${endpoint}`
	console.log(`\n🔹 Enviando requisição para: ${endpoint}`)
	console.log('📤 Corpo da requisição:')
	console.log(JSON.stringify(body, null, 2))

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': API_KEY,
			},
			body: JSON.stringify(body),
		})

		const text = await response.text()
		let data = null
		try {
			data = JSON.parse(text)
		} catch {
			data = { raw: text }
		}

		console.log(`\n✅ Resposta recebida de ${endpoint}:`)
		console.log(JSON.stringify(data, null, 2))

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${text}`)
		}

		return data
	} catch (error) {
		console.error(`❌ Erro em ${endpoint}:`, error.message)
		return null
	}
}

async function signAndExecute(userOpHash) {
	if (!userOpHash) {
		console.error('❌ signAndExecute: userOpHash ausente.')
		return null
	}

	const signature = await account.signMessage({ message: { raw: userOpHash } })
	console.log(`✍️ Assinatura gerada: ${signature}`)

	const execBody = {
		userOperationHash: userOpHash,
		signature,
	}

	const result = await postToNotus(ENDPOINTS.execute, execBody)
	if (result) {
		console.log('🚀 Execução concluída com sucesso!')
	}
	return result
}

async function saveBase64Image(base64Data, filename = 'deposit_qr.png') {
	try {
		const buffer = Buffer.from(base64Data, 'base64')
		await fs.writeFile(filename, buffer)
		console.log(`📸 QR Code salvo como imagem: ${filename}`)
	} catch (err) {
		console.error('❌ Erro ao salvar imagem base64:', err.message)
	}
}

// === Função principal ===
async function main() {
	const [, , operation, jsonFile, maybeExecute] = process.argv

	if (!operation || !jsonFile) {
		console.error('Uso: node notus-cli.js <operation> <arquivo.json> [execute]')
		console.error('Operações suportadas: register | deposit | withdraw | transfer | swap')
		process.exit(1)
	}

	const shouldExecute = maybeExecute === 'execute'
	const requestBody = await loadRequestBody(jsonFile)

	// === REGISTRO DE SMART WALLET ===
	if (operation === 'register') {
		// prepare body: externallyOwnedAccount (fallback para account.address) e factory (obrigatório)
		const externallyOwnedAccount = requestBody.externallyOwnedAccount || account.address
		const factory = requestBody.factory
		if (!factory) {
			console.error('❌ ERRO: "factory" é obrigatório no arquivo JSON para registrar a wallet.')
			return
		}

		const registerBody = {
			externallyOwnedAccount,
			factory,
		}

		// opcional: incluir salt, eip7702, metadata se existirem no requestBody
		if (requestBody.salt !== undefined) registerBody.salt = requestBody.salt
		if (requestBody.eip7702 !== undefined) registerBody.eip7702 = requestBody.eip7702
		if (requestBody.metadata !== undefined) registerBody.metadata = requestBody.metadata

		const resp = await postToNotus(ENDPOINTS.registerWallet, registerBody)
		if (!resp) return

		// Se a API retornar 'wallet', mostramos; se retornar um userOperationHash (raro), permitimos execute
		const wallet = resp.wallet
		if (wallet) {
			console.log('\n🏷️ Wallet registrada / retornada pelo serviço:')
			console.log(JSON.stringify(wallet, null, 2))
		}

		// Se houver userOperationHash (algumas integrações podem retornar), trate a execução
		const userOpHash =
			resp.userOperationHash ||
			resp.userOpHash ||
			wallet?.userOperationHash ||
			wallet?.userOpHash ||
			null

		if (userOpHash && shouldExecute) {
			console.log(`\n🔑 userOperationHash obtido: ${userOpHash}`)
			console.log('🚀 Executando operação de registro (execute-user-op)...')
			await signAndExecute(userOpHash)
		} else if (userOpHash) {
			console.log('\n💰 Registro cotado — adicione "execute" para efetivar (se aplicável).')
		} else {
			console.log('\n✅ Registro concluído (sem execução adicional necessária).')
		}
		return
	}

	// === DEPÓSITO FIAT ===
	if (operation === 'deposit') {
		const quoteResponse = await postToNotus(ENDPOINTS.depositQuote, requestBody)
		const quoteId = quoteResponse?.depositQuote?.quoteId

		if (!quoteId) {
			console.warn('⚠️ Nenhum quoteId retornado da cotação.')
			return
		}
		console.log(`\n📦 Cotação obtida: quoteId = ${quoteId}`)

		if (!shouldExecute) {
			console.log('💰 Modo COTAÇÃO: operação não executada (adicione "execute" para criar a ordem).')
			return
		}

		const walletAddress = requestBody.walletAddress
		if (!walletAddress) {
			console.error('❌ ERRO: walletAddress é obrigatório no arquivo JSON para depósito.')
			return
		}

		const orderBody = { quoteId, walletAddress }
		const orderResponse = await postToNotus(ENDPOINTS.depositOrder, orderBody)
		const depositOrder = orderResponse?.depositOrder
		if (!depositOrder) {
			console.warn('⚠️ Resposta inválida ao criar ordem de depósito.')
			return
		}

		// busca base64QrCode em vários possíveis caminhos
		const base64QrCode =
			depositOrder.base64QrCode ||
			depositOrder.paymentMethodToSendDetails?.base64QrCode ||
			depositOrder.paymentInfo?.base64QrCode

		if (base64QrCode) {
			const fileName = `deposit_${quoteId}.png`
			await saveBase64Image(base64QrCode, fileName)
		} else {
			console.warn('⚠️ Nenhum campo base64QrCode encontrado na resposta (nem em paymentMethodToSendDetails).')
		}

		console.log('\n✅ Depósito criado com sucesso! QR Code salvo (se disponível).')
		return
	}

	// === SAQUE FIAT ===
	if (operation === 'withdraw') {
		const quoteResponse = await postToNotus(ENDPOINTS.withdrawQuote, requestBody)
		const quoteId = quoteResponse?.withdrawQuote?.quoteId
		if (!quoteId) {
			console.warn('⚠️ Nenhum quoteId retornado da cotação.')
			return
		}
		console.log(`\n📦 Cotação obtida: quoteId = ${quoteId}`)

		if (!shouldExecute) {
			console.log('💰 Modo COTAÇÃO: operação não executada (adicione "execute" para efetuar).')
			return
		}

		const walletAddress = requestBody.walletAddress
		if (!walletAddress) {
			console.error('❌ ERRO: walletAddress é obrigatório no arquivo JSON para retirada.')
			return
		}

		const orderBody = { quoteId, walletAddress }
		const orderResponse = await postToNotus(ENDPOINTS.withdrawOrder, orderBody)
		const withdrawOrder = orderResponse?.withdrawOrder
		if (!withdrawOrder) {
			console.warn('⚠️ Resposta inválida ao criar ordem de retirada.')
			return
		}

		const userOpHash = withdrawOrder.userOperationHash || withdrawOrder.userOpHash
		if (!userOpHash) {
			console.warn('⚠️ Nenhum userOperationHash encontrado na resposta da ordem.')
			return
		}

		console.log(`\n🔑 userOperationHash obtido: ${userOpHash}`)
		console.log('🚀 Executando operação de usuário (execute-user-op)...')
		await signAndExecute(userOpHash)
		return
	}

	// === TRANSFER ===
	if (operation === 'transfer') {
		const response = await postToNotus(ENDPOINTS.transfer, requestBody)
		const quoteId =
			response?.transfer?.quoteId ||
			response?.data?.quoteId ||
			response?.quoteId ||
			response?.userOperationHash ||
			null

		if (!quoteId) {
			console.warn('⚠️ Nenhum quoteId encontrado na resposta.')
			return
		}

		console.log(`\n📦 Quote ID: ${quoteId}`)
		if (shouldExecute) {
			console.log('🚀 Modo EXECUTE: executando operação...')
			await signAndExecute(quoteId)
		} else {
			console.log('💰 Modo COTAÇÃO: operação não executada (adicione "execute" para efetuar).')
		}
		return
	}

	// === SWAP ===
	if (operation === 'swap') {
		const response = await postToNotus(ENDPOINTS.swap, requestBody)
		if (Array.isArray(response.quotes) && response.quotes.length > 0) {
			const firstQuote = response.quotes[0]
			const quoteId = firstQuote.quoteId || firstQuote.userOperationHash || null
			console.log(`\n🔁 Usando primeira cotação (provedor: ${firstQuote.swapProvider || 'unknown'})`)
			console.log('📦 Primeira cotação:')
			console.log(JSON.stringify(firstQuote, null, 2))

			if (!quoteId) {
				console.warn('⚠️ Primeiro item de quotes não contém quoteId/userOperationHash.')
				return
			}

			console.log(`\n📦 Quote ID: ${quoteId}`)
			if (shouldExecute) {
				console.log('🚀 Modo EXECUTE: executando operação...')
				await signAndExecute(quoteId)
			} else {
				console.log('💰 Modo COTAÇÃO: operação não executada (adicione "execute" para efetuar).')
			}
		} else {
			console.warn('⚠️ Nenhuma cotação retornada no array "quotes".')
		}
		return
	}

	console.error(`❌ Operação '${operation}' não reconhecida.`)
}

main().catch((err) => {
	console.error('❌ Erro inesperado:', err)
	process.exit(1)
})

