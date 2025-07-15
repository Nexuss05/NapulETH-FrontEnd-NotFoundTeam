import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  CheckCircle, 
  Lock, 
  Zap, 
  Coins, 
  Target,
  BookOpen,
  Users,
  Shield,
  TrendingUp,
  Gift
} from 'lucide-react';

const Index = () => {
  const [userLevel, setUserLevel] = useState(3);
  const [userXP, setUserXP] = useState(750);
  const [nextLevelXP] = useState(1000);
  
  const battlePassLevels = [
    { level: 1, xp: 0, reward: 'Welcome Badge', type: 'badge', unlocked: true },
    { level: 2, xp: 250, reward: '100 Tokens', type: 'tokens', unlocked: true },
    { level: 3, xp: 500, reward: 'First Trade Badge', type: 'badge', unlocked: true },
    { level: 4, xp: 750, reward: 'NFT Avatar', type: 'nft', unlocked: false },
    { level: 5, xp: 1000, reward: '500 Tokens', type: 'tokens', unlocked: false },
    { level: 6, xp: 1500, reward: 'DeFi Master Badge', type: 'badge', unlocked: false },
    { level: 7, xp: 2000, reward: 'Premium Features', type: 'feature', unlocked: false },
    { level: 8, xp: 2500, reward: '1000 Tokens', type: 'tokens', unlocked: false },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Connect Your Wallet',
      description: 'Learn to connect MetaMask or other wallets',
      xp: 100,
      completed: true,
      category: 'basics',
      icon: Shield
    },
    {
      id: 2,
      title: 'Make Your First Transaction',
      description: 'Send a small amount to another wallet',
      xp: 150,
      completed: true,
      category: 'basics',
      icon: Zap
    },
    {
      id: 3,
      title: 'Explore DeFi Protocols',
      description: 'Learn about decentralized finance',
      xp: 200,
      completed: false,
      category: 'defi',
      icon: TrendingUp
    },
    {
      id: 4,
      title: 'Join Trading Community',
      description: 'Connect with other traders',
      xp: 100,
      completed: false,
      category: 'social',
      icon: Users
    },
    {
      id: 5,
      title: 'Complete Trading Course',
      description: 'Master the basics of crypto trading',
      xp: 300,
      completed: false,
      category: 'education',
      icon: BookOpen
    }
  ];

  const achievements = [
    { name: 'First Steps', description: 'Completed your first task', unlocked: true },
    { name: 'Wallet Master', description: 'Connected 3 different wallets', unlocked: true },
    { name: 'Trading Pro', description: 'Completed 10 trades', unlocked: false },
    { name: 'DeFi Explorer', description: 'Used 5 different protocols', unlocked: false },
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const handleTaskComplete = (taskId: number) => {
    // Logica per completare un task
    console.log(`Task ${taskId} completed`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CryptoQuest
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-foreground">{userXP} XP</span>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Level {userLevel}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="battlepass" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="battlepass">Battle Pass</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
          </TabsList>

          {/* Battle Pass Section */}
          <TabsContent value="battlepass" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Crypto Battle Pass</h2>
              <p className="text-muted-foreground">
                Complete tasks to unlock rewards and level up your crypto journey
              </p>
            </div>

            {/* Progress Bar */}
            <Card className="bg-gradient-to-r from-card to-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Level {userLevel}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userXP} / {nextLevelXP} XP
                  </div>
                </div>
                <Progress value={(userXP / nextLevelXP) * 100} className="h-3" />
              </CardContent>
            </Card>

            {/* Battle Pass Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {battlePassLevels.map((level) => (
                <Card
                  key={level.level}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    level.unlocked
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50'
                      : userXP >= level.xp
                      ? 'bg-gradient-to-br from-accent/20 to-accent/30 border-accent/50'
                      : 'bg-muted/50 border-muted'
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {level.unlocked ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : userXP >= level.xp ? (
                        <Gift className="w-8 h-8 text-accent" />
                      ) : (
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">Level {level.level}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{level.xp} XP</p>
                    <Badge
                      variant={level.unlocked ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {level.reward}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Section */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Learning Tasks</h2>
              <p className="text-muted-foreground">
                Complete these tasks to earn XP and unlock new levels
              </p>
            </div>

            <div className="grid gap-4">
              {tasks.map((task) => {
                const IconComponent = task.icon;
                return (
                  <Card
                    key={task.id}
                    className={`transition-all duration-300 hover:shadow-lg ${
                      task.completed
                        ? 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/50'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              task.completed
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {task.title}
                            </h3>
                            <p className="text-muted-foreground mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {task.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                +{task.xp} XP
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <Button
                              onClick={() => handleTaskComplete(task.id)}
                              size="sm"
                              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            >
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Achievements Section */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Achievements</h2>
              <p className="text-muted-foreground">
                Unlock badges as you progress through your crypto journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`text-center transition-all duration-300 hover:scale-105 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                      : 'bg-muted/50 border-muted'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      {achievement.unlocked ? (
                        <Trophy className="w-12 h-12 text-yellow-400" />
                      ) : (
                        <Lock className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learn Section */}
          <TabsContent value="learn" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Learn Crypto</h2>
              <p className="text-muted-foreground">
                Educational resources to master blockchain and cryptocurrency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Wallet Basics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Learn how to safely store and manage your cryptocurrencies
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    DeFi Fundamentals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Discover decentralized finance and yield farming strategies
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Trading Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Master technical analysis and risk management techniques
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
