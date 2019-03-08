'use strict';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const devMode = process.env.NODE_ENV !== 'production';
const LiveReloadPlugin = require('webpack-livereload-plugin');

const nunjucksPath = './src/templates/pages/';

const articles = fs.readdirSync(nunjucksPath);

let multiplesNunjucksFiles = articles.map(function(entryName) {
    return new HtmlWebpackPlugin({
        filename: entryName.replace('njk', 'html'),
        inject: 'body',
        template: `nunjucks-html-loader!${nunjucksPath + entryName}`,
    });
});

module.exports = {
    devtool: "source-map",
    output: {
        path: __dirname + '/dist/',
        filename: 'assets/scripts/scripts.min.js'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false
                    }
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts|tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.njk|nunjucks/,
                use: ['html-loader',
                    {
                        loader: 'nunjucks-html-loader',
                        options : {
                            searchPaths: ['./src/templates'],
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g)/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "./assets/images/[name].[ext]",
                            limit: 10000
                        }
                    },
                    {
                        loader: "img-loader"
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './assets/styles/'
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: 'inline',
                            plugins: () => [
                                Autoprefixer({
                                    'browsers': ['> 1%', 'last 2 versions']
                                })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/*']),
        new MiniCssExtractPlugin({
            filename: 'assets/styles/styles.min.css',
            chunkFilename: '[id].min.css',
        }),
        new LiveReloadPlugin({
            appendScriptTag: true
        }),
        new FileManagerPlugin({
            onEnd: {
                mkdir: [
                    './dist/assets/images/',
                    './dist/assets/fonts/'
                ],
                move: [
                    { source: './src/assets/images', destination: './dist/assets/images' },
                    { source: './src/assets/fonts', destination: './dist/assets/fonts' }
                ]
            }
        })
    ].concat(multiplesNunjucksFiles)
};

