import 'antd/dist/antd.less';

import React from 'react';
import ReactDom from 'react-dom';
import { Router,Route,hashHistory } from 'react-router';

// WEB模块引入
import App from '../component/App';
import home from '../component/newHomepage.jsx';
import index from '../component/personalManage/index.jsx';

// MOBILE模块引入
import AntM from '../component/AntM.jsx';
import login from '../component/login/Login.jsx';
import market from '../component/trade/Market.jsx';

ReactDom.render(
  (
    <Router history={hashHistory}>
      <Route component={App}>
        <Route path="/" component={home}></Route>
        <Route path="/production/index/:uid" component={index}></Route>
      </Route>
      <Route component={AntM}>
        <Route path="/login" component={login}></Route>
        <Route path="/main/:uid" component={market}></Route>
      </Route>
    </Router>
  ), document.getElementById('react-content')
);

