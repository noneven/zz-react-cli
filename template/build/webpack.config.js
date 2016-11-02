var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
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
var uglify = args.indexOf('--uglify') > -1;


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
    app: [SRC_PATH + '/index.js']
  },
  output: {
    path: DIST_PATH,
    // chunkhash 不能与 --hot 同时使用
    // see https://github.com/webpack/webpack-dev-server/issues/377
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
      // http://stackoverflow.com/questions/30030031/passing-environment-dependent-variables-in-webpack
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
    }),

    // 使用文件名替换数字作为模块ID
    // new webpack.NamedModulesPlugin(),
    // 使用 hash 作模块 ID，文件名作ID太长了，文件大小剧增
    new HashedModuleIdsPlugin(),
    // 根据文件内容生成 hash
    new WebpackMd5Hash(),
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // new InterpolateHtmlPlugin({
    //   PUBLIC_URL: publicUrl
    // }),
    // Generates an `index.html` file with the <script> injected.
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   template: paths.appHtml,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeRedundantAttributes: true,
    //     useShortDoctype: true,
    //     removeEmptyAttributes: true,
    //     removeStyleLinkTypeAttributes: true,
    //     keepClosingSlash: true,
    //     minifyJS: true,
    //     minifyCSS: true,
    //     minifyURLs: true
    //   }
    // }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    // new webpack.DefinePlugin(env),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    // new webpack.optimize.DedupePlugin(),
    // Minify the code.
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     screw_ie8: true, // React doesn't support IE8
    //     warnings: false
    //   },
    //   mangle: {
    //     screw_ie8: true
    //   },
    //   output: {
    //     comments: false,
    //     screw_ie8: true
    //   }
    // }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    // new ExtractTextPlugin('static/css/[name].[contenthash:20].css'),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    // new ManifestPlugin({
    //   fileName: 'asset-manifest.json'
    // }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
};


// loaders
var CACHE_PATH = ROOT_PATH + '/cache';
config.module.loaders = [];

// 使用 babel 编译 jsx、es6
config.module.loaders.push({
  // test: /\.js$/,
  // exclude: /node_modules/,
  // // 这里使用 loaders ，因为后面还需要添加 loader
  // loaders: ['babel?cacheDirectory=' + CACHE_PATH]

  // test: /\.(js|jsx)$/,
  // include: SRC_PATH,
  // loaders: ['babel']
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
if (uglify) {
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
    template: SRC_PATH + '/index.html',
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

// 内嵌 manifest 到 html 页面
// config.plugins.push(function() {
//   this.plugin('compilation', function(compilation) {
//     compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
//       var manifest = '';
//       Object.keys(compilation.assets).forEach(function(filename) {
//         if (/\/?manifest.[^\/]*js$/.test(filename)) {
//           manifest = '<script>' + compilation.assets[filename].source() + '</script>';
//         }
//       });
//       if (manifest) {
//         var htmlSource = file.html.source();
//         htmlSource = htmlSource.replace(/(<\/head>)/, manifest + '$1');
//         file.html.source = function() {
//           return htmlSource;
//         };
//       }
//       callback(null, file);
//     });
//   });
// });

module.exports = config;
