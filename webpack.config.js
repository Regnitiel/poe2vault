const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
	const isProduction = argv.mode === "production";

	return {
		entry: "./src/index.tsx",
		target: "electron-renderer",
		externalsPresets: { node: false },
		externals: {
			// Override electron-renderer target to bundle these modules
			events: false,
		},
		mode: argv.mode || "development",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "bundle.js",
			publicPath: isProduction ? "./" : "/",
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
			fallback: {
				path: require.resolve("path-browserify"),
				fs: false,
				global: false,
				process: require.resolve("process/browser"),
				buffer: require.resolve("buffer"),
				events: require.resolve("events"),
			},
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					exclude: /node_modules/,
					use: {
						loader: "ts-loader",
					},
				},
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								"@babel/preset-env",
								"@babel/preset-react",
								"@babel/preset-typescript",
							],
						},
					},
				},
				{
					test: /\.css$/,
					exclude: /\.module\.css$/,
					use: ["style-loader", "css-loader"],
				},
				{
					test: /\.module\.css$/,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								modules: {
									localIdentName: "[name]__[local]___[hash:base64:5]",
								},
							},
						},
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: "images",
								publicPath: "./images",
							},
						},
					],
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				"globalThis.global": "globalThis",
				global: "globalThis",
				"process.env.NODE_ENV": JSON.stringify(
					isProduction ? "production" : "development"
				),
			}),
			new webpack.ProvidePlugin({
				process: "process/browser",
				Buffer: ["buffer", "Buffer"],
			}),
			new HtmlWebpackPlugin({
				template: "./public/index.html",
				filename: "index.html",
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: "public/Images",
						to: "Images",
					},
				],
			}),
		],
		devServer: {
			port: 3000,
			hot: true,
			static: {
				directory: path.join(__dirname, "public"),
			},
		},
		devtool: isProduction ? false : "source-map", // Only show source maps in development
	};
};
