import React from 'react';
import util from '../../common/util.js';
import './Market.less';
import { List, InputItem, Stepper, Flex, Button } from 'antd-mobile';
import ajax from '../../common/ajax.js';
const Item = List.Item;
const Brief = Item.Brief;

const OrderMarket = React.createClass(
  {
    propTypes: {
      uid: React.PropTypes.any
    },

    getInitialState(){
      return {
        friendList: [],
        prodList: [],
        friendPage: "main",
        assert: 0
      }
    },

    componentDidMount(){
      this.getFriendList();
    },

    getFriendList(){
      // 查询商家列表
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/relations?myId=' + this.props.uid + '&_expand=user',
          success: (d) => {
            this.setState({friendList: d}, ()=>this.getFriendGoods())
          }
        }
      );
    },

    getFriendGoods(){
      this.state.friendList.map(
        (o, i)=> {
          // 查询在商家那儿充钱的列表
          ajax(
            {
              type: 'GET',
              url: 'http://localhost:3000/goods?userId=' + this.props.uid + '&friendId=' + o.userId,
              success: (d) => {
                let friendList = this.state.friendList;
                let temp = friendList[i];
                friendList[i] = {...temp, goods: d};
                this.setState({friendList: friendList})
              }
            }
          );
        }
      );
    },

    getProdList(userInfo){
      // 产品列表查询
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/prods?userId=' + userInfo.id + '&_sort=id&_order=DESC',
          success: (d) => {
            let prodList = d;
            prodList = prodList.map((o)=> {return ({...o, num: 0})});
            this.setState({prodList: prodList});
          }
        }
      );
    },
    getAssert(userInfo){
      // 产品列表查询
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/goods?userId=' + this.props.uid + '&friendId=' + userInfo.id,
          success: (d) => {if (d.length > 0) {this.setState({assert: d[0]})}}
        }
      );
    },

    gotoProdList(userInfo){
      this.setState({friendPage: userInfo.id});
      // 查询商家产品列表
      this.getProdList(userInfo);
      // 查询用户在商家那儿的余额
      this.getAssert(userInfo);
    },

    changeProdNum(index, value){
      let prodList = this.state.prodList;
      prodList[index].num = value;
      this.setState({prodList: prodList});
    },

    // 记录订单流水
    createOrder(isCreate, price, newValue){
      if (!isCreate) {return;}
      let currentDate = util.getDateTimeStr(new Date());
      // 记录账单
      ajax(
        {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          data: {
            date: currentDate,
            userId: parseInt(this.props.uid),
            friendId: parseInt(this.state.friendPage),
            price: parseInt(price)
          },
          success: (d) => {
            // 更新账户余额
            this.updateAssert(newValue, currentDate, d.id);
          }
        }
      );
    },
    // 更新余额
    updateAssert(newValue, currentDate, orderId){
      let assert = this.state.assert;
      ajax(
        {
          type: 'PATCH',
          url: 'http://localhost:3000/goods/' + assert.id,
          data: {
            //type: assert.type,
            //userId: assert.userId,
            //friendId: assert.friendId,
            value: parseInt(newValue)
          },
          success: (d) => {
            // 记录产品流水
            this.createBiz(currentDate, orderId, this.state.prodList);
          }
        }
      );
    },
    // 记录产品流水
    createBiz(currentDate, orderId, prodList){
      if (prodList.length > 0) {
        let o = prodList[0];
        if (parseInt(o.num) === 0) {
          return;
        }
        ajax(
          {
            type: 'POST',
            url: 'http://localhost:3000/bizs/',
            data: {
              "orderId": parseInt(orderId),
              "date": currentDate,
              "userId": parseInt(this.props.uid),
              "friendId": parseInt(this.state.friendPage),
              "prodId": parseInt(o.id),
              "versionId": parseInt(o.versionId),
              "count": parseInt(o.num),
              "price": parseInt(o.price),
              "prodName": o.name
            },
            success: (d) => {
              prodList.splice(0, 1);
              this.createBiz(currentDate, orderId, prodList);
            }
          }
        );
      }
    },

    render() {
      let friendList = this.state.friendList.map(
        (o, i)=> {
          return (
            <div key={i} className="market-friend-item">
              <List>
                <Item thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                      style={{borderBottom:'1px solid'}}>
                  {o.user.name}
                  {o.goods ? <Brief>余额 : {(o.goods[0].value / 100).toFixed(2)}</Brief> : null}
                </Item>
                <Item>
                  <div className="market-control-btn">
                    <i className="fa fa-credit-card"></i>
                    充值
                  </div>
                  <div className="market-control-btn" onClick={this.gotoProdList.bind(this,o.user)}>
                    <i className="fa fa-bitbucket" />购物
                  </div>
                </Item>
              </List>
            </div>
          )
        }
      );

      let prodList = this.state.prodList.map(
        (o, i)=> {
          return (
            <div key={i} className="market-friend-item">
              <List>
                <Item extra={o.name}>商品名称</Item>
                <Item extra={o.price}>商品单价</Item>
                <Item extra={
                <Stepper style={{ width: '100%', minWidth: '2rem' }}
                  showNumber size="small" defaultValue={0} value={o.num} min={0}
                  onChange={this.changeProdNum.bind(this,i)}
                  />
                }>
                  预定数量
                </Item>
                <Item extra={o.price * o.num}>商品总价</Item>
              </List>
            </div>
          )
        }
      );

      let totalPrice = 0;
      this.state.prodList.forEach(
        (o)=> {
          let onePrice = o.price * o.num;
          totalPrice = totalPrice + onePrice
        }
      );

      let assertCSS = {fontSize: ".6rem"};
      if (this.state.assert.value - totalPrice < 0) {assertCSS = {fontSize: ".6rem", color: "#f44336"}}

      let isCreate = false;
      if (totalPrice > 0 && (this.state.assert.value - totalPrice >= 0)) {isCreate = true}

      let prodPage =
        <div>
          <div className="market-friend-list">
            {prodList}
          </div>
          <div style={{padding:".3rem 0",color:"#fff",fontSize:".8rem"}}>
            <div>总价 : {(totalPrice / 100).toFixed(2)}</div>
            <div style={assertCSS}>
              账户余额 : {((this.state.assert.value - totalPrice) / 100).toFixed(2)}
            </div>
          </div>
          <div className="market-friend-control">
            <Button className="btn" style={{width:"45%",backgroundColor:"#ddd",color:"#bbb"}}
                    onClick={()=>{this.setState({friendPage:"main"})}}>返回列表</Button>
            <Button className="btn" style={{width:"45%",backgroundColor:"#fff",color:"#666"}}
                    onClick={this.createOrder.bind(this,isCreate,totalPrice,this.state.assert.value - totalPrice)}>
              提交订单
            </Button>
          </div>
        </div>;

      let mainArea = null;
      if (this.state.friendPage === "main") {mainArea = friendList;} else {mainArea = prodPage}

      return (
        <div className="order-market">
          {mainArea}
        </div>
      );
    }
  }
);

export default OrderMarket;
