import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { Buffer } from 'buffer'
import { suppressAntDesignWarnings } from './utils/antdCompat'

// Polyfill Buffer for bip39 library
window.Buffer = Buffer

// Suppress Ant Design React 19 compatibility warnings
suppressAntDesignWarnings()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f7931a', // Bitcoin orange
            borderRadius: 6,
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
