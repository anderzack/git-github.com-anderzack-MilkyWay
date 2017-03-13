import 'antd/dist/antd.less';

import React from 'react';
import ReactDom from 'react-dom';
import {Router} from 'react-router';
import App from '../component/App';

// 新首页
import home from '../component/newHomepage.jsx';
import index from '../component/index.jsx';

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

ReactDom.render(
  (
    <Router>{rootRoute}</Router>
  ), document.getElementById('react-content')
);
