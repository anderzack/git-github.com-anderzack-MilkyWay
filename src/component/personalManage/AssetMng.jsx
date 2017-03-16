import React from 'react';
import ajax from '../../common/ajax.js';
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
          url: 'http://localhost:3000/goods?friendId=' + this.props.uid + '&_expand=user',
          data: {},
          success: (d) => {
            this.setState({assertList: d});
          }
        }
      );
    },

    render() {
      const columns = [
        {title: '用户', dataIndex: 'user.name', key: 'user.name'},
        {title: '账号', dataIndex: 'user.account', key: 'user.account'},
        {title: '余额', dataIndex: 'value', key: 'value'}
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
