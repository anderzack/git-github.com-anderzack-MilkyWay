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
          success: (d) => {this.setState({friendList: d})}
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
            userId: this.props.uid,
            friendId: this.state.friendPage,
            price: price
          },
          success: (d) => {
            console.log('createOrder', d, isCreate, price, newValue);
            // 记录产品流水
            this.createBiz(currentDate, d.id);
            // 更新账户余额
            this.updateAssert(newValue);
          }
        }
      );
    },

    // 记录产品流水
    createBiz(currentDate, orderId){
      this.state.prodList.forEach(
        (o)=> {
          if (o.num !== 0) {
            ajax(
              {
                type: 'POST',
                url: 'http://localhost:3000/bizs/',
                data: {
                  "orderId": orderId,
                  "date": currentDate,
                  "userId": this.props.uid,
                  "prodId": this.state.friendPage,
                  "versionId": o.versionId,
                  "count": o.num,
                  "price": o.price,
                  "prodName": o.name
                },
                success: (d) => {
                  console.log("createBiz", d, currentDate, orderId);
                }
              }
            );
          }
        }
      );
    },

    // 更新余额
    updateAssert(newValue){
      let assert = this.state.assert;
      console.log("updateAssert =", assert, newValue);
      ajax(
        {
          type: 'PATCH',
          url: 'http://localhost:3000/goods/' + assert.id,
          data: {
            //type: assert.type,
            //userId: assert.userId,
            //friendId: assert.friendId,
            value: newValue
          },
          success: (d) => {
            console.log("updateAssert ==== ", d, newValue);
          }
        }
      );
    },

    render() {
      let friendList = this.state.friendList.map(
        (o, i)=> {
          return (
            <div key={i} className="market-friend-item">
              <List>
                <Item arrow="horizontal" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                      onClick={this.gotoProdList.bind(this,o.user)}
                  >
                  {o.user.name}
                  <Brief>{o.user.desc}</Brief>
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

      console.log('isCreate', isCreate);

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
