import React from 'react';
import moment from 'moment';
import ajax from '../../common/ajax.js';
import { Table, DatePicker,Modal } from 'antd';

const BizMng = React.createClass(
  {
    propTypes: {
      uid: React.PropTypes.any
    },
    getInitialState(){
      return {
        bizMergeByProd: [],
        bizDetailByProd: [],
        showModal: false,
        dateString: moment().format('YYYY-MM-DD')
      }
    },

    componentDidMount(){
      this.changeDate(moment(), this.state.dateString);
    },

    getProdByUser(){
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/bizs?friendId=' + this.props.uid + '&date_like=' + this.state.dateString,
          success: (d)=> {
            this.setState({bizMergeByProd: this.groupBy(d, ['prodId', 'versionId'], 'count')});
          }
        }
      )
    },

    getProdDetail(prodId, versionId){
      this.setState({showModal: true});
      ajax(
        {
          type: 'GET',
          url: 'http://localhost:3000/bizs?_expand=user&friendId=' + this.props.uid + '&date_like=' + this.state.dateString + '&prodId=' + prodId + '&versionId=' + versionId,
          success: (d)=> {
            this.setState({bizDetailByProd: d});
          }
        }
      )
    },

    changeDate(date, dateString){
      // 查询当日订单
      this.setState({dateString: dateString}, ()=>this.getProdByUser());
    },

    render() {
      const columns = [
        {title: '购买商品', dataIndex: 'prodName', key: 'prodName'},
        {title: '购买份数', dataIndex: 'count', key: 'count'},
        {
          title: '购买单价(元)', dataIndex: 'price', key: 'price',
          render: (text, record)=> {return <span>{(record.price / 100).toFixed(2)}</span>}
        },
        {
          title: '总价(元)', dataIndex: 'total', key: 'total',
          render: (text, record)=> {return <span>{((record.count * record.price) / 100).toFixed(2)}</span>}
        },
        {
          title: '操作', dataIndex: 'operate', key: 'operate',
          render: (text, record)=> {return <a onClick={this.getProdDetail.bind(this,record.prodId,record.versionId)}>查看购买详情</a>}
        }
      ];

      let bizDetail = [
        {
          title: '购买时间', dataIndex: 'date', key: 'date',
          render: (text, record)=> {return <span><div>{record.date.split(' ')[0]}</div><div>{record.date.split(' ')[1]}</div></span>}
        },
        {title: '购买人', dataIndex: 'user.name', key: 'user.name'},
        {title: '购买人账号', dataIndex: 'user.account', key: 'user.account'},
        {title: '购买产品', dataIndex: 'prodName', key: 'prodName'},
        {title: '产品编号', dataIndex: 'prodId', key: 'prodId'},
        {title: '购买单价', dataIndex: 'price', key: 'price'},
        {title: '购买数量', dataIndex: 'count', key: 'count'},
        {
          title: '总价(元)', dataIndex: 'total', key: 'total',
          render: (text, record)=> {return <span>{((record.count * record.price) / 100).toFixed(2)}</span>}
        }
      ];

      return (
        <div>
          <DatePicker style={{verticalAlign:'top'}} defaultValue={moment()} format={'YYYY-MM-DD'}
                      onChange={this.changeDate} />
          <Table columns={columns} dataSource={this.state.bizMergeByProd} />
          <Modal width="80%" visible={this.state.showModal} title="商品购买详情" footer={null}
                 onCancel={()=>{this.setState({showModal:false})}}>
            <Table columns={bizDetail} dataSource={this.state.bizDetailByProd} />
          </Modal>
        </div>
      );
    },

    groupBy(list, groupColList, sumCol){
      let newList = [];
      list.forEach(
        (o)=> {
          // 1 init
          if (newList.length === 0) {
            newList.push(o);
            return;
          }
          // 2 matching, add
          let isAdd = true;
          newList.forEach(
            (newo)=> {
              for (let i = 0; i < groupColList.length; i++) {
                if (newo[groupColList[i]] !== o[groupColList[i]]) {
                  isAdd = false;
                  break;
                }
              }
              if (isAdd) {newo[sumCol] = parseInt(newo[sumCol]) + parseInt(o[sumCol])}
            }
          );
          // 3 no-matching, new
          if (!isAdd) {newList.push(o)}
        }
      );

      return [...newList];
    }
  }
);

export default BizMng;
