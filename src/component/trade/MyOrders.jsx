import React from 'react';
import './Market.less';
import { TabBar, Icon, List } from 'antd-mobile';
import ajax from '../../common/ajax.js';
const Item = List.Item;

const MyOrders = React.createClass(
  {
    propTypes: {
      params: React.PropTypes.object
    },

    getInitialState(){
      return {
        orderList: [],
        friendList: []
      };
    },

    componentDidMount(){
      this.getOrderList();
    },

    getOrderList(){
      // 订单查询
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/orders?_sort=id&_order=DESC&userId=' + this.props.uid,
          success: (d) => {
            this.setState(
              {orderList: d}, ()=> {
                this.getBizList();
                this.getFriendList();
              }
            )
          }
        }
      );
    },

    // 获取商品信息
    getBizList(){
      this.state.orderList.forEach(
        (o, i)=> {
          ajax(
            {
              type: 'GET',
              url: 'http://localhost:3000/bizs?orderId=' + o.id,
              success: (d)=> {
                let orderList = [...this.state.orderList];
                let item = orderList[i];
                item = {...item, bizList: d};
                orderList[i] = item;
                this.setState({orderList: orderList});
              }
            }
          )
        }
      );
    },

    // 获取商户信息
    getFriendList(){
      this.state.orderList.forEach(
        (o)=> {
          ajax(
            {
              type: 'GET',
              url: 'http://localhost:3000/users/' + o.friendId,
              success: (d)=> {
                let friendList = this.state.friendList;
                friendList.push(d);
                this.setState({friendList: friendList});
              }
            }
          )
        }
      );
    },

    render() {
      console.log('this.state.orderList', this.state.orderList);
      console.log('this.state.friendList', this.state.friendList);

      let orderList = this.state.orderList.map(
        (o, i)=> {
          console.log('o', o);
          let bizList = null;
          if (o.bizList) {
            bizList = o.bizList.map(
              (v, j)=> {
                console.log('v', v);
                return (
                  <List key={j} style={{padding:'.5rem',borderTop:'1px solid',borderBottom:'1px solid'}}>
                    <Item extra={v.prodName}>商品名称</Item>
                    <Item extra={v.price}>商品单价</Item>
                    <Item extra={v.count}>预定数量</Item>
                    <Item extra={v.price * v.count}>商品总价</Item>
                  </List>
                )
              }
            );
          }
          return (
            <div key={i} className="market-friend-item">
              <List>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',padding:'.2rem 1rem'}}>
                  <div>{this.state.friendList[i] ? this.state.friendList[i].name : ''}</div>
                  <div>{o.date}</div>
                </div>
                <div style={{padding:'0 1rem .2rem 1rem'}}>订购总价 : {(o.price / 100).toFixed(2)}</div>
                <div>{bizList}</div>
              </List>
            </div>
          )
        }
      );

      return (
        <div className="order-market my-orders">
          {orderList}
        </div>
      );
    }
  }
);

export default MyOrders;
