import message from 'antd/lib/message';

function padding2(v) {
  let ret = v;
  if ((v + '').length < 2) {
    ret = '0' + v;
  }
  return ret;
}

const util = {
  redirectToLogin() {
    message.error('长时间不操作，将重新刷新页面');
    setTimeout(
      () => {
        location.reload();
      }, 1500
    );
  },
  getMonthStr(date) {
    const year = date.getFullYear();
    const month = padding2(date.getMonth() + 1);
    return `${year}-${month}`;
  },
  getDateStr(date) {
    const year = date.getFullYear();
    const month = padding2(date.getMonth() + 1);
    const day = padding2(date.getDate());
    return `${year}-${month}-${day}`;
  },
  getTimeStr(date) {
    const year = date.getFullYear();
    const month = padding2(date.getMonth() + 1);
    const day = padding2(date.getDate());
    const hour = padding2(date.getHours());
    const min = padding2(date.getMinutes());
    const sec = padding2(date.getSeconds());

    return `${year}${month}${day}${hour}${min}${sec}`;
  },
  getDateTimeStr(date) {
    const year = date.getFullYear();
    const month = padding2(date.getMonth() + 1);
    const day = padding2(date.getDate());
    const hour = padding2(date.getHours());
    const min = padding2(date.getMinutes());
    const sec = padding2(date.getSeconds());

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }
};

export default util;
