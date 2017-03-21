import React from 'react';
import util from '../../common/util.js';
import './Market.less';
import { List, SearchBar, Button } from 'antd-mobile';
import ajax from '../../common/ajax.js';
const Item = List.Item;
const Brief = Item.Brief;

const Find = React.createClass(
  {
    propTypes: {
      uid: React.PropTypes.any
    },

    getInitialState(){
      return {
        searchContent: '',
        friendList: [],
        OldFriendList: []
      }
    },

    componentDidMount(){
      this.getFriendList();
    },

    SearchFriend(type){
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/users?_limit=10&' + type + '_like=' + this.state.searchContent,
          success: (d)=> {
            this.setState({searchContent: '', friendList: d});
          }
        }
      )
    },

    addRelation(friendId){
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/relations?myId=' + this.props.uid + '&userId=' + friendId,
          success: (d)=> {
            if (d.length === 0) {
              ajax(
                {
                  type: 'POST',
                  url: 'http://localhost:3000/relations',
                  data: {myId: this.props.uid, userId: friendId},
                  success: (d)=> {this.getFriendList()}
                }
              )
            }
          }
        }
      )
    },

    getFriendList(){
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/relations?myId=' + this.props.uid,
          success: (d)=> {
            let OldFriendList = [];
            d.forEach((o)=> {OldFriendList.push(o.userId)});
            this.setState({OldFriendList: OldFriendList});
          }
        }
      )
    },

    render() {

      let friendList = this.state.friendList.map(
        (o, i)=> {
          let btn = null;
          if (parseInt(this.props.uid) === parseInt(o.id)) {
            btn = null;
          } else {
            if (this.state.OldFriendList.find((n)=>parseInt(n) === parseInt(o.id)) === undefined) {
              btn = <Button type='primary' onClick={this.addRelation.bind(this,o.id)}>添加商家</Button>
            } else {
              btn = <Button>已添加</Button>
            }
          }
          return (
            <Item key={i} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                  extra={btn} style={{borderBottom:'1px solid'}}>
              {o.name}
              {o.desc ? <Brief>{o.desc}</Brief> : null}
            </Item>
          )
        }
      );

      return (
        <div>
          <SearchBar placeholder="搜商家"
                     onClear={()=>{this.setState({searchContent:''})}}
                     onChange={(e)=>{this.setState({searchContent:e})}}
                     value={this.state.searchContent}
            />
          {
            this.state.searchContent.length > 0 ?
              <div>
                <Button onClick={this.SearchFriend.bind(this,'name')}>搜商家名称 :
                  <span style={{color:"#1DA57A"}}>{this.state.searchContent}</span>
                </Button>
                <Button onClick={this.SearchFriend.bind(this,'account')}>搜商家账号 :
                  <span style={{color:"#1DA57A"}}>{this.state.searchContent}</span>
                </Button>
              </div>
              : null
          }
          <div className="order-market">
            <List>
              {friendList}
            </List>
          </div>
        </div>
      );
    }
  }
);

export default Find;
