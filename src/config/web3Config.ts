import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { mainnet, sepolia } from "wagmi/chains";

export const veryMainnet = {
  id: 4613,
  name: "Very Network Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "VERY",
    symbol: "VERY",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.verylabs.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Very Explorer",
      url: "https://www.veryscan.io",
    },
  },
  mainnet: true,
} as const;

export const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "your_project_id_here";

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Very Racing",
  description: "The ultimate blockchain racing experience on Very Network",
  url: "https://very-racing.com",
  icons: ["https://very-racing.com/icon.png"],
};

const chains = [veryMainnet, veryMainnet, mainnet, sepolia] as const;

// Create standard Wagmi config
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});
