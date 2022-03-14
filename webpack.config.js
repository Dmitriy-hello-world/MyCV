const path = require("path");
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: path.join(__dirname, './src/assets'),
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const optimization = () => {
    const config = {
      splitChunks: {
        cacheGroups: {
            vendor: {
                name: 'vendors',
                test: /node_modules/,
                chunks: 'all',
                enforce: true,
            },
        },
        chunks: 'all'
      }
    };

    if (isProd) {
      config.minimizer = [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin()
      ];
    }
  
    return config;
};

module.exports = {
    context: PATHS.src,
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './js/index.js']
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: '[file][ext]'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `${PATHS.assets}/`,
                    to: `${PATHS.dist}/assets/`,
                    noErrorOnMissing: true,
                },
            ],
        }),
        new ESLintPlugin()
    ],
    resolve: {
        extensions: [
            '.js',
            '.png',
            '.svg',
            '.jpeg',
            '.jpg',
            '.json',
            '.html',
            '.css',
            '.scss',
        ],
    },
    devtool: isDev ? 'source-map' : false,
    module: {
        rules: [
            {
            test: /\.css/,
            use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: isDev,
                    reloadAll: true
                  },
                },
                'css-loader'
              ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /.(png|gif|jpe?g|ico|webp|svg|ttf|woff|woff2|otf|eot|jpeg2000)$/,
                type: 'asset/resource',
                generator: {
                    filename: './[path][name][ext]',
                },
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            }
        ]
    },
    optimization: optimization(),
    devServer: {
        port: 8081,
        static: PATHS.src,
        hot: isDev,
        client: {
            overlay: {
                warnings: false,
                errors: false,
            },
        },
    },
};