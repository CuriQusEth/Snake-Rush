import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { BASE_DENIM_CONFIG } from './denim';

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  pollingInterval: BASE_DENIM_CONFIG.blockTimeMs, // 200ms for Denim 200ms canonical blocks
  transports: {
    [base.id]: http(BASE_DENIM_CONFIG.rpcUrl, {
      batch: true,
      retryCount: 3,
    }),
  },
});

