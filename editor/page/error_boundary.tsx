/*
 * @Author: kunnisser
 * @Date: 2021-01-29 23:10:11
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-29 23:19:19
 * @FilePath: \kunigame\editor\page\error_boundary.tsx
 * @Description: ---- 定义错误边界组件 ----
 */
import React from 'react';
import { Result, Button } from 'antd';

interface ErrorState {
  error: object | null,
  errorInfo: object | null
}
class ErrorBoundary extends React.Component {
  public props: any;
  public state: ErrorState;
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  public refresh = () => {
  }

  render() {
    if (this.state['errorInfo']) {
      return <Result
        status="error"
        title={this.state.error?.toString()}
        subTitle={!!this.state['errorInfo'] && this.state.errorInfo['componentStack']}
        extra={<Button type="primary" onClick={this.refresh}>重试</Button>}
      ></Result>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
