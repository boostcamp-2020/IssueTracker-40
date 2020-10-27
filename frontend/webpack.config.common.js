const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const parseEnvKeys = (env) => {
    const currentPath = path.join(__dirname);
    const basePath = `${currentPath}/env/.env`;
    const envPath = `${basePath}.${env.ENVIRONMENT}`;
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    const fileEnv = dotenv.config({
        path: finalPath
    }).parsed;

    return Object.keys(fileEnv).reduce((keys, key) => {
        keys[`process.env.${key}`] = JSON.stringify(fileEnv[key]);
        return keys;
    }, {});
};

module.exports = (env) => {
    const envKeys = parseEnvKeys(env);

    return {
        resolve: {
            extensions: [".jsx", ".js"],
            alias: {
                "@config": path.resolve(__dirname, "config"),
                "@components": path.resolve(__dirname, "src/components"),
                "@pages": path.resolve(__dirname, "src/pages"),
                "@style": path.resolve(__dirname, "src/common/style"),
                "@utils": path.resolve(__dirname, "src/common/utils"),
                "@imgs": path.resolve(__dirname, "public/imgs")
            }
        },
        entry: {
            index: "./src/index"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    modules: false,
                                    targets: {
                                        browsers: ["> 1% in KR"]
                                    }
                                }
                            ],
                            ["@babel/preset-react"]
                        ]
                    }
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader", "sass-loader"]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                filename: "index.html",
                chunks: ["index"],
                hash: true
            }),
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin(envKeys)
        ],
        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].js"
        }
    };
};
