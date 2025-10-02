# Smart Wallet CLI - Notus API

CLI para criar e gerenciar Smart Wallets usando a API da Notus Labs na rede Polygon.

## Funcionalidades

- ✅ Lista **TODAS** as Smart Wallets associadas ao mesmo EOA (salts 0-9)
- ✅ Registra Smart Wallets usando LightAccount Factory  
- ✅ Saída detalhada (verbose) como padrão
- ✅ Rede Polygon hard-coded (ID: 137)
- ✅# Smart Wallet CLI - Notus API

CLI para criar e gerenciar Smart Wallets usando a API da Notus Labs na rede Polygon.

## Instalação

1. Clone ou baixe os arquivos do projeto
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione sua API key da Notus:
```
NOTUS_API_KEY=sua_api_key_aqui
```

## Uso

### Comando básico
```bash
node src/index.js <endereço-eoa>
```

### Opções disponíveis

- `-c, --check`: Apenas verificar status, não registrar
- `-s, --salt VALUE`: Salt customizado (padrão: "0") 
- `-v, --verbose`: Saída detalhada
- `-h, --help`: Mostrar ajuda

### Exemplos

**Registrar ou verificar Smart Wallet:**
```bash
node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
```

**Apenas verificar status (não registrar):**
```bash
node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 --check
```

**Com salt customizado:**
```bash
node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 --salt 1
```

**Saída verbosa:**
```bash
node src/index.js 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 --verbose
```

## Funcionalidades

- ✅ Registra Smart Wallets usando LightAccount Factory
- ✅ Verifica status de Smart Wallets existentes  
- ✅ Suporte para salt customizado
- ✅ Validação de endereços Ethereum
- ✅ Saída formatada e informativa
- ✅ Configuração via arquivo `.env`
- ✅ Rede Polygon hard-coded

## Estrutura do Projeto

```
smart-wallet-cli/
├── src/
│   ├── index.js      # Entry point do CLI
│   ├── config.js     # Configurações
│   ├── wallet.js     # Lógica Smart Wallet  
│   └── utils.js      # Funções auxiliares
├── .env.example      # Exemplo de configuração
├── package.json
└── README.md
```

## Configuração

O projeto usa as seguintes configurações:

- **Rede**: Polygon (ID: 137)
- **Factory**: LightAccount (`0x0000000000400CdFef5E2714E63d8040b700BC24`)
- **API Base**: `https://api.notus.team/api/v1`

## Exemplo de Saída

**Smart Wallet já existente:**
```
✓ Smart Wallet encontrada!

Informações da Smart Wallet:
  EOA: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
  Smart Wallet: 0x1234...5678  
  Factory: LightAccount
  Salt: 0
  Rede: Polygon (137)
  Registrada em: 15/01/2025 10:30:00
```

**Smart Wallet nova:**
```
✓ Smart Wallet registrada com sucesso!

Informações da Smart Wallet:
  EOA: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
  Smart Wallet: 0x1234...5678
  Factory: LightAccount  
  Salt: 0
  Rede: Polygon (137)
  Registrada em: 15/01/2025 10:30:00
```

## Próximos Passos

Após criar a Smart Wallet:
1. O endereço pode ser usado para operações via API Notus
2. O deploy será feito automaticamente na primeira transação
3. Use o endereço para swaps, transfers, etc.

## Requisitos

- Node.js 16+
- API Key da Notus Labs
- Endereço EOA válido