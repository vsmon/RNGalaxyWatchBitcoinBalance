export interface storedParams {
  bitcoinParams?: {
    address: string[];
    investedAmount: number;
    currency: string;
    darkMode: boolean;
  };
  Error?: string;
}

export interface storedData {
  bitcoinData?: {
    bitcoinPrice: number;
    bitcoinBalance: number;
    bitcoinProfit: number;
  };
  Error?: string;
}
