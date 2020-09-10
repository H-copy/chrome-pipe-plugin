import babel from 'rollup-plugin-babel';

module.exports = {

    input: 'src/main.js',
    output: {
        file: 'lib/index.js',
        format: 'umd',
        name: 'chrome-pip'
    },
    plugins: [ babel({exclude: 'node_modules/**'}) ]

}