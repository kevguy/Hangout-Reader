var path = require('path');

var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	// context: path.resolve('js'),
	entry: {
		about: './js/app',
		// fileupload: './js/fileupload'
	},
	output: {
		path: path.resolve('build/js/'),
		publicPath: '/public/assets/js/',
		filename: "[name]_page.js"
	},
	watch: true,
	plugins: [
		commonsPlugin,
		// new UglifyJSPlugin({
		// 	// compress: { warnings: false },
		// 	// include: /\.min\.js$/
		// }),
		new ExtractTextPlugin("[name].css"),
		new OptimizeCssAssetsPlugin({
		    //assetNameRegExp: /\.min\.css$/,
		    // default is /\.css$/g
		    cssProcessorOptions: { discardComments: { removeAll: true } }
		})
	],
	devServer: {
		contentBase: 'public'
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'jshint-loader'
			}
		],
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{ 
                test: /\.worker$/,
                exclude: /node_modules/,
                loader: "worker-loader",
            },
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader")
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
			},
			{
				test: /\.(png|jpg|ttf|eot)$/,
				exclude: /node_modules/,
				loader: 'url-loader?limit=100000'
			},
			{
				test: /\.json$/,
				exclude: /node_modules/,
				loader: "json-loader!" + path.resolve('loaders/strip')
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.es6']
	},
	externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "Vue": "Vue",
        "dialogPolyfill": "dialogPolyfill",
        "Rx": "Rx",
        "twemoji": "twemoji"
    }
};