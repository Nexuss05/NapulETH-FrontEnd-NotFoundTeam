import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Droplets, AlertTriangle, Wallet } from 'lucide-react';
import { formatEther } from 'viem';

export const FaucetHelper = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address: address,
  });

  const faucets = [
    {
      name: 'Official Avalanche Faucet',
      url: 'https://faucet.avax.network/',
      description: '2 AVAX per request',
      primary: true
    },
    {
      name: 'Chainlink Faucet',
      url: 'https://faucets.chain.link/fuji',
      description: 'Alternative faucet'
    }
  ];

  const handleFaucetClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  if (!isConnected || !address) {
    return null;
  }

  const balanceValue = balance ? parseFloat(formatEther(balance.value)) : 0;
  const isLowBalance = balanceValue < 0.1;

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-cyber-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5 text-cyber-blue" />
          Wallet Balance
        </CardTitle>
        <CardDescription>
          Your Avalanche Fuji testnet balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div>
            <p className="text-sm text-muted-foreground">AVAX Balance</p>
            <p className="text-xl font-bold text-white">
              {isLoading ? 'Loading...' : `${balanceValue.toFixed(4)} AVAX`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Test Network</p>
            <p className="text-sm font-medium text-cyber-blue">Avalanche Fuji</p>
          </div>
        </div>

        {/* Low Balance Warning */}
        {isLowBalance && (
          <Alert className="border-amber-500/30 bg-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              Insufficient balance! You need more AVAX to pay for gas fees. Recommended minimum: 0.1 AVAX.
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Wallet Address:</p>
          <div className="flex items-center gap-2 p-2 rounded bg-slate-800/50 border border-slate-700">
            <code className="flex-1 text-xs text-cyber-blue break-all">
              {address}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={copyAddress}
              className="shrink-0 text-xs"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Faucet Links */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <h3 className="font-medium">Get Free Test AVAX</h3>
          </div>
          
          <div className="space-y-2">
            {faucets.map((faucet, index) => (
              <Button
                key={index}
                variant={faucet.primary ? "default" : "outline"}
                className={`w-full justify-between ${
                  faucet.primary 
                    ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90' 
                    : 'border-cyber-blue/30 hover:bg-cyber-blue/10'
                }`}
                onClick={() => handleFaucetClick(faucet.url)}
              >
                <div className="text-left">
                  <div className="font-medium">{faucet.name}</div>
                  <div className="text-xs opacity-80">{faucet.description}</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>How to use:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Click any faucet link above</li>
            <li>Paste your wallet address</li>
            <li>Complete verification and request test AVAX</li>
            <li>Wait 1-2 minutes for tokens to arrive</li>
            <li>Refresh page to see updated balance</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};