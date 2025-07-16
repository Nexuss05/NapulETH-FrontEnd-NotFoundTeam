import { useState } from 'react';
import { useAccount, useSendTransaction, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RealTransactionForm = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendTransaction, isPending, error, isSuccess } = useSendTransaction();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    to: '',
    amount: '',
    token: 'AVAX'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.to || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendTransaction({
        to: formData.to as `0x${string}`,
        value: parseEther(formData.amount),
      });
      
      toast({
        title: "Transaction Sent!",
        description: `Successfully sent ${formData.amount} ${formData.token}`,
      });
      
      setFormData({ to: '', amount: '', token: 'AVAX' });
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-cyber-blue">Send Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to send transactions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-cyber-blue">Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyber-purple">
            {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 AVAX'}
          </div>
          <div className="text-sm text-muted-foreground">
            Available to send
          </div>
        </CardContent>
      </Card>

      {/* Send Form */}
      <Card className="bg-card/80 backdrop-blur-sm border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-cyber-blue">Send Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">Recipient Address</Label>
              <Input
                id="to"
                placeholder="0x..."
                value={formData.to}
                onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                className="bg-cyber-dark/30 border-cyber-blue/30 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.001"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-cyber-dark/30 border-cyber-blue/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select value={formData.token} onValueChange={(value) => setFormData(prev => ({ ...prev, token: value }))}>
                  <SelectTrigger className="bg-cyber-dark/30 border-cyber-blue/30">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAX">AVAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-500">Network Fee</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Estimated gas fee: ~$0.10 (Avalanche Fuji Testnet)
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">{error.message}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Transaction
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
