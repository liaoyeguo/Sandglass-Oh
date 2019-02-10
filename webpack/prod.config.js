const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");

const customPath = path.join(__dirname, "./customPublicPath");

module.exports = {
  entry: {
    popup: [customPath, path.join(__dirname, "../chrome/extension/popup")],
    background: [
      customPath,
      path.join(__dirname, "../chrome/extension/background")
    ]
  },
  output: {
    path: path.join(__dirname, "../build/js"),
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  resolve: {
    extensions: ["*", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["react-optimize"]
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              modifyVars: {
                "primary-color": "#fc6f80",
                "link-color": "#1DA57A"
              }
            }
          }
        ]
      }
    ]
  }
};
