import React from 'react';
import ajax from '../../common/ajax.js';
import { Table, Popconfirm, Input, InputNumber, Button, Modal, Row, Col } from 'antd';
import EditableCell from './editableCell.js';
import deepcopy from 'deepcopy';
import './Manage.less';

const ProdMng = React.createClass(
  {
    getInitialState(){
      return {
        prodList: [],
        prodNameSearchText: '',
        visible: false,
        newProdName: '',
        newProdPrice: '',
        loading: false
      }
    },

    componentDidMount(){this.getProdList();},

    // 查
    getProdList(){
      ajax(
        {
          type: 'get',
          url: 'http://localhost:3000/prods?_sort=id&_order=DESC&name_like=' + this.state.prodNameSearchText,
          data: {},
          success: (d) => {
            this.setState({prodList: d});
          }
        }
      );
    },

    // 改
    editProdById(data){
      // 添加流水version
      ajax(
        {
          type: 'POST',
          url: 'http://localhost:3000/versions/',
          data: {name: data.name, price: parseInt(data.price), prodId: parseInt(data.id)},
          success: (d) => {}
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
          success: (d) => {}
        }
      );
    },

    // 删
    deleteProdById(prodInfo){
      // 修改产品信息
      ajax(
        {
          type: 'put',
          url: 'http://localhost:3000/prods/' + prodInfo.id,
          data: {
            name: prodInfo.name,
            price: parseInt(prodInfo.price),
            versionId: parseInt(prodInfo.versionId),
            state: prodInfo.state
          },
          success: (d) => {}
        }
      );
    },

    // 增
    handleOk(){
      this.setState({loading: true});
      ajax(
        {
          type: 'post',
          url: 'http://localhost:3000/prods/',
          data: {
            name: this.state.newProdName,
            price: parseInt(this.state.newProdPrice),
            versionId: 1,
            state: 'online'
          },
          success: (d) => {
            ajax(
              {
                type: 'post',
                url: 'http://localhost:3000/versions/',
                data: {
                  name: d.name, price: parseInt(d.price), prodId: parseInt(d.id)
                },
                success: (d) => {
                  this.setState({loading: false, visible: false, prodNameSearchText: ''}, ()=>this.getProdList());
                }
              }
            )
          }
        }
      )
    },

    onCellChange(index, key, value){
      let prodList = deepcopy(this.state.prodList);
      prodList[index][key] = value;
      this.setState({prodList: prodList}, ()=> {this.editProdById(prodList[index])});
    },

    onDelete(index, key, value){
      let prodList = deepcopy(this.state.prodList);
      prodList[index][key] = value;
      this.setState({prodList: prodList}, ()=> {this.deleteProdById(prodList[index])});
    },

    onProdNameSearchChange(e){this.setState({prodNameSearchText: e.target.value})},

    showModal(){this.setState({visible: true})},
    handleCancel(){this.setState({visible: false})},

    render() {
      const columns = [
        {title: '商品编号', dataIndex: 'id', key: 'id'},
        {
          title: '商品名称', dataIndex: 'name', key: 'name', width: '30%',
          render: (text, record, index) => {
            const App = ()=> <EditableCell
              value={text}
              onChange={this.onCellChange.bind(this,index, 'name')}
              />;
            return <App />;
          },
          filterDropdown: (
            <div className="custom-filter-dropdown">
              <Input
                placeholder="搜商品名称"
                value={this.state.prodNameSearchText}
                onChange={this.onProdNameSearchChange}
                onPressEnter={this.getProdList}
                />
              <Button type="primary" onClick={this.getProdList}>搜</Button>
            </div>
          ),
          filterDropdownVisible: this.state.isProdNameSearch,
          onFilterDropdownVisibleChange: visible => this.setState({isProdNameSearch: visible}),
        },
        {
          title: '商品价格(分)', dataIndex: 'price', key: 'price', width: '30%',
          render: (text, record, index) => {
            const App = ()=> <EditableCell
              value={text}
              onChange={this.onCellChange.bind(this, index, 'price')}
              />;
            return <App />
          }
        },
        {title: '商品状态', dataIndex: 'state', key: 'state'},
        {
          title: '修改商品', dataIndex: 'operation', key: 'operation',
          render: (text, record, index) => {
            const UpProd = ()=><div>
              <Popconfirm title="确定上架商品?" onConfirm={() => this.onDelete(index,'state','online')}>
                <a href="#">上架商品</a>
              </Popconfirm>
            </div>;
            const DownProd = ()=><div>
              <Popconfirm title="确定下架商品?" onConfirm={() => this.onDelete(index,'state','offline')}>
                <a href="#">下架商品</a>
              </Popconfirm>
            </div>;

            if (this.state.prodList.length > 0) {
              if (this.state.prodList[index].state === 'online') {
                return <DownProd />;
              } else {
                return <UpProd />;
              }
            }
            return null;
          }
        }
      ];

      return (
        <div>
          <Table columns={columns} dataSource={this.state.prodList} />
          <Modal
            visible={this.state.visible}
            title="新增商品"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button disabled={this.state.newProdName && this.state.newProdPrice && (this.state.newProdName.length===0||this.state.newProdPrice.length===0)}
              key="submit" type="primary" size="large"
              loading={this.state.loading} onClick={this.handleOk}>
              新增
            </Button>
          ]}
            >
            <Row>
              <Col span='16'>
                <Input placeholder="商品名称" onChange={(e)=>{this.setState({newProdName:e.target.value})}} />
              </Col>
              <Col span='8'>
                <Input placeholder="单价(分)"
                       value={this.state.newProdPrice}
                       onChange={(e)=>{if(!isNaN(e.target.value)){this.setState({newProdPrice:e.target.value})}}} />
              </Col>
            </Row>
          </Modal>
          <Button type="primary" onClick={this.showModal}>
            新增商品
          </Button>
        </div>
      );
    }
  }
);

export default ProdMng;
