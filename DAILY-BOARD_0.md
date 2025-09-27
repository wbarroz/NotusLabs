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
Nesta sessão, o objetivo é seguir a documentação para criar smart wallet(s)

---

**2. Qual abordagem você vai usar?**
Seguir rigorosamente a documentação, a partir da seção "Getting Started"

---

**3. Há algo que precisa ser configurado antes de começar?**
Definido o ponto de partida, são explícitos os seguintes requisitos p/ operação:
    * Acesso ao Dashboard -- Gentilmente cedido pela NotusLabs ✅;
    * Organização criada -- Conforme documentação ✅;
    * Criação de Projeto -- Conforme documentação ✅;
    * Uso(criação?) da chave da API(criada automaticamente com o Projeto) ✅;
    * Configuração de taxas e endereço -- a ser definido na criação da carteira;
    

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ ] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**
Liste bugs, comportamentos inesperados ou dificuldades (mesmo que pequenas).
* Ao se seguir o link indicado para criação de carteiras(smart wallet) na seção "Getting Started", é aberto o ítem "Web3Auth" da seção "Authentication", que pode ser lógico mas é confuso; seguida pois a ordem posicional(apenas) de começar por criar a conta("Create an account");
* O link para criação da conta("Create an account") leva à seção "Getting started", que é lógico também mas poderia ser mais claro(a documentação deveria trazer um fluxo padrão, conveniente para iniciantes(ainda que não ótimo p/ avançados)
* Do ponto de vista do iniciante, ainda, iniciar passando pelo "Light Account"(o que só é evidente após tentativa e erro) faz muito mais sentido, uma vez que várias características e vantagens da abordagem NotusLabs ficam mais claras
* Para criação "pura" da carteira(sem login social) foi necessária a criação de um par chave pública/privada na "mão", tendo sido adotada Foundry(cast wallet new); também necessária visita ao site da Polygon Mumbai p/ obtenção de faucet
---

**6. Observações adicionais**
(Ex: sugestões de melhoria, dúvidas, ideias, insights que surgiram durante o teste.)
* Falta um "caminho feliz" para "noobs", o que, se de um lado será ignorado por usuários experientes, favorece e muito implementadores de primeira viagem e aficcionados em crypto sem tanta bagagem técnica
* A partir do caso do FIAT, e tendo em mente que na própria documentação o token BRZ é citado logo inicialmente, informação em português favoreceria o uso no Brasil(por exemplo)
