import React from 'react';
import ajax from '../common/ajax.js';
import { Table } from 'antd';

const BizMng = React.createClass(
  {
    getInitialState(){
      return {
        bizList: []
      }
    },

    componentDidMount(){
      this.getBizList();
    },

    getBizList(){
      ajax(
        {
          type: 'get',
          url: 'http://localhost:3000/bizs?_expand=prod&_expand=user&_sort=id&_order=DESC',
          data: {},
          success: (d) => {
            this.setState({bizList: d});
          }
        }
      );
    },

    render() {
      const columns = [
        {title: '用户', dataIndex: 'user.name', key: 'user.name'},
        {title: '购买产品', dataIndex: 'prodName', key: 'prodName'},
        {title: '购买份数', dataIndex: 'count', key: 'count'},
        {title: '购买单价', dataIndex: 'price', key: 'price'}
      ];
      return (
        <div>
          <Table columns={columns} dataSource={this.state.bizList} />
        </div>
      );
    }
  }
);

export default BizMng;
