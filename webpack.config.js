const path = require('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: 'commonjs',
                targets: {
                  browsers: ['last 2 versions'],
                },
              }],
            ],
            sourceType: 'unambiguous',
            babelrc: false,
            configFile: false,
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
        filename: 'images/[name].[hash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
  static: './dist',
  port: 3000,
  open: true,
  hot: true,
},
  mode: process.env.NODE_ENV || 'development',
};