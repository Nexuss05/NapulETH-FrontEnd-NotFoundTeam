import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/WalletConnect';
import { TransactionHistory } from '@/components/TransactionHistory';
import { TransactionForm } from '@/components/TransactionForm';
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
  Send
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: 'basics' | 'trading' | 'defi' | 'security';
}

interface Level {
  level: number;
  title: string;
  xpRequired: number;
  rewards: string[];
  unlocked: boolean;
  description: string;
  requirements: string[];
  tips: string[];
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Connect Your Wallet',
    description: 'Connect your MetaMask wallet to the platform',
    xp: 100,
    completed: false,
    category: 'basics'
  },
  {
    id: '2',
    title: 'Complete Profile',
    description: 'Add your basic information',
    xp: 50,
    completed: false,
    category: 'basics'
  },
  {
    id: '3',
    title: 'First Transaction',
    description: 'Execute your first blockchain transaction',
    xp: 200,
    completed: false,
    category: 'trading'
  },
  {
    id: '4',
    title: 'Learn DeFi Basics',
    description: 'Complete the DeFi tutorial',
    xp: 150,
    completed: false,
    category: 'defi'
  },
  {
    id: '5',
    title: 'Setup 2FA',
    description: 'Enable two-factor authentication',
    xp: 75,
    completed: false,
    category: 'security'
  }
];

const levels: Level[] = [
  {
    level: 1,
    title: 'Crypto Newbie',
    xpRequired: 0,
    rewards: ['Welcome Badge', 'Basic Tutorial Access'],
    unlocked: true,
    description: 'Welcome to the crypto world! Start your journey by learning the basics.',
    requirements: ['Complete registration', 'Connect wallet'],
    tips: ['Take your time to read everything', 'Don\'t rush', 'Ask questions in the community']
  },
  {
    level: 2,
    title: 'Wallet Explorer',
    xpRequired: 150,
    rewards: ['Wallet Badge', 'Transaction Tutorial'],
    unlocked: false,
    description: 'Learn to manage your wallet and make your first transactions safely.',
    requirements: ['Connect wallet', 'Complete profile', 'Study security basics'],
    tips: ['Always save your seed phrase', 'Always check recipient address', 'Start with small amounts']
  },
  {
    level: 3,
    title: 'Trader Apprentice',
    xpRequired: 350,
    rewards: ['Trading Badge', 'Market Analysis Tools'],
    unlocked: false,
    description: 'Discover crypto markets and learn trading basics.',
    requirements: ['Execute first transaction', 'Study basic charts', 'Understand order types'],
    tips: ['DYOR (Do Your Own Research)', 'Don\'t invest more than you can afford to lose', 'Use stop losses']
  },
  {
    level: 4,
    title: 'DeFi Student',
    xpRequired: 500,
    rewards: ['DeFi Badge', 'Yield Farming Access'],
    unlocked: false,
    description: 'Explore the world of decentralized finance.',
    requirements: ['Complete DeFi tutorial', 'Try a DEX', 'Understand liquidity pools'],
    tips: ['Watch out for gas fees', 'Understand impermanent loss risks', 'Start with trusted protocols']
  },
  {
    level: 5,
    title: 'Security Expert',
    xpRequired: 650,
    rewards: ['Security Badge', 'Advanced Features'],
    unlocked: false,
    description: 'Become a blockchain security expert.',
    requirements: ['Enable 2FA', 'Study best practices', 'Complete security quiz'],
    tips: ['Never share private keys', 'Use hardware wallet for large amounts', 'Always verify smart contracts']
  }
];

const Index = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentXP, setCurrentXP] = useState(75);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const currentLevelData = levels.find(l => l.level === currentLevel);
  const nextLevelData = levels.find(l => l.level === currentLevel + 1);
  const progressToNextLevel = nextLevelData ? 
    ((currentXP - (currentLevelData?.xpRequired || 0)) / (nextLevelData.xpRequired - (currentLevelData?.xpRequired || 0))) * 100 : 100;

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  if (!isConnected) {
    return <WalletConnect onConnect={handleWalletConnect} />;
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
                <p className="text-sm text-muted-foreground">Your crypto adventure starts here</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-lg font-bold text-cyber-blue">{currentXP}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-lg font-bold text-cyber-purple">{currentLevel}</p>
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
            <TabsTrigger value="battlepass">Battle Pass</TabsTrigger>
            <TabsTrigger value="transactions">
              <History className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="send">
              <Send className="w-4 h-4 mr-2" />
              Send
            </TabsTrigger>
            <TabsTrigger value="learn">
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="battlepass">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Battle Pass */}
              <div className="lg:col-span-2">
                <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-cyber-blue flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Battle Pass - Season 1
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Level Progress</span>
                          <span>{Math.round(progressToNextLevel)}%</span>
                        </div>
                        <Progress value={progressToNextLevel} className="h-2" />
                      </div>
                      <Badge variant="outline" className="border-cyber-purple text-cyber-purple">
                        {currentXP} / {nextLevelData?.xpRequired || 'MAX'} XP
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {levels.map((level, index) => (
                        <Dialog key={level.level}>
                          <DialogTrigger asChild>
                            <div 
                              className={`relative p-4 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                                level.unlocked 
                                  ? 'bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border-cyber-blue/30' 
                                  : 'bg-gray-500/10 border-gray-500/20'
                              }`}
                              onClick={() => setSelectedLevel(level)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  level.unlocked ? 'bg-gradient-to-br from-cyber-blue to-cyber-purple' : 'bg-gray-500'
                                }`}>
                                  {level.unlocked ? (
                                    <Star className="w-6 h-6 text-white" />
                                  ) : (
                                    <Lock className="w-6 h-6 text-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{level.title}</h3>
                                    <Badge variant="outline" className="text-xs">
                                      Level {level.level}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {level.xpRequired} XP required
                                  </p>
                                  <div className="flex gap-2">
                                    {level.rewards.map((reward, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {reward}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {currentLevel >= level.level && (
                                  <CheckCircle className="w-6 h-6 text-green-400" />
                                )}
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-cyber-blue" />
                                {level.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{level.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {level.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <Target className="w-3 h-3" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Tips</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {level.tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <BookOpen className="w-3 h-3" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Rewards</h4>
                                <div className="flex flex-wrap gap-2">
                                  {level.rewards.map((reward, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      <Gift className="w-3 h-3 mr-1" />
                                      {reward}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
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
                {/* Current Level */}
                <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-cyber-purple flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Current Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{currentLevel}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{currentLevelData?.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {currentXP} / {nextLevelData?.xpRequired || 'MAX'} XP
                      </p>
                      <Progress value={progressToNextLevel} className="h-2" />
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
                        <span className="text-sm text-muted-foreground">Tasks Completed</span>
                        <span className="font-bold text-cyber-blue">{completedTasks}/{totalTasks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">XP Earned</span>
                        <span className="font-bold text-cyber-purple">{currentXP}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Level</span>
                        <span className="font-bold text-cyber-neon">{currentLevel}</span>
                      </div>
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
                      {tasks.slice(0, 3).map((task) => (
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
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="send">
            <TransactionForm />
          </TabsContent>

          <TabsContent value="learn">
            <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-cyber-blue">Learn Center</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-cyber-dark/30 border border-cyber-blue/20">
                    <h3 className="font-bold mb-2 text-cyber-blue">Blockchain Basics</h3>
                    <p className="text-sm text-muted-foreground mb-3">Learn the fundamentals of blockchain technology</p>
                    <Button variant="outline" size="sm">Start Learning</Button>
                  </div>
                  <div className="p-4 rounded-lg bg-cyber-dark/30 border border-cyber-blue/20">
                    <h3 className="font-bold mb-2 text-cyber-purple">DeFi Guide</h3>
                    <p className="text-sm text-muted-foreground mb-3">Explore decentralized finance protocols</p>
                    <Button variant="outline" size="sm">Start Learning</Button>
                  </div>
                  <div className="p-4 rounded-lg bg-cyber-dark/30 border border-cyber-blue/20">
                    <h3 className="font-bold mb-2 text-cyber-neon">Security Best Practices</h3>
                    <p className="text-sm text-muted-foreground mb-3">Keep your crypto assets safe</p>
                    <Button variant="outline" size="sm">Start Learning</Button>
                  </div>
                  <div className="p-4 rounded-lg bg-cyber-dark/30 border border-cyber-blue/20">
                    <h3 className="font-bold mb-2 text-cyber-blue">Trading Strategies</h3>
                    <p className="text-sm text-muted-foreground mb-3">Learn how to trade cryptocurrencies</p>
                    <Button variant="outline" size="sm">Start Learning</Button>
                  </div>
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