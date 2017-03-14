import React from 'react';
import { Button, List, InputItem, Flex, WhiteSpace } from 'antd-mobile';
import './login.less';

const Login = React.createClass(
  {
    render() {
      return (
        <div className="flex-container">
          <div className="main-title">Milky Way</div>

          <div className="login-input">
            <List>
              <InputItem placeholder="手机/邮箱/账号" type="phone" autoFocus>账号</InputItem>
              <InputItem placeholder="" type="password">密码</InputItem>
            </List>
            <WhiteSpace size="xl" />
            <Button className="btn">登陆</Button>
            <WhiteSpace size="sm" />

            <div className="sub-title">注册账号</div>
          </div>
        </div>
      );
    }
  }
);

export default Login;
