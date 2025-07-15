import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

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

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: '0.5',
    token: 'ETH',
    from: '0x742d35Cc6634C0532925a3b8D',
    timestamp: '2024-01-15 14:30',
    status: 'completed',
    hash: '0xabcd1234...'
  },
  {
    id: '2',
    type: 'sent',
    amount: '100',
    token: 'USDC',
    to: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    timestamp: '2024-01-14 10:15',
    status: 'completed',
    hash: '0xefgh5678...'
  },
  {
    id: '3',
    type: 'received',
    amount: '2.5',
    token: 'ETH',
    from: '0x742d35Cc6634C0532925a3b8D',
    timestamp: '2024-01-13 16:45',
    status: 'pending',
    hash: '0xijkl9012...'
  }
];

export const TransactionHistory = () => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-cyber-blue">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
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
                      {tx.type === 'sent' ? 'Sent' : 'Received'} {tx.amount} {tx.token}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tx.type === 'sent' ? `To: ${tx.to}` : `From: ${tx.from}`}
                    </div>
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
  );
};