import babel from 'rollup-plugin-babel';

module.exports = {

    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'umd',
        name: 'chrome-pip'
    },
    plugins: [ babel({exclude: 'node_modules/**'}) ]

}