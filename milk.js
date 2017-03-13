var remote = require('@alipay/milk-remote');
var mock = require('@alipay/milk-mock');
var mockDir = require('@alipay/milk-mock-dir');
var dirMockData = mockDir('./mock');

module.exports = [
  mock({
    enable: false,
    data: dirMockData
  }),
  remote({
    url: 'http://csvoice.public.alipay.net/'
  })
];
