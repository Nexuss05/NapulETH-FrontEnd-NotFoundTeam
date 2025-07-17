// src/components/ContractDebug.tsx
import { useYourContract } from '../hooks/useContract';
import { useAccount, useNetwork } from 'wagmi';

export function ContractDebug() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { greeting, totalCounter, contractAddress } = useYourContract();

  if (!isConnected) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <div className="font-bold mb-2">🔗 Contract Debug</div>
      <div>Network: {chain?.name || 'Unknown'}</div>
      <div>Chain ID: {chain?.id || 'Unknown'}</div>
      <div>Contract: {contractAddress}</div>
      <div>Greeting: {greeting || 'Loading...'}</div>
      <div>Counter: {totalCounter?.toString() || 'Loading...'}</div>
      <div className={`font-bold ${chain?.id === 43113 ? 'text-green-400' : 'text-red-400'}`}>
        {chain?.id === 43113 ? '✅ Avalanche Fuji' : '❌ Wrong Network'}
      </div>
    </div>
  );
}
