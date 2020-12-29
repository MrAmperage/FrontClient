module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'production',
  entry: './src/Components/App.jsx',
  output: {
    path: '/opt/Projects/wrclient/res/js',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
            },
          },
        ],
      },
    ],
  },
};
