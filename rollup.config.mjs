import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs'
    },
    plugins: [
        serve({
            open: true,
            host: 'localhost',
            port: 3000,
            contentBase: ['test']
        }),
        livereload({
            watch: ['dist', 'test']
        })
    ]
}