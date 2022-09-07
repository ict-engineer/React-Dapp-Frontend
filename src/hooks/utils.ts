import { SUPPORTED_CHAINS } from "./chains";
import { IChainData } from "./types";

export function getChainData(chainId: number): IChainData {
    const chainData = SUPPORTED_CHAINS.filter((chain: any) => chain.chain_id === chainId)[0];

    if (!chainData) {
      throw new Error("ChainId missing or not supported");
    }

    const API_KEY = "ANGULAR_APP_INFURA_PROJECT_ID";

    if (
      chainData.rpc_url.includes("infura.io") &&
      chainData.rpc_url.includes("%API_KEY%") &&
      API_KEY
    ) {
      const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

      return {
        ...chainData,
        rpc_url: rpcUrl,
      };
    }

    return chainData;
}

export function sanitizeHex(hex: string): string {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") {
    return "";
  }
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
}
