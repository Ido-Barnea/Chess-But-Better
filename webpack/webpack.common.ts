import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  entry: path.resolve(__dirname, '..', 'core/view/Index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        use: ['file-loader?name:[name].[ext]'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'core/view/index.html'),
    }),
  ],
  stats: 'errors-only',
}

export default config;
