import path from 'path';
import webpack from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

interface CustomConfiguration extends webpack.Configuration {
  devServer?: DevServerConfiguration;
}

const config: CustomConfiguration = {
  entry: {
    room: './core/controller/pages/Room.ts',
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
      {
        test: /\.svg$/,
        use: ['svg-inline-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './core/view/home.html',
      filename: 'view/home.html',
      chunks: [],
      favicon: './assets/images/logo.svg',
    }),
    new HtmlWebpackPlugin({
      template: './core/view/room.html',
      filename: 'view/room.html',
      chunks: ['room'],
      favicon: './assets/images/logo.svg',
    }),
    new HtmlWebpackPlugin({
      template: './core/view/404.html',
      filename: 'view/404.html',
      chunks: [],
      favicon: './assets/images/logo.svg',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './core/view/styles', to: 'styles' }],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    client: {
      logging: 'none',
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/(home)?$/, to: '/view/home.html' },
        { from: /^\/room$/, to: '/view/room.html' },
        { from: /./, to: '/view/404.html' },
      ],
    },
  },
};

export default config;
