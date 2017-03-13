/* global $ */
import assign from 'object-assign';
import util from './util';
import message from 'antd/lib/message';
function getCookie(key) {

  var m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? encodeURIComponent(m[1]) : '';

}
function ajax(config) {
  const originalError = config.error;
  const originalSuccess = config.success;
  config.success = (...args)=> {
    const d = args[0];
    if (d && d.redirect) {
      util.redirectToLogin();
    } else {
      if (d && (d.error || ('success' in d && d.success !== true && d.success !== 'true') || (d.STATE && d.STATE !== 'SUCCESS'))) {
        message.error(d.error || d.msg || d.resultMsg || d.MESSAGE || '失败');
        //return;
      }
      originalSuccess.apply(this, args);
    }
  };
  config.error = (xhr) => {
    if (originalError) {
      originalError(xhr);
    }
    if (xhr.status === 302 || xhr.status === 0) {
      util.redirectToLogin();
    }
  };

  //config.data = assign(
  //  {}, config.data, {
  //    _input_charset: 'utf-8',
  //    _random: new Date().getTime(),
  //  }
  //);
  return $.ajax(config);
}

export default ajax;
