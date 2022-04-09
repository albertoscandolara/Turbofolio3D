const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rules = require('require.all')('./tasks/rules');
const plugins = require('require.all')('./tasks/plugins');

module.exports = (options) => {
  const environment = options.WEBPACK_BUNDLE ? 'production' : 'development';

  rules((name, rule) => rule(environment));
  plugins((name, rule) => rule(environment));

  return {
    mode: environment,
    entry: {
      app: path.resolve(__dirname, 'src/code/main.ts')
    },
    output: {
      filename: '[name].js'
    },
    module: {
      rules: [
        ...rules.files,
        ...rules.scripts,
        rules.styles,
        {
          test: /\.(s(a|c)ss)$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: {
            loader: 'url-loader'
          }
        }
      ]
    },
    plugins: [plugins.html, plugins.images, plugins.extractStyles, plugins.purgeStyles],
    devServer: {
      open: true,
      port: 4000,
      https: false,
      hot: true,
      historyApiFallback: true,
      watchOptions: {
        poll: true
      }
      // proxy: { '/api': 'http://localhost:3000' }
    },
    optimization: {
      minimizer: [plugins.uglify],
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: path.resolve(__dirname, 'node_modules'),
            name: 'vendor',
            enforce: true
          }
        }
      }
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        styles: path.resolve(__dirname, 'src/styles'),
        assets: path.resolve(__dirname, 'src/assets'),
        '~': path.resolve(__dirname, 'src/app')
      }
    }
  };
};
