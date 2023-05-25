import { sendAnalyticsEvent } from '@uniswap/analytics'
import { WalletConnect, WalletConnectConstructorArgs } from '@web3-react/walletconnect-v2'
import { SupportedChainId } from 'constants/chains'

import { RPC_URLS } from '../constants/networks'

// Avoid testing for the best URL by only passing a single URL per chain.
// Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
  (map, [chainId, urls]) => ({
    ...map,
    [chainId]: urls[0],
  }),
  {}
)

export class WalletConnectV2Popup extends WalletConnect {
  ANALYTICS_EVENT = 'Wallet Connect QR Scan'
  constructor({
    actions,
    onError,
    qrcode = true,
  }: Omit<WalletConnectConstructorArgs, 'options'> & { qrcode?: boolean }) {
    //  options:
    //    projectId: string;
    //    chains: number[];
    //    optionalChains?: number[];
    //    methods?: string[];
    //    optionalMethods?: string[];
    //    events?: string[];
    //    optionalEvents?: string[];
    //    rpcMap?: EthereumRpcMap;
    //    metadata?: Metadata;
    //    showQrModal: boolean;
    //    qrModalOptions?: QrModalOptions;
    super({
      actions,
      options: {
        projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string,
        optionalChains: Object.keys(RPC_URLS_WITHOUT_FALLBACKS).map((key) => Number(key)),
        chains: [SupportedChainId.MAINNET],
        showQrModal: qrcode,
        rpcMap: RPC_URLS_WITHOUT_FALLBACKS,
      },
      onError,
    })
  }

  activate(chainId?: number) {
    sendAnalyticsEvent(this.ANALYTICS_EVENT)
    return super.activate(chainId)
  }
}