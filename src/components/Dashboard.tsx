import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, List, Space, Tag, Skeleton, Empty } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SendOutlined, QrcodeOutlined, ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { updateBalances, updateTransactions } from '../store/walletSlice';
import { WalletService } from '../services/wallet';
import {  priceAPI, type Transaction } from '../services/api';
import type { RootState } from '../store';

const { Title, Paragraph, Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletData } = useSelector((state: RootState) => state.wallet);
  
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Load wallet data when component mounts
    loadWalletData();
    
    // Get BTC price
    loadBtcPrice();
    
    // Refresh wallet data every 30 seconds
    const intervalId = setInterval(loadWalletData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadWalletData = async () => {
    if (!walletData?.address) return;
    
    try {
      setLoading(true);
      
      // Get wallet balances
      const assets = await WalletService.getWalletBalances(walletData.address);
      
      // Get transaction history
      const transactions = await WalletService.getTransactionHistory(walletData.address);
      
      // Update Redux store
      dispatch(updateBalances(assets));
      dispatch(updateTransactions(transactions));
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadBtcPrice = async () => {
    try {
      const price = await priceAPI.getBitcoinPrice();
      setBtcPrice(price);
    } catch (error) {
      console.error('Error loading BTC price:', error);
    }
  };
  
  const renderTransactionType = (tx: Transaction) => {
    // Simple heuristic: If there are outputs to our address, it's incoming
    // If our address is in inputs, it's outgoing
    // This is simplified; a real app would need more sophisticated logic
    const isIncoming = tx.vout.some(output => 
      output.scriptpubkey_address === walletData?.address
    );
    
    if (isIncoming) {
      return (
        <Tag color="green" icon={<ArrowDownOutlined />}>
          Received
        </Tag>
      );
    } else {
      return (
        <Tag color="blue" icon={<ArrowUpOutlined />}>
          Sent
        </Tag>
      );
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };
    return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Wallet Dashboard</Title>
            <Paragraph type="secondary">
              Manage your Liquid Network assets
            </Paragraph>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadWalletData}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </div>
      
      <Row gutter={[16, 16]}>
        {walletData?.assets.map(asset => (
          <Col key={asset.assetId} xs={24} md={12}>
            <Card variant="outlined" style={{ height: '100%' }}>
              <Statistic
                title={asset.name}
                value={asset.balance}
                precision={8}
                valueStyle={{ color: asset.ticker === 'L-BTC' ? '#f7931a' : '#20bf6b' }}
                prefix={<Text style={{ marginRight: '8px' }}>{asset.ticker}</Text>}
                suffix={
                  asset.ticker === 'L-BTC' && btcPrice ? (
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      ${(asset.balance * btcPrice).toFixed(2)} USD
                    </Text>
                  ) : null
                }
              />
              <div style={{ marginTop: '16px' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => navigate('/send', { state: { assetId: asset.assetId } })}
                  >
                    Send
                  </Button>
                  <Button
                    icon={<QrcodeOutlined />}
                    onClick={() => navigate('/receive')}
                  >
                    Receive
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
        <Card 
        title="Recent Transactions" 
        variant="outlined"
        style={{ marginTop: '24px' }}
        extra={
          <Button type="link" onClick={loadWalletData} disabled={loading}>
            Refresh
          </Button>
        }
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : walletData?.transactions && walletData.transactions.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={walletData.transactions.slice(0, 10)}
            renderItem={(tx: Transaction) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => window.open(`https://blockstream.info/liquid/tx/${tx.txid}`, '_blank')}
                  >
                    View
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={renderTransactionType(tx)}
                  title={
                    <span>
                      {tx.txid.slice(0, 8)}...{tx.txid.slice(-8)}
                    </span>
                  }
                  description={
                    <Space>
                      <ClockCircleOutlined />
                      {tx.status.confirmed ? formatDate(tx.status.block_time || 0) : 'Pending'}
                    </Space>
                  }
                />
                <div>
                  <Text strong>{tx.vout[0]?.value || 0} L-BTC</Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="No transactions found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
