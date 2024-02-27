import path from 'path';
import webpack from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

interface CustomConfiguration extends webpack.Configuration {
  devServer?: DevServerConfiguration;
}

const config: CustomConfiguration = {
  mode: 'development',
  entry: {
    room: './development/pages/Room.ts',
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
      template: './views/home.html',
      chunks: [],
      favicon: './assets/logo.svg',
    }),
    new HtmlWebpackPlugin({
      filename: 'views/room.html',
      template: './views/room.html',
      chunks: ['room'],
      favicon: './assets/logo.svg',
    }),
    new HtmlWebpackPlugin({
      filename: 'views/404.html',
      template: './views/404.html',
      chunks: [],
      favicon: './assets/logo.svg',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'styles', to: 'styles' }],
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
        { from: /^\/(home)?$/, to: '/views/home.html' },
        { from: /^\/room$/, to: '/views/room.html' },
        { from: /./, to: '/views/404.html' },
      ],
    },
  },
};

export default config;
