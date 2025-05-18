import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Form, Input, Button, Select, InputNumber, 
  Divider, Alert, Result, Space
} from 'antd';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { SendOutlined, ArrowLeftOutlined  } from '@ant-design/icons';
import { WalletService } from '../services/wallet';
import { bitcoinAPI } from '../services/api';
import type { Asset } from '../services/wallet';
import type { RootState } from '../store';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const Send: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { walletData } = useSelector((state: RootState) => state.wallet);
  
  const [form] = Form.useForm();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feeRate, setFeeRate] = useState<number>(1);
  const [success, setSuccess] = useState(false);
  const [txid, setTxid] = useState<string>('');
  
  // This would be used to pre-select asset from Dashboard
  const initialAssetId = location.state?.assetId;
  
  useEffect(() => {
    if (initialAssetId && walletData?.assets) {
      const asset = walletData.assets.find(a => a.assetId === initialAssetId);
      if (asset) {
        setSelectedAsset(asset);
        form.setFieldsValue({ asset: asset.assetId });
      }
    }
    
    // Get fee estimates
    loadFeeEstimates();
  }, [initialAssetId, walletData]);
  
  const loadFeeEstimates = async () => {
    try {
      const estimates = await bitcoinAPI.getFeeEstimates();
      // Use the 6-block target fee rate (medium priority)
      if (estimates['6']) {
        setFeeRate(estimates['6']);
      }
    } catch (error) {
      console.error('Error loading fee estimates:', error);
    }
  };
  
  const handleAssetChange = (assetId: string) => {
    const asset = walletData?.assets.find(a => a.assetId === assetId) || null;
    setSelectedAsset(asset);
  };
  
  const calculateFee = () => {
    // Simplified fee calculation: base fee for a typical transaction
    // In a real app, this would calculate based on transaction size
    return 0.0001; // 10000 satoshis, approximately
  };
  
  const handleSubmit = async (values: any) => {
    if (!walletData?.address || !selectedAsset) {
      setError('Wallet not loaded correctly');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { recipient, amount } = values;
      const fee = calculateFee(); // This would be calculated based on tx size
      
      // Check if balance is sufficient
      if (selectedAsset.balance < (amount + fee)) {
        setError('Insufficient balance');
        setLoading(false);
        return;
      }
      
      // Send the transaction
      const result = await WalletService.sendTransaction(
        walletData.address,
        recipient,
        amount,
        selectedAsset.assetId,
        fee
      );
      
      setTxid(result.txid);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error sending transaction:', error);
      setError('Failed to send transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // If transaction was successful, show success result
  if (success) {
    return (
      <Result
        status="success"
        title="Transaction Sent Successfully!"
        subTitle={`Transaction ID: ${txid.slice(0, 8)}...${txid.slice(-8)}`}
        extra={[
          <Button 
            type="primary" 
            key="dashboard" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>,
          <Button 
            key="explorer" 
            onClick={() => window.open(`https://blockstream.info/liquid/tx/${txid}`, '_blank')}
          >
            View on Explorer
          </Button>,
        ]}
      />
    );
  }
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
      
      <Card variant="outlined" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <SendOutlined style={{ fontSize: '32px', color: '#1677ff', marginBottom: '16px' }} />
          <Title level={3}>Send Assets</Title>
          <Paragraph type="secondary">
            Send your Liquid Network assets to another address
          </Paragraph>
        </div>
        
        <Divider />
        
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
            closable
            onClose={() => setError(null)}
          />
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ asset: initialAssetId }}
        >
          <Form.Item
            label="Asset"
            name="asset"
            rules={[{ required: true, message: 'Please select an asset' }]}
          >
            <Select placeholder="Select asset" onChange={handleAssetChange}>
              {walletData?.assets.map(asset => (
                <Option key={asset.assetId} value={asset.assetId}>
                  {asset.name} ({asset.ticker}) - Balance: {asset.balance}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Recipient Address"
            name="recipient"
            rules={[
              { required: true, message: 'Please enter a recipient address' },
              { 
                pattern: /^[a-zA-Z0-9]+$/, 
                message: 'Please enter a valid Liquid address' 
              }
            ]}
          >
            <Input placeholder="Enter Liquid address" />
          </Form.Item>
          
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: 'Please enter an amount' },
              { 
                type: 'number', 
                min: 0.00000001, 
                message: 'Amount must be greater than 0' 
              },
              {
                validator: (_, value) => {
                  if (!selectedAsset || !value) return Promise.resolve();
                  
                  const fee = calculateFee();
                  const totalNeeded = value + (selectedAsset.ticker === 'L-BTC' ? fee : 0);
                  
                  return selectedAsset.balance >= totalNeeded
                    ? Promise.resolve()
                    : Promise.reject(new Error('Insufficient balance'));
                }
              }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Enter amount" 
              precision={8}
              max={selectedAsset?.balance || 0}
              addonAfter={selectedAsset?.ticker || ''}
            />
          </Form.Item>
          
          {selectedAsset?.ticker === 'L-BTC' && (
            <Form.Item label="Transaction Fee">
              <Space>
                <Input 
                  value={`${calculateFee()} L-BTC`}
                  disabled
                  addonBefore="Network Fee"
                  style={{ width: '200px' }}
                />
                <Text type="secondary">
                  {feeRate.toFixed(1)} sat/vB
                </Text>
              </Space>
            </Form.Item>
          )}
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SendOutlined />}
              block
            >
              Send Transaction
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Send;
