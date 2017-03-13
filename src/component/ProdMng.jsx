import React from 'react';
import ajax from '../common/ajax.js';
import { Table, Popconfirm } from 'antd';
import EditableCell from './editableCell.js';
import deepcopy from 'deepcopy';

const ProdMng = React.createClass(
  {
    getInitialState(){
      return {
        prodList: []
      }
    },

    componentDidMount(){
      this.getProdList();
    },

    getProdList(){
      ajax(
        {
          type: 'get',
          url: 'http://localhost:3000/prods?_sort=id&_order=DESC',
          data: {},
          success: (d) => {
            this.setState({prodList: d});
          }
        }
      );
    },

    editProdById(data){
      console.log("-- editProdById -- ", data.id, data);
      // 添加流水version
      ajax(
        {
          type: 'POST',
          url: 'http://localhost:3000/versions/',
          data: {
            name: data.name,
            price: parseInt(data.price),
            prodId: parseInt(data.id)
          },
          success: (d) => {
            //this.setState({prodList: d});
          }
        }
      );
      // 修改产品信息
      ajax(
        {
          type: 'put',
          url: 'http://localhost:3000/prods/' + data.id,
          data: {
            id: parseInt(data.id),
            name: data.name,
            price: parseInt(data.price),
            versionId: parseInt(data.versionId) + 1,
            state: data.state
          },
          success: (d) => {
            //this.setState({prodList: d});
          }
        }
      );
    },

    deleteProdById(prodInfo){
      console.log("delete prod ID ", prodInfo);
      // 修改产品信息
      ajax(
        {
          type: 'put',
          url: 'http://localhost:3000/prods/' + prodInfo.id,
          data: {
            name: prodInfo.name,
            price: parseInt(prodInfo.price),
            versionId: parseInt(prodInfo.versionId),
            state: 'offline'
          },
          success: (d) => {
            //this.setState({prodList: d});
          }
        }
      );
    },

    onCellChange(index, key, value){
      let prodList = deepcopy(this.state.prodList);
      prodList[index][key] = value;
      this.setState({prodList: prodList}, ()=> {this.editProdById(prodList[index])});
    },

    onDelete(index, key, value){
      console.log('index, key, value', index, key, value);
      let prodList = deepcopy(this.state.prodList);
      prodList[index][key] = value;
      this.setState({prodList: prodList}, ()=> {this.deleteProdById(prodList[index])});
    },

    render() {
      const columns = [
        {title: '产品编号', dataIndex: 'id', key: 'id'},
        {
          title: '产品名称', dataIndex: 'name', key: 'name', width: '30%',
          render: (text, record, index) => (
            <EditableCell
              value={text}
              onChange={this.onCellChange.bind(this,index, 'name')}
              />
          )
        },
        {
          title: '产品价格(分)', dataIndex: 'price', key: 'price', width: '30%',
          render: (text, record, index) => (
            <EditableCell
              value={text}
              onChange={this.onCellChange.bind(this, index, 'price')}
              />
          )
        },
        {title: '产品状态', dataIndex: 'state', key: 'state'},
        {
          title: '修改产品', dataIndex: 'operation', key: 'operation',
          render: (text, record, index) => {
            return (
              this.state.prodList.length > 1 ?
                (
                  <div>
                    <Popconfirm title="确定下架产品?" onConfirm={() => this.onDelete(index,'state','offline')}>
                      <a href="#">下架产品</a>
                    </Popconfirm>
                  </div>
                ) : null
            );
          }
        }
      ];
      return (
        <div>
          <Table columns={columns} dataSource={this.state.prodList} />
        </div>
      );
    }
  }
);

export default ProdMng;
