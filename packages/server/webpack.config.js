const path = require('path');
const nodeExternals = require('webpack-node-externals');

const {
	NODE_ENV = 'production',
} = process.env;
module.exports = {
	entry: './src/app.ts',
	mode: NODE_ENV,
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'app.js'
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx'],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			use: [
				'ts-loader',
			]
		}]
	},
	externals: [ nodeExternals(),'bufferutil', 'utf-8-validate','express','mongoose']
}
