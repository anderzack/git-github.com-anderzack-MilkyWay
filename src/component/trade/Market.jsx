import React from 'react';
import './Market.less';
import { TabBar, Icon } from 'antd-mobile';
// 订货
import OrderMarket from './OrderMarket.jsx';
// 我的订单
import MyOrders from './MyOrders.jsx';

// 发现商家

const Market = React.createClass(
  {
    propTypes: {
      params: React.PropTypes.object
    },
    getInitialState(){
      return {
        hidden: false,
        page: 1
      };
    },
    setPage(page){this.setState({page: page})},
    render() {
      let page = this.state.page;
      let title = "找商家订货";
      let content = <OrderMarket uid={this.props.params.uid} />;
      if (page === 2) {
        title = "我的订单";
        content = <MyOrders uid={this.props.params.uid} />;
      }
      if (page === 3) {title = "发现商家"}

      return (
        <div className="market-container">
          <div className="big-title">{title}</div>
          <div className="main-area">{content}</div>
          <div className="footer-bar">
            <div className="func-btn" onClick={this.setPage.bind(this,1)}>
              <i className="fa fa-calendar-check-o" />订货
            </div>
            <div className="func-btn" onClick={this.setPage.bind(this,2)}>
              <i className="fa fa-handshake-o" />我的订单
            </div>
            <div className="func-btn" onClick={this.setPage.bind(this,3)}>
              <i className="fa fa-address-book-o" />发现商家
            </div>
          </div>
        </div>
      );
    }
  }
);

export default Market;
