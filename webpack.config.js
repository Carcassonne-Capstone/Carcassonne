const path = require('path')

module.exports = {
    entry: ['babel-polyfill', './client/index.js'],
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
        //   {
        //     test: /\.css$/,
        //     use: [
        //       'style-loader',
        //       'css-loader',
        //     ]
        //   }
        ]
    }
}