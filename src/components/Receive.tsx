import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Tabs, Input, Space, Divider, message, QRCode } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons';
import type { RootState } from '../store';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const Receive: React.FC = () => {
  const navigate = useNavigate();
  const { walletData } = useSelector((state: RootState) => state.wallet);
  const [selectedAsset, setSelectedAsset] = useState<string>('L-BTC');
  const [amount, setAmount] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  
  useEffect(() => {
    if (walletData?.address) {
      generateQrValue();
    }
  }, [walletData, selectedAsset, amount]);
  
  const generateQrValue = () => {
    if (!walletData?.address) return;
    
    let qrString = walletData.address;
    
    // For a proper implementation, this would create a BIP21 URI with asset info
    if (amount) {
      qrString += `?amount=${amount}`; // simplified
    }
    
    setQrValue(qrString);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('Address copied to clipboard');
      })
      .catch((err) => {
        message.error('Failed to copy: ' + err);
      });
  };
  
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
          <QrcodeOutlined style={{ fontSize: '32px', color: '#1677ff', marginBottom: '16px' }} />
          <Title level={3}>Receive Assets</Title>
          <Paragraph type="secondary">
            Share your address to receive payments on the Liquid Network
          </Paragraph>
        </div>
        
        <Divider />
        
        <Tabs defaultActiveKey="address" centered>
          <TabPane tab="Address" key="address">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: 220,
                height: 220,
                background: '#fff',
                padding: 10,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                marginBottom: '24px'
              }}>
                {walletData?.address && (
                  <QRCode 
                    value={qrValue} 
                    size={200}
                    bordered={false}
                    errorLevel="H"
                  />
                )}
              </div>
              
              <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }}>
                <Text strong>Your Liquid Address:</Text>
                <Input.Group compact>
                  <Input
                    style={{ width: 'calc(100% - 32px)' }}
                    value={walletData?.address}
                    readOnly
                  />
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(walletData?.address || '')}
                  />
                </Input.Group>
              </Space>
              
              <div style={{ marginBottom: 16 }}>
                <Space direction="horizontal">
                  <Text>Asset:</Text>
                  <Button 
                    type={selectedAsset === 'L-BTC' ? 'primary' : 'default'} 
                    onClick={() => setSelectedAsset('L-BTC')}
                  >
                    L-BTC
                  </Button>
                  <Button
                    type={selectedAsset === 'USDt' ? 'primary' : 'default'}
                    onClick={() => setSelectedAsset('USDt')}
                  >
                    USDt
                  </Button>
                </Space>
              </div>
              
              <div style={{ marginBottom: 16, width: '100%' }}>
                <Text>Amount (optional):</Text>
                <Input
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  suffix={selectedAsset}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Paragraph type="secondary">
            Send only Bitcoin (L-BTC) or Tether (USDt) on the Liquid Network to this address.
            Sending other assets may result in loss of funds.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default Receive;
