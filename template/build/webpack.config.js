var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsWebpackPlugin = require('assets-webpack-plugin');
var path = require('path');
// 辅助函数
var utils = require('./utils');
var fullPath  = utils.fullPath;
var pickFiles = utils.pickFiles;

// 项目根路径
var ROOT_PATH = fullPath('../');
// 项目源码路径
var SRC_PATH = ROOT_PATH + '/src';
// 产出路径
var DIST_PATH = ROOT_PATH + '/dist';

// node_modules
var NODE_MODULES_PATH =  ROOT_PATH + '/node_modules';

var __DEV__ = process.env.NODE_ENV !== 'production';

var args = process.argv;

// conf
// import api from 'conf/api';
var alias = pickFiles({
  id: /(conf\/[^\/]+).js$/,
  pattern: SRC_PATH + '/conf/*.js'
});

// components
// import Alert from 'components/alert';
alias = Object.assign(alias, pickFiles({
  id: /(components\/[^\/]+)/,
  pattern: SRC_PATH + '/components/*/index.js'
}));

// reducers
// import reducers from 'reducers/index';
alias = Object.assign(alias, pickFiles({
  id: /(reducers\/[^\/]+).js/,
  pattern: SRC_PATH + '/js/reducers/*'
}));

// actions
// import actions from 'actions/index';
alias = Object.assign(alias, pickFiles({
  id: /(actions\/[^\/]+).js/,
  pattern: SRC_PATH + '/js/actions/*'
}));

alias = Object.assign(alias, {
  'react-router': NODE_MODULES_PATH + '/react-router/lib/index.js',
  'react-redux': NODE_MODULES_PATH + '/react-redux/lib/index.js',
  'redux': NODE_MODULES_PATH + '/redux/lib/index.js',
  'redux-thunk': NODE_MODULES_PATH + '/redux-thunk/lib/index.js'
});


var config = {
  context: SRC_PATH,
  entry: {
    app: ['babel-polyfill', SRC_PATH + '/main.js']
  },
  output: {
    path: DIST_PATH,
    filename: __DEV__ ? 'static/js/[name].js' : 'static/js/[name].[chunkhash].js',
    chunkFilename: __DEV__ ? 'static/[name].chunk.js' : 'static/js/[name].[chunkhash].chunk.js'
  },
  module: {},
  resolve: {
    root: SRC_PATH,
    alias: alias
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new AssetsWebpackPlugin({
      filename: 'asset-manifest.json',
      path: DIST_PATH
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor'],
    // })
  ]
};

// loaders
var CACHE_PATH = ROOT_PATH + '/cache';
config.module.loaders = [];

// 使用 babel 编译 jsx、es6
config.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel?presets[]=es2015'],
    include: SRC_PATH,
    exclude: /node_modules/
});


// 编译 less
if (__DEV__) {
  config.module.loaders.push({
    test: /\.(less|css)$/,
    loaders: ['style', 'css', 'postcss', 'less']
  });
} else {
  config.module.loaders.push({
    test: /\.(less|css)$/,
    loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
  });
  config.plugins.push(
    new ExtractTextPlugin('static/css/[name].[contenthash:20].css')
  );
}

// css autoprefix
var precss = require('precss');
var autoprefixer = require('autoprefixer');
config.postcss = function() {
  return [precss, autoprefixer];
}

// 图片路径处理，压缩
config.module.loaders.push({
  test: /\.(?:jpg|gif|png|svg)$/,
  loaders: [
    'file?limit=8000&name=static/img/[name].[hash:20].[ext]',
    'image-webpack'
  ]
});

// 压缩 js, css
if (!__DEV__) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  );
}

// 去掉重复模块
if (!__DEV__) {
  config.plugins.push(
    new webpack.optimize.DedupePlugin()
  );
}

// html 页面
var HtmlwebpackPlugin = require('html-webpack-plugin');
config.plugins.push(
  new HtmlwebpackPlugin({
    filename: 'index.html',
    chunks: ['app', 'vendor'],
    template: ROOT_PATH + '/index.html',
    minify: __DEV__ ? false : {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  })
);

// 内嵌 manifest 到 html 页面 px=>rem支持
config.plugins.push(function() {
  this.plugin('compilation', function(compilation) {

    compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
      var manifest = '';
      var flexable = ';(function(){var d=document,f=d.documentElement,b=d.querySelector(\'meta[name="viewport"]\'),c;function e(){var g=f.getBoundingClientRect().width;f.style.fontSize=(g/320*16)+"px"}function a(){var g=1;b=d.createElement("meta");b.setAttribute("name","viewport");b.setAttribute("content","initial-scale="+g+", maximum-scale="+g+", minimum-scale="+g+", user-scalable=no");f.firstElementChild.appendChild(b)}a();e();window.addEventListener("resize",function(){clearTimeout(c);c=setTimeout(e,100)},false);window.addEventListener("pageshow",function(g){if(g.persisted){clearTimeout(c);c=setTimeout(e,100)}},false)})();';

      Object.keys(compilation.assets).forEach(function(filename) {
        if (/\/?manifest.[^\/]*js$/.test(filename)) {
          manifest = compilation.assets[filename].source();
        }
      });

      manifest ='<script>' +flexable+manifest+ '<\/script>'
      if (manifest) {
        var htmlSource = file.html.source();
        htmlSource = htmlSource.replace(/(<\/head>)/, manifest + '$1');
        file.html.source = function() {
          return htmlSource;
        };
      }

      callback(null, file);
    });
  });
});
module.exports = config;
