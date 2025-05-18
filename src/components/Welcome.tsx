import React from 'react';
import { Button, Card, Typography, Row, Col, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WalletOutlined, ImportOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>      <Card variant="outlined" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>          <img 
            src="/liquid-logo.svg" 
            alt="Liquid Network"
            style={{ height: '80px', margin: '0 auto 1rem' }}
          />
          <Title level={2} style={{ marginBottom: '0.5rem' }}>Welcome to Liquid Wallet</Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            A secure wallet for Bitcoin and USDT on the Liquid Network
          </Paragraph>
        </div>

        <Divider />
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card 
              variant="outlined"
              hoverable
              style={{ 
                height: '100%',
                backgroundColor: '#f7f9fc',
                borderRadius: '8px',
                textAlign: 'center'
              }}
              onClick={() => navigate('/create')}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <WalletOutlined style={{ fontSize: '32px', color: '#f7931a' }} />
                <Title level={4}>Create New Wallet</Title>
                <Paragraph>
                  Generate a new wallet with a secure recovery phrase
                </Paragraph>
                <Button type="primary" size="large">
                  Create Wallet
                </Button>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>            <Card
              variant="outlined"
              hoverable
              style={{ 
                height: '100%',
                backgroundColor: '#f7f9fc',
                borderRadius: '8px',
                textAlign: 'center'
              }}
              onClick={() => navigate('/import')}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <ImportOutlined style={{ fontSize: '32px', color: '#f7931a' }} />
                <Title level={4}>Import Wallet</Title>
                <Paragraph>
                  Restore your wallet using your recovery phrase
                </Paragraph>
                <Button size="large">
                  Import Wallet
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />
        
        <Paragraph style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
          Liquid Network is a sidechain-based settlement network for traders and exchanges, enabling faster, more confidential 
          Bitcoin transactions and the issuance of digital assets.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Welcome;
