# Relatório Final - NotusLab DX Research

**Template estruturado para participantes**

---

## Dados do Participante

**Nome:** Wilson Pereira Barros Junior

**Email:** wbarroz@gmail.com

**Ferramentas utilizadas:**
- Editor NeoVim
- Execução em Node, Python, cURL e a ferramenta da referência para execução de chamadas de API e code snippets
- IA ChatGPT e Gemini como auxílio em código e testes 

**Link do repositório:**
`https://github.com/wbarroz/NotusLabs`

**Link do post público:**


**Data de iní­cio:** 26/09/2025

**Data de conclusão:** 04/10/2025

---

## Relatório

### **1. Qual trilha você testou?**

(*) Trilha A -- Smart Wallet, KYC, Fiat, Portfolio, History

( ) Trilha B -- Smart Wallet, Swaps, Transfer, Portfolio, History

( ) Trilha C -- Smart Wallet, Liquidity Pools, Portfolio, History

---

### **2. Quais endpoints você testou com mais profundidade?**

a. Registro de carteiras
`/api/v1/wallets/register`  
A execução deste endpoint resulta na criação de uma smart wallet, a partir da EOA(chave pública previamente criada), um valor inteiro de salt(default 0) e uma das opções de contratos p/ funcionalidade da smart wallet(no caso, foi usado o modelo "Light Account Factory", mais simples e adequado à experimentação); porém, para ser transacionada, a carteira necessitará de um depósito prévio, e só será "trazida" à vida no momento em que receber uma solicitação de transação(na prática uma cotação é o suficiente)

b. Lista das carteiras criadas
`/api/v1/wallets`  
A execução deste endpoint traz na resposta uma lista com as carteiras criadas

c. Portfolio de uma carteira específica
`/api/v1/wallets/${wallet}/portfolio`  
A execução deste endpoint traz na resposta o portfolio da carteira, i.e., um "saldo" das quantidades dos diferentes tokens suportados presentes na carteira

d. Cotação p/ transferência
`/api/v1/crypto/transfer`  
A execução deste endpoint executa uma cotação para uma transferência a partir da carteira, indicando no retorno da chamada o id da cotação e sua efetividade (efetuável/não efetuável, baseado no saldo e no gas necessário para a realização); a efetivação deve ser feita com o uso do endpoint "Execução de operação do usuário"

e. Execução de operação do usuário
`/api/v1/crypto/execute-user-op`  
Este endpoint necessita do id de uma cotação e da sua assinatura feita com a chave privada da EOA, para execução efetiva da cotação

f. Criação de sessão de verificação de identidade de cliente
`/api/v1/kyc/individual-verification-sessions/standard`  
A execução deste endpoint dispara o processo de verificação de identidade do cliente, com a inclusão no corpo de envio dos dados do cliente, e a indicação no corpo do retorno os locais de "upload" das fotos da documentação a fornecer, após o que deve ser invocado o "Processamento da verificação de identidade de cliente", descrito a seguir.

g. Processamento da verificação de identidade de cliente
`/api/v1/kyc/individual-verification-sessions/standard/{session_id}/process`  
Este endpoint permite que se dispare o processamento dos dados do cliente para a verificação de identidade, cujo status se obtém pelo endpoint "Checagem do status de verificação de identidade do cliente"

h. Checagem do status de verificação de identidade do cliente
`/api/v1/kyc/individual-verification-sessions/standard/{session_id}`  

Liste os endpoints e o que foi validado neles (ex: `/wallet/create`, `/swap/quote`, etc.)

---

### **3. Quais foram os principais bugs encontrados?**

* Descreva cada bug com:

  * Endpoint envolvido
  * Comportamento esperado vs. real
  * Reprodutibilidade (acontece sempre? só em certas condições?)
  * Gravidade (baixa, média, alta)

---

### **4. Quais comportamentos inesperados você identificou?**

Mesmo que não sejam bugs, anote tudo que *pareceu estranho* ou *pouco intuitivo*.

---

### **5. Como foi a experiência de usar a API?**

- **De uma nota de 1 a 5 para cada item, com comentários opcionais.**

* A documentação foi suficiente? 1-5
* As mensagens de erro ajudaram? 1-5
* O fluxo fez sentido? 1-5
* O tempo de resposta era razoável? 1-5


---

### **6. Alguma funcionalidade estava ausente ou incompleta?**

Liste endpoints ou comportamentos esperados que simplesmente **não estavam lá** ou pareciam inacabados.

---

### **7. Quais melhorias você sugere?**

Inclua sugestões sobre:

* Nomes de campos
* Design de endpoints
* Lógica de negócio
* Fluxo geral de uso
* Retornos da API
* Consistência entre rotas

---

### **8. Como você avaliaria a estabilidade geral da API nesta trilha?**

* [ ] Muito estável -- tudo funcionou bem
* [ ] Estável -- poucos problemas, nada crí­tico
* [ ] Instável -- muitos problemas ou travamentos
* [ ] Quebrada -- mal consegui testar

Explique com base na sua experiência.

---

### **9. Há testes que você gostaria de ter feito, mas não conseguiu? Por quê?**

Isso ajuda a identificar lacunas no ambiente, documentação ou tempo alocado.

---

### **10. Comentários finais ou insights gerais?**

Espaço livre para observações, sugestões estratégicas, ideias de produto, ou qualquer coisa que não se encaixou nas perguntas anteriores.

---
