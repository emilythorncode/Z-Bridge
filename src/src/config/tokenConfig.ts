import {
  CONFIDENTIAL_ETH_TOKEN_ABI,
  CONFIDENTIAL_ETH_TOKEN_ADDRESS,
  CONFIDENTIAL_USDC_TOKEN_ABI,
  CONFIDENTIAL_USDC_TOKEN_ADDRESS,
  CONFIDENTIAL_ZAMA_TOKEN_ABI,
  CONFIDENTIAL_ZAMA_TOKEN_ADDRESS,
  ETH_TOKEN_ABI,
  ETH_TOKEN_ADDRESS,
  USDCT_TOKEN_ABI,
  USDCT_TOKEN_ADDRESS,
  ZAMA_TOKEN_ABI,
  ZAMA_TOKEN_ADDRESS,
} from "./contracts";

export type TokenKey = "zama" | "usdc" | "eth";

export type TokenConfig = {
  key: TokenKey;
  label: string;
  symbol: string;
  decimals: number;
  underlying: {
    address: `0x${string}`;
    abi: readonly unknown[];
  };
  confidential: {
    address: `0x${string}`;
    abi: readonly unknown[];
  };
};

export const TOKENS: TokenConfig[] = [
  {
    key: "zama",
    label: "Zama Test Token",
    symbol: "ZAMA",
    decimals: 6,
    underlying: {
      address: ZAMA_TOKEN_ADDRESS,
      abi: ZAMA_TOKEN_ABI,
    },
    confidential: {
      address: CONFIDENTIAL_ZAMA_TOKEN_ADDRESS,
      abi: CONFIDENTIAL_ZAMA_TOKEN_ABI,
    },
  },
  {
    key: "usdc",
    label: "USD Coin Test Token",
    symbol: "USDC",
    decimals: 6,
    underlying: {
      address: USDCT_TOKEN_ADDRESS,
      abi: USDCT_TOKEN_ABI,
    },
    confidential: {
      address: CONFIDENTIAL_USDC_TOKEN_ADDRESS,
      abi: CONFIDENTIAL_USDC_TOKEN_ABI,
    },
  },
  {
    key: "eth",
    label: "Ether Test Token",
    symbol: "ETH",
    decimals: 6,
    underlying: {
      address: ETH_TOKEN_ADDRESS,
      abi: ETH_TOKEN_ABI,
    },
    confidential: {
      address: CONFIDENTIAL_ETH_TOKEN_ADDRESS,
      abi: CONFIDENTIAL_ETH_TOKEN_ABI,
    },
  },
];
