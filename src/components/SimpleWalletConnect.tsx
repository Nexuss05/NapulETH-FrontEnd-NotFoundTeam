import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, AlertCircle } from 'lucide-react';

interface SimpleWalletConnectProps {
  onConnect: (walletAddress: string) => void;
}

export const SimpleWalletConnect = ({ onConnect }: SimpleWalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      // 检查是否有 MetaMask
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }

      // 请求连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // 检查网络
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Avalanche Fuji chainId = 0xa869 (十六进制) = 43113 (十进制)
      if (chainId !== '0xa869') {
        // 尝试切换网络
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa869' }],
          });
        } catch (switchError: any) {
          // 如果网络不存在，添加网络
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xa869',
                chainName: 'Avalanche Fuji C-Chain',
                nativeCurrency: {
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  decimals: 18
                },
                rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://testnet.snowtrace.io/']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      onConnect(accounts[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

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
              <p className="text-muted-foreground">We'll automatically switch networks</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div className="text-sm">
              <p className="font-medium">Smart Contract</p>
              <p className="text-muted-foreground text-xs font-mono">0x524a...931a8</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// 扩展 Window 接口
declare global {
  interface Window {
    ethereum?: any;
  }
}
