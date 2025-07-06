import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'

// Get environment variables - fallback to placeholder for development
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder'
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY || 'placeholder'

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId,
    }),
    coinbaseWallet({
      appName: 'Nodeifi DAO',
    }),
  ],
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
  },
})

// DAO Configuration
export const DAO_CONFIG = {
  address: '0x2c154014103b5EC2AC0337599fDe0F382d9fB52f' as const,
  network: 'base',
  chainId: base.id,
} as const