// src/components/ContractStatus.tsx
import { useYourContract } from '../hooks/useContract';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function ContractStatus() {
  const { address, isConnected } = useAccount();
  const { 
    greeting, 
    owner, 
    premium, 
    totalCounter, 
    userCounter,
    contractAddress 
  } = useYourContract();

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Contract Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to see contract data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Avalanche Contract Status</CardTitle>
        <Badge variant="secondary">{contractAddress}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>Network:</strong> Avalanche Fuji
        </div>
        <div>
          <strong>Greeting:</strong> {greeting || 'Loading...'}
        </div>
        <div>
          <strong>Owner:</strong> {owner || 'Loading...'}
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
        <div>
          <strong>Your Address:</strong> {address}
        </div>
      </CardContent>
    </Card>
  );
}
