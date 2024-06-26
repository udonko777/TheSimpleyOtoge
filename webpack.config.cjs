// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';


/** @type {import('webpack').Configuration} */
const config = {
    entry: './src/index.ts',
    output: {
        assetModuleFilename: 'assets/[hash][ext][query]',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            favicon: './src/resource/demo/favicon.ico'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                "test": /\.ts$/,
                "use": "ts-loader",
                "exclude": /node_modules/
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(mp3|wav|ogg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(text|txt|bms|bme)$/i,
                type: 'asset/source'
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    "resolve": {
        "extensions": [".ts", ".js"]
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
