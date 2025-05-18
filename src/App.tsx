import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Welcome from './components/Welcome'
import CreateWallet from './components/CreateWallet'

import './App.css'
import { Layout } from 'antd'
import Dashboard from './components/Dashboard'
import ImportWallet from './components/ImportWallet'
import Receive from './components/Receive'
import Send from './components/Send'
import ErrorBoundary from './components/ErrorBoundary'
import type { RootState } from './store'

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.wallet);

  // Wrap components with ErrorBoundary
  const withErrorBoundary = (component: React.ReactNode) => (
    <ErrorBoundary>{component}</ErrorBoundary>
  );

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : withErrorBoundary(<Welcome />)
      } />
      <Route path="/create" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : withErrorBoundary(<CreateWallet />)
      } />
      <Route path="/import" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : withErrorBoundary(<ImportWallet />)
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        isAuthenticated ? withErrorBoundary(<Layout><Dashboard /></Layout>) : <Navigate to="/" replace />
      } />
      <Route path="/send" element={
        isAuthenticated ? withErrorBoundary(<Layout><Send /></Layout>) : <Navigate to="/" replace />
      } />
      <Route path="/receive" element={
        isAuthenticated ? withErrorBoundary(<Layout><Receive /></Layout>) : <Navigate to="/" replace />
      } />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
