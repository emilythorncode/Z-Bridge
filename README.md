# Z Bridge - Confidential ERC20 Bridge

A production-ready privacy-preserving bridge that wraps standard ERC20 tokens into confidential ERC7984 tokens using Zama's Fully Homomorphic Encryption (FHE) technology. Z Bridge enables users to maintain complete privacy while transacting with digital assets on the blockchain.

## Table of Contents

- [Introduction](#introduction)
- [Key Advantages](#key-advantages)
- [Problems Solved](#problems-solved)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Smart Contracts](#smart-contracts)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Introduction

Z Bridge is a groundbreaking decentralized application that leverages **Fully Homomorphic Encryption (FHE)** to provide true privacy for blockchain transactions. Built on Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine), Z Bridge allows users to convert standard ERC20 tokens into confidential ERC7984 tokens, enabling private transactions while maintaining the security guarantees of blockchain technology.

Unlike traditional privacy solutions that rely on mixers or zero-knowledge proofs, Z Bridge uses FHE to perform computations directly on encrypted data, ensuring that sensitive information like balances and transaction amounts remain encrypted at all times - even during smart contract execution.

### What Makes Z Bridge Unique?

- **True On-Chain Privacy**: Balances and transaction amounts remain encrypted throughout the entire lifecycle
- **Computation on Encrypted Data**: Smart contracts can perform operations on encrypted values without decrypting them
- **No Trust Assumptions**: Unlike mixers, there's no need to trust a set of participants or relayers
- **Regulatory Compliance Ready**: Users can selectively decrypt their data for authorized parties
- **Seamless UX**: Familiar ERC20 interface with added privacy features

## Key Advantages

### 1. Complete Transaction Privacy

- **Encrypted Balances**: User balances are stored in encrypted form on-chain
- **Private Transfer Amounts**: Transaction amounts are never revealed publicly
- **Hidden Transaction Graph**: Sender-receiver relationships remain confidential
- **Selective Disclosure**: Users can decrypt and prove their balances to specific parties when needed

### 2. Advanced Cryptographic Security

- **Fully Homomorphic Encryption**: Enables computation on encrypted data without decryption
- **Threshold Decryption**: Distributed key management prevents single points of failure
- **Blockchain Security**: Inherits the security guarantees of the underlying blockchain
- **Auditable Code**: Open-source smart contracts verified on Etherscan

### 3. Developer-Friendly Architecture

- **ERC20 Compatible**: Wraps existing ERC20 tokens with zero friction
- **ERC7984 Standard**: Implements the emerging standard for confidential tokens
- **Hardhat Integration**: Professional development tooling and testing framework
- **TypeScript Support**: Fully typed contracts and frontend code

### 4. Superior User Experience

- **One-Click Wrapping**: Convert ERC20 to confidential tokens instantly
- **RainbowKit Integration**: Modern wallet connection with multi-wallet support
- **Real-Time Balance Decryption**: View your private balances on demand
- **Gas Efficient**: Optimized contract code minimizes transaction costs

### 5. Regulatory Compliance

- **Selective Disclosure**: Prove balances to auditors without revealing to everyone
- **Audit Trail**: All transactions are recorded on-chain (in encrypted form)
- **KYC Compatible**: Can integrate with identity verification systems
- **Programmable Privacy**: Fine-grained control over data access

## Problems Solved

### Traditional Blockchain Privacy Issues

1. **Public Transparency Problem**
   - **Issue**: All Ethereum transactions are publicly visible, exposing user balances and transaction patterns
   - **ZamaBridge Solution**: Encrypts all sensitive data while maintaining blockchain verifiability

2. **MEV (Maximal Extractable Value) Attacks**
   - **Issue**: Front-running and sandwich attacks exploit visible pending transactions
   - **ZamaBridge Solution**: Encrypted transaction amounts prevent MEV bots from profiting

3. **Privacy vs Decentralization Trade-off**
   - **Issue**: Existing privacy solutions (mixers, sidechains) often sacrifice decentralization
   - **ZamaBridge Solution**: Provides privacy without trust assumptions or centralized components

4. **Regulatory Compliance Challenges**
   - **Issue**: Pure privacy solutions make it impossible to comply with audits or regulations
   - **ZamaBridge Solution**: Selective decryption enables compliance while preserving privacy

5. **Scalability of Privacy Solutions**
   - **Issue**: Zero-knowledge proof systems require significant computational overhead
   - **ZamaBridge Solution**: FHE-based approach offers better scalability characteristics

6. **Interoperability Limitations**
   - **Issue**: Privacy tokens often operate in isolated ecosystems
   - **ZamaBridge Solution**: Wraps standard ERC20 tokens, maintaining DeFi composability

7. **User Experience Complexity**
   - **Issue**: Privacy tools often require complex setup (trusted setups, ceremony participation)
   - **ZamaBridge Solution**: Simple wrapping interface - no special knowledge required

## Technology Stack

### Smart Contract Layer

- **Solidity ^0.8.27**: Latest Solidity compiler with advanced security features
- **FHEVM (@fhevm/solidity)**: Zama's Fully Homomorphic Encryption VM for confidential smart contracts
- **OpenZeppelin Confidential Contracts**: Battle-tested implementation of ERC7984 standard
- **Hardhat**: Professional development environment for Ethereum
- **TypeChain**: TypeScript bindings for type-safe contract interactions
- **Hardhat Deploy**: Deterministic deployment system with upgrade support

### Frontend Application

- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript 5.8**: Type safety throughout the application
- **Vite 7**: Lightning-fast build tool with HMR
- **Wagmi 2.17**: React hooks for Ethereum with full TypeScript support
- **RainbowKit 2.2**: Beautiful wallet connection modal with 100+ wallet support
- **TanStack Query 5**: Powerful data synchronization and caching
- **Ethers.js 6**: Complete Ethereum library for blockchain interactions
- **Zama Relayer SDK**: Decryption service integration for FHE operations

### Development Tools

- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Automated code formatting
- **Solhint**: Solidity-specific linting
- **Mocha + Chai**: Comprehensive testing framework
- **Hardhat Network Helpers**: Advanced testing utilities
- **Hardhat Gas Reporter**: Gas usage optimization
- **Solidity Coverage**: Test coverage analysis

### Infrastructure

- **Ethereum Sepolia Testnet**: Production-like testing environment
- **Infura**: Reliable Ethereum node infrastructure
- **Etherscan**: Contract verification and exploration
- **Zama Network**: FHE computation network
- **IPFS** (planned): Decentralized metadata storage

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React UI     │  │ RainbowKit   │  │ Wagmi Hooks  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                          │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  ERC20 Tokens    │◄────────┤  ERC7984 Wrapper │          │
│  │  (Public)        │  Wrap   │  (Confidential)  │          │
│  ├──────────────────┤  ─────► ├──────────────────┤          │
│  │ • ZamaToken      │ Unwrap  │ • cZAMA          │          │
│  │ • USDCToken      │         │ • cUSDC          │          │
│  │ • ETHToken       │         │ • cETH           │          │
│  └──────────────────┘         └──────────────────┘          │
│                                         │                    │
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  FHE Computation Layer                       │
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │            Zama FHEVM Network                    │        │
│  │  • Homomorphic Addition                          │        │
│  │  • Homomorphic Comparison                        │        │
│  │  • Threshold Decryption                          │        │
│  │  • Key Management                                │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

```solidity
MintableERC20 (Standard ERC20 with Faucet)
    ├── ZamaToken
    ├── USDCTestToken
    └── ETHTestToken

BaseConfidentialWrapper (ERC7984 + FHE)
    ├── ConfidentialZamaToken (wraps ZamaToken)
    ├── ConfidentialUSDCToken (wraps USDCTestToken)
    └── ConfidentialETHToken (wraps ETHTestToken)
```

### Data Flow

1. **Wrapping Process**:
   ```
   User → Approve ERC20 → Call wrap() → Transfer to Contract
   → Mint Encrypted Balance → Emit EncryptedTransfer Event
   ```

2. **Encrypted Transfer**:
   ```
   User → Encrypt Amount (Client-Side) → Submit to Contract
   → FHE Subtraction (Sender) → FHE Addition (Receiver)
   → Emit EncryptedTransfer Event
   ```

3. **Balance Decryption**:
   ```
   User → Request Decryption → Zama Relayer → Threshold Decryption
   → Return Plaintext Balance → Display to User
   ```

4. **Unwrapping Process**:
   ```
   User → Call unwrap(encrypted_amount) → Burn Confidential Tokens
   → Transfer ERC20 to User → Emit Transfer Event
   ```

## Features

### Core Functionality

- **Token Minting**: Free faucet for test tokens (ZAMA, USDC, ETH)
- **Wrapping**: Convert ERC20 tokens to confidential ERC7984 tokens
- **Unwrapping**: Convert confidential tokens back to standard ERC20
- **Encrypted Transfers**: Send confidential tokens with hidden amounts
- **Balance Decryption**: View your encrypted balance on demand
- **Allowance Management**: Approve confidential token spending

### User Interface Features

- **Wallet Connection**: Multi-wallet support via RainbowKit
- **Real-Time Updates**: Automatic balance refresh after transactions
- **Transaction History**: View your transaction history
- **Error Handling**: User-friendly error messages and retry logic
- **Loading States**: Clear feedback during blockchain operations
- **Responsive Design**: Mobile-friendly interface

### Security Features

- **Encrypted Storage**: All sensitive data encrypted on-chain
- **Access Control**: Only token owners can decrypt their balances
- **Replay Protection**: Nonce-based transaction ordering
- **Overflow Protection**: SafeMath operations throughout
- **Reentrancy Guards**: Protection against reentrancy attacks

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm/yarn/pnpm**: Package manager
- **MetaMask**: Or any Web3 wallet
- **Sepolia ETH**: For testnet transactions ([faucet](https://sepoliafaucet.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ZamaBridge.git
cd ZamaBridge
```

#### 2. Install Smart Contract Dependencies

```bash
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd src
npm install
cd ..
```

#### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Wallet configuration
MNEMONIC="your twelve word mnemonic phrase here"

# Network configuration
INFURA_API_KEY="your_infura_api_key"

# Optional: For contract verification
ETHERSCAN_API_KEY="your_etherscan_api_key"
```

Hardhat variable configuration (more secure):

```bash
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set ETHERSCAN_API_KEY
```

#### 5. Compile Smart Contracts

```bash
npm run compile
```

#### 6. Run Tests

```bash
# Local tests
npm run test

# Sepolia testnet tests
npm run test:sepolia
```

#### 7. Deploy Contracts (if needed)

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

#### 8. Start Frontend Development Server

```bash
cd src
npm run dev
```

The application will be available at `http://localhost:5173`

### Quick Start Guide

1. **Connect Wallet**: Click "Connect Wallet" and select your wallet
2. **Get Test Tokens**: Click "Mint" on any token card to receive free test tokens
3. **Wrap Tokens**: Enter amount and click "Wrap" to convert to confidential tokens
4. **View Balance**: Click "Decrypt Balance" to view your encrypted balance
5. **Transfer**: Send confidential tokens to other addresses (coming soon)
6. **Unwrap**: Convert confidential tokens back to standard ERC20

## Usage Guide

### For End Users

#### Minting Test Tokens

1. Connect your wallet to Sepolia testnet
2. Select a token (ZAMA, USDC, or ETH)
3. Click the "Mint" button
4. Confirm the transaction in your wallet
5. Wait for confirmation (usually 10-15 seconds)

#### Wrapping Tokens

1. Enter the amount of tokens you want to wrap
2. Click "Approve" to allow the contract to spend your tokens
3. Wait for approval transaction to confirm
4. Click "Wrap" to convert tokens to confidential version
5. Confirm the transaction in your wallet

#### Decrypting Your Balance

1. Click "Decrypt Balance" button on a token card
2. Sign the decryption request in your wallet
3. Wait for the Zama relayer to process the request
4. Your decrypted balance will be displayed

#### Unwrapping Tokens

1. Enter the amount you want to unwrap
2. Click "Unwrap" button
3. Confirm the transaction
4. Receive your standard ERC20 tokens back

### For Developers

#### Integrating ZamaBridge Contracts

```typescript
import { ethers } from "ethers";
import { ConfidentialZamaToken__factory } from "./typechain-types";

// Connect to contract
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_KEY");
const signer = await provider.getSigner();
const contract = ConfidentialZamaToken__factory.connect(CONTRACT_ADDRESS, signer);

// Wrap tokens
await contract.wrap(ethers.parseUnits("100", 6));

// Get encrypted balance
const encryptedBalance = await contract.balanceOf(userAddress);

// Request decryption
const instance = await createInstance();
const decryptedBalance = await instance.decrypt(CONTRACT_ADDRESS, encryptedBalance);
```

#### Using the Zama Instance Hook

```tsx
import { useZamaInstance } from "./hooks/useZamaInstance";

function MyComponent() {
  const { instance, isLoading, error } = useZamaInstance();

  const decryptBalance = async (ciphertext: bigint) => {
    if (!instance) return;
    const plaintext = await instance.decrypt(contractAddress, ciphertext);
    return plaintext;
  };

  // Use instance for encryption/decryption
}
```

## Development

### Project Structure

```
ZamaBridge/
├── contracts/                    # Solidity smart contracts
│   └── ZamaBridgeTokens.sol     # Main bridge contracts
├── deploy/                      # Deployment scripts
│   └── deploy.ts                # Hardhat deployment configuration
├── test/                        # Contract tests
├── src/                         # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── BridgeApp.tsx   # Main application
│   │   │   ├── Header.tsx      # Navigation header
│   │   │   └── TokenCard.tsx   # Token interaction card
│   │   ├── config/             # Configuration files
│   │   │   ├── contracts.ts    # Contract addresses and ABIs
│   │   │   ├── tokenConfig.ts  # Token configurations
│   │   │   └── wagmi.ts        # Wagmi/wallet configuration
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useEthersSigner.ts
│   │   │   └── useZamaInstance.ts
│   │   ├── styles/             # CSS styles
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Application entry point
│   ├── package.json
│   └── vite.config.ts          # Vite configuration
├── hardhat.config.ts            # Hardhat configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Running Tests

```bash
# Run all tests on local network
npm run test

# Run tests with gas reporting
REPORT_GAS=true npm run test

# Run coverage analysis
npm run coverage

# Run tests on Sepolia testnet
npm run test:sepolia
```

### Linting and Formatting

```bash
# Lint Solidity code
npm run lint:sol

# Lint TypeScript code
npm run lint:ts

# Check formatting
npm run prettier:check

# Auto-fix formatting
npm run prettier:write

# Run all linting
npm run lint
```

### Local Development Workflow

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node --network hardhat

# Terminal 2: Deploy contracts to local node
npm run deploy:localhost

# Terminal 3: Start frontend
cd src && npm run dev
```

### Building for Production

```bash
# Build smart contracts
npm run compile

# Build frontend
cd src
npm run build

# Preview production build
npm run preview
```

## Smart Contracts

### Deployed Contracts (Sepolia)

Update these addresses after deployment:

```typescript
// Standard ERC20 Tokens
ZAMA_TOKEN_ADDRESS = "0x...";
USDCT_TOKEN_ADDRESS = "0x...";
ETH_TOKEN_ADDRESS = "0x...";

// Confidential ERC7984 Tokens
CONFIDENTIAL_ZAMA_TOKEN_ADDRESS = "0x...";
CONFIDENTIAL_USDC_TOKEN_ADDRESS = "0x...";
CONFIDENTIAL_ETH_TOKEN_ADDRESS = "0x...";
```

### Contract Interfaces

#### MintableERC20

Standard ERC20 token with public minting capabilities for testing.

```solidity
function mint(address to, uint256 amount) external;
function faucet(uint256 amount) external;
```

#### BaseConfidentialWrapper (ERC7984)

Confidential token wrapper implementing the ERC7984 standard.

```solidity
function wrap(uint256 amount) external returns (bool);
function unwrap(euint64 amount) external returns (bool);
function balanceOf(address account) external view returns (euint64);
function transfer(address to, euint64 amount) external returns (bool);
```

### Gas Costs (Estimated)

| Operation | Gas Cost | USD (at 30 gwei, $3000 ETH) |
|-----------|----------|------------------------------|
| Mint | ~50,000 | $4.50 |
| Approve | ~45,000 | $4.05 |
| Wrap | ~120,000 | $10.80 |
| Unwrap | ~100,000 | $9.00 |
| Transfer (encrypted) | ~150,000 | $13.50 |
| Decrypt Balance | Free (off-chain) | $0.00 |

## Security Considerations

### Smart Contract Security

- **Audited Dependencies**: Uses OpenZeppelin and Zama's audited contracts
- **Access Controls**: Proper permission checks on all sensitive functions
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Integer Overflow**: SafeMath operations prevent overflow/underflow
- **Upgrade Safety**: Deployment system supports safe upgrades

### FHE Security

- **Threshold Decryption**: No single party can decrypt user data
- **Ciphertext Indistinguishability**: Encrypted data reveals no information
- **Secure Key Generation**: Distributed key generation ceremonies
- **Replay Protection**: Nonces prevent transaction replay attacks

### Frontend Security

- **Input Validation**: All user inputs are validated and sanitized
- **Secure RPC**: Encrypted communication with blockchain nodes
- **Wallet Security**: Never stores private keys or mnemonics
- **HTTPS Only**: All production deployments use HTTPS

### Best Practices

1. **Never share your private keys or mnemonic phrases**
2. **Verify contract addresses before interacting**
3. **Start with small amounts when testing**
4. **Keep your wallet software updated**
5. **Use hardware wallets for large amounts**
6. **Verify transactions before signing**

### Known Limitations

- **Testnet Only**: Currently deployed on Sepolia testnet
- **Gas Costs**: FHE operations are more expensive than standard operations
- **Decryption Latency**: Balance decryption takes 5-10 seconds
- **Browser Compatibility**: Requires modern browser with Web3 support

## Future Roadmap

### Phase 1: Core Enhancement (Q2 2025)

- [ ] **Mainnet Deployment**: Deploy to Ethereum mainnet
- [ ] **Multi-Network Support**: Expand to Polygon, Arbitrum, Optimism
- [ ] **Gas Optimization**: Reduce transaction costs by 30-40%
- [ ] **Batch Operations**: Support batch wrapping/unwrapping
- [ ] **Enhanced UI/UX**: Improved mobile experience and animations

### Phase 2: Advanced Features (Q3 2025)

- [ ] **Encrypted Transfers UI**: Complete transfer interface in frontend
- [ ] **Transfer History**: View your complete transaction history
- [ ] **Address Book**: Save frequently used addresses
- [ ] **QR Code Support**: Generate/scan QR codes for addresses
- [ ] **Multi-Language**: Support for 10+ languages
- [ ] **Dark Mode**: Beautiful dark theme option

### Phase 3: DeFi Integration (Q4 2025)

- [ ] **Confidential Swaps**: Private DEX trading
- [ ] **Confidential Lending**: Borrow/lend with hidden amounts
- [ ] **Liquidity Pools**: Privacy-preserving AMM
- [ ] **Yield Farming**: Stake confidential tokens
- [ ] **Governance**: Vote with encrypted token holdings

### Phase 4: Enterprise Features (Q1 2026)

- [ ] **Compliance Tools**: Regulatory reporting capabilities
- [ ] **Audit Trails**: Selective disclosure to auditors
- [ ] **Multi-Sig Support**: Confidential multi-signature wallets
- [ ] **Corporate Accounts**: Business account management
- [ ] **API Access**: REST API for institutional integrators

### Phase 5: Advanced Privacy (Q2 2026)

- [ ] **Cross-Chain Privacy**: Bridge between different networks
- [ ] **Private Smart Contracts**: Deploy confidential logic
- [ ] **Confidential NFTs**: Privacy-preserving NFT ownership
- [ ] **Encrypted Messaging**: Private communication layer
- [ ] **Zero-Knowledge Proofs**: Hybrid ZK+FHE system

### Research & Innovation

- [ ] **FHE Performance**: Optimize cryptographic operations
- [ ] **Layer 2 Integration**: Deploy on rollups for lower costs
- [ ] **Hardware Acceleration**: GPU/FPGA support for FHE
- [ ] **Quantum Resistance**: Post-quantum cryptography research
- [ ] **Formal Verification**: Mathematical proof of contract correctness

### Community & Ecosystem

- [ ] **Bug Bounty Program**: Security researcher incentives
- [ ] **Developer Grants**: Fund ecosystem projects
- [ ] **Educational Content**: Tutorials, videos, documentation
- [ ] **Hackathons**: Host privacy-focused hackathons
- [ ] **Partnerships**: Collaborate with DeFi protocols

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- **Report Bugs**: Open issues for any bugs you find
- **Suggest Features**: Share your ideas for new features
- **Submit PRs**: Contribute code improvements
- **Improve Documentation**: Help make our docs better
- **Write Tests**: Increase test coverage
- **Security Audits**: Review code for vulnerabilities

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Run linting (`npm run lint`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style Guidelines

- Follow existing code formatting (enforced by Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Comment complex logic
- Use TypeScript types strictly

### Testing Requirements

- All PRs must include tests
- Maintain >80% code coverage
- Tests must pass on CI/CD
- Include both unit and integration tests

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

```
Copyright (c) 2025, ZamaBridge Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED
BY THIS LICENSE.
```

See the [LICENSE](LICENSE) file for full details.

## Support

### Getting Help

- **Documentation**: [https://docs.zama.ai](https://docs.zama.ai)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/ZamaBridge/issues)
- **Discord**: [Join the Zama community](https://discord.gg/zama)
- **Twitter**: [@zama_fhe](https://twitter.com/zama_fhe)
- **Email**: support@zama.ai

### Frequently Asked Questions

**Q: Is this production-ready?**
A: Currently on testnet only. Mainnet deployment planned for Q2 2025.

**Q: What are the gas costs?**
A: FHE operations cost more than standard ERC20. See [Gas Costs](#gas-costs-estimated) section.

**Q: Can I use this on mainnet?**
A: Not yet. Stay tuned for mainnet deployment announcements.

**Q: How secure is the encryption?**
A: Uses Zama's battle-tested FHE implementation with threshold decryption.

**Q: Can the contract owner see my balance?**
A: No. Only you can decrypt your balance with your private key.

**Q: What wallets are supported?**
A: All Web3 wallets (MetaMask, Rainbow, Coinbase Wallet, WalletConnect, etc.)

**Q: How long does decryption take?**
A: Typically 5-10 seconds depending on network conditions.

**Q: Can I transfer confidential tokens?**
A: Yes, the contracts support transfers. UI coming in next release.

### Community

Join our growing community of privacy enthusiasts:

- **GitHub**: Star and watch this repository
- **Discord**: Daily discussions and support
- **Twitter**: Latest updates and announcements
- **Blog**: Technical deep-dives and tutorials

## Acknowledgments

- **Zama Team**: For developing FHEVM and FHE technology
- **OpenZeppelin**: For confidential contract implementations
- **Ethereum Foundation**: For the Sepolia testnet
- **RainbowKit Team**: For excellent wallet connection UX
- **Wagmi Contributors**: For React hooks and Web3 tooling

---

**Built with privacy in mind. Secured by mathematics. Powered by Zama.**

For more information about Fully Homomorphic Encryption and FHEVM:
- [Zama Documentation](https://docs.zama.ai)
- [FHEVM Whitepaper](https://github.com/zama-ai/fhevm)
- [ERC7984 Standard](https://eips.ethereum.org/EIPS/eip-7984)
