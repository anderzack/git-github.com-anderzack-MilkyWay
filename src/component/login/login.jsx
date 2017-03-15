import React from 'react';
import { Button, List, InputItem, Flex, WhiteSpace } from 'antd-mobile';
import { History } from 'react-router';
import './login.less';
import ajax from '../../common/ajax.js';

const Login = React.createClass(
  {
    mixins: [History],

    getInitialState(){
      return {
        account: "",
        password: "",
        regNick: "",
        regAccount: "",
        regPassword: "",
        checkRegNick: "init",
        checkRegAccount: "init",
        checkRegPassword: "init",
        page: "login"
      }
    },

    login(){
      if (this.state.account.length !== 0 && this.state.password.length !== 0) {
        ajax(
          {
            type: 'GET',
            url: 'http://localhost:3000/users?account=' + this.state.account + '&password=' + this.state.password,
            // TODO: 成功, 模拟跳转...后面上了JAVA服务器代码, 通过session控制
            success: (d) => {if (d.length === 1) {this.history.pushState(null, '/main/' + d[0].id)}}
          }
        );
      }
    },
    register(){
      if (this.state.regNick.length !== 0 && this.state.regAccount.length !== 0 && this.state.regPassword.length !== 0) {
        ajax(
          {
            type: 'post',
            url: 'http://localhost:3000/users/',
            data: {name: this.state.regNick, account: this.state.regAccount, password: this.state.regPassword},
            success: (d) => {
              if (d.id) {
                this.history.pushState(null, '/main/' + d.id);
              }
            }
          }
        );
      }
    },
    checkName(type, value, stateName){
      if ((type === 'name' && value.length < 2) || (type === 'account' && value.length < 8)) {
        this.setState({[stateName]: "noPass"})
        return;
      }
      this.setState({[stateName]: "loading"});
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/users/?' + type + '=' + value,
          success: (d) => {
            if (d.length > 0) {
              this.setState({[stateName]: "noPass"})
            } else {
              this.setState({[stateName]: "checked"})
            }
          }
        }
      );
    },
    checkPassword(value){
      if (value.length < 8) {this.setState({checkRegPassword: "noPass"})} else {this.setState({checkRegPassword: "checked"})}
    },

    render() {
      let rightCheckedCSS = {right: 0, position: "absolute", color: "#1DA57A"};
      let rightNoPassCSS = {right: 0, position: "absolute", color: "#f44336"};
      let rightLoadingCSS = {right: 0, position: "absolute", color: "#ff9800"};

      let checkName = null;
      let checkAccount = null;
      let checkPassword = null;

      // 状态校验编码
      if (this.state.checkRegNick === "checked") {
        checkName = <i style={rightCheckedCSS} className="fa fa-check" />;
      }
      if (this.state.checkRegAccount === "checked") {
        checkAccount = <i style={rightCheckedCSS} className="fa fa-check" />;
      }
      if (this.state.checkRegPassword === "checked") {
        checkPassword = <i style={rightCheckedCSS} className="fa fa-check" />;
      }

      if (this.state.checkRegNick === "noPass") {
        checkName = <i style={rightNoPassCSS} className="fa fa-minus-square" />;
      }
      if (this.state.checkRegAccount === "noPass") {
        checkAccount = <i style={rightNoPassCSS} className="fa fa-minus-square" />;
      }
      if (this.state.checkRegPassword === "noPass") {
        checkPassword = <i style={rightNoPassCSS} className="fa fa-minus-square" />;
      }

      if (this.state.checkRegNick === "loading") {
        checkName = <i style={rightLoadingCSS} className="fa fa-spinner fa-spin" />;
      }
      if (this.state.checkRegAccount === "loading") {
        checkAccount = <i style={rightLoadingCSS} className="fa fa-spinner fa-spin" />;
      }
      // END -- 状态校验编码 --

      let loginInput =
        <div className="login-input">
          <List>
            <InputItem onChange={(e)=>{this.setState({account:e})}}
                       placeholder="手机/邮箱/账号"
                       value={this.state.account}
                       autoFocus>
              账号
            </InputItem>
            <InputItem onChange={(e)=>{this.setState({password:e})}}
                       placeholder="" value={this.state.password}
                       type="password">
              密码
            </InputItem>
          </List>
          <WhiteSpace size="xl" />
          <Button className="btn" onClick={this.login}>登陆</Button>
          <WhiteSpace size="sm" />

          <div className="sub-title" onClick={()=>{this.setState({page:"reg"})}}>注册账号</div>
        </div>;
      if (this.state.page === "reg") {
        loginInput =
          <div className="login-input">
            <List>
              <InputItem
                onChange={(e)=>{this.setState({regNick:e},()=>this.checkName('name',e,'checkRegNick'))}}
                value={this.state.regNick}
                autoFocus>
                昵称{checkName}
              </InputItem>
              <InputItem
                onChange={(e)=>{this.setState({regAccount:e},()=>this.checkName('account',e,'checkRegAccount'))}}
                value={this.state.regAccount}
                placeholder="手机/邮箱/账号">
                账号{checkAccount}
              </InputItem>
              <InputItem onChange={(e)=>{this.setState({regPassword:e},()=>this.checkPassword(e))}}
                         value={this.state.regPassword}
                         placeholder="密码最少8位" type="password">
                密码{checkPassword}
              </InputItem>
            </List>
            <WhiteSpace size="xl" />
            <Button className="btn" onClick={this.register}>注册</Button>
            <WhiteSpace size="sm" />

            <div className="sub-title" onClick={()=>{this.setState({page:"login"})}}>已有账号, 登陆</div>
          </div>;
      }
      return (
        <div className="flex-container">
          <div className="main-title">Milky Way</div>
          {loginInput}
        </div>
      );
    }
  }
);

export default Login;
