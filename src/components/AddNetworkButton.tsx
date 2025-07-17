import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Network } from 'lucide-react';

export const AddNetworkButton = () => {
  const addAvalancheFuji = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xa869', // 43113 in hex
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
      alert('Avalanche Fuji network added successfully!');
    } catch (error) {
      console.error('Failed to add network:', error);
      alert('Failed to add network. Please add manually.');
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-cyber-blue/20">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <Network className="w-8 h-8 text-white" />
        </div>
        <CardTitle>Add Avalanche Fuji Network</CardTitle>
        <CardDescription>
          First add the Avalanche Fuji testnet to your MetaMask
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={addAvalancheFuji}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Avalanche Fuji Network
        </Button>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            Click the button above to automatically add Avalanche Fuji to MetaMask
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
