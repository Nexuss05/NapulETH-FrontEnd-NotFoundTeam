import React from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Clock, CheckCircle } from 'lucide-react';

export function RealTransactionHistory() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // 你的真实交易记录
  const realTransactions = [
    {
      hash: '0xb3014ab3c175153e202b22696afbafe7e45802ceeef52d62556173bc34c39336',
      type: 'Contract Deployment',
      to: '0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8',
      amount: '0 AVAX',
      fee: '0.000000000001065486 AVAX',
      status: 'Success',
      date: '2025-07-15',
      time: '22:50:18',
      network: 'Avalanche Fuji'
    }
  ];

  if (!isConnected) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to view transaction history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Real Transaction History
            <Badge variant="outline">
              {chain?.name || 'Unknown Network'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>Your Address:</strong> {address}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Network:</strong> {chain?.name} (Chain ID: {chain?.id})
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle>Your Avalanche Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realTransactions.map((tx, index) => (
              <div key={index} className="border rounded-lg p-4 bg-cyber-dark/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-cyber-blue">{tx.type}</span>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {tx.status}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div><strong>Contract:</strong> {tx.to}</div>
                  <div><strong>Amount:</strong> {tx.amount}</div>
                  <div><strong>Gas Fee:</strong> {tx.fee}</div>
                  <div><strong>Date:</strong> {tx.date} {tx.time}</div>
                  <div className="flex items-center gap-2">
                    <strong>Transaction:</strong> 
                    <a 
                      href={`https://testnet.snowtrace.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-blue hover:text-cyber-purple flex items-center gap-1"
                    >
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center py-4">
              <a 
                href={`https://testnet.snowtrace.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:text-cyber-purple flex items-center justify-center gap-2"
              >
                View all transactions on Snowtrace
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
