# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based Web3 DApp for NapulETH hackathon called "CryptoQuest" - a gamified learning platform for cryptocurrency education. The application is built with React, TypeScript, Vite, and integrates with the Avalanche Fuji testnet using Wagmi/Viem.

### Core Architecture

The application follows a modern React structure with:
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components  
- **Web3 Integration**: Wagmi v1 + Viem for Avalanche Fuji testnet
- **Smart Contract**: Simple greeting contract deployed at `0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8`
- **Backend**: Hardhat for smart contract development and deployment

### Key Features

1. **Wallet Connection**: MetaMask integration specifically for Avalanche Fuji testnet
2. **Gamified Learning**: Season-based task system with XP rewards
3. **Educational Content**: Learn Center with crypto/Web3 educational modules
4. **Transaction Management**: Send AVAX and view transaction history
5. **Smart Contract Interaction**: Interface with deployed greeting contract

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Backend/Smart Contract Commands

```bash
# Navigate to backend directory
cd backend

# Install dependencies  
npm install

# Compile contracts
npx hardhat compile

# Deploy to Avalanche Fuji
npx hardhat deploy --network avalancheFuji

# Run tests
npx hardhat test

# Generate TypeScript ABIs
npx hardhat run scripts/generateTsAbis.ts
```

## Important Configuration Details

### Network Configuration
- **Primary Network**: Avalanche Fuji testnet (Chain ID: 43113)
- **RPC**: https://api.avax-test.network/ext/bc/C/rpc
- **Explorer**: https://testnet.snowtrace.io
- **Native Currency**: AVAX (18 decimals)

### Contract Information
- **Address**: `0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8`
- **Type**: Simple greeting contract with premium features
- **Location**: `src/contracts/YourContract.ts`

### Web3 Setup
- Uses Wagmi v1 (legacy version) with explicit Avalanche Fuji configuration
- Two config files exist: `src/lib/wagmi.ts` (newer) and `src/lib/web3.ts` (legacy)
- MetaMask is the only supported wallet connector
- **Important**: Application enforces Avalanche Fuji network only

## Key File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Real*.tsx        # Main functional components (wallet, transactions, etc.)
│   └── *.tsx           # Other UI components
├── lib/
│   ├── wagmi.ts        # Wagmi configuration (newer)
│   ├── web3.ts         # Web3 configuration (legacy)
│   └── utils.ts        # Utility functions
├── contracts/
│   └── YourContract.ts # Contract ABI and address
├── hooks/
│   └── useContract.ts  # Custom Web3 hooks
└── pages/
    ├── Index.tsx       # Main application page (CryptoQuest interface)
    └── NotFound.tsx    # 404 page
```

## Design System

### Theme
- **Primary Colors**: Cyber-themed palette with purple (`#9933FF`), blue, teal, pink, green
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom cyber theme extensions
- **Icons**: Lucide React icons

### Component Patterns
- Heavily uses shadcn/ui components (Card, Button, Dialog, Tabs, etc.)
- Custom cyber-themed color scheme throughout
- Responsive design with mobile-first approach
- Extensive use of gradient backgrounds and glassmorphism effects

## Development Guidelines

### Web3 Integration
- Always use the Avalanche Fuji testnet configuration
- Wallet connection state is managed in the main Index component
- Transaction handling uses Wagmi hooks for reading/writing contract state
- Gas fees are paid in AVAX

### State Management
- No global state management library - uses React useState
- Wallet connection state is lifted to main Index component
- Task completion and XP tracking is handled locally
- Learning module completion triggers task updates

### Testing Approach
- No test framework currently configured in frontend
- Backend uses Hardhat with Chai for smart contract testing
- Manual testing recommended for Web3 interactions on Fuji testnet

### Code Style
- TypeScript strict mode disabled for flexibility
- ESLint configured but with relaxed rules
- Import aliases: `@/` maps to `src/`
- No unused parameter/variable warnings enabled

## Common Development Tasks

### Adding New Educational Content
1. Update the `learnTopics` array in `src/pages/Index.tsx`
2. Add corresponding task with `learnTopicId` in the season tasks
3. Implement task completion logic in `completeTaskByLearnTopic` function

### Modifying Smart Contract
1. Edit `backend/contracts/YourContract.sol` 
2. Redeploy: `npx hardhat deploy --network avalancheFuji`
3. Update contract address and ABI in `src/contracts/YourContract.ts`
4. Update any components using the contract

### Adding New Wallet Connectors
- Modify `src/lib/wagmi.ts` connectors array
- Ensure Avalanche Fuji network compatibility
- Update connection logic in `RealWalletConnect.tsx`

### Debugging Web3 Issues
- Check browser console for MetaMask connection errors
- Verify network is set to Avalanche Fuji testnet
- Ensure sufficient AVAX balance for gas fees
- Use Snowtrace explorer to verify transactions