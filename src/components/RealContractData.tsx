import React from 'react';
import { useYourContract } from '../hooks/useContract';
import { useAccount, useNetwork } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function RealContractData() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { 
    greeting, 
    owner, 
    premium, 
    totalCounter, 
    userCounter,
    contractAddress,
    setGreeting,
    isSettingGreeting
  } = useYourContract();

  const [newGreeting, setNewGreeting] = React.useState('');

  const handleSetGreeting = () => {
    if (newGreeting && setGreeting) {
      setGreeting({
        args: [newGreeting],
        value: 0, // 可以发送 ETH
      });
      setNewGreeting('');
    }
  };

  if (!isConnected) {
    return null;
  }

  const isCorrectNetwork = chain?.id === 43113;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 网络状态 */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Network Status
            <Badge variant={isCorrectNetwork ? "default" : "destructive"}>
              {isCorrectNetwork ? '✅ Avalanche Fuji' : '❌ Wrong Network'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Chain:</strong> {chain?.name || 'Unknown'}
          </div>
          <div>
            <strong>Chain ID:</strong> {chain?.id || 'Unknown'}
          </div>
          <div>
            <strong>Contract:</strong> 
            <span className="font-mono text-xs block">{contractAddress}</span>
          </div>
        </CardContent>
      </Card>

      {/* 合约数据 */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle>Contract Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Greeting:</strong> {greeting || 'Loading...'}
          </div>
          <div>
            <strong>Owner:</strong> 
            <span className="font-mono text-xs block">{owner || 'Loading...'}</span>
          </div>
          <div>
            <strong>Premium:</strong> {premium ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Total Counter:</strong> {totalCounter?.toString() || 'Loading...'}
          </div>
          <div>
            <strong>Your Counter:</strong> {userCounter?.toString() || '0'}
          </div>
        </CardContent>
      </Card>

      {/* 交互功能 */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20 md:col-span-2">
        <CardHeader>
          <CardTitle>Interact with Contract</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="newGreeting">New Greeting</Label>
              <Input
                id="newGreeting"
                value={newGreeting}
                onChange={(e) => setNewGreeting(e.target.value)}
                placeholder="Enter new greeting..."
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSetGreeting}
                disabled={!newGreeting || isSettingGreeting || !isCorrectNetwork}
                className="bg-gradient-to-r from-cyber-blue to-cyber-purple"
              >
                {isSettingGreeting ? 'Setting...' : 'Set Greeting'}
              </Button>
            </div>
          </div>
          
          {!isCorrectNetwork && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                Please switch to Avalanche Fuji network to interact with the contract.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
