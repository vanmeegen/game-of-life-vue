const path = require('path');
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: "development",
  entry: {web: "./src/index.ts"},
  output: {
    // output path
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist/',
    filename: 'bundle-[name].js'
  },

  devtool: "#eval-source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".vue", ".tsx", ".js", ".min.js"],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {test: /\.vue$/, loader: "vue-loader"},
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.(png|jpg|gif)$/, loader: "file-loader?name=img/[name].[ext]"}
    ]
  },

  plugins: [new webpack.DefinePlugin({
    // the api server url could be something like http://myserver:8080
    // however, we use blank in order to server all api requests from the same server as the html/css/js - files
    // this works both for development (with the devserver proxy) and in production
    __API_SERVER_URL__: JSON.stringify(''),
    __VERSION__: JSON.stringify(require("./package.json").version),
    __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER),
    __GIT_COMMIT__: JSON.stringify(process.env.GIT_COMMIT),
    __NODE_ENV__: JSON.stringify('development')
  }),
  new VueLoaderPlugin()],

  devServer: {
    port: 8080
  }

};