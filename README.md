# NapulETH Hackathon - CryptoQuest DApp - NotFoundTeam

## Project Overview:

**CryptoQuest** is a comprehensive Web3 educational platform built for the NapulETH hackathon. The project combines blockchain technology with gamified learning to create an engaging crypto education experience. Users can connect their wallets, perform real transactions on the Avalanche Fuji testnet, and complete educational tasks to earn badges and XP.

## Key Features:

### - Wallet Integration
- **MetaMask Connection**: Seamless integration with MetaMask wallet
- **Multi-Network Support**: Primarily configured for Avalanche Fuji testnet
- **Real Transaction Processing**: Send actual AVAX transactions on testnet
- **Transaction History**: View and track all your blockchain transactions

### - Gamified Learning System
- **Season-Based Progression**: Three seasons with increasing difficulty
- **Task Completion**: Complete educational modules and practical tasks
- **XP & Badge System**: Earn experience points and collectible badges
- **Progress Tracking**: Visual progress indicators and achievement system

### - Educational Content
- **Interactive Modules**: Learn about Web3, cryptocurrencies, blockchain, and more
- **Practical Exercises**: Real-world crypto operations on testnet
- **Security Training**: Best practices for cryptocurrency security
- **Smart Contract Interaction**: Learn to interact with deployed contracts

### - AI-Powered Assistant
- **Real-time Guidance**: Interactive AI agent that assists with transactions and tutorials
- **Risk Prevention**: Proactive risk assessment and warnings for transactions
- **Knowledge Base Integration**: Access to comprehensive crypto education database
- **Screen Sharing Capability**: AI can see and respond to your screen content in real-time
- **Conversational Learning**: Chat with the AI like having a personal crypto tutor
- **External Data Integration**: Connects to real-time databases for up-to-date information
- **Search Functionality**: Advanced search capabilities for instant answers
- **Interruptible Conversations**: Pause and resume AI interactions at any time
- 
### - Modern UI/UX
- **Cyberpunk Theme**: Futuristic design with neon colors and gradients
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live transaction status and wallet balance
- **Toast Notifications**: User-friendly feedback for all actions



## Architecture:

### Frontend Stack
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom theme
- **Radix UI** components for accessibility
- **React Router** for navigation
- **React Query** for state management

### AI Agent Stack
- **Real-time Screen Analysis** for contextual assistance
- **Knowledge Base Integration** for educational content
- **External API Connections** for live data feeds
- **Voice/Text Interface** for natural conversations

### Web3 Integration
- **Wagmi** for Ethereum interactions
- **Viem** for low-level blockchain operations
- **MetaMask** as primary wallet connector
- **Avalanche Fuji** testnet for transactions

### Smart Contract Backend
- **Hardhat** development environment
- **Solidity** smart contracts
- **TypeChain** for TypeScript bindings
- **OpenZeppelin** for secure contract patterns

## Project Structure:

```
NapulETH-FrontEnd-NotFoundTeam/
├── src/
│   ├── components/
│   │   ├── RealWalletConnect.tsx      # Wallet connection component
│   │   ├── RealTransactionForm.tsx    # Transaction sending interface
│   │   ├── RealTransactionHistory.tsx # Transaction history display
│   │   ├── RealContractData.tsx       # Smart contract information
│   │   └── ui/                        # Reusable UI components
│   ├── pages/
│   │   ├── Index.tsx                  # Main application page
│   │   └── NotFound.tsx               # 404 error page
│   ├── lib/
│   │   ├── wagmi.ts                   # Web3 configuration
│   │   └── utils.ts                   # Utility functions
│   ├── hooks/
│   │   └── use-toast.ts               # Toast notification hook
│   ├── assets/
│   │   └── icons/                     # SVG icons
│   └── App.tsx                        # Main application component
├── backend/
│   ├── contracts/
│   │   └── YourContract.sol           # Smart contract implementation
│   ├── hardhat.config.ts              # Hardhat configuration
│   └── deploy/                        # Deployment scripts
├── public/                            # Static assets
└── package.json                       # Dependencies and scripts
├── ai/
│   ├── ai.py                          # AI agent core logic
│   ├── app.py                         # AI application runner
│   └── requirements.txt               # AI dependencies
```

## 🚀 Getting Started:

### Prerequisites
- Node.js (v18 or higher)
- Yarn or npm package manager
- MetaMask browser extension
- Avalanche Fuji testnet configured in MetaMask

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nexuss05/NapulETH-FrontEnd-NotFoundTeam.git
   cd NapulETH-FrontEnd-NotFoundTeam
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### AI Agent Setup

1. **Create virtual environment for AI**
   ```bash
   python -m venv ai-env
   source ai-env/bin/activate  # On Windows: ai-env\Scripts\activate
   ```
   
2. **Install AI dependencies and Start**
   ```bash
   pip install -r requirements.txt
   python app.py
   ```

## How to Use:

### 1. Wallet Connection
- Click "Connect MetaMask" to link your wallet
- Ensure you're connected to Avalanche Fuji testnet
- Your wallet address will be displayed in the interface

### 2. Educational Journey
- **Season 1**: Complete basic crypto education modules
- **Season 2**: Perform real transactions and learn advanced concepts
- **Season 3**: Master smart contracts and DeFi interactions

### 3. Task Completion
- Read educational content in each module
- Complete practical exercises (wallet setup, transactions)
- Earn XP and collect badges for achievements
- Track your progress through the season system

### 4. Real Transactions
- Use the transaction form to send AVAX to other addresses
- View transaction history with blockchain explorer links
- Monitor transaction status in real-time
- Learn about gas fees and network costs

### 5. AI Assistant
- **Enable AI Agent**: Run `python app.py` to start the AI assistant
- **Screen Sharing**: Allow screen access for contextual help
- **Real-time Guidance**: Ask questions about any part of the interface
- **Transaction Assistance**: Get help with transaction setup and risk assessment
- **Educational Support**: Interactive explanations of crypto concepts
- **Interrupt Anytime**: Pause or stop AI conversations as needed
- **Toggle On/Off**: Enable or disable AI assistance at any time

## Configuration:

### Network Configuration
The application is configured for **Avalanche Fuji testnet**:
- **Chain ID**: 43113
- **RPC URL**: `https://api.avax-test.network/ext/bc/C/rpc`
- **Explorer**: `https://testnet.snowtrace.io`

### Smart Contract
- **Contract Address**: `0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8`
- **Network**: Avalanche Fuji testnet
- **Deployed**: 2025-07-15 22:50:18

### Customization
- Modify `src/lib/wagmi.ts` to change networks
- Update contract address in components for different deployments
- Customize theme colors in `tailwind.config.ts`

## Design System:

### Color Palette
- **Cyber Blue**: Primary accent color
- **Cyber Purple**: Secondary accent color
- **Cyber Teal**: Success and positive actions
- **Cyber Pink**: Highlights and special elements
- **Cyber Green**: Success states

### Typography
- Modern, clean fonts optimized for readability
- Consistent hierarchy with proper spacing
- Monospace fonts for addresses and technical data

### Components
- Glassmorphism effects with backdrop blur
- Gradient backgrounds and borders
- Hover animations and transitions
- Responsive grid layouts

## Security Features:

- **Wallet Connection Validation**: Ensures proper network connection
- **Transaction Confirmation**: User must approve all transactions
- **Error Handling**: Comprehensive error messages and recovery
- **Testnet Environment**: Safe learning environment with no real funds
- **Private Key Protection**: Never exposed in the application
- **AI Privacy Protection**: Screen reading only with explicit user permission
- **Secure AI Communication**: Encrypted data transmission to AI services
- **User-Controlled AI**: Complete control over AI activation and deactivation
## Performance:

- **Vite Build System**: Fast development and optimized production builds
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Components loaded on demand
- **Caching**: React Query for efficient data management
- **Image Optimization**: SVG icons for crisp display at any size

## License:

This project is developed for the NapulETH hackathon and follows MIT license terms.  

Created by team **NotFound**:  
- [Matteo Cotena](https://github.com/Nexuss05)  
- [Qiang Ma](https://github.com/ma2214889041)  
- [Cristofor Doarme](https://github.com/Chriss1618)  
- [Yuri Mario Gianoli](https://github.com/SpacebornYu)

## 🙏 Acknowledgments

- **NapulETH Team** for organizing the hackathon
- **Avalanche Foundation** for testnet infrastructure
- **Hardhat Team** for development tools
- **Wagmi Team** for Web3 integration
- **Radix UI** for accessible components


**Built with ❤️ for the NapulETH Hackathon**
