const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.resolve(__dirname, './src/main.js'),
  mode: 'development',
  target: 'lib',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 9090,
    hot: true,
    compress: true,
    open: true,
    // proxy: {
    //   '/api/': {
    //     target: 'http://example.com:9090',
    //     changeOrigin: true,
    //   },
    // },
  },
  output: {
    path: path.resolve(__dirname, '/build'),
    filename: '[name].js',
    libraryTarget: 'umd',  // 用到的模块定义规范
    library: 'myLib',   // 库的名字
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: path.resolve(__dirname, './src'),
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|ttf|otf|woff2?)(\?\S*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 5,
          },
        },
        generator: {
          filename: 'font/[name]_[hash:8][ext]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 5,
          },
        },
        generator: {
          filename: 'images/[name]_[hash:8][ext]',
        },
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.css', '.json'],
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
};
