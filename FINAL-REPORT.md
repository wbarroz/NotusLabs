# Relatório Final - NotusLab DX Research

**Template estruturado para participantes**

---

## Dados do Participante

**Nome:** Wilson Pereira Barros Junior

**Email:** wbarroz@gmail.com

**Ferramentas utilizadas:**
- Editor NeoVim
- Execução em Node, Python, cURL e a ferramenta da referência para execução de chamadas de API e obtenção de "code snippets"
- IA ChatGPT e Gemini como auxílio em código e testes 

**Link do repositório:**
`https://github.com/wbarroz/NotusLabs`

**Link do post público:**


**Data de iní­cio:** 26/09/2025

**Data de conclusão:** 10/10/2025

---

## Relatório

### **1. Qual trilha você testou?**

(*) Trilha A -- Smart Wallet, KYC, Fiat, Portfolio, History

(*) Trilha B -- Smart Wallet, Swaps, Transfer, Portfolio, History

( ) Trilha C -- Smart Wallet, Liquidity Pools, Portfolio, History

---

### **2. Quais endpoints você testou com mais profundidade?**

a. *Registro de carteiras*  
`/api/v1/wallets/register`  
A execução deste endpoint resulta na criação de uma smart wallet, a partir da EOA(chave pública previamente criada), um valor inteiro de salt(default 0) e uma das opções de contratos p/ funcionalidade da smart wallet(no caso, foi usado o modelo "Light Account Factory", mais simples e adequado à experimentação); porém, para ser transacionada, a carteira necessitará de um depósito prévio, e só será "trazida" à vida no momento em que receber uma solicitação de transação(na prática uma cotação é o suficiente)

b. *Lista das carteiras criadas*  
`/api/v1/wallets`  
A execução deste endpoint traz na resposta uma lista com as carteiras criadas

c. *Portfolio de uma carteira específica*  
`/api/v1/wallets/${wallet}/portfolio`  
A execução deste endpoint traz na resposta o portfolio da carteira, i.e., um "saldo" das quantidades dos diferentes tokens suportados presentes na carteira

d. *Cotação p/ transferência*  
`/api/v1/crypto/transfer`  
A execução deste endpoint executa uma cotação para uma transferência a partir da carteira, indicando no retorno da chamada o id da cotação e sua efetividade (efetuável/não efetuável, baseado no saldo e no gas necessário para a realização); a efetivação deve ser feita com o uso do endpoint "Execução de operação do usuário"

e. *Execução de operação do usuário*  
`/api/v1/crypto/execute-user-op`  
Este endpoint necessita do id de uma cotação e da sua assinatura feita com a chave privada da EOA, para execução efetiva da cotação

f. *Criação de sessão de verificação de identidade de cliente*  
`/api/v1/kyc/individual-verification-sessions/standard`  
A execução deste endpoint dispara o processo de verificação de identidade do cliente, com a inclusão no corpo de envio dos dados do cliente, e a indicação no corpo do retorno os locais de "upload" das fotos da documentação a fornecer, após o que deve ser invocado o "Processamento da verificação de identidade de cliente", descrito a seguir.

g. *Processamento da verificação de identidade de cliente*  
`/api/v1/kyc/individual-verification-sessions/standard/{session_id}/process`  
Este endpoint permite que se dispare o processamento dos dados do cliente para a verificação de identidade

h. *Checagem do status de verificação de identidade do cliente*  
`/api/v1/kyc/individual-verification-sessions/standard/{session_id}`  
Este endpoint permite que se verifique o status da verificação de identidade

i. *Cotação de depósito fiduciário*  
`/api/v1/fiat/deposit/quote`
Este endpoint faz a cotação para um depósito fiduciário numa smart wallet

j. *Ordem de depósito fiduciário*  
`/api/v1/fiat/deposit`
Este endpoint efetua o depósito fiduciário numa smart wallet, baseado em cotação prévia

k. *Cotação de saque fiduciário*  
`/api/v1/fiat/withdraw/quote`
Este endpoint faz a cotação para um resgate fiduciário a partir de uma smart wallet

l. *Ordem de saque fiduciário*  
`/api/v1/fiat/withdraw`
Este endpoint executa um resgate fiduciário a partir de uma smart wallet, baseado em cotação prévia


Liste os endpoints e o que foi validado neles (ex: `/wallet/create`, `/swap/quote`, etc.)

---

### **3. Quais foram os principais bugs encontrados?**

* Foi um problema momentâneo("bug resolvido"), a verificação de identidade individual(`/api/v1/kyc/individual-verification-sessions/standard`) esteve inoperante por alguns dias, mas o apoio contínuo do pessoal da `@API` ajudou a depurar alguns erros de uso(*meus*), permitindo o sucesso na primeira tentativa quando da volta do serviço.

---

### **4. Quais comportamentos inesperados você identificou?**

* Longe de ser um bug, mas aconteceu com alguma frequência e, especialmente no começo, atrapalhou um bocado(a *minha* falta de experiência também ajudou), foi a "generalidade" de algumas mensagens; por exemplo, ao usar o endpoint "Create Transfer"(`/api/v1/crypto/transfer`), com valor insuficiente para concluir a operação:
```
{
  "message": "An unexpected error occurred. Our team has been notified.",
  "id": "INTERNAL_SERVER_ERROR",
  "traceId": "28e7931e191c466bbf77718a923baf60"
}
```

* Entre 12 e 13h no dia 10 de outubro houve uma certa indisponibilidade, onde por exemplo as chamadas à função "Get Smart Wallet Portfolio"(`/api/v1/wallets/{walletAddress}/portfolio`) retornavam sempre:
```
{
  "message": "Failed to get balances. Please try again later.",
  "id": "FAILED_TO_GET_BALANCES",
  "traceId": "06ce5127231142edae48dfda1e78c7fc"
}
```

* Ainda nessa tarde(10/10), uma das moedas estavam incorretamente identificadas("Staked BRZ" &mdash; STBRZ &mdash; estava como "Brazilian Digital" &mdash; BRZ), o que foi prontamente corrigido &mdash; mas pode estar presente em outras moedas

---

### **5. Como foi a experiência de usar a API?**

- **De uma nota de 1 a 5 para cada item, com comentários opcionais.**

* A documentação foi suficiente? _4.5_  
A documentação está ótima, e o recurso de poder executar chamadas na referência, com os exemplos em diversos formatos(cURL, python, javascript, etc) é extremamente valioso, mas às vezes há detalhes nas chamadas efetivamente usados que não estão presentes no formulário de body, apenas no editor de JSON
* As mensagens de erro ajudaram? _2_  
Sinceramente, às vezes as mensagens são um bocado genéricas, e não ajudam na depuração dos problemas como deveriam
* O fluxo fez sentido? _3_
As definições são claras, mas faz falta um *FLUXOGRAMA* com casos de uso que ilustrassem quais as sequencias típicas das chamadas, incluindo possíveis variações e enganos comuns
* O tempo de resposta era razoável? _5_
Tanto no sucesso(o que felizmente aconteceu na maior parte do tempo 😃) quanto nos eventuais erros, a resposta da API foi rápida e não interferiu nos casos de uso 



---

### **6. Alguma funcionalidade estava ausente ou incompleta?**

Os endpoints disponibilizados foram suficientes para o teste das funcionalidades, não foi notada uma ausência importante.

---

### **7. Quais melhorias você sugere?**

* Descrições mais detalhadas e específicas nas mensagens de erro;
* Na documentação, particularmente na referência, tornar compatíveis os campos disponíveis no formulário com o conteúdo do corpo da mensagem visível quando se habilita o editor de JSON;
* Na documentação, os diferentes guias deveriam incluir o contexto de uso, com uma descrição mais detalhada dos passos, e também mais exemplos de código no repositório

* Nomes de campos? Melhor manter
* Design de endpoints? É funcional no estado em que está
* Lógica de negócio? Seria beneficiado de fluxogramas com as sequências esperadas
* Fluxo geral de uso? Idem lógica de negócio acima
* Retornos da API? Mensagens de erro precisam ser mais detalhadas e menos genéricas
* Consistência entre rotas? Parece bom como está(não atrapalhou, pelo menos)

---

### **8. Como você avaliaria a estabilidade geral da API nesta trilha?**

* [ ] Muito estável -- tudo funcionou bem
* [*] Estável -- poucos problemas, nada crí­tico
* [ ] Instável -- muitos problemas ou travamentos
* [ ] Quebrada -- mal consegui testar

Explique com base na sua experiência.
A experiência com o uso da API foi bem satisfatória pois, mesmo com alguns problemas no KYC e mensagens de erro restritas, todas as funcionalidades que se planejava testar foram experimentadas com sucesso.

---

### **9. Há testes que você gostaria de ter feito, mas não conseguiu? Por quê?**

Foi possível realizar todos os "caminhos felizes" que permitiram verificar as principais funcionalidades da plataforma, o que talvez tenha ficado de fora foi uma teste mais sistemático de todas as funcionalidades, mas isso estava fora do escopo inicial e do tempo disponível.

---

### **10. Comentários finais ou insights gerais?**

Para finalizar, uma seqüência com os casos de uso das trilhas 1 & 2:

1. No dashboard, um projeto é criado:

1. Para os testes, serão criadas duas carteiras("smart wallets"), a partir de um par de chaves(pública & privada, que constituem uma EOA) que pode ser obtido pelo seguinte comando do Foundry SDK:  
    ```console
    cast wallet new
    ```

1. Com as chaves acima obtidas, já se torna possível criar as carteiras, através do código `https://github.com/wbarroz/NotusLabs/tree/main/notus-cli`, registrando-as com o seguinte corpo de mensagem:
    ```
    {
        "factory": "0x0000000000400CdFef5E2714E63d8040b700BC24",
        "externallyOwnedAccount": "0xfa..9c",
        "salt": "0"
    }
    ```
    com a chamada:  
    ```console
    npm run register -- reg_wallet.json # usada a função "Register Smart Wallet"(/api/v1/wallets/register)
    ```
    sendo que para a primeira carteira o campo "salt" fica a "0" como mostrado acima e para a segunda o valor é "1", e "factory" traz o tipo de smart contract atrelado às accounts(o que caracteriza a "smart wallet") usado, que no nosso caso é o mais simples &mdash; "Light Account Factory"; as carteiras ficam como a seguir:  
![carteiras criadas](https://github.com/wbarroz/NotusLabs/blob/main/Lista_carteiras.png)

1. Para exercitar as transferências de valores entre as carteiras, é necessário um depósito inicial, o que vai ser feito através da rampa de entrada(on-ramp); para tanto, é necessária a habilitação da rampa para o projeto criado(procedimento interno), e a criação de uma identificação, através do processo de KYC para o usuário, que consiste na verificação de documentação e prova de vida(aqui não usado para efeito de simplicidade, mas que pode ser feito): o KYC é iniciado através da chamada da função "Create a standard individual verification session", que pode ser executada no código `https://github.com/wbarroz/NotusLabs/tree/main/kyc/kyc_py`, usando o seguinte corpo de mensagem:
    ```
    {
        "firstName": "Joao",
        "lastName": "da Silva Souza",
        "birthDate": "20/04/1993",
        "documentCategory": "IDENTITY_CARD",
        "documentCountry": "BRAZIL",
        "documentId": "13333333332",
        "livenessRequired": false,
        "email": "exemplo@email.com.br",
        "address": "Rua Generica, 7",
        "city": "Campinas",
        "state": "SP",
        "postalCode": "09999990",
        "nationality": "BRAZILIAN"
    }
    ```
    ...e a seguinte chamada:  
`./kyc.py --body form.json --front frente.jpg --back verso.jpg`  
O processo de KYC envolve o envio da mensagem acima, seguido pelo envio(em caso de um início de verificação bem-sucedido) da(s) foto(s) de documento, seguido pela consulta do status do processo em que a resposta pode ser "PENDING"(fotos não enviadas), "PROCESSING(fotos enviadas, fazendo processamento)" , "VERIFYING"(fazendo a verificação das informações) , "COMPLETED"(verificação bem-sucedida, inclue o individualId) , "FAILED"(falhou verificação) ou "EXPIRED(não enviadas a(s) foto(s) de documento no tempo hábil". Todo esse processo é realizado pelo código acima mencionado. Convém mencionar que o procedimento de envio das fotos poderia se beneficiar de uma descrição, ainda que sucinta, do processo de upload no AWS S3 usado(no caso o assistente de IA foi capaz de criar a automação necessária, baseado nos campos de retorno da mensagem inicial &mdash; "Create a standard individual verification session").

1. Obtido o "individualId" num projeto habilitado ao uso da rampa, podem ser feitas as transações com vista à conversão de moeda fiduciária em crypto-ativos; para tanto, o primeiro passo é a execução de uma cotação do depósito em dinheiro para uma das carteiras, o que é feito através do endpoint "Create Fiat Deposit Quote", usando-se o seguinte conteúdo(por exemplo)no corpo da mensagem:
    <a name="fiat_deposit"></a>
    ```json
    {
        "paymentMethodToSend": "PIX",
        "receiveCryptoCurrency": "BRZ",
        "amountToSendInFiatCurrency": 27.55,
        "individualId": "ff..8d",
        "walletAddress": "0x57..1c",
        "chainId": 137
    }
    ```
    como pode ser visto, o criptoativo alvo para o depósito é BRZ(para essa operação, podem ser usados BRZ &mdash; "Brazilian Digital" &mdash; e USDC &mdash; "USD Coin");
    na resposta à esta requisição, se viável(valor mínimo em reais: R$ 0,01, endereço correto de carteira, usuário, etc), são confirmados os valores, incluindo a efetiva conversão(no caso, 1:1) e sua validade:
    ```json
    {
      "depositQuote": {
        "quoteId": "be885ff6-52e6-467f-b32b-7ac6bcdd5a2f",
        "amountToSendInFiatCurrency": "27.55",
        "amountToReceiveInCryptoCurrency": "27.55",
        "expiresAt": "2025-10-13T20:12:18.382Z"
      }
    }
    ```
    Tudo o mais correto, a ordem tem sua efetivação iniciada através do endpoint "Create Fiat Deposit Order", usando o seguinte corpo de mensagem:
    ```json
    {
      "quoteId": "be885ff6-52e6-467f-b32b-7ac6bcdd5a2f",
      "walletAddress": "0x57..1c"
    }
    ```
    Na resposta à esta última requisição, estarão presentes as informações para o depósito via PIX:
    ```json
    {
        "depositOrder": {
            "orderId": "925c869f-27ca-406b-b872-db6c5930c106",
            "expiresAt": "2025-10-13T20:12:18.382Z",
            "paymentMethodToSendDetails": {
                "type": "PIX",
                "pixKey": "000...br.gov.bcb.pix...pix.b...com/qrs1/v2/01djWpcPZxXuRjHepRUw1gh352gVkSWgRPuXzFdgxX5MXNNay520400005303986540527.555802BR59213rz .....................Rio de Janeiro6***************D26",
                "base64QrCode": "iVBORw0KGgoAAAANXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5CYII="
            }
        }
    }
    ```
    Usando-se o código em `https://github.com/wbarroz/NotusLabs/blob/main/notus-cli/notus-cli.js`, com o seguinte comando:  
    ```console
    npm run deposit -- deposit_body.json execute
    ```  
    e tendo no arquivo `deposit_body.json` o conteúdo do [corpo de mensagem inicial acima mostrado](#fiat_deposit), toda essa sequência de operação é executada automaticamente, com a geração de um arquivo PNG com o QR-Code para a efetuação do depósito via PIX.
    <p align="center">
    <img src="https://github.com/wbarroz/NotusLabs/blob/main/pix_started.jpg" alt="preparação do PIX" width="200"/>
    <img src="https://github.com/wbarroz/NotusLabs/blob/main/pix_finished.jpg" alt="PIX finalizado" width="200"/>
    </p>

1. Através do endpoint "Get Smart Wallet Portfolio", é possível verificar, no corpo da mensagem de retorno, a carteira destino com os recursos recém-depositados:
    ```json
    {
      "tokens": [
        {
          "chainId": 137,
          "balance": "27550000000000000000",
          "priceUsd": "0.1817383484",
          "balanceUsd": "5.00689149842",
          "balanceFormatted": "27.55",
          "address": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "name": "Brazilian Digital",
          "symbol": "brz",
          "logo": "https://coin-images.coingecko.com/coins/images/8472/large/MicrosoftTeams-image_%286%29.png?1696508657",
          "decimals": 18,
          "chain": {
            "id": 137,
            "logo": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
            "name": "Polygon",
            "symbol": "POL"
          }
        }
      ],
      "nfts": [],
      "portfolio": [
        {
          "chainId": 137,
          "balance": "27550000000000000000",
          "priceUsd": "0.1817383484",
          "balanceUsd": "5.00689149842",
          "balanceFormatted": "27.55",
          "address": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "name": "Brazilian Digital",
          "symbol": "brz",
          "logo": "https://coin-images.coingecko.com/coins/images/8472/large/MicrosoftTeams-image_%286%29.png?1696508657",
          "decimals": 18,
          "chain": {
            "id": 137,
            "logo": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
            "name": "Polygon",
            "symbol": "POL"
          }
        }
      ]
    }
    ```

1. Uma vez havendo saldo numa carteira, pode-se fazer operações de transferência e/ou swap, sendo que essa última operação(endpoint "Create Swap" &mdash; /api/v1/crypto/swap)
permite que se faça também a transferência na mesma funcionalidade; por exemplo, através do comando:
    ```console
    npm run swap -- swap_body.json execute
    ```
    e usando o seguinte conteúdo no arquivo `swap_body.json`:
    ```json
    {
        "amountIn": "15.00",
        "chainIdIn": 137,
        "chainIdOut": 1,
        "gasFeePaymentMethod": "DEDUCT_FROM_AMOUNT",
        "payGasFeeToken": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
        "tokenIn": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
        "tokenOut": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
        "walletAddress": "0x5786e89cec635a71abeb8bde4aea5e664137d21c",
        "toAddress": "0xc587ba228502745e7e13e19dc44af39a28aa004a",
        "routeProfile": "BEST_OUTPUT",
        "transactionFeePercent": null,
        "slippage": 5
    }
    ```
    será executado:  
    + "Create Swap", usando o conteúdo acima, o que implica:  
        * Uma quantia de entrada de 15.00, na token de entrada(BRZ &mdash; 0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc) na rede de entrada(137 &mdash; Polygon); essa situação foi definida ainda no depósito via PIX;  
        * A chain de saída é Ethereum(1), tendo como token de saída Shiba Inu(0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce)
        * A carteira de onde sai o recurso é "0x5786e89cec635a71abeb8bde4aea5e664137d21c"(criada com "salt" zero), e a carteira a receber é "0xc587ba228502745e7e13e19dc44af39a28aa004a"(criada com "salt" 1)
        * O valor indicado servirá para a transferência e cobertura de qualquer custo da transação, dada a opção "DEDUCT_FROM_AMOUNT"(a alternativa seria "ADD_TO_AMOUNT", o que implica "amountIn" corresponder ao valor da transferência e toda taxa ser cobrada à parte)
        * Não é estipulado uma porcentagem a remunerar o "tesouro"(uma carteira definida para receber taxas oriundas das transferências), dada a simplicidade da demonstração("transactionFeePercent")
        * A tolerância entre o valor nominal("amountIn") e o efetivamente executado, no caso da presente solicitação, é de 5%("slippage")
    + A resposta ao comando "Create Swap" descrito acima será uma sequência de cotações, cada uma na forma:
    ```json
    {
      "amountIn": "15.00",
      "amountInUSD": "2.7240819056718136665192",
      "amountOutUSD": "2.2687587677997714",
      "chainIn": 137,
      "chainOut": 1,
      "estimatedExecutionTime": "2025-10-14T00:57:18.041Z",
      "estimatedCollectedFee": {
                "collectedFee": "0",
        "collectedFeeToken": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
        "collectedFeePercent": "0",
        "notusCollectedFee": "0.03",
        "notusCollectedFeePercent": "0.2"
              },
      "estimatedGasFees": {
                "payGasFeeToken": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
        "maxGasFeeToken": "0.01934719714136787",
        "gasFeeTokenAmount": "0.01934719714136787",
        "gasFeeTokenAmountUSD": "0.0035148082855095203772170390169945",
        "maxGasFeeNative": "0.037931512746807708"
              },
      "expiresAt": 1760403439000,
      "minAmountOut": "193591.231615782554529124",
      "quoteId": "0x78cf1aec46dbefcddb746ef42e77c2b504752c8571d8b2606802fd71669507e6",
      "userOperationHash": "0x78cf1aec46dbefcddb746ef42e77c2b504752c8571d8b2606802fd71669507e6",
      "revertReason": null,
      "authorization": null,
      "swapProvider": "RANGO",
      "tokenIn": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
      "tokenInPrice": "0.18184",
      "tokenOut": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "walletAddress": "0x5786e89cec635a71abeb8bde4aea5e664137d21c",
      "metadata": null
    }
    ```
    Escolhida a cotação(no caso do comando usado, será sempre a primeira cotação retornada), usa-se o endpoint "Execute User Operation" para a execução do "quoteId" correspondente.
    Concluída a operação, pode ser verificado o saldo resultante na carteira destino(através do endpoint "Get Smart Wallet Portfolio"):
    ```json
    {
      "tokens": [
        {
          "chainId": 1,
          "balance": "205706273389756124737807",
          "priceUsd": "0.0000111084",
          "balanceUsd": "2.2850675673227669360374552788",
          "balanceFormatted": "205706.273389756124737807",
          "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
          "name": "Shiba Inu",
          "symbol": "shib",
          "logo": "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800",
          "decimals": 18,
          "chain": {
            "id": 1,
            "logo": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
            "name": "Ethereum",
            "symbol": "ETH"
          }
        }
      ],
      "nfts": [],
      "portfolio": [
        {
          "chainId": 1,
          "balance": "205706273389756124737807",
          "priceUsd": "0.0000111084",
          "balanceUsd": "2.2850675673227669360374552788",
          "balanceFormatted": "205706.273389756124737807",
          "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
          "name": "Shiba Inu",
          "symbol": "shib",
          "logo": "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800",
          "decimals": 18,
          "chain": {
            "id": 1,
            "logo": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
            "name": "Ethereum",
            "symbol": "ETH"
          }
        }
      ]
    }
    ```
1. Na próxima operação, uma transferência simples, o restante do recurso na carteira origem(0x5786e89cec635a71abeb8bde4aea5e664137d21c), em BRZ também será enviado para a carteira "0xc587ba228502745e7e13e19dc44af39a28aa004a"; para realizar a transferência, o endpoint "Transfer"(/api/v1 /crypto/transfer), é usado, através da seguinte chamada:
    ```console
    node notus-cli.js transfer transfer_body.json execute
    ```
    usando como corpo da mensagem(conteúdo do arquivo "transfer_body.json") o seguinte:
    ```json
    {
      "amount": "12.55",
      "chainId": 137,
      "gasFeePaymentMethod": "DEDUCT_FROM_AMOUNT",
      "payGasFeeToken": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
      "token": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
      "walletAddress": "0x5786e89cec635a71abeb8bde4aea5e664137d21c",
      "toAddress": "0xc587ba228502745e7e13e19dc44af39a28aa004a",
      "transactionFeePercent": null
    }
    ```
    será executado:  
    + "Create Transfer", usando o conteúdo acima, o que implica:  
        * A quantia de 12.55, na token de entrada(BRZ &mdash; 0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc) na rede de entrada(137 &mdash; Polygon); servirá para a transferência e custos associados("DEDUCT_FROM_AMOUNT");  
        * Por ser uma transferência, tanto o token(BRZ) quanto a chain de destino(Polygon) são os mesmos;
        * A carteira de onde sai o recurso é "0x5786e89cec635a71abeb8bde4aea5e664137d21c" e a carteira a receber é "0xc587ba228502745e7e13e19dc44af39a28aa004a"(tal como no exemplo anterior)
        * Não é estipulado uma porcentagem a remunerar o "tesouro"(tal como na operação de swap anterior)
    + A resposta ao comando "Create Transfer", quando bem sucedido, será como a seguir:
    ```json
    {
      "transfer": {
        "amountToBeReceived": "12.538517674136121511",
        "amountToBeReceivedUSD": "2.27420180981695923500438952026790157",
        "amountToSend": "12.55",
        "amountToSendUSD": "2.2762844424645492685",
        "chain": 137,
        "estimatedExecutionTime": "2025-10-14T12:26:04.881Z",
        "estimatedGasFees": {
          "gasFeeTokenAmount": "0.011482325863878489",
          "gasFeeTokenAmountUSD": "0.00208263264759003349561047973209843",
          "maxGasFeeNative": "0.009858853649052191",
          "maxGasFeeToken": "0.011482325863878489",
          "payGasFeeToken": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc"
        },
        "estimatedCollectedFee": {
          "collectedFee": "0",
          "collectedFeeToken": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "collectedFeePercent": "0",
          "notusCollectedFee": "0",
          "notusCollectedFeePercent": "0"
        },
        "expiresAt": 1760444810000,
        "quoteId": "0x05278e974139d89ac749473f6a2f4a734f9643b00d56cbac3cf7311634c21e36",
        "userOperationHash": "0x05278e974139d89ac749473f6a2f4a734f9643b00d56cbac3cf7311634c21e36",
        "revertReason": null,
        "authorization": null,
        "toAddress": "0xc587ba228502745e7e13e19dc44af39a28aa004a",
        "walletAddress": "0x5786e89cec635a71abeb8bde4aea5e664137d21c",
        "token": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
        "metadata": null
      }
    }
    ```
    Aqui veem-se o valor efetivamente transferido("amountToBeReceived"), as "fees" recolhidas, tanto no token usado mas também em USD, a validade da cotação, entre outros; a seguir, procede-se à execução da transferência via "Execute User Operation", usando-se a informação da cotação; a execução do comando acima descrito executa automaticamente toda essa sequência. Tendo sido feita com sucesso, a transferência pode ser verificada no portfólio da carteira destino(através do endpoint "Get Smart Wallet Portfolio"), agora indicando a presença de ambos os tokens:
    ```json
    {
      "tokens": [
        {
          "chainId": 137,
          "balance": "12538517674136121511",
          "priceUsd": "0.1806644495",
          "balanceUsd": "2.2652643931438227808499231945",
          "balanceFormatted": "12.538517674136121511",
          "address": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "name": "Brazilian Digital",
          "symbol": "brz",
          "logo": "https://coin-images.coingecko.com/coins/images/8472/large/MicrosoftTeams-image_%286%29.png?1696508657",
          "decimals": 18,
          "chain": {
            "id": 137,
            "logo": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
            "name": "Polygon",
            "symbol": "POL"
          }
        },
        {
          "chainId": 1,
          "balance": "205706273389756124737807",
          "priceUsd": "0.000010308",
          "balanceUsd": "2.120420266101606133797314556",
          "balanceFormatted": "205706.273389756124737807",
          "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
          "name": "Shiba Inu",
          "symbol": "shib",
          "logo": "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800",
          "decimals": 18,
          "chain": {
            "id": 1,
            "logo": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
            "name": "Ethereum",
            "symbol": "ETH"
          }
        }
      ],
      "nfts": [],
      "portfolio": [
        {
          "chainId": 137,
          "balance": "12538517674136121511",
          "priceUsd": "0.1806644495",
          "balanceUsd": "2.2652643931438227808499231945",
          "balanceFormatted": "12.538517674136121511",
          "address": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "name": "Brazilian Digital",
          "symbol": "brz",
          "logo": "https://coin-images.coingecko.com/coins/images/8472/large/MicrosoftTeams-image_%286%29.png?1696508657",
          "decimals": 18,
          "chain": {
            "id": 137,
            "logo": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
            "name": "Polygon",
            "symbol": "POL"
          }
        },
        {
          "chainId": 1,
          "balance": "205706273389756124737807",
          "priceUsd": "0.000010308",
          "balanceUsd": "2.120420266101606133797314556",
          "balanceFormatted": "205706.273389756124737807",
          "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
          "name": "Shiba Inu",
          "symbol": "shib",
          "logo": "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800",
          "decimals": 18,
          "chain": {
            "id": 1,
            "logo": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
            "name": "Ethereum",
            "symbol": "ETH"
          }
        }
      ]
    }
1. Como penúltimo passo, vamos converter na carteira destino o montante em Shiba Inu para BRZ, usando:
    ```console
    npm run swap -- swap_body.json execute
    ```
    tendo no arquivo "swap_body.json" o seguinte:
    ```json
     {
      "amountIn": "205706.273389756124737807",
      "chainIdIn": 1,
      "chainIdOut": 137,
      "gasFeePaymentMethod": "DEDUCT_FROM_AMOUNT",
      "payGasFeeToken": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "tokenIn": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "tokenOut": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
      "walletAddress": "0xc587ba228502745e7e13e19dc44af39a28aa004a",
      "toAddress": "0xc587ba228502745e7e13e19dc44af39a28aa004a",
      "routeProfile": "BEST_OUTPUT",
      "transactionFeePercent": null,
      "slippage": 5
    }
    ```
    Uma nova consulta ao portfólio o mostra unificado em BRZ:

    ```json
    {
      "tokens": [
        {
          "chainId": 137,
          "balance": "16973291947706598909",
          "priceUsd": "0.1807678128",
          "balanceUsd": "3.0682248614027738609067962352",
          "balanceFormatted": "16.973291947706598909",
          "address": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "name": "Brazilian Digital",
          "symbol": "brz",
          "logo": "https://coin-images.coingecko.com/coins/images/8472/large/MicrosoftTeams-image_%286%29.png?1696508657",
          "decimals": 18,
          "chain": {
            "id": 137,
            "logo": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
            "name": "Polygon",
            "symbol": "POL"
          }
        }
      ],
      "nfts": [],
      "portfolio": [
        {
          "chainId": 137,
          "balance": "16973291947706598909",
          "priceUsd": "0.1807678128",
          "balanceUsd": "3.0682248614027738609067962352",
          "balanceFormatted": "16.973291947706598909",
          "address": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
          "name": "Brazilian Digital",
          "symbol": "brz",
          "logo": "https://coin-images.coingecko.com/coins/images/8472/large/MicrosoftTeams-image_%286%29.png?1696508657",
          "decimals": 18,
          "chain": {
            "id": 137,
            "logo": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
            "name": "Polygon",
            "symbol": "POL"
          }
        }
      ]
    }
    
    ```
1. Como último passo, é feita o "off-ramping", ou seja, o saque fiduciário do valor total, usando o endpoint "Create Fiat Withdrawal Quote/Order", através do comando:
    ```console
    npm run withdraw -- withdraw_body.json execute
    ```
    tendo no arquivo "swap_body.json" o seguinte:
    ```json
     {
         "individualId": "ffbdb44e-929d-4262-b2e6-3de0849fba8d",
         "chainId": 137,
         "paymentMethodToReceiveDetails": {
             "type": "PIX",
             "pixKey": "+5511960277847"
         },
         "amountToSendInCryptoCurrency": "16.973291947706598909",
         "cryptoCurrencyToSend": "BRZ",
         "transactionFeePercent": null,
         "walletAddress": "0xc587ba228502745e7e13e19dc44af39a28aa004a"
     }
    ```
    Tendo sido a transação bem-sucedida, temos a seguinte resposta:
    ```json
    {
      "withdrawOrder": {
        "userOperationHash": "0x5419cf8dd248e0f2554d0e5d93bf01e4354a80c98fefbb39ff6a09a19e4d1f52",
        "userOpHash": "0x5419cf8dd248e0f2554d0e5d93bf01e4354a80c98fefbb39ff6a09a19e4d1f52",
        "authorization": null,
        "orderId": "f7a8d267-2b0d-4a5a-badd-056656a4bbd3",
        "amountToSendInCryptoCurrency": "16.973291947706598909",
        "amountToReceiveInFiatCurrency": "16.93",
        "transactionFeeAmountInCryptoCurrency": "0",
        "estimatedGasFeeAmountInCryptoCurrency": "0.043291947706598909",
        "expiresAt": "2025-10-14T14:33:27.496Z"
      }
    }
    ```
    E ao executar a ordem, temos o efeito pretendido:

    <p align="center">
    <img src="https://github.com/wbarroz/NotusLabs/blob/main/last_withdrawal.jpeg" alt="preparação do PIX" width="200"/>
    </p>




---
