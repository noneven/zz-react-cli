
var webpack = require('webpack');
var config = require('./webpack.config');

var args = process.argv;
var watch = args.indexOf('--watch') > -1;

// 测试环境静态资源 domain
var testPublicPath = '/';
// 生产环境静态资源 domain
var onlinePublicPath = 'http://m/zhuanzhuan.58.com/Mzhuanzhuan/ZZMuying';

config.output.publicPath = onlinePublicPath;

var compiler = webpack(config);

function callback(err, stats) {
  if (err) {
    console.log(err);
  } else {
    console.log(stats.toString({
      colors: true,
      chunks: false,
      children: false,
    }));
  }
}

if (watch) {
  compiler.watch({}, callback);
} else {
  compiler.run(callback);
}
