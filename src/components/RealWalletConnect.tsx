import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, AlertCircle, Zap } from 'lucide-react';

interface RealWalletConnectProps {
  onConnect: (walletAddress: string) => void;
}

export const RealWalletConnect = ({ onConnect }: RealWalletConnectProps) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);

  // 当钱包连接成功时，调用父组件的回调
  useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await connect({ connector: metaMask() });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
    setIsLoading(false);
  };

  const connectDev = () => {
    onConnect('0xDEV123456789ABCDEF');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyber-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            CryptoQuest
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect your wallet to start your crypto journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20">
            <Shield className="w-5 h-5 text-cyber-blue" />
            <div className="text-sm">
              <p className="font-medium">Secure Connection</p>
              <p className="text-muted-foreground">Your wallet stays safe</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div className="text-sm">
              <p className="font-medium">Learn & Earn</p>
              <p className="text-muted-foreground">Complete tasks to level up</p>
            </div>
          </div>

          <Button 
            onClick={connectWallet}
            disabled={isConnecting || isLoading}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
          >
            {isConnecting || isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              'Connect MetaMask'
            )}
          </Button>

          <Button 
            onClick={connectDev}
            variant="outline"
            className="w-full border-cyber-teal/30 hover:bg-cyber-teal/10"
          >
            Dev Login (Test Mode)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
