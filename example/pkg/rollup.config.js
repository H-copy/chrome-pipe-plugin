
import resolve from 'rollup-plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs'; // commonjs模块转换插件
import babel from "rollup-plugin-babel"; // babel 插件
import { eslint } from 'rollup-plugin-eslint'; // eslint插件

const defaultConf = {
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
    input: './src/content.js',
    output: {
      name: 'my-pkg',  
      file: './content.js',
      format: 'es'
    }
  }),

  buildConf({
    input: './src/background.js',
    output: {
      name: 'my-pkg',  
      file: './background.js',
      format: 'es'
    }
  })
  
]
