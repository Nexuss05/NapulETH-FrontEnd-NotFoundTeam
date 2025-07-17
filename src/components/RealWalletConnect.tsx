import React from "react";
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RealWalletConnectProps {
  onConnect: (walletAddress: string) => void;
  isReconnecting?: boolean;
}

export const RealWalletConnect = ({ onConnect, isReconnecting = false }: RealWalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  // Call parent callback when wallet connection succeeds
  React.useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);


  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension",
          variant: "destructive"
        });
        return;
      }

      console.log('Available connectors:', connectors.map(c => c.name));
      
      const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
      
      if (metaMaskConnector) {
        console.log('Connecting to MetaMask...');
        console.log('Connector details:', metaMaskConnector);
        
        // Connect wallet first, then handle network
        try {
          connect({ connector: metaMaskConnector });
          
          // Show network reminder after connection
          setTimeout(() => {
            toast({
              title: "Network Reminder",
              description: "Make sure you're connected to Avalanche Fuji testnet in MetaMask",
            });
          }, 2000);
          
        } catch (connectError) {
          console.error('Connect call failed:', connectError);
          throw connectError;
        }
      } else {
        const errorMsg = 'MetaMask connector not found. Please install MetaMask.';
        console.error(errorMsg);
        toast({
          title: "Connection Error",
          description: errorMsg,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to MetaMask: ${(error as Error)?.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Show error if connection fails
  React.useEffect(() => {
    if (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    }
  }, [error, toast]);

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
          
          {/* Connection Tips */}
          {!window.ethereum && (
            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm font-medium text-blue-400 mb-2">Connection Issues?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Make sure MetaMask extension is installed</li>
                <li>• Refresh the page and try again</li>
                <li>• Try a different browser (Chrome/Firefox)</li>
                <li>• Check if MetaMask is disabled</li>
              </ul>
            </div>
          )}
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

          {/* MetaMask检测状态 */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            window.ethereum 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              window.ethereum ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <div className="text-sm">
              <p className="font-medium">
                {window.ethereum ? 'MetaMask Detected' : 'MetaMask Not Found'}
              </p>
              <p className="text-muted-foreground">
                {window.ethereum 
                  ? 'Ready to connect' 
                  : 'Please install MetaMask extension'
                }
              </p>
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
