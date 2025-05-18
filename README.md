# Liquid Web Wallet

A professional web-based wallet for the Liquid Network that supports L-BTC and USDT. Built with React, Vite, and TypeScript.

## Features

- ✅ Generate HD wallet with BIP39 mnemonic phrases
- ✅ Import existing wallets using recovery phrases
- ✅ Display Confidential addresses
- ✅ Show L-BTC and USDT balances (using Blockstream API)
- ✅ Receive funds via QR code
- ✅ Send transactions
- ✅ Sign and broadcast transactions from the browser
- ✅ Modern UI with Ant Design

## Asset IDs

- **L-BTC**: `6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d`
- **USDt**: `cebf41c5c507b05e1c6c999b352fba44ac96e6d6e15b817cdb3a1aa1c5b7f08f`

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + TypeScript |
| UI Library | Ant Design |
| Wallet | BIP39 for mnemonic handling |
| API | Blockstream Esplora for Liquid |
| State Management | Redux Toolkit |

## Project Structure

```
liquid-wallet/
├── src/
│   ├── services/
│   │   ├── api.ts        ← API integration with Blockstream 
│   │   ├── wallet.ts     ← HD Wallet functionality
│   │   └── builder.ts    ← Transaction builder
│   ├── store/
│   │   ├── index.ts      ← Redux store setup
│   │   └── walletSlice.ts ← Wallet state management
│   ├── components/
│   │   ├── Welcome.tsx   ← Landing page
│   │   ├── CreateWallet.tsx ← Create new wallet flow
│   │   ├── ImportWallet.tsx ← Import existing wallet
│   │   ├── Dashboard.tsx ← Main wallet interface
│   │   ├── Send.tsx      ← Send assets form
│   │   └── Receive.tsx   ← Receive funds with QR
│   └── App.tsx           ← Main application with routes
├── public/
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Security Notes

This wallet is for demonstration purposes. For production use:

1. Never store private keys in browser localStorage for long periods
2. Consider using a hardware wallet for signing transactions
3. Add additional security measures like encryption and PIN protection
