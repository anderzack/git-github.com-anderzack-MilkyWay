import React from 'react';
import {History} from 'react-router';
import {Button} from 'antd';
import ajax from '../common/ajax.js';
import './newHomepage.less';
import QueueAnim from 'rc-queue-anim';
import Animate from 'rc-animate';

const newHomepage = React.createClass(
  {
    mixins: [History],
    goUrl(modalName, url){
      this.modalAccessLog(modalName);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.history.pushState(null, url);
    },

    modalAccessLog(modalName){
      ajax(
        {
          url: '/experience/accessMonitor.json',
          dataType: 'json',
          data: {url: modalName},
          success: (d) => {}
        }
      );
    },

    getInitialState(){
      return {
        moduleList: [
          {
            name: "产品空间",
            desc: "用理性数据剖析体验痛点，这里汇聚了全业务各个维度的数据指标。用多维数据和深度报告帮你改进产品体验。",
            pic: "fa fa-newspaper-o",
            link: "/production/index"
          },
          //{
          //  name: "全民小二",
          //  desc: "由蚂蚁金服客户中心主办，让蚂蚁同学贴近用户倾听用户声音，每一个用户声音都值得被认真对待，全民小二期待你的加入。",
          //  pic: "fa fa-users",
          //  link: "/wholePeople"
          //},
          //{
          //  name: "体验广场",
          //  desc: "在这里你不仅可以感受到最真实的用户声音还能一览最新最IN的体验热议，听见用户真声，碰撞体验火花尽在体验广场。",
          //  pic: "fa fa-codepen",
          //  link: "/home"
          //},
          //{
          //  name: "分析工具",
          //  desc: "从数据分析找到体验突破，海量数据帮你切中要点。提升用户体验，从尊重每一个真实的数据出发。",
          //  pic: "fa fa-connectdevelop",
          //  link: "/analyst"
          //},
          //{
          //  name: "报告工具",
          //  desc: "智能与贴心的结合，简单上手易操作。原来你的报告也可以这么精致和打动人心，快来撰写一份属于你的报告吧。",
          //  pic: "fa fa-stack-exchange",
          //  link: "/docEditor"
          //},
          //{
          //  name: "工作台",
          //  desc: "体验小二们专属又清晰的后台操作平台，专注于数据精加工和流程的快速推进。",
          //  pic: "fa fa-steam-square",
          //  link: "/production/all/workbench"
          //}
        ],
        colNum: 3,
        widthPx: 1200,
        isShowAnimate: true,
      }
    },

    toggleAnimate(){
      window._is_login = true;
      this.setState({isShowAnimate: !this.state.isShowAnimate});
    },

    listSplice(list, num){
      let newList = [];
      while (list.length > num) {
        newList.push(list.splice(0, num))
      }
      newList.push(list);
      return newList;
    },

    render(){
      let moduleList = this.state.moduleList;
      let colNum = this.state.colNum;
      let widthPx = this.state.widthPx;
      let dataList = this.listSplice([...moduleList], colNum);
      let rowCSS = {width: widthPx, height: 300};
      let cellCSS = {width: widthPx / colNum, height: 300};
      let btnCSS = {
        color: "#fff",
        backgroundColor: "transparent",
        borderRadius: 4
      };

      let dataListHtm = dataList.map(
        (dataRow, i)=> {
          let cell = dataRow.map(
            (o, j)=> {
              return (
                <div key={`dataCell-${j}`} className="newHomepage-cell" style={cellCSS}>
                  <div className="newHomepage-show">
                    <div className="newHomepage-pic-box">
                      <div className="newHomepage-pic">
                        <i className={o.pic} />
                      </div>
                    </div>
                    <div className="newHomepage-title">
                      {o.name}
                    </div>
                  </div>
                  <div className="newHomepage-hover">
                    <div className="newHomepage-title">
                      {o.name}
                    </div>
                    <div className="newHomepage-desc">
                      {o.desc}
                    </div>
                    <div className="newHomepage-link">
                      <Button style={btnCSS} onClick={this.goUrl.bind(this,o.name,o.link)}>点击进入</Button>
                    </div>
                  </div>
                </div>
              )
            }
          );
          return (<div key={`dataRow-${i}`} className="newHomepage-row" style={rowCSS}>{cell}</div>);
        }
      );

      return (
        <div className="newHomepage">
          <div className="newHomepageBackground"></div>
          {dataListHtm}
        </div>
      );
    }
  }
);

export default newHomepage;
