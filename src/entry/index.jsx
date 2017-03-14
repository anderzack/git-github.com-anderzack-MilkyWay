import 'antd/dist/antd.less';

import React from 'react';
import ReactDom from 'react-dom';
import {Router} from 'react-router';

// WEB模块引入
import App from '../component/App';
import home from '../component/newHomepage.jsx';
import index from '../component/personalManage/index.jsx';

// MOBILE模块引入
import AntM from '../component/AntM.jsx';
import login from '../component/login/Login.jsx';

const rootRoute = {
  component: App,
  childRoutes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/production/index',
      component: index
    }
  ]
};

const antMRoute = {
  component: AntM,
  childRoutes: [
    {
      path: '/login',
      component: login
    }
  ]
};

ReactDom.render(
  (
    <Router>{rootRoute}</Router>
  ), document.getElementById('react-content')
);

ReactDom.render(
  (
    <Router>{antMRoute}</Router>
  ), document.getElementById('ant-mobile-content')
);
