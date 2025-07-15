import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TransactionForm = () => {
  const [formData, setFormData] = useState({
    to: '',
    amount: '',
    token: 'ETH'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate transaction
    setTimeout(() => {
      toast({
        title: "Transaction Sent!",
        description: `Successfully sent ${formData.amount} ${formData.token} to ${formData.to}`,
      });
      setFormData({ to: '', amount: '', token: 'ETH' });
      setIsLoading(false);
    }, 2000);
  };

  return (
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
              className="bg-cyber-dark/30 border-cyber-blue/30"
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
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
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
              Estimated gas fee: ~$2.50 (0.001 ETH)
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-blue/90 hover:to-cyber-purple/90"
          >
            {isLoading ? 'Sending...' : 'Send Transaction'}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};