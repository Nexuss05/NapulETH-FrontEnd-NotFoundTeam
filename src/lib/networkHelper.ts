// 网络助手函数
export const AVALANCHE_FUJI_CHAIN_ID = 43113;
export const AVALANCHE_FUJI_CHAIN_ID_HEX = '0xA869';

export const avalancheFujiConfig = {
  chainId: AVALANCHE_FUJI_CHAIN_ID_HEX,
  chainName: 'Avalanche Fuji C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io'],
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const addAvalancheFujiNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // 首先尝试切换到网络
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: AVALANCHE_FUJI_CHAIN_ID_HEX }],
    });
  } catch (switchError: any) {
    // 如果网络不存在 (error code 4902)，则添加网络
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [avalancheFujiConfig],
        });
      } catch (addError: any) {
        // 处理用户拒绝添加网络的情况
        if (addError.code === 4001 || addError.code === 4100) {
          throw new Error('User rejected network addition. Please add Avalanche Fuji network manually in MetaMask.');
        }
        throw new Error(`Failed to add network: ${addError.message || 'Unknown error'}`);
      }
    } else if (switchError.code === 4001 || switchError.code === 4100) {
      // 用户拒绝切换网络
      throw new Error('User rejected network switch. Please switch to Avalanche Fuji network manually in MetaMask.');
    } else {
      throw switchError;
    }
  }
};

export const checkCurrentNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) {
    return false;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === AVALANCHE_FUJI_CHAIN_ID_HEX;
  } catch (error) {
    console.error('Failed to check network:', error);
    return false;
  }
};