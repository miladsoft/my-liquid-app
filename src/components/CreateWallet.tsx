import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Steps, Alert, Space, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WalletOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { WalletService } from '../services/wallet';
import { createWallet } from '../store/walletSlice';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const CreateWallet: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [confirming, setConfirming] = useState(false);
  const [confirmWords, setConfirmWords] = useState<string[]>([]);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [selectedWordIndexes, setSelectedWordIndexes] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate a new wallet when component mounts
    const { address, mnemonic } = WalletService.generateWallet();
    setMnemonic(mnemonic);
    setAddress(address);
    
    // For confirmation, randomly select words to confirm (e.g., the 3rd, 8th, 12th)
    const wordIndexes = Array.from({ length: 12 }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .sort((a, b) => a - b);
    
    setSelectedWordIndexes(wordIndexes);
  }, []);
  
  const onContinue = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setConfirming(true);
      setCurrentStep(2);
    }
  };
  
  const handleConfirmWord = (index: number, word: string) => {
    const newUserWords = [...userWords];
    newUserWords[index] = word;
    setUserWords(newUserWords);
  };
  
  const allWordsConfirmed = () => {
    if (userWords.length !== selectedWordIndexes.length) return false;
    
    const mnemonicWords = mnemonic.split(' ');
    return selectedWordIndexes.every((wordIndex, index) => 
      userWords[index] === mnemonicWords[wordIndex]);
  };
  
  const handleFinish = () => {
    // Create wallet in Redux store
    dispatch(createWallet({
      address,
      mnemonic,
      assets: [],
      transactions: []
    }));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const steps = [
    {
      title: 'Generate',
      content: (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="Back up your recovery phrase"
              description="Write down the recovery phrase below on paper and keep it in a safe place. You'll need this phrase to recover your wallet."
              type="warning"
              showIcon
            />
            
            <div style={{ 
              backgroundColor: '#f7f9fc', 
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
              }}>
                {mnemonic.split(' ').map((word, index) => (
                  <div key={index} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #eee'
                  }}>
                    <Text type="secondary" style={{ marginRight: '8px' }}>{index + 1}.</Text>
                    <Text strong>{word}</Text>
                  </div>
                ))}
              </div>
            </div>
            
            <Alert
              message="Never share your recovery phrase"
              description="Anyone with this phrase can take your assets. Never share it with anyone or enter it in any app or website."
              type="error"
              showIcon
            />
          </Space>
        </Card>
      )
    },
    {
      title: 'Secure',
      content: (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="Confirm your backup"
              description="Make sure you've written down your recovery phrase correctly."
              type="info"
              showIcon
            />
            
            <Paragraph strong>
              Have you written down your recovery phrase and stored it in a secure place?
            </Paragraph>
            
            <Alert
              message="Important security tips"
              description={
                <ul>
                  <li>Never store your recovery phrase digitally</li>
                  <li>Write it down on paper and store it in a secure place</li>
                  <li>Consider making multiple copies in different secure locations</li>
                  <li>Never share your recovery phrase with anyone</li>
                </ul>
              }
              type="warning"
              showIcon
            />
          </Space>
        </Card>
      )
    },
    {
      title: 'Verify',
      content: (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="Verify your recovery phrase"
              description={`Please enter the ${selectedWordIndexes.map(i => `${i+1}${i+1 === selectedWordIndexes[selectedWordIndexes.length-1] ? 'th' : i+1 === selectedWordIndexes[selectedWordIndexes.length-2] ? 'th' : ['st', 'nd', 'rd'][i % 10 - 1] || 'th'}`).join(', ')} words from your recovery phrase.`}
              type="info"
              showIcon
            />
            
            <Row gutter={[16, 16]}>
              {selectedWordIndexes.map((wordIndex, index) => (
                <Col key={index} span={8}>
                  <div>
                    <Text type="secondary">Word #{wordIndex + 1}</Text>
                    <input
                      type="text"
                      style={{ 
                        width: '100%', 
                        padding: '8px',
                        marginTop: '8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px'
                      }}
                      onChange={(e) => handleConfirmWord(index, e.target.value)}
                    />
                  </div>
                </Col>
              ))}
            </Row>
            
            {userWords.length > 0 && !allWordsConfirmed() && (
              <Alert
                message="Words don't match"
                description="The words you've entered don't match your recovery phrase. Double-check and try again."
                type="error"
                showIcon
              />
            )}
            
            {allWordsConfirmed() && (
              <Alert
                message="Success!"
                description="Your recovery phrase has been verified successfully."
                type="success"
                showIcon
              />
            )}
          </Space>
        </Card>
      )
    }
  ];
  
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <WalletOutlined style={{ fontSize: '32px', color: '#f7931a', marginBottom: '1rem' }} />
        <Title level={2} style={{ marginBottom: '0.5rem' }}>Create New Wallet</Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Generate a new wallet for Bitcoin and USDT on the Liquid Network
        </Paragraph>
      </div>
      
      <Steps current={currentStep} style={{ marginBottom: '2rem' }}>
        <Step title="Recovery Phrase" icon={<WalletOutlined />} />
        <Step title="Backup" icon={<SafetyOutlined />} />
        <Step title="Verify" icon={<CheckCircleOutlined />} />
      </Steps>
      
      <div style={{ marginTop: '2rem' }}>
        {steps[currentStep].content}
      </div>
      
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && (
          <Button onClick={() => setCurrentStep(currentStep - 1)}>
            Back
          </Button>
        )}
        <div style={{ flex: 1 }}></div>
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={onContinue}>
            Continue
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button 
            type="primary" 
            onClick={handleFinish}
            disabled={!allWordsConfirmed()}
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateWallet;
