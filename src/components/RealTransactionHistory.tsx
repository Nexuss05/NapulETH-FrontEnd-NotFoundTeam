import { useAccount, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Clock, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

// 你的真实交易记录 + 一些模拟数据保持界面完整
const realTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: '0',
    token: 'AVAX',
    to: '0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8',
    timestamp: '2025-07-15 22:50',
    status: 'completed',
    hash: '0xb3014ab3c175153e202b22696afbafe7e45802ceeef52d62556173bc34c39336'
  },
  {
    id: '2',
    type: 'received',
    amount: '2.0',
    token: 'AVAX',
    from: 'Faucet',
    timestamp: '2025-07-15 22:45',
    status: 'completed',
    hash: '0xfaucet1234...'
  }
];

export const RealTransactionHistory = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const getExplorerUrl = (hash: string) => {
    if (chainId === 43113) { // Avalanche Fuji
      return `https://testnet.snowtrace.io/tx/${hash}`;
    }
    return `https://etherscan.io/tx/${hash}`;
  };

  if (!isConnected) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-cyber-blue">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to view transaction history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Info Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-cyber-blue">Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>Address:</strong> <span className="font-mono">{address}</span></div>
            <div><strong>Network:</strong> {chainId === 43113 ? 'Avalanche Fuji Testnet' : `Chain ${chainId}`}</div>
            <div><strong>Real Contract:</strong> <span className="font-mono text-cyber-blue">0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-cyber-blue">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realTransactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-lg bg-cyber-dark/30 border border-cyber-blue/10 hover:border-cyber-blue/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'sent' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {tx.type === 'sent' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.type === 'sent' ? 'Contract Deploy' : 'Received'} {tx.amount} {tx.token}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tx.type === 'sent' ? `To: ${tx.to}` : `From: ${tx.from}`}
                      </div>
                      {tx.hash.startsWith('0xb3014') && (
                        <a 
                          href={getExplorerUrl(tx.hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyber-blue hover:text-cyber-purple flex items-center gap-1 mt-1"
                        >
                          View on Snowtrace <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                      {tx.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {tx.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
