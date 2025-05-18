import axios from 'axios';

// Base URLs for different API services
const BLOCKSTREAM_API = 'https://blockstream.info/liquid/api';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Interface for transaction data
export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    };
    scriptsig: string;
    scriptsig_asm: string;
    witness?: string[];
    is_coinbase: boolean;
    sequence: number;
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address?: string;
    value: number;
  }>;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

// Interface for address data
export interface AddressInfo {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

// Interface for asset data
export interface Asset {
  asset_id: string;
  issuance_txin: {
    txid: string;
    vin: number;
  };
  issuance_prevout: {
    txid: string;
    vout: number;
  };
  reissuance_token: string;
  contract_hash: string;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  chain_stats: {
    tx_count: number;
    issuance_count: number;
    issued_amount: number;
    burned_amount: number;
    has_blinded_issuances: boolean;
    reissuance_tokens: number;
    burned_reissuance_tokens: number;
  };
  mempool_stats: {
    tx_count: number;
    issuance_count: number;
    issued_amount: number;
    burned_amount: number;
    has_blinded_issuances: boolean;
    reissuance_tokens: number;
    burned_reissuance_tokens: number;
  };
  contract: {
    entity: {
      domain: string;
    };
    issuer_pubkey: string;
    name: string;
    precision: number;
    ticker: string;
    version: number;
  };
  name?: string;
  ticker?: string;
  precision?: number;
}

// Basic asset data for common assets on Liquid
export const LIQUID_ASSETS = {
  // Bitcoin in Liquid
  LBTC: {
    asset_id: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
    name: 'Liquid Bitcoin',
    ticker: 'L-BTC',
    precision: 8,
    type: 'bitcoin'
  },  // Tether USD in Liquid
  USDT: {
    asset_id: 'cebf41c5c507b05e1c6c999b352fba44ac96e6d6e15b817cdb3a1aa1c5b7f08f',
    name: 'Tether USD',
    ticker: 'USDt',
    precision: 8,
    type: 'stablecoin'
  }
};

// Bitcoin API functions
export const bitcoinAPI = {
  // Get address information
  getAddressInfo: async (address: string): Promise<AddressInfo> => {
    try {
      const response = await axios.get(`${BLOCKSTREAM_API}/address/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address info:', error);
      throw error;
    }
  },

  // Get address transactions
  getAddressTransactions: async (address: string): Promise<Transaction[]> => {
    try {
      const response = await axios.get(`${BLOCKSTREAM_API}/address/${address}/txs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address transactions:', error);
      throw error;
    }
  },

  // Get transaction details
  getTransaction: async (txid: string): Promise<Transaction> => {
    try {
      const response = await axios.get(`${BLOCKSTREAM_API}/tx/${txid}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Get fee estimates
  getFeeEstimates: async (): Promise<Record<string, number>> => {
    try {
      const response = await axios.get(`${BLOCKSTREAM_API}/fee-estimates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fee estimates:', error);
      throw error;
    }
  },
  
  // Broadcast a transaction
  broadcastTransaction: async (txHex: string): Promise<string> => {
    try {
      const response = await axios.post(`${BLOCKSTREAM_API}/tx`, txHex);
      return response.data; // Transaction ID
    } catch (error) {
      console.error('Error broadcasting transaction:', error);
      throw error;
    }
  },

  // Get asset info
  getAssetInfo: async (assetId: string): Promise<Asset> => {
    try {
      const response = await axios.get(`${BLOCKSTREAM_API}/asset/${assetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset info:', error);
      throw error;
    }
  },
};

// Price API functions
export const priceAPI = {
  // Get price of LBTC in USD
  getBitcoinPrice: async (): Promise<number> => {
    try {
      const response = await axios.get(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd`);
      return response.data.bitcoin.usd;
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      throw error;
    }
  },

  // Get price of multiple assets
  getPrices: async (ids: string[], currencies: string[] = ['usd']): Promise<Record<string, Record<string, number>>> => {
    try {
      const response = await axios.get(
        `${COINGECKO_API}/simple/price?ids=${ids.join(',')}&vs_currencies=${currencies.join(',')}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }
};
