var path = require('path');
var SRC_DIR = path.join(__dirname, '/Client/Src');
var DIST_DIR = path.join(__dirname, '/Client/Dist');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  watch: true,
  devServer: {
    publicPath: "/",
    contentBase: "./Client/Dist",
    hot: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};