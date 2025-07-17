import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSendTransaction, useAccount, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';

export const RealTransactionForm = () => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const { sendTransaction, isPending, data: hash } = useSendTransaction();

  // Debug hash to understand its type
  React.useEffect(() => {
    if (hash) {
      console.log('Transaction hash data:', hash, 'Type:', typeof hash);
    }
  }, [hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
        toast({
          title: "Invalid Address",
          description: "Please enter a valid Ethereum address",
          variant: "destructive"
        });
        return;
      }

      // Check balance
      const amountWei = parseEther(amount);
      if (balance && amountWei > balance.value) {
        const currentBalance = formatEther(balance.value);
        toast({
          title: "Insufficient Balance",
          description: `Your balance of ${currentBalance} AVAX is insufficient for this transaction. Visit the Learn tab to get test AVAX.`,
          variant: "destructive"
        });
        return;
      }

      await sendTransaction({
        to: to as `0x${string}`,
        value: amountWei,
      });

      toast({
        title: "Transaction Submitted!",
        description: `Sending ${amount} AVAX to ${to.slice(0, 6)}...${to.slice(-4)}`,
      });

      // Clear form
      setTo('');
      setAmount('');
    } catch (error: unknown) {
      console.error('Transaction error:', error);
      const errorMessage = (error as Error)?.message || "Failed to send transaction";
      
      // Check for insufficient funds error
      if (errorMessage.includes('insufficient funds') || 
          errorMessage.includes('not enough')) {
        toast({
          title: "Insufficient Balance",
          description: "Your account doesn't have enough AVAX to pay for gas fees. Get test AVAX from the Learn tab.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-cyber-blue flex items-center gap-2">
          <Send className="w-5 h-5" />
          Send AVAX (Avalanche Fuji)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Balance Display */}
          <div className="p-3 rounded-lg bg-cyber-dark/30 border border-cyber-blue/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Balance:</span>
              <span className="font-mono text-cyber-blue">
                {balance ? `${formatEther(balance.value)} AVAX` : '0.00 AVAX'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Recipient Address</Label>
            <Input
              id="to"
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-cyber-dark/30 border-cyber-blue/30 font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (AVAX)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-cyber-dark/30 border-cyber-blue/30 pr-16"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                AVAX
              </span>
            </div>
          </div>

          {/* Network Info */}
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Avalanche Fuji Testnet</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Network: Avalanche Fuji (43113) • Gas fees paid in AVAX
            </p>
          </div>

          {/* Transaction Hash Display */}
          {hash && typeof hash === 'string' && hash.length > 10 && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-400">Transaction Submitted!</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-muted-foreground">
                  {hash.slice(0, 10)}...{hash.slice(-8)}
                </span>
                <a
                  href={`https://testnet.snowtrace.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isPending || !address}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
          >
            {isPending ? 'Sending...' : 'Send AVAX'}
            <Send className="w-4 h-4 ml-2" />
          </Button>

          {!address && (
            <p className="text-xs text-center text-muted-foreground">
              Please connect your wallet to send transactions
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};