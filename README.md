# Infinita Community Bank

Lending for real world projects like housing development or business expansion loans outside of the financial system is lacking. This causes an underdevelopment in many communities like Infinita. 

The goal of this project is to introduce a novel way to provide funding (using blockchain) for real world investments to these regions to accelerate development and growth. 

## Background
The current crypto ecosystem is very familiar with over collateralized loans (i.e aave), however a real implementation of real world under collateralized loans are still lacking. These loans are what is needed to bring the lending ecosystem to equality with the traditional banking system. To accomplish this goal, we need a bank that exists in both worlds (online and offline).

Online: Use defi to raise funds, pay yield and offer trading to token holders

Offline: The registered bank entity takes 1st position liens on assets purchased with loans (property, equipment). If the loan defaults, then the bank will foreclose and use the proceeds to pay loan holders on-chain.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd infinita-community-bank
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install smart contract dependencies
   cd chain
   npm install
   
   # Install web application dependencies  
   cd ../web
   npm install
   ```

### Smart Contract Setup

1. **Configure environment**
   ```bash
   cd chain
   cp .env.example .env
   # Add your deployer private key and RPC URLs
   ```

2. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

3. **Deploy to testnet (Base Sepolia)**
   ```bash
   npx hardhat run scripts/deploy.js --network base_sepolia
   ```

4. **Deploy locally**
   ```bash
   # Start local Hardhat node
   npx hardhat node
   
   # In another terminal, deploy contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

### Web Application Setup

1. **Configure environment**
   ```bash
   cd web
   cp .env.example .env.local
   # Add your WalletConnect project ID and contract addresses
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Open application**
   Navigate to `http://localhost:3000`