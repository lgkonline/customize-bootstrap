const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),
    entry: [
        "./main.js",
    ],
    output: {
        path: path.join(__dirname, "www"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                ],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader", options: { importLoaders: 1 }
                        }
                    ]
                })
            },
            // {
            //     test: /\.(sass|scss)$/,
            //     // exclude: "/node_modules/bootstrap/",
            //     loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
            // },
            {
                test: /\.(sass|scss)$/,
                // exclude: "/node_modules/bootstrap/",
                loaders: ["css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, "node_modules"),
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "[name].css",
            disable: true
        })
    ]
};