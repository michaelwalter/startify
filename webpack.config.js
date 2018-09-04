module.exports = {
    output: {
        filename: 'scripts.min.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.json']
    },
    devtool: 'inline-source-map'
};