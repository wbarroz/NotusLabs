# **[Template]** Daily Board - NotusLab DX Research

---

## Instruções de Uso

* Preencha este board toda vez que for testar a aplicação.
* Seja honesto e o mais detalhado possí­vel nas respostas.
* Anote problemas assim que eles acontecerem -- não deixe para depois.
* Cada sessão de teste deve gerar um board novo.
* Pense na sessão como um *pull request*: nem muito grande, nem muito pequena.
* Reserve um tempo para focar e executar a sessão com começo, meio e fim.

---

## Sessão de Teste

**1. Qual é o objetivo desta sessão?**

Neste momento, o objetivo é fazer o processo de KYC("Know Your Client") na plataforma, para tornar o cliente elegível a utilizar as "rampas"(fazer o "on-ramping" -- troca de moeda fiduciária por criptoativo -- e "off-ramping" -- troca de criptoativo por moeda fiduciária)
Embora o processo técnico fosse muito facilitado pela experiência já obtida na criação e manuseio das smart-wallets, empecilhos foram encontrados para obter a validação propriamente dita da identidade.

O processo de KYC da plataforma resume-se a:
- Utilizar o endpoint "Create a standard individual verification session"(kyc/individual-verification-sessions/standard), com os campos do "formulário"(body) preenchidos("firstName", "lastName", "birthDate", "documentCategory", "documentCountry", "documentId", "livenessRequired", "email", "address", "city", "state", "postalCode", "nationality");
- Utilizar a resposta para fazer o upload da(s) foto(s) do documento no AWS S3 via URL pré-assinada(presigned)
- Através do endpoint "Process a standard individual verification session"(/kyc/individual-verification-sessions/standard/:sessionId/process) iniciar o processamento da verificação;
- E por último, monitorar o andamento da verificação via endpoint "Get a standard individual verification session result"(/kyc/individual-verification-sessions/standard/:sessionId/process) -- até que o status seja "COMPLETED" ou "FAILED"

---

**2. Qual abordagem você vai usar?**

Seguindo rigorosamente a documentação, a partir da seção "KYC Quickstart":
a. Criar sessão de verificação, com o endpoint:  
`POST kyc/individual-verification-sessions/standard`

b. Envio de Documento(s):
A resposta ao endpoint anterior contém informação para o upload do(s) arquivo(s) em um S3 da AWS:
- Foto da frente("Front Document"): para toda opção de documento("PASSPORT","DRIVERS_LICENSE" ou "IDENTITY_CARD")
- Foto do verso(Back Document): documentos com verso("DRIVERS_LICENSE" ou "IDENTITY_CARD")
Um cuidado extra é o de que sejam obtidas fotos de boa qualidade, não imagens escaneadas ou digitalizações; outro detalhe é que o link "dura" só 15 minutos

c. Finalização
Após o upload da(s) foto(s) do documento, o processo de verificação propriamente dito é disparado pelo endpoint:
`POST /kyc/individual-verification-sessions/standard/:sessionId/process`

d. Check Status
...e o status da verificação pode ser consultado em:  
`GET /kyc/individual-verification-sessions/standard/:sessionId`

O status da verificação poderá ser:
- "PENDING": Sessão criada, falta realizar upload
- "VERIFYING": Documentos em análise pelo sistema
- "COMPLETED": Verificação approvada, sucesso
- "FAILED":	Verificação rejeitada, ou erro durante processamento
- "EXPIRED": Sessão expirada

---

**3. Há algo que precisa ser configurado antes de começar?**  
Definido o ponto de partida, são explícitos os seguintes requisitos p/ operação:  
* Acesso ao Dashboard -- Gentilmente cedido pela NotusLabs ✅;  
* Organização criada -- Conforme documentação ✅;  
* Criação de Projeto -- Conforme documentação ✅;  
* Uso(criação?) da chave da API(criada automaticamente com o Projeto) ✅;  
    

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ ] Sim
* [X] Não. Se **não**, explique o que impediu.

Não foi possível a finalização do processo, uma vez que para as execuções de on/off ramping dependem do "individualId", obtido via KYC

---

**5. Problemas encontrados**  
O processo de verificação é relativamente simples, porém:  
- A resposta obtida quando da primeira chamada de API("Criação de sessão"), a ser usado no passo seguinte("Envio de Documentos") difere da documentação;
- No caso de se usar "PASSPORT" na sessão de verificação, o sistema rejeita os caracteres alfabéticos presentes no número de passaporte, impedindo portanto seu uso;
- De acordo com orientação fornecida pelo suporte, o número de documento efetivamente aceito é o de CPF, porém há dúvidas se mesmo os documentos de identificação recentes possuem o CPF 
- A resposta de falha não inclue o motivo da rejeição do envio, tornando obrigatória a consulta ao suporte
- Embora todas as condições fossem satisfeitas, não houve sucesso nas tentativas de se fazer a verificação de identidade, tendo o sistema rejeitado a documentação imediatamente após a solicitação

---

**6. Observações adicionais**
(Ex: sugestões de melhoria, dúvidas, ideias, insights que surgiram durante o teste.)
* Falta um "caminho feliz" para "noobs", o que, se de um lado será ignorado por usuários experientes, favorece e muito implementadores de primeira viagem e aficcionados em crypto sem tanta bagagem técnica
* A partir do caso do FIAT, e tendo em mente que na própria documentação o token BRZ é citado logo inicialmente, informação em português favoreceria o uso no Brasil(por exemplo)
* Há recursos MUITO interessantes, como o suporte à execução de chamadas a partir da documentação, e exemplos para execução em cURL, python, java, etc, que mereciam um destaque no topo da documentação
