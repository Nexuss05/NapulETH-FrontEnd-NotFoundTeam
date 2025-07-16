import React from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Activity } from 'lucide-react';

export function RealContractData() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const contractInfo = {
    address: '0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8',
    network: 'Avalanche Fuji',
    chainId: 43113,
    deployed: '2025-07-15 22:50:18'
  };

  const getNetworkName = (id: number) => {
    switch (id) {
      case 43113: return 'Avalanche Fuji';
      case 43114: return 'Avalanche Mainnet';
      case 1: return 'Ethereum';
      default: return `Chain ${id}`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-blue" />
            Contract Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Network:</span>
              <Badge variant="outline" className="text-cyber-blue">
                {contractInfo.network}
              </Badge>
            </div>
            
            <div className="p-3 bg-cyber-dark/30 rounded-lg border border-cyber-blue/20">
              <div className="text-xs text-muted-foreground mb-1">Contract Address:</div>
              <div className="font-mono text-xs break-all text-cyber-blue">
                {contractInfo.address}
              </div>
            </div>

            {isConnected && (
              <div className="p-3 bg-cyber-dark/30 rounded-lg border border-green-400/20">
                <div className="text-xs text-muted-foreground mb-1">Your Wallet:</div>
                <div className="font-mono text-xs break-all text-green-400">
                  {address}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <a 
                href={`https://testnet.snowtrace.io/address/${contractInfo.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Badge variant="outline" className="w-full justify-center text-cyber-blue border-cyber-blue hover:bg-cyber-blue/10">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Contract
                </Badge>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-cyber-blue">Connection Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={isConnected ? "text-green-400" : "text-red-400"}>
                {isConnected ? "✅ Connected" : "❌ Disconnected"}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-cyber-blue">
                {getNetworkName(chainId)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Chain ID:</span>
              <span className="text-cyber-blue">
                {chainId}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Contract Deployed:</span>
              <span className="text-muted-foreground text-xs">
                {contractInfo.deployed}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
