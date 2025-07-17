// 在浏览器控制台运行这个来检查当前网络
console.log('当前网络 ID:', window.ethereum.chainId);
console.log('当前网络 ID (十进制):', parseInt(window.ethereum.chainId, 16));
console.log('期望网络 ID: 43113');

// 强制切换到 Avalanche Fuji
window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xA869' }], // 43113 in hex
}).catch((error) => {
  if (error.code === 4902) {
    // 网络不存在，先添加
    return window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0xA869',
        chainName: 'Avalanche Fuji C-Chain',
        nativeCurrency: {
          name: 'AVAX',
          symbol: 'AVAX',
          decimals: 18,
        },
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://testnet.snowtrace.io'],
      }],
    });
  }
});
