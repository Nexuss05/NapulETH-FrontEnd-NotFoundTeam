// src/hooks/useContract.ts
import { useContract, useAccount, useContractRead, useContractWrite } from 'wagmi';
import { ethers } from 'ethers';
import { YourContract } from '../contracts/YourContract';

export function useYourContract() {
  const { address } = useAccount();
  
  // 读取合约状态
  const { data: greeting } = useContractRead({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'greeting',
  });

  const { data: owner } = useContractRead({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'owner',
  });

  const { data: premium } = useContractRead({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'premium',
  });

  const { data: totalCounter } = useContractRead({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'totalCounter',
  });

  const { data: userCounter } = useContractRead({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'userGreetingCounter',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // 写入合约
  const { write: setGreeting, isLoading: isSettingGreeting } = useContractWrite({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'setGreeting',
  });

  const { write: withdraw, isLoading: isWithdrawing } = useContractWrite({
    address: YourContract.address as `0x${string}`,
    abi: YourContract.abi,
    functionName: 'withdraw',
  });

  return {
    // 读取数据
    greeting,
    owner,
    premium,
    totalCounter,
    userCounter,
    // 写入函数
    setGreeting,
    withdraw,
    // 状态
    isSettingGreeting,
    isWithdrawing,
    // 合约地址
    contractAddress: YourContract.address,
  };
}
