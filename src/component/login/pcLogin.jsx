import React from 'react';
import { Button, Input, Icon } from 'antd';
import { History } from 'react-router';
import './pcLogin.less';
import ajax from '../../common/ajax.js';

const pcLogin = React.createClass(
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
        page: "login",
        showNote: false
      }
    },

    login(){
      if (this.state.account.length !== 0 && this.state.password.length !== 0) {
        ajax(
          {
            type: 'GET',
            url: 'http://localhost:3000/users?account=' + this.state.account + '&password=' + this.state.password,
            // TODO: 成功, 模拟跳转...后面上了JAVA服务器代码, 通过session控制
            success: (d) => {
              if (d.length === 1) {this.history.pushState(null, '/production/index/' + d[0].id)} else {
                this.setState(
                  {
                    showNote: true,
                    password: ''
                  }
                )
              }
            }
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
      let rightCheckedCSS = {top: "-8px", right: 0, position: "absolute", color: "#1DA57A"};
      let rightNoPassCSS = {top: "-8px", right: 0, position: "absolute", color: "#f44336"};
      let rightLoadingCSS = {top: "-8px", right: 0, position: "absolute", color: "#ff9800"};

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
        <div className="pc-login-input">
          {
            this.state.showNote ?
              <div style={{height:"24px",lineHeight:"24px",color:"#fff",fontSize:12,letterSpacing:4}}>
                <i className="fa fa-warning" />账号或密码错误, 请重试
              </div>
              :
              <div style={{height:"24px",lineHeight:"24px",color:"#fff",fontSize:12,letterSpacing:4}}></div>
          }
          <Input onChange={(e)=>{this.setState({account:e.target.value})}}
                 style={{padding:"4px 0px"}}
                 placeholder="手机/邮箱/账号"
                 size="large"
                 prefix={<Icon type="user" />}
                 value={this.state.account}>
          </Input>
          <Input onChange={(e)=>{this.setState({password:e.target.value})}}
                 style={{padding:"4px 0px"}}
                 placeholder=""
                 size="large"
                 value={this.state.password}
                 prefix={<Icon type="lock" />}
                 type="password">
          </Input>
          <Button style={{fontSize:16,width:"100%",margin:"12px 0px",color:"#1DA57A",backgroundColor:"#fff"}}
                  className="btn"
                  onClick={this.login}>登陆</Button>

          <div className="pc-sub-title" onClick={()=>{this.setState({page:"reg"})}}>注册账号</div>
        </div>;
      if (this.state.page === "reg") {
        loginInput =
          <div className="pc-login-input">
            <Input
              onChange={(e)=>{this.setState({regNick:e.target.value},()=>this.checkName('name',this.state.regNick,'checkRegNick'))}}
              value={this.state.regNick}
              size="large"
              style={{padding:"4px 0px"}}
              placeholder="昵称"
              prefix={<Icon type="shop" />}
              suffix={checkName}
              >
            </Input>
            <Input
              onChange={(e)=>{this.setState({regAccount:e.target.value},()=>this.checkName('account',this.state.regAccount,'checkRegAccount'))}}
              value={this.state.regAccount}
              size="large"
              style={{padding:"4px 0px"}}
              placeholder="手机/邮箱/账号"
              prefix={<Icon type="user" />}
              suffix={checkAccount}
              >
            </Input>
            <Input
              onChange={(e)=>{this.setState({regPassword:e.target.value},()=>this.checkPassword(this.state.regPassword))}}
              value={this.state.regPassword}
              size="large"
              style={{padding:"4px 0px"}}
              placeholder="密码最少8位" type="password"
              prefix={<Icon type="lock" />}
              suffix={checkPassword}
              >
            </Input>
            <Button style={{fontSize:16,width:"100%",margin:"12px 0px",color:"#1DA57A",backgroundColor:"#fff"}}
                    className="btn" onClick={this.register}>注册</Button>

            <div className="pc-sub-title" onClick={()=>{this.setState({page:"login"})}}>已有账号, 登陆</div>
          </div>;
      }
      return (
        <div className="pc-login-background">
          <div className="pc-flex-container">
            <div className="pc-main-title">Milky Way</div>
            {loginInput}
          </div>
        </div>
      );
    }
  }
);

export default pcLogin;
