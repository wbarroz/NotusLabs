const body = JSON.stringify({
	"firstName": "John",
	"lastName": "Doe",
	"birthDate": "1983-04-20",
	"documentCategory": "IDENTITY_CARD",
	"documentCountry": "BRAZIL",
	"documentId": "1234567890",
	"livenessRequired": true,
	"email": "email@example.com",
	"address": "Av Abcd 1024",
	"city": "Diadema",
	"state": "SP",
	"postalCode": "09900123",
	"nationality": "BRAZILIAN"
})

fetch("https://api.notus.team/api/v1/kyc/individual-verification-sessions/standard", {
	headers: {
		"x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTFiMDAyMy00ZGM3LTQ3NTEtYWIzNy05ZGFhZjU0NDhmZmIiLCJhcGlLZXlHZW5lcmF0ZWRBdCI6IjIwMjUtMDktMjZUMTk6NTk6MzYuNDQyWiIsIm9yZ2FuaXphdGlvbklkIjoiNmQwNDA0NTQtZjIwMi00NzBmLThjNDctNmNkODA1NDcyOTcwIn0.YXVhMqkJuwBtCryp2mu6iLN46KlBy5_6-NHy__GGTek"
	},
	body
})
