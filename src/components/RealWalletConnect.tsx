import React from "react";
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface RealWalletConnectProps {
  onConnect: (walletAddress: string) => void;
}

export const RealWalletConnect = ({ onConnect }: RealWalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  // 当钱包连接成功时，调用父组件的回调
  React.useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);

  const connectWallet = () => {
    const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  if (isConnected && address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyber-dark flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-cyber-blue/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-500">
              Wallet Connected!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {address}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => disconnect()}
              variant="outline"
              className="w-full"
            >
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyber-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            CryptoQuest
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect your wallet to start your crypto journey on Avalanche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20">
            <Shield className="w-5 h-5 text-cyber-blue" />
            <div className="text-sm">
              <p className="font-medium">Avalanche Fuji Network</p>
              <p className="text-muted-foreground">Connect to interact with your contract</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div className="text-sm">
              <p className="font-medium">Smart Contract</p>
              <p className="text-muted-foreground">0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8</p>
            </div>
          </div>

          <Button 
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
          >
            {isLoading ? 'Connecting...' : 'Connect to Avalanche'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
