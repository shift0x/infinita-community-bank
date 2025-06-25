# Infinita Community Bank

A decentralized community banking platform that improves access to credit for the Infinita community by sourcing liquidity from the broader crypto ecosystem through incentivized deposits and fractionalized loan offerings.

## 🌟 Overview

Infinita Community Bank revolutionizes how communities access financial services by bridging traditional banking needs with modern DeFi infrastructure. The platform addresses a critical challenge: while the Infinita community has significant development potential, access to credit remains limited by traditional banking barriers.

Our solution sources liquidity from the broader crypto ecosystem by offering attractive yield opportunities to depositors worldwide. These deposits create a community-owned lending pool that prioritizes local development projects and individual financial needs. Rather than extracting value from the community, the platform ensures that profits flow back to participants through a transparent tokenization system.

The platform democratizes both lending and investing by fractionalizing loan positions, allowing anyone to participate in community development while earning competitive returns. This creates a sustainable cycle where global crypto liquidity supports local growth, and community success benefits all stakeholders.

## 🏗️ Architecture

The platform is built as a full-stack DeFi application with smart contracts managing the core financial logic and a React frontend providing user interaction.

### Smart Contracts (`/chain`)

The smart contract layer implements a sophisticated banking system built on Solidity 0.8.28 using the Hardhat development framework. The **BankVault.sol** contract serves as the central hub, managing USDC deposits and implementing a fractional reserve system where 20% of deposits remain available for immediate withdrawals while 80% flows into the community lending pool. This design ensures liquidity for depositors while maximizing capital efficiency for borrowers.

**LoanVault.sol** handles the complete loan lifecycle from application submission through repayment tracking. The system supports flexible loan terms and integrates with the vault's tokenization system, enabling loans to be fractionalized and traded as NFT positions. **MintableToken.sol** provides the ERC20 implementation for both BANK tokens (representing deposits) and sBANK tokens (staking receipts for profit sharing).

The architecture maintains a clear separation between deposit management and loan operations, allowing for independent scaling and upgrades while ensuring seamless integration through well-defined interfaces in **Types.sol**.

### Web Application (`/web`)

The frontend delivers a modern banking experience through a React 19 application with comprehensive Web3 integration. Built using Wagmi and Viem for blockchain interactions, the interface provides real-time balance tracking, transaction history, and seamless wallet connectivity through RainbowKit.

Users interact with the platform through a suite of specialized modals for deposits, staking, and loan applications. The **CurrencyInput** component ensures consistent currency formatting across all financial inputs, while the **UserBalanceProvider** maintains centralized state management for token balances and real-time updates.

The application emphasizes mobile-first responsive design and provides comprehensive portfolio management tools, allowing users to track their deposit yields, staking rewards, and loan positions from a unified dashboard.

## 🚀 Getting Started

To run the Infinita Community Bank locally, you'll need a modern development environment with Node.js 18 or higher, npm for package management, and Git for version control. Additionally, you'll want a Web3-compatible wallet like MetaMask installed to interact with the application and test transactions on local or testnet deployments.

### Installation

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

## 🎯 How It Works

The Infinita Community Bank operates on a simple yet powerful model that benefits all participants in the ecosystem.

### For Depositors and Investors

Community members and external investors can deposit USDC into the bank vault, receiving BANK tokens that represent their proportional ownership of the deposit pool. These BANK tokens can be held as-is to maintain deposit rights, or staked to receive sBANK tokens that entitle holders to a share of the bank's profits from lending operations.

The staking mechanism creates an attractive yield opportunity for crypto holders worldwide while ensuring that those most committed to the platform's success receive the greatest rewards. Profits flow to sBANK holders from multiple sources: interest payments on loans, fees from loan origination, and any gains from secondary market trading of loan positions.

### For Borrowers and the Community

Community members can submit comprehensive loan applications through the web interface, providing details about their funding needs, intended use of capital, and repayment capacity. The current system uses designated loan officers to evaluate applications, but the roadmap includes transitioning to community-based governance for loan approvals.

Approved borrowers receive USDC directly from the vault, with loan terms recorded on-chain for transparency. The fractionalized nature of the lending pool means that funds come from the collective deposits rather than individual lenders, often enabling more favorable terms than traditional banking while building local financial infrastructure.

### Sustainable Community Development

The platform creates a virtuous cycle where successful community development attracts more deposits, which in turn enables larger and more impactful loans. Unlike extractive financial models, profits generated by the bank flow back to token holders, many of whom are community members themselves. This ensures that financial success strengthens rather than depletes the local ecosystem.

## 🏦 Token Economics

The platform uses a multi-token system designed to align incentives and provide clear value accrual mechanisms.

**BANK tokens** represent deposit positions in the vault, minted 1:1 when users deposit USDC. These tokens can be redeemed for the underlying deposits (subject to the 20% liquidity reserve) or staked to earn yield. The token design ensures that depositors maintain proportional claims on vault assets while enabling additional utility through staking.

**sBANK tokens** are receipt tokens issued when users stake their BANK tokens. These tokens entitle holders to proportional distributions of bank profits, creating a yield-bearing asset that benefits from successful lending operations. The staking mechanism locks up BANK tokens, reducing selling pressure while rewarding long-term commitment to the platform.

**Loan tokens** represent fractionalized positions in individual loans, allowing sophisticated investors to purchase specific loan exposures. This creates a secondary market for loan risk and provides additional liquidity options for the bank while enabling more granular risk management for participants.

Profit distribution follows a transparent formula where 80% of net profits flow to sBANK holders based on their proportional stake, while 20% is retained for protocol development, security audits, and operational expenses.

## 🛣️ Future Development

The current implementation represents the foundation of a more comprehensive community banking ecosystem. The immediate roadmap focuses on two critical enhancements that will significantly strengthen the platform's community focus and decentralization.

### Identity and Verification System

The next major development phase involves integrating a robust identity solution to verify Infinita residency for loan applicants. This system will ensure that the platform's primary mission—improving credit access for the Infinita community—remains central while preventing misuse by external actors. The verification system will balance privacy concerns with the need for community accountability, potentially leveraging zero-knowledge proofs or decentralized identity standards.

### Community Governance for Loan Approvals

Perhaps most importantly, the platform will transition from centralized loan officers to a community-driven voting mechanism for loan approvals. This change will democratize the lending process, allowing sBANK holders and community members to collectively evaluate loan applications based on factors like community benefit, repayment likelihood, and alignment with ecosystem development goals.

The governance system will implement sophisticated voting mechanisms that prevent manipulation while ensuring that those with the greatest stake in the platform's success have appropriate influence over lending decisions. This might include quadratic voting, reputation-weighted voting, or hybrid systems that balance token holdings with community standing.

### Long-term Vision

Beyond these immediate enhancements, the platform envisions expanding into a full-service community financial infrastructure. This could include integration with local businesses for payment processing, development of community-specific stablecoins, and partnerships with traditional financial institutions to bridge DeFi and conventional banking services.

The ultimate goal is creating a financial system that serves community development first, with profit as a means to sustainability rather than an end in itself. By aligning financial incentives with community growth, the platform can demonstrate an alternative model for how technology can strengthen rather than displace local economic systems.

## 🔧 Technical Implementation

### Smart Contract Security

The platform prioritizes security through industry-standard practices including OpenZeppelin contract templates, comprehensive reentrancy protection, and role-based access controls. All external function calls include appropriate safeguards, and the modular architecture allows for upgrades and improvements without compromising user funds.

### Frontend Architecture

The React application employs modern Web3 integration patterns using Wagmi for contract interactions and RainbowKit for wallet connectivity. State management through context providers ensures real-time balance updates, while the component architecture enables rapid development of new features and consistent user experiences.

## 🤝 Contributing

The Infinita Community Bank welcomes contributions from developers, designers, and community members who share the vision of democratized financial services. The codebase is organized for clarity and extensibility, with comprehensive documentation and testing frameworks to support collaborative development.

## ⚠️ Important Considerations

This platform represents experimental technology that combines novel financial mechanisms with smart contract systems. While built using established frameworks and security practices, users should understand the inherent risks of DeFi platforms and conduct appropriate due diligence before participating with significant funds.

The platform has not undergone formal security audits and should be considered a demonstration of community banking concepts rather than a production-ready financial service. Future versions will include comprehensive auditing and additional security measures as the platform matures.

---

**Building financial infrastructure for community empowerment** 🏗️

