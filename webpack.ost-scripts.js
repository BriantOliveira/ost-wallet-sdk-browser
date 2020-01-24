const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
    entry: {
        "OstWalletSdk": "./src/OstWalletSdk/index.js",
        "ost-sdk-iframe-script": "./src/OstSdk/index.js",
        "ost-sdk-key-manager-script": "./src/OstSdkKeyManager/index.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
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
        port: 9090,
        liveReload: true,
        clientLogLevel: 'silent'
    },
    plugins: [
        new CleanWebpackPlugin(),
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

