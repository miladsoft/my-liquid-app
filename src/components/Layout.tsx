import React from 'react';
import { Layout as AntdLayout, Menu, Typography, Dropdown, Button, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DashboardOutlined,
  SendOutlined,
  QrcodeOutlined,
  LogoutOutlined,
  DownOutlined,
  UserOutlined
} from '@ant-design/icons';
import { logout } from '../store/walletSlice';
import type { MenuProps } from 'antd';
import type { RootState } from '../store';

const { Header, Content, Footer } = AntdLayout;
const { Title, Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { walletData } = useSelector((state: RootState) => state.wallet);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/send',
      icon: <SendOutlined />,
      label: <Link to="/send">Send</Link>,
    },
    {
      key: '/receive',
      icon: <QrcodeOutlined />,
      label: <Link to="/receive">Receive</Link>,
    },
  ];
  
  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'View Address',
      icon: <UserOutlined />,
      onClick: () => navigate('/receive'),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Log Out',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];
  
  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        paddingInline: '24px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0, marginRight: '24px' }}>
            Liquid Wallet
          </Title>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none' }}
          />
        </div>
        
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <Button type="text">
            <Space>
              <Text ellipsis style={{ maxWidth: 120 }}>
                {walletData?.address.slice(0, 8)}...{walletData?.address.slice(-8)}
              </Text>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '8px',
          minHeight: 280
        }}>
          {children}
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        Liquid Wallet ©{new Date().getFullYear()} - A secure Bitcoin and USDT wallet for Liquid Network
      </Footer>
    </AntdLayout>
  );
};

export default Layout;
