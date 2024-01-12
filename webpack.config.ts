import path from 'path';
import { Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';

interface CustomConfiguration extends Configuration {
  devServer?: DevServerConfiguration;
}

const config: CustomConfiguration = {
  entry: './development/code/Index.ts',
  output: {
    filename: 'ChessButBetter.js',
    path: path.resolve(__dirname, 'dist'),
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
  devServer: {
    static: {
      directory: path.join(__dirname, 'development'),
    },
    port: 8080,
    client: {
      logging: 'none',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './development/views/index.html',
      filename: 'index.html',
    }),
  ],
};

export default config;
