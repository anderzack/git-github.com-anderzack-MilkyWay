import React from 'react';
import ajax from '../common/ajax.js';
import { Table } from 'antd';

const AssertMng = React.createClass(
  {
    getInitialState(){
      return {
        assertList: []
      }
    },

    componentDidMount(){
      this.getBizList();
    },

    getBizList(){
      ajax(
        {
          type: 'get',
          url: 'http://localhost:3000/users?_embed=goods&_embed=points',
          data: {},
          success: (d) => {
            console.log(d)
            this.setState({assertList: d});
          }
        }
      );
    },

    render() {
      const columns = [
        {title: '用户', dataIndex: 'name', key: 'name'},
        {title: '账号', dataIndex: 'account', key: 'account'},
        {title: '余额', dataIndex: 'goods[0].value', key: 'goods[0].value'},
        {title: '点券', dataIndex: 'points[0].value', key: 'points[0].value'},
      ];
      return (
        <div>
          <Table columns={columns} dataSource={this.state.assertList} />
        </div>
      );
    }
  }
);

export default AssertMng;
