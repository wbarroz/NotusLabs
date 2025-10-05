import { privateKeyToAccount } from 'viem/accounts'

const BASE_URL = "https://api.notus.team/api/v1"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTFiMDAyMy00ZGM3LTQ3NTEtYWIzNy05ZGFhZjU0NDhmZmIiLCJhcGlLZXlHZW5lcmF0ZWRBdCI6IjIwMjUtMDktMjZUMTk6NTk6MzYuNDQyWiIsIm9yZ2FuaXphdGlvbklkIjoiNmQwNDA0NTQtZjIwMi00NzBmLThjNDctNmNkODA1NDcyOTcwIn0.YXVhMqkJuwBtCryp2mu6iLN46KlBy5_6-NHy__GGTek"
const externallyOwnedAccount = "0x848e41ed9a7925f197aa22e86f91d715be40f5b7"
const walletAddress = "0x5a8e0bdda70fccc5142717810b0a130f5527fed0"
const toAddress = "0x471776b1dec2e61bd262f3a14a0fded58b5109ee"

const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const privateKey = '0x6d538a89c9c47bf54d7b0bef9bacc1dcf50828ce06612c7ff890b31d82e2f8a2'
const transfer_endpoint = "/crypto/transfer";
const execute_user_endpoint = "/crypto/execute-user-op";
const account = privateKeyToAccount(privateKey)

console.log(account.address)


async function getUserOperation(userOperationHash) {
	const endpoint = "/crypto/transfer";
	const url = `${BASE_URL}${endpoint}`;


	let output = null
	try {
		// 2. Execute the fetch request
		const response = await fetch(url, {
			method: 'POST', // -X POST
			headers: {
				'Content-Type': 'application/json', // -H "Content-Type: application/json"
				'x-api-key': API_KEY, // -H "x-api-key: ..."
			},
			body: JSON.stringify(requestBody), // -d '{...}'
		});

		// 3. Check for HTTP errors (e.g., 4xx or 5xx)
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
		}

		// 4. Parse the JSON response
		// console.log(response);
		const data = await response.json();

		// 5. Output the result
		console.log("Transfer successful! API Response:");
		//console.log(data.transfer);

		output = data.transfer

		/*
		const signature = await account.signMessage({
			message: {
				raw: data.transfer.quoteId, // Quote ID from the transfer quote
			},
		})
		console.log(signature)
		*/


	} catch (error) {
		console.error("An error occurred during the transfer:", error.message);
	} finally {
		return output
	}
}
/**
 * Executes the crypto transfer API call.
 */
async function executePost(requestBody, endpoint) {
	const url = `${BASE_URL}${endpoint}`;


	let output = null
	try {
		// 2. Execute the fetch request
		const response = await fetch(url, {
			method: 'POST', // -X POST
			headers: {
				'Content-Type': 'application/json', // -H "Content-Type: application/json"
				'x-api-key': API_KEY, // -H "x-api-key: ..."
			},
			body: JSON.stringify(requestBody), // -d '{...}'
		});

		// 3. Check for HTTP errors (e.g., 4xx or 5xx)
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
		}

		// 4. Parse the JSON response
		// console.log(response);
		const data = await response.json();

		// 5. Output the result
		console.log("Transfer successful! API Response:");
		//console.log(data.transfer);

		output = data.transfer

		/*
		const signature = await account.signMessage({
			message: {
				raw: data.transfer.quoteId, // Quote ID from the transfer quote
			},
		})
		console.log(signature)
		*/


	} catch (error) {
		console.error("An error occurred during the transfer:", error.message);
	} finally {
		return output
	}
}

async function main() {
	const smartWalletAddress = "0x5a8e0bdda70fccc5142717810b0a130f5527fed0"

	console.log(smartWalletAddress)


	// 1. Define the body data exactly as in the curl command
	let requestBody = {
		amount: "8.8",
		chainId: 137,
		gasFeePaymentMethod: "ADD_TO_AMOUNT",
		payGasFeeToken: NATIVE,
		token: NATIVE,
		signerAddress: externallyOwnedAccount,
		walletAddress: walletAddress,
		toAddress: toAddress,
		transactionFeePercent: null,
	};

	let result = await executePost(requestBody, transfer_endpoint)
	console.log(result)
	if (result) {
		const signature = await account.signMessage({
			message: {
				raw: result.quoteId, // Quote ID from the transfer quote
			},
		})
		console.log(result.quoteId)
		console.log(signature)
		requestBody = {
			userOperationHash: result.quoteId,
			quoteId: result.quoteId,
			authorization: signature,
			signature: signature,
		};
		requestBody = {
			userOperationHash: result.quoteId,
			signature: signature,
		};
		result = await executePost(requestBody, execute_user_endpoint)
		console.log(result)
	}

}

main().catch(error => {
	console.error("An unhandled error occurred in the main function:");
	console.error(error);
	// Exit with a non-zero code to indicate failure
	process.exit(1);
});
