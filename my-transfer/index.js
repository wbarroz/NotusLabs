import { privateKeyToAccount } from 'viem/accounts'

const BASE_URL = "https://api.notus.team/api/v1"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTFiMDAyMy00ZGM3LTQ3NTEtYWIzNy05ZGFhZjU0NDhmZmIiLCJhcGlLZXlHZW5lcmF0ZWRBdCI6IjIwMjUtMDktMjZUMTk6NTk6MzYuNDQyWiIsIm9yZ2FuaXphdGlvbklkIjoiNmQwNDA0NTQtZjIwMi00NzBmLThjNDctNmNkODA1NDcyOTcwIn0.YXVhMqkJuwBtCryp2mu6iLN46KlBy5_6-NHy__GGTek"
const externallyOwnedAccount = "0x848e41ed9a7925f197aa22e86f91d715be40f5b7"

const UNI_POLYGON = '0xb33eaad8d922b1083446dc23f610c2567fb5180f'
const USDC_POLYGON = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const privateKey = '0x6d538a89c9c47bf54d7b0bef9bacc1dcf50828ce06612c7ff890b31d82e2f8a2'
const account = privateKeyToAccount(privateKey)

console.log(account.address)

async function main() {
	const smartWalletAddress = "0x5a8e0bdda70fccc5142717810b0a130f5527fed0"

	console.log(smartWalletAddress)


	const { data } = await fetch(`${BASE_URL}/crypto/transfer`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': API_KEY,
		},
		body: JSON.stringify(
			{
				payGasFeeToken: NATIVE, // Token used to pay gas fees
				token: NATIVE,        // Token to transfer
				amount: '5',               // Amount to transfer
				walletAddress: smartWalletAddress, // Sender's wallet
				signerAddress: externallyOwnedAccount, // Signer's address
				toAddress: '0x471776b1dec2e61bd262f3a14a0fded58b5109ee', // Replace <recipient-address> with the recipient's wallet
				chainId: 137,          // Blockchain network
				gasFeePaymentMethod: 'DEDUCT_FROM_AMOUNT', // Fee payment method
			}
		),
	}).then((res) => res.json());

	console.log(data)

}

main().catch(error => {
	console.error("An unhandled error occurred in the main function:");
	console.error(error);
	// Exit with a non-zero code to indicate failure
	process.exit(1);
});
