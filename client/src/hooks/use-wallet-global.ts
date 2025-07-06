import { useState, useEffect, createContext, useContext } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  isConnecting: boolean;
  isOnBaseNetwork: boolean;
}

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkConnection: () => Promise<void>;
}

// Global wallet state management
class WalletManager {
  private listeners: Set<(state: WalletState) => void> = new Set();
  private state: WalletState = {
    isConnected: false,
    address: null,
    chainId: null,
    isConnecting: false,
    isOnBaseNetwork: false,
  };

  private BASE_CHAIN_ID = '0x2105'; // Base mainnet (8453 in decimal)

  constructor() {
    this.initializeEventListeners();
    this.checkInitialConnection().catch(error => {
      console.error('Initial wallet connection check failed:', error);
    });
  }

  private initializeEventListeners() {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on?.('accountsChanged', this.handleAccountsChanged.bind(this));
      window.ethereum.on?.('chainChanged', this.handleChainChanged.bind(this));
      window.ethereum.on?.('disconnect', this.handleDisconnect.bind(this));
    }
  }

  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.updateState({
        isConnected: false,
        address: null,
        chainId: null,
        isOnBaseNetwork: false,
      });
    } else {
      this.updateState({
        isConnected: true,
        address: accounts[0],
      });
    }
  };

  private handleChainChanged = (chainId: string) => {
    this.updateState({
      chainId,
      isOnBaseNetwork: chainId === this.BASE_CHAIN_ID,
    });
  };

  private handleDisconnect = () => {
    this.updateState({
      isConnected: false,
      address: null,
      chainId: null,
      isOnBaseNetwork: false,
    });
  };

  private updateState(updates: Partial<WalletState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  private async checkInitialConnection() {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (accounts.length > 0) {
        this.updateState({
          isConnected: true,
          address: accounts[0],
          chainId,
          isOnBaseNetwork: chainId === this.BASE_CHAIN_ID,
        });
      }
    } catch (error) {
      console.error('Error checking initial wallet connection:', error);
    }
  }

  async connectWallet(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.');
    }

    try {
      this.updateState({ isConnecting: true });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      this.updateState({
        isConnected: true,
        address: accounts[0],
        chainId,
        isOnBaseNetwork: chainId === this.BASE_CHAIN_ID,
      });

      // Auto-switch to Base network if not connected
      if (chainId !== this.BASE_CHAIN_ID) {
        await this.switchToBase();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      this.updateState({ isConnecting: false });
    }
  }

  private async switchToBase() {
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.BASE_CHAIN_ID }],
      });
      this.updateState({ 
        chainId: this.BASE_CHAIN_ID,
        isOnBaseNetwork: true 
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Chain not added, add Base network
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: this.BASE_CHAIN_ID,
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
        this.updateState({ 
          chainId: this.BASE_CHAIN_ID,
          isOnBaseNetwork: true 
        });
      } else {
        throw switchError;
      }
    }
  }

  disconnectWallet() {
    this.updateState({
      isConnected: false,
      address: null,
      chainId: null,
      isOnBaseNetwork: false,
    });
  }

  async checkConnection(): Promise<void> {
    await this.checkInitialConnection();
  }

  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.add(listener);
    // Send current state immediately
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): WalletState {
    return this.state;
  }
}

// Global wallet manager instance
const walletManager = new WalletManager();

// Hook for components to use wallet state
export function useWalletGlobal() {
  const [state, setState] = useState<WalletState>(walletManager.getState());

  useEffect(() => {
    const unsubscribe = walletManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    connectWallet: () => walletManager.connectWallet(),
    disconnectWallet: () => walletManager.disconnectWallet(),
    checkConnection: () => walletManager.checkConnection(),
  };
}