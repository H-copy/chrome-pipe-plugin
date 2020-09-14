
import resolve from 'rollup-plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs'; // commonjs模块转换插件
import babel from "rollup-plugin-babel"; // babel 插件
import { eslint } from 'rollup-plugin-eslint'; // eslint插件

const defaultConf = {

  input: './src/main.js', // 打包的入口文件
  output:{
    name: 'my-pkg',  // 输入的包名
    file: './lib/index.js', // 打包输出地址, 这里的导出地址就是package内main的地址
    format: 'es' // 包类型
  },
  plugins: [  // 使用的插件
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    eslint({ 
      throwOnError: true,
      include: ['src/**'],
      exclude: ['node_modules/**']
    })
  ],
  ignore: [
    "node_modules/**" // 忽略目录
  ]
  
}

const buildConf = option =>{
  return Object.assign({}, defaultConf, option)
}

export default [

  buildConf({
    output: {
      name: 'my-pkg',  
      file: './bin/index.js',
      format: 'es'
    }
  }),

  buildConf({
    output: {
      name: 'my-pkg',  
      file: './lib/index.js',
      format: 'umd'
    }
  })
  
]
