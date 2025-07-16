import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, AlertCircle } from 'lucide-react';
import Icon from '@/assets/icons/icon.png';

interface WalletConnectProps {
  onConnect: (walletAddress: string) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      onConnect('0x742d35Cc6634C0532925a3b8D');
      setIsConnecting(false);
    }, 1500);
  };

  const connectDev = () => {
    onConnect('0xDEV123456789ABCDEF');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyber-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader className="text-center">
          {/* <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div> */}

          <div className="w-20 h-20 mx-auto flex items-center justify-center">
            <img src={Icon} alt="Icon" className="w-13 h-13" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            CryptoQuest
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect your wallet to start your crypto journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-blue/10 border border-cyber-green/20">
            <Shield className="w-5 h-5 text-cyber-green" />
            <div className="text-sm">
              <p className="font-medium">Secure Connection</p>
              <p className="text-muted-foreground">Your wallet stays safe</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-blue/10 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div className="text-sm">
              <p className="font-medium">Learn & Earn</p>
              <p className="text-muted-foreground">Complete tasks to level up</p>
            </div>
          </div>

          <Button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full text-white bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
          >
            {isConnecting ? 'Connecting...' : 'Connect Avalanche'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};