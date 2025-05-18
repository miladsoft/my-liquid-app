import React, { useState } from 'react';
import { Button, Card, Typography, Input, Alert, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ImportOutlined } from '@ant-design/icons';
import { WalletService } from '../services/wallet';
import { importWallet } from '../store/walletSlice';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ImportWallet: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [mnemonic, setMnemonic] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleMnemonicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMnemonic(e.target.value);
    setError(null);
  };
  
  const handleImport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate mnemonic
      if (!mnemonic.trim()) {
        setError('Please enter your recovery phrase');
        setLoading(false);
        return;
      }
      
      // Try to import the wallet
      const { address, mnemonic: validatedMnemonic } = WalletService.importWalletFromMnemonic(mnemonic.trim());
      
      // Get initial wallet data
      const assets = await WalletService.getWalletBalances(address);
      const transactions = await WalletService.getTransactionHistory(address);
      
      // Create wallet in Redux store
      dispatch(importWallet({
        address,
        mnemonic: validatedMnemonic,
        assets,
        transactions
      }));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Import error:', error);
      setError('Invalid recovery phrase. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Card variant="outlined" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ImportOutlined style={{ fontSize: '32px', color: '#f7931a', marginBottom: '1rem' }} />
          <Title level={2} style={{ marginBottom: '0.5rem' }}>Import Wallet</Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Restore your wallet using your 12-word recovery phrase
          </Paragraph>
        </div>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Enter your recovery phrase"
            description="Type your 12-word recovery phrase below, with each word separated by a space."
            type="info"
            showIcon
          />
          
          <TextArea
            rows={4}
            placeholder="Enter recovery phrase (12 words separated by spaces)"
            value={mnemonic}
            onChange={handleMnemonicChange}
            style={{ resize: 'none' }}
          />
          
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          )}
          
          <Button 
            type="primary" 
            block 
            size="large"
            onClick={handleImport}
            loading={loading}
            disabled={!mnemonic.trim()}
          >
            Import Wallet
          </Button>
          
          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/')}>
              Back to Welcome
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ImportWallet;
