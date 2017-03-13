module.exports = function(webpackConfig, env) {
  // babel-plugin-antd
  //webpackConfig.module.loaders.forEach(function(loader) {
  //  if (loader.loader === 'babel') {
  //    loader.query.plugins.push('antd');
  //  }
  //  return loader;
  //});

  // 映射 react 和 react-dom 为 dist 文件
  //if (env === 'development') {
  //  webpackConfig.resolve.alias = Object.assign({}, webpackConfig.resolve.alias, {
  //    'react': 'react/dist/react',
  //    'react-dom': 'react-dom/dist/react-dom',
  //  });
  //}

  // 可临时指定 entry 文件
  //if (env === 'development' && process.env.ENTRY) {
  //  webpackConfig.entry = Object.keys(webpackConfig.entry)
  //    .filter(item => item.indexOf(process.env.ENTRY) > -1)
  //    .reduce((memo, item) => {
  //      memo[item] = webpackConfig.entry[item];
  //      return memo;
  //    }, {});
  //  console.log('ENTRY FILTERED : ', webpackConfig.entry);
  //}

  return webpackConfig;
};
