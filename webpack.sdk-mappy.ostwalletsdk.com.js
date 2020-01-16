const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
<<<<<<< HEAD
    entry: './src/OstSdk/index.js',
=======
    entry: ['@babel/polyfill', './src/OstSdk/index.js'],
>>>>>>> 2fb9f78ddf6181fc1d1a7808bd74a4c5aea0b5e9
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'OstSdk.js',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env"
                        ]
                    }
                }
            },
            {
                test: /\.css$/, 
                use: ['style-loader','css-loader' ]
            }
        ]
    },
};


const devConfig = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        port: 9001,
        liveReload: true,
        clientLogLevel: 'silent'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Sdk-mappy.ostwalletsdk.com",
            template: "./devserver/sdk-mappy.ostwalletsdk.com.html",
            inject: true
        })
    ]
};

const prodConfig = {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin()
    ]
};

module.exports = env => {

    let envConfig = env.NODE_ENV === 'prod' ? prodConfig : devConfig;

    return {
        ...commonConfig,
        ...envConfig
    }
};

