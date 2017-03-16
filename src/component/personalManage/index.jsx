import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Footer, Content, Sider } = Layout;

// 订单管理
import BizMng from './BizMng.jsx';
// 商品管理
import ProdMng from './ProdMng.jsx';
// 余额管理
import AssetMng from './AssetMng.jsx';

const Index = React.createClass(
  {
    propTypes: {
      params: React.PropTypes.object
    },

    getInitialState(){
      return {
        menuIndex: "1"
      }
    },

    handleClick(e){this.setState({menuIndex: e.key})},

    render() {
      let uid = this.props.params.uid;
      let content = <BizMng uid={uid} />;
      if (this.state.menuIndex === '2') {content = <ProdMng uid={uid} />}
      if (this.state.menuIndex === '3') {content = <AssetMng uid={uid} />}

      return (
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px', border:0 }}
              >
              <div style={{fontSize:18}}>Milky Way - 健康奶源, 用心智造</div>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>Milky Way</Breadcrumb.Item>
              <Breadcrumb.Item>管理工作台</Breadcrumb.Item>
            </Breadcrumb>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu mode="inline" defaultSelectedKeys={['1']} onClick={this.handleClick}>
                  <Menu.Item key="1">
                    <Icon type="user" />
                    <span className="nav-text">每日订单</span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="video-camera" />
                    <span className="nav-text">商品管理</span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Icon type="upload" />
                    <span className="nav-text">余额管理</span>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                {content}
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      );
    }
  }
);

export default Index;
