import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Asset, WalletData } from '../services/wallet';

interface WalletState {
  walletData: WalletData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: WalletState = {
  walletData: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    createWallet: (state, action: PayloadAction<WalletData>) => {
      state.walletData = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    importWallet: (state, action: PayloadAction<WalletData>) => {
      state.walletData = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    updateBalances: (state, action: PayloadAction<Asset[]>) => {
      if (state.walletData) {
        state.walletData.assets = action.payload;
      }
    },
    
    updateTransactions: (state, action: PayloadAction<any[]>) => {
      if (state.walletData) {
        state.walletData.transactions = action.payload;
      }
    },
    
    logout: (state) => {
      state.walletData = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  createWallet,
  importWallet,
  updateBalances,
  updateTransactions,
  logout,
} = walletSlice.actions;

export default walletSlice.reducer;
