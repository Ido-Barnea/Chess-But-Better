import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
  mode: 'production',
  entry: {
    room: './core/development/pages/Room.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'views/home.html',
      template: './core/views/home.html',
      chunks: [],
      favicon: './assets/logo.svg',
    }),
    new HtmlWebpackPlugin({
      filename: 'views/room.html',
      template: './core/views/room.html',
      chunks: ['room'],
      favicon: './assets/logo.svg',
    }),
    new HtmlWebpackPlugin({
      filename: 'views/404.html',
      template: './core/views/404.html',
      chunks: [],
      favicon: './assets/logo.svg',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './core/styles', to: 'styles' }],
    }),
  ],
};

export default config;
