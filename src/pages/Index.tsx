import { RealWalletConnect } from "@/components/RealWalletConnect";
import { RealTransactionHistory } from "@/components/RealTransactionHistory";
import { RealTransactionForm } from "@/components/RealTransactionForm";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Lock,
  CheckCircle,
  Zap,
  Award,
  Target,
  BookOpen,
  Shield,
  Coins,
  TrendingUp,
  Users,
  Gift,
  Wallet,
  LogOut,
  History,
  Send,
  Activity,
  ExternalLink
} from 'lucide-react';
import WalletIcon from '@/assets/icons/wallet.svg';
import SecurityIcon from '@/assets/icons/security.svg';
import Web3Icon from '@/assets/icons/web3.svg';
import CryptoIcon from '@/assets/icons/crypto.svg';
import TestnetIcon from '@/assets/icons/testnet.svg';

const season1TaskIcons: Record<string, JSX.Element> = {
  '1': <img src={WalletIcon} alt="Wallet" className="w-20 h-20" />,
  '2': <img src={SecurityIcon} alt="Security" className="w-20 h-20" />,
  '3': <img src={Web3Icon} alt="Web3" className="w-20 h-20" />,
  '4': <img src={CryptoIcon} alt="Crypto" className="w-20 h-20" />,
  '5': <img src={TestnetIcon} alt="Testnet" className="w-20 h-20" />,
};

interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  reward?: string;
  learnTopicId?: string;
}

interface Season {
  season: number;
  title: string;
  description: string;
  tasks: Task[];
  rewards: string[];
}

const seasons: Season[] = [
  {
    season: 1,
    title: 'Season 1: The Beginning',
    description: 'Start your adventure in the crypto world! Complete all the tasks to unlock the next season.',
    rewards: ['Welcome Badge', 'Basic Tutorial Access'],
    tasks: [
      {
        id: '1',
        title: 'Create Your Personal Wallet',
        description: 'Set up your first crypto wallet to securely store your assets.',
        xp: 100,
        completed: true, // Auto-complete when wallet connected
        reward: 'Wallet Badge'
      },
      { 
        id: '2', 
        title: 'Complete the "How Do You Secure Your Cryptocurrencies?" Module', 
        description: 'Understand best practices for cryptocurrency security.', 
        xp: 200, 
        completed: false, 
        reward: 'Secure Cryptocurrencies Badge',
        learnTopicId: 'securing-cryptocurrencies',
      },
      {
        id: '3',
        title: 'Complete the "What is Web3" Module',
        description: 'Learn the basics of Web3 technology.',
        xp: 150,
        completed: false,
        reward: 'Web3 Badge',
        learnTopicId: 'what-is-web3',
      },
      {
        id: '4',
        title: 'Complete the "What is a Cryptocurrency" Module',
        description: 'Understand the fundamentals of cryptocurrencies.',
        xp: 150,
        completed: false,
        reward: 'Cryptocurrency Badge',
        learnTopicId: 'what-is-cryptocurrency',
      },
      {
        id: '5',
        title: 'Perform Your First Demo Transaction (Testnet)',
        description: 'Conduct your first cryptocurrency transaction in a safe environment.',
        xp: 200,
        completed: false,
        reward: 'Testnet Badge'
      }
    ]
  },
  {
    season: 2,
    title: 'Season 2: Crypto Explorer',
    description: 'Become a true explorer of the crypto world! New challenges await you.',
    rewards: ['Explorer Badge', 'Advanced Tutorial Access'],
    tasks: [
      { 
        id: '6', 
        title: 'Set Advanced Wallet Security (2FA, Seed Phrase Backup)', 
        description: 'Enhance your wallet security by enabling additional features.', 
        xp: 200, 
        completed: false, 
        reward: 'Advanced Security Badge' 
      },
      { 
        id: '7', 
        title: 'Complete the "What is a Blockchain" Module', 
        description: 'Learn about blockchain technology and its applications.', 
        xp: 200, 
        completed: false, 
        reward: 'Blockchain Badge',
        learnTopicId: 'what-is-blockchain',
      },
      { 
        id: '8', 
        title: 'Complete the "How Do You Secure Your Cryptocurrencies?" Module', 
        description: 'Understand best practices for cryptocurrency security.', 
        xp: 200, 
        completed: false, 
        reward: 'Secure Cryptocurrencies Badge',
        learnTopicId: 'securing-cryptocurrencies',
      },
      { 
        id: '9', 
        title: 'Perform 3 Mainnet Transactions', 
        description: 'Conduct three real cryptocurrency transactions.', 
        xp: 300, 
        completed: false, 
        reward: 'Mainnet Transaction Badge' 
      },
      { 
        id: '10', 
        title: 'Interact with a Basic dApp', 
        description: 'Experience decentralized applications firsthand.', 
        xp: 250, 
        completed: false, 
        reward: 'dApp Badge' 
      },
      { 
        id: '11', 
        title: 'Complete the "What are Transactions?" Module', 
        description: 'Dive deeper into how crypto transactions function.', 
        xp: 200, 
        completed: false, 
        reward: 'Transactions Badge',
        learnTopicId: 'what-are-transactions',
      },
      { 
        id: '12', 
        title: 'Complete the "Who are Validators and Why Are They Important?" Module', 
        description: 'Understand the role and significance of validators.', 
        xp: 250, 
        completed: false, 
        reward: 'Validators Badge',
        learnTopicId: 'who-are-validators',
      }
    ]
  },
  {
    season: 3,
    title: 'Season 3: Crypto Master',
    description: 'Prove your mastery by completing all the advanced tasks!',
    rewards: ['Master Badge', 'VIP Access'],
    tasks: [
      { 
        id: '13', 
        title: 'Interact with a Smart Contract (e.g., Staking)', 
        description: 'Utilize smart contracts for staking activities.', 
        xp: 400, 
        completed: false, 
        reward: 'Staking Badge' 
      },
      { 
        id: '14', 
        title: 'Complete the "What is a Smart Contract?" Module', 
        description: 'Learn the fundamentals of smart contracts.', 
        xp: 300, 
        completed: false, 
        reward: 'Smart Contract Badge',
        learnTopicId: 'what-is-smart-contract',
      },
      { 
        id: '15', 
        title: 'Participate in DAO Governance (Vote at Least Once)', 
        description: 'Engage in decentralized governance processes.', 
        xp: 500, 
        completed: false, 
        reward: 'DAO Badge' 
      },
      { 
        id: '16', 
        title: 'Complete the "What are dApps?" Module', 
        description: 'Discover decentralized applications in depth.', 
        xp: 300, 
        completed: false, 
        reward: 'dApps Badge',
        learnTopicId: 'what-are-dapps',
      },
      { 
        id: '17', 
        title: 'Provide Liquidity on a dApp (Liquidity Pool)', 
        description: 'Participate in liquidity pools on supported dApps.', 
        xp: 500, 
        completed: false, 
        reward: 'Liquidity Badge' 
      },
      { 
        id: '18', 
        title: 'Perform 5 Advanced Transactions (e.g., Swap)', 
        description: 'Execute complex crypto transactions like swaps.', 
        xp: 400, 
        completed: false, 
        reward: 'Advanced Transactions Badge' 
      },
      { 
        id: '19', 
        title: 'Write a Brief Review on a Used dApp', 
        description: 'Share feedback on a dApp.', 
        xp: 250, 
        completed: false, 
        reward: 'Brief Review Badge' 
      },
      { 
        id: '20', 
        title: 'Obtain an NFT from a Supported Platform', 
        description: 'Acquire a non-fungible token (NFT).', 
        xp: 300, 
        completed: false, 
        reward: 'NFT Badge' 
      },
      { 
        id: '21', 
        title: 'Complete an Advanced Simulated Trading Challenge', 
        description: 'Participate in simulated trading scenarios.', 
        xp: 400, 
        completed: false, 
        reward: 'ASTC Badge' 
      },
      { 
        id: '22', 
        title: 'Create an Advanced Feature Tutorial or Guide', 
        description: 'Develop a tutorial on a complex platform feature.', 
        xp: 500, 
        completed: false, 
        reward: 'Master Badge' 
      }
    ]
  }
];




// Daily tasks (unchanged)
const dailyTasks: Task[] = [
  {
    id: 't1',
    title: 'Log into your account',
    description: 'Sign in at least once today',
    xp: 10,
    completed: false,
  },
  {
    id: 't2',
    title: 'Check your wallet balance',
    description: 'View your wallet balance',
    xp: 15,
    completed: false,
  },
  {
    id: 't3',
    title: 'Review your transaction history',
    description: 'Check the history of your past transactions',
    xp: 15,
    completed: false,
  },
  {
    id: 't4',
    title: 'Complete one quick module quiz',
    description: 'Take a short quiz in the Learn Center',
    xp: 25,
    completed: false,
  },
  {
    id: 't5',
    title: 'Perform one transaction',
    description: 'Make any transaction using your wallet',
    xp: 30,
    completed: false,
  },
  {
    id: 't6',
    title: 'Send AVAX',
    description: 'Send AVAX to a friend or to another wallet of yours',
    xp: 30,
    completed: false,
  },
  {
    id: 't7',
    title: 'Check Learn Center updates',
    description: 'See if there are new updates in the Learn Center',
    xp: 20,
    completed: false,
  },
  {
    id: 't8',
    title: 'Explore a new feature',
    description: 'Try out a new feature on the platform',
    xp: 20,
    completed: false,
  },
  {
    id: 't9',
    title: 'Use the AI assistant',
    description: 'Ask a question to the AI assistant',
    xp: 25,
    completed: false,
  },
  {
    id: 't10',
    title: 'Perform a testnet transaction',
    description: 'Complete a transaction on the testnet',
    xp: 20,
    completed: false,
  },
  {
    id: 't11',
    title: 'View AVAX price trends',
    description: 'Check the current and historical price trends of AVAX',
    xp: 15,
    completed: false,
  },
  {
    id: 't12',
    title: 'Verify wallet security',
    description: 'Review and confirm your wallet security settings',
   xp: 20,
   completed: false,
 },
 {
   id: 't13',
   title: 'Complete intermediate module',
   description: 'Finish an intermediate-level module in the Learn Center',
   xp: 35,
   completed: false,
 },
 {
   id: 't14',
   title: 'Try a basic dApp',
   description: 'Interact with a basic decentralized application',
   xp: 40,
   completed: false,
 },
 {
   id: 't15',
   title: 'Perform wallet backup check',
   description: 'Make sure your wallet backup is up to date',
   xp: 20,
   completed: false,
 },
 {
   id: 't16',
   title: 'Use an advanced dApp feature',
   description: 'Explore and interact with an advanced dApp feature',
   xp: 50,
   completed: false,
 },
 {
   id: 't17',
   title: 'Stake AVAX',
   description: 'Stake AVAX using a smart contract',
   xp: 50,
   completed: false,
 },
 {
   id: 't18',
   title: 'Vote in a DAO simulation',
   description: 'Participate in a simulated DAO voting session',
   xp: 45,
   completed: false,
 },
 {
   id: 't19',
   title: 'Complete advanced-level quiz',
   description: 'Finish a high-difficulty quiz in the Learn Center',
   xp: 40,
   completed: false,
 },
 {
   id: 't20',
   title: 'Give daily feedback',
   description: 'Write a short feedback about your experience today',
   xp: 25,
   completed: false,
 }
];







// Get today's daily tasks (unchanged function)
function getTodaysDailyTasks(tasks: Task[]): Task[] {
 const today = new Date().toISOString().slice(0, 10);
 let hash = 0;
 for (let i = 0; i < today.length; i++) {
   hash = today.charCodeAt(i) + ((hash << 5) - hash);
 }
 const shuffled = [...tasks];
 for (let i = shuffled.length - 1; i > 0; i--) {
   hash = (hash * 9301 + 49297) % 233280;
   const j = Math.floor((hash / 233280) * (i + 1));
   [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
 }
 return shuffled.slice(0, 3);
}

const todaysDailyTasks = getTodaysDailyTasks(dailyTasks);

// Learn Center topics (unchanged)
const learnTopics = [
 {
   "id": "what-is-web3",
   "title": "What is Web3?",
   "shortDescription": "Understand the next evolution of the internet",
   "longDescription": "Web3 is the next internet evolution, decentralized and powered by blockchain technology. Unlike Web2, which is dynamic but centralized, Web3 prioritizes user ownership of data and identity. Web3 is governed by principles such as decentralization, ownership of assets and identity, blockchain transparency, open-source development, and permissionless participation."
 },
 {
   "id": "what-is-blockchain",
   "title": "What is a Blockchain?",
   "shortDescription": "Learn about blockchain technology fundamentals",
   "longDescription": "A blockchain is a distributed, digital, and immutable ledger designed for secure and transparent recording of transactions in a decentralized manner. Key features include immutability (data can't be altered once added), transparency (transactions visible to everyone), decentralization (no single controlling authority), and security (protected by cryptography). Data is stored in chronologically linked blocks containing a list of transactions, timestamps, and cryptographic hashes linking each block to its predecessor."
 },
 {
   "id": "what-is-cryptocurrency",
   "title": "What is a Cryptocurrency?",
   "shortDescription": "Discover digital currencies secured by cryptography",
   "longDescription": "A cryptocurrency is a digital currency secured by cryptography and recorded on the blockchain. Cryptocurrencies have various applications, including payments, utilities (such as Ethereum for gas fees), or value storage (like Bitcoin)."
 },
 {
   "id": "securing-cryptocurrencies",
   "title": "How Do You Secure Your Cryptocurrencies?",
   "shortDescription": "Learn methods for safely storing your digital assets",
   "longDescription": "Cryptocurrencies are stored using Crypto Wallets, which manage both your blockchain identity and assets, analogous to a combined bank and ID. Wallets are categorized as Hot Wallets (online-connected like MetaMask) and Cold Wallets (offline like Trezor). Wallets store private (non-shareable password) and public keys (shareable email-like identifier), sign transactions, interact with decentralized applications (dApps), and display balances and NFTs."
 },
 {
   "id": "what-are-transactions",
   "title": "What Are Transactions?",
   "shortDescription": "Understand blockchain transaction processes",
   "longDescription": "In Web3, a transaction records actions performed on the blockchain, such as sending tokens or interacting with smart contracts. The process involves user creation of a transaction, wallet signing using a private key, broadcasting to the network, validation by validators, and eventual inclusion in the blockchain. Transactions incur a Gas Fee, which compensates validators and prevents spam."
 },
 {
   "id": "who-are-validators",
   "title": "Who Are Validators and Why Are They Important?",
   "shortDescription": "Explore the role and significance of blockchain validators",
   "longDescription": "Validators verify blockchain transactions and create new blocks, crucial for maintaining blockchain security and integrity. They stake native blockchain tokens (e.g., AVAX on Avalanche) to participate. Validators proposing or validating blocks are selected based on their stake size. Honest validators earn token rewards, whereas malicious validators risk losing their stakes."
 },
 {
   "id": "what-is-smart-contract",
   "title": "What is a Smart Contract?",
   "shortDescription": "Learn about self-executing blockchain programs",
   "longDescription": "Smart contracts are self-executing programs on the blockchain that store data and trigger actions, like token transfers. They operate transparently, immutably, and automatically, removing the need for intermediaries."
 },
 {
   "id": "what-are-dapps",
   "title": "What are dApps?",
   "shortDescription": "Understand decentralized applications running on blockchains",
   "longDescription": "Decentralized applications (dApps) run on blockchain networks using smart contracts for operations and crypto wallets for identity and authentication. Common dApps include decentralized financial platforms (e.g., Uniswap), NFT marketplaces (e.g., OpenSea), and blockchain-based games (e.g., Axie Infinity)."
 }
];



const Index = () => {
 const [currentSeasonIdx, setCurrentSeasonIdx] = useState(0);
 const [seasonsState, setSeasonsState] = useState<Season[]>(JSON.parse(JSON.stringify(seasons)));
 const [currentXP, setCurrentXP] = useState(100); // Start with 100 XP for wallet connection
 const [isConnected, setIsConnected] = useState(false);
 const [walletAddress, setWalletAddress] = useState('');
 const [selectedTask, setSelectedTask] = useState<Task | null>(null);
 const [selectedLearnTopic, setSelectedLearnTopic] = useState<typeof learnTopics[0] | null>(null);

 const currentSeason = seasonsState[currentSeasonIdx];
 const completedTasks = currentSeason.tasks.filter(task => task.completed).length;
 const totalTasks = currentSeason.tasks.length;
 const progressToNextSeason = (completedTasks / totalTasks) * 100;
 const completedRewards = currentSeason.tasks.filter(t => t.completed && t.reward).map(t => t.reward);

 const handleWalletConnect = (address: string) => {
   setWalletAddress(address);
   setIsConnected(true);
   
   // Auto-complete wallet creation task
   setSeasonsState(prev => {
     const newSeasons = [...prev];
     const firstTask = newSeasons[0].tasks.find(t => t.id === '1');
     if (firstTask && !firstTask.completed) {
       firstTask.completed = true;
     }
     return newSeasons;
   });
 };

 const handleDisconnect = () => {
   setIsConnected(false);
   setWalletAddress('');
 };

 const handleCompleteTask = (taskId: string) => {
   setSeasonsState(prev => {
     const newSeasons = [...prev];
     const season = newSeasons[currentSeasonIdx];
     const taskIdx = season.tasks.findIndex(t => t.id === taskId);
     if (taskIdx !== -1 && !season.tasks[taskIdx].completed) {
       season.tasks[taskIdx].completed = true;
       setCurrentXP(xp => xp + season.tasks[taskIdx].xp);
     }
     if (season.tasks.every(t => t.completed) && currentSeasonIdx < seasons.length - 1) {
       setTimeout(() => setCurrentSeasonIdx(idx => idx + 1), 1000);
     }
     return newSeasons;
   });
 };

 const completeTaskByLearnTopic = (learnTopicId: string) => {
   setSeasonsState(prev => {
     const newSeasons = [...prev];
     const season = newSeasons[currentSeasonIdx];
     let updated = false;
     for (const task of season.tasks) {
       if (task.learnTopicId === learnTopicId && !task.completed) {
         task.completed = true;
         setCurrentXP(xp => xp + task.xp);
         updated = true;
       }
     }
     if (updated && season.tasks.every(t => t.completed) && currentSeasonIdx < seasons.length - 1) {
       setTimeout(() => setCurrentSeasonIdx(idx => idx + 1), 1000);
     }
     return newSeasons;
   });
 };

 if (!isConnected) {
   return <RealWalletConnect onConnect={handleWalletConnect} />;
 }

 return (
   <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyber-dark">
     {/* Header */}
     <header className="border-b border-cyber-blue/20 bg-card/80 backdrop-blur-sm">
       <div className="container mx-auto px-4 py-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
               <Zap className="w-5 h-5 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                 CryptoQuest
               </h1>
               <p className="text-sm text-muted-foreground">Your crypto adventure starts here.</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="text-right">
               <p className="text-sm text-muted-foreground">Total XP</p>
               <p className="text-lg font-bold text-cyber-blue">{currentXP}</p>
             </div>
             <div className="flex items-center gap-2">
               <div className="text-right">
                 <p className="text-sm text-muted-foreground">Wallet</p>
                 <p className="text-sm font-mono text-cyber-blue">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
               </div>
               <Button variant="outline" size="sm" onClick={handleDisconnect}>
                 <LogOut className="w-4 h-4" />
               </Button>
             </div>
           </div>
         </div>
       </div>
     </header>









     <div className="container mx-auto px-4 py-8">
       <Tabs defaultValue="battlepass" className="w-full">
         <TabsList className="grid w-full grid-cols-4 mb-8">
           <TabsTrigger value="battlepass" className="data-[state=active]:bg-[#9933FF] data-[state=active]:text-white">
             Wallet Pass
           </TabsTrigger>
           <TabsTrigger value="send" className="data-[state=active]:bg-[#9933FF] data-[state=active]:text-white">
             <Send className="w-4 h-4 mr-2" />
             Send
           </TabsTrigger>
           <TabsTrigger value="transactions" className="data-[state=active]:bg-[#9933FF] data-[state=active]:text-white">
             <History className="w-4 h-4 mr-2" />
             Transactions
           </TabsTrigger>
           <TabsTrigger value="learn" className="data-[state=active]:bg-[#9933FF] data-[state=active]:text-white">
             <BookOpen className="w-4 h-4 mr-2" />
             Learn
           </TabsTrigger>
         </TabsList>

         <TabsContent value="battlepass">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Season Pass */}
             <div className="lg:col-span-2">
               <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                 <CardHeader>
                   <CardTitle className="text-xl font-bold text-cyber-blue flex items-center gap-2">
                     <Trophy className="w-5 h-5" />
                     {currentSeason.title}
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="mb-4">
                     <p className="text-sm text-muted-foreground">{currentSeason.description}</p>
                   </div>
                   <div className="space-y-4">
                     {currentSeason.tasks.map((task) => (
                       <Dialog key={task.id} open={selectedTask?.id === task.id} onOpenChange={(open) => setSelectedTask(open ? task : null)}>
                         <DialogTrigger asChild>
                           <div
                             className={`relative p-4 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                               task.completed
                                 ? 'bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border-cyber-blue/30'
                                 : 'bg-gray-500/10 border-gray-500/20'
                             }`}
                             onClick={() => setSelectedTask(task)}
                           >
                             <div className="flex items-center gap-4">
                               {task.completed ? (
                                 currentSeason.season === 1 && season1TaskIcons[task.id]
                                   ? (
                                     <span className="flex items-center justify-center">{season1TaskIcons[task.id]}</span>
                                   ) : (
                                     <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-cyber-blue to-cyber-purple">
                                       <CheckCircle className="w-6 h-6 text-white" />
                                     </div>
                                   )
                               ) : (
                                 <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-500">
                                   <Target className="w-16 h-16 text-gray-300" />
                                 </div>
                               )}
                               <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                   <h3 className="font-bold text-lg">{task.title}</h3>
                                   <Badge variant="outline" style={{ color: '#9933FF', borderColor: '#9933FF' }} className="text-xs">
                                     +{task.xp} XP
                                   </Badge>
                                 </div>
                                 <p className="text-sm text-muted-foreground mb-2">
                                   {task.description}
                                 </p>
                                 {task.reward && (
                                   <Badge variant="secondary" className="text-xs">
                                     <Gift className="w-3 h-3 mr-1" />
                                     {task.reward}
                                   </Badge>
                                 )}
                               </div>
                             </div>
                           </div>
                         </DialogTrigger>
                         <DialogContent className="max-w-md">
                           <DialogHeader>
                             <DialogTitle className="flex items-center gap-2">
                               <Star className="w-5 h-5 text-cyber-blue" />
                               {task.title}
                             </DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                             <div>
                               <h4 className="font-semibold mb-2">Description</h4>
                               <p className="text-sm text-muted-foreground">{task.description}</p>
                             </div>
                             {task.reward && (
                               <div>
                                 <h4 className="font-semibold mb-2">Reward</h4>
                                 <Badge variant="secondary" className="text-xs">
                                   <Gift className="w-3 h-3 mr-1" />
                                   {task.reward}
                                 </Badge>
                               </div>
                             )}
                           </div>
                         </DialogContent>
                       </Dialog>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Sidebar */}
             <div className="space-y-6">
               {/* Current Season */}
               <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                 <CardHeader>
                   <CardTitle className="text-lg font-bold text-cyber-purple flex items-center gap-2">
                     <Award className="w-5 h-5" />
                     Current Season
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-center">
                     <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                       <span className="text-2xl font-bold text-white">{currentSeason.season}</span>
                     </div>
                     <h3 className="font-bold text-lg mb-2">{currentSeason.title}</h3>
                     <p className="text-sm text-muted-foreground mb-4">
                       {completedTasks} / {totalTasks} Task
                     </p>
                     <Progress value={progressToNextSeason} className="h-2" />
                   </div>
                 </CardContent>
               </Card>

               {/* Quick Stats */}
               <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                 <CardHeader>
                   <CardTitle className="text-lg font-bold text-cyber-blue flex items-center gap-2">
                     <TrendingUp className="w-5 h-5" />
                     Statistics
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-muted-foreground">Task Done</span>
                       <span className="font-bold text-cyber-blue">{completedTasks}/{totalTasks}</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-muted-foreground">XP Earned</span>
                       <span className="font-bold text-cyber-purple">{currentXP}</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-muted-foreground">Season</span>
                       <span className="font-bold text-cyber-teal">{currentSeason.season}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               {/* Reward Season */}
               <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                 <CardHeader>
                   <CardTitle className="text-lg font-bold text-cyber-blue flex items-center gap-2">
                     <Gift className="w-5 h-5" />
                     Reward Season
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="flex flex-wrap gap-2">
                     {completedRewards.length === 0 ? (
                       <span className="text-sm text-muted-foreground">No rewards yet</span>
                     ) : (
                       completedRewards.map((reward, idx) => (
                         <Badge key={idx} variant="secondary" className="text-xs">
                           <Gift className="w-3 h-3 mr-1" />
                           {reward}
                         </Badge>
                       ))
                     )}
                   </div>
                 </CardContent>
               </Card>

               {/* Daily Tasks */}
               <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                 <CardHeader>
                   <CardTitle className="text-lg font-bold text-cyber-blue flex items-center gap-2">
                     <Target className="w-5 h-5" />
                     Daily Tasks
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {todaysDailyTasks.map((task) => (
                       <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/30">
                         <div className={`w-2 h-2 rounded-full ${
                           task.completed ? 'bg-green-400' : 'bg-yellow-400'
                         }`} />
                         <div className="flex-1">
                           <p className="text-sm font-medium">{task.title}</p>
                           <p className="text-xs text-muted-foreground">+{task.xp} XP</p>
                         </div>
                         {task.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             </div>
           </div>
         </TabsContent>

         <TabsContent value="transactions">
           <RealTransactionHistory />
         </TabsContent>

         <TabsContent value="send">
           <RealTransactionForm />
         </TabsContent>

         <TabsContent value="learn">
           {/* Contract Status Card */}
           <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20 mb-6">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Activity className="w-5 h-5 text-cyber-blue" />
                 Real Contract Status
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <div className="text-sm"><strong>Your Wallet:</strong></div>
                   <div className="font-mono text-xs text-cyber-blue bg-cyber-dark/30 p-2 rounded">
                     {walletAddress}
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="text-sm"><strong>Smart Contract:</strong></div>
                   <div className="font-mono text-xs text-cyber-purple bg-cyber-dark/30 p-2 rounded">
                     0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8
                   </div>
                 </div>
               </div>
               <div className="mt-4 text-center">
                 <a 
                   href={`https://testnet.snowtrace.io/address/0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-cyber-blue hover:text-cyber-purple"
                 >
                   View Contract on Snowtrace <ExternalLink className="w-4 h-4" />
                 </a>
               </div>
             </CardContent>
           </Card>




           {/* Learn Center */}
           <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
             <CardHeader>
               <CardTitle className="text-xl font-bold text-cyber-blue">Learn Center</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {learnTopics.map((topic) => (
                   <Dialog key={topic.id} open={selectedLearnTopic?.id === topic.id} onOpenChange={open => {
                     setSelectedLearnTopic(open ? topic : null);
                     if (open) completeTaskByLearnTopic(topic.id);
                   }}>
                     <DialogTrigger asChild>
                       <div
                         className="p-4 rounded-lg bg-cyber-dark/30 border border-cyber-blue/20 cursor-pointer hover:scale-105 transition-all"
                         onClick={() => setSelectedLearnTopic(topic)}
                       >
                         <h3 className="font-bold mb-2 text-cyber-blue">{topic.title}</h3>
                         <p className="text-sm text-muted-foreground mb-3">{topic.shortDescription}</p>
                         <Button variant="outline" size="sm">Learn More</Button>
                       </div>
                     </DialogTrigger>
                     <DialogContent className="max-w-md">
                       <DialogHeader>
                         <DialogTitle className="flex items-center gap-2">
                           {topic.title}
                         </DialogTitle>
                       </DialogHeader>
                       <div className="space-y-4">
                         <div>
                           <h4 className="font-semibold mb-2">Description</h4>
                           <p className="text-sm text-muted-foreground">{topic.longDescription}</p>
                         </div>
                       </div>
                     </DialogContent>
                   </Dialog>
                 ))}
               </div>
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>
     </div>
   </div>
 );
};

export default Index;
