const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsImportPlugin = require('ts-import-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const isProd = !(process.env.NODE_ENV === 'development');
const isRelease = process.env.NODE_ENV === 'release';

module.exports = function makeWebpackConfig() {
  let config = {};

  config.mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

  config.resolve = {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  };

  config.entry = {
    main: './src/main.tsx'
  };

  config.output = {
    path: path.join(__dirname, './dist'),
    publicPath: isProd ? '/' : '/',
    filename: isProd ? 'js/[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? 'js/[name].[hash].js' : '[name].bundle.js'
  };

  config.devtool = isProd ? false : 'inline-source-map';

  config.module = {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [TsImportPlugin({
                  libraryName: 'antd-mobile',
                  libraryDirectory: 'es',
                  style: 'css'
                })]
              })
            }
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}}
          ],
          use: [
            {loader: 'css-loader', options: {modules: true, sourceMap: !isProd}},
            {loader: 'postcss-loader'},
            {loader: 'sass-loader'}
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}}
          ],
          use: [
            {loader: 'css-loader'}
          ]
        }),
        include: [/node_modules/, path.join(__dirname, './src/main.css')]
      },
      {
        test: /\.(ico|woff|woff2|ttf|eot|otf)(\?.+)?$/,
        use: [
          {loader: 'file-loader'}
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: isProd ? '/' : '',
              publicPath: isProd ? '/' : '/',
            }
          }
        ]
      },
      // {
      //   test: /\.html/,
      //   use: [
      //     {loader: 'html-loader'}  // 用了这个没法使用htmlwebpackplugin的变量替代功能，可不用，要用对test做更严格的匹配，避免对index.html进行load
      //   ]
      // }
    ]
  };

  config.externals = {};

  config.plugins = [];

  config.plugins.push(
    new ExtractTextPlugin({
      filename: isProd ? 'css/[name].[hash].css' : '[name].bundle.css'
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
      templateParameters: {
        url: isProd ? JSON.stringify('') : JSON.stringify('')
      }
    }),

    new webpack.DefinePlugin({
    })
  );

  if (isProd) {
    config.plugins.push(
      new OptimizeCssAssetsPlugin()
    )
  }

  config.optimization = {
    minimizer: [
      new UglifyPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            warnings: false,
            dead_code: true,
            unused: true
          }
        },
        extractComments: false,
        sourceMap: false,
      })
    ],
    // splitChunks: {
    //   cacheGroups: {
    //     common: {
    //       name: "common",
    //       chunks: "initial",
    //       minChunks: 2       // 一入口文件分离有问题，别填1，选2，原因未知，等待研究
    //     }
    //   }
    // }
  };

  config.devServer = {
    contentBase: path.join(__dirname, './dist'),
    historyApiFallback: {
      index: `/index.html`,
    },
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false,
    },
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '*': {
        target: '',
        secure: false,
        changeOrigin: true
      }
    }
  };

  return config;
};
