var path = require('path');
const webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'dist');

var config = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './src/index.jsx')
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  resolve: {
      extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8082,
    stats: 'errors-only'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({
      MapboxAccessToken: 'pk.eyJ1Ijoib2xlZ2tsZWltYW4iLCJhIjoiY2pyM3owa3NhMDB0aTQzcG5jaHZrbHRkaCJ9.hG7WaJ_AuRNl2muX7L0R0Q'
    })
  ]

};

module.exports = config;
