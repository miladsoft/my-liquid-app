import  { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Button, Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              type="error"
              message="Something went wrong"
              description="An error occurred in this component."
              showIcon
            />
            
            <div>
              <Title level={4}>Error Details</Title>
              <Text code>{this.state.error?.toString()}</Text>
              
              {this.state.errorInfo && (
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                  <Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                </div>
              )}
            </div>
            
            <Button type="primary" onClick={this.resetErrorBoundary}>
              Try Again
            </Button>
          </Space>
        </div>
      );
    }    return this.props.children;
  }
}
