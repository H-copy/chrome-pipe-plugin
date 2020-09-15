# chrome 插件通信包



###  Summary ’🎉

这个是一个用于chrome 插件内的通信包， 封装了三个简单的类，用于插件内以及插件与页面的通信



### Install 🔌

```shell
cnpm i --save chrome-plugin-pipe
```



### Usage ✨

```js
// page
import { ref, onMounted } from 'vue'
import pkg from 'chrome-pipe-plugin'


export default {
  setup(){
    const p = ref( new pkg.PGClient({ELE: 'pip'}) )
    
    onMounted(() =>{

      const client = p.value
      
      client.init()
	 // 添加content监听
      client.addListener(data => {
        console.log(`PG get: ${JSON.stringify(data, null, 2)}`)
      })
	  // 向content发送消息
      setTimeout(() => {
        client.send('PG', {t: new Date().getTime()})
      }, 1000)
      
    })
    
  }
}
</script>


// content.js
import pkg from 'chrome-pipe-plugin'

const c = new pkg.CTClient({ELE: 'pip'})

c.init() // 初始化
c.registerPort() // 向background注册当前tab

// 添加页面监听
c.addPGListener(data => {
  console.log(`CT get msg from PG: ${JSON.stringify(data, null,2)}`)

  // 向页面发送消息
  setTimeout(() =>{
    c.sendObjToPg("CT", {t: new Date().getTime()})
  }, 1000)
  
  // 向background发送消息
  setTimeout(() =>{
    c.sendToBgLongMsg({msg: 'is BG ?'})
  }, 2000)
  
})

// 添加background监听
c.addBgListener(data => {
  console.log(`CT get msg from BG: ${JSON.stringify(data, null,2)}`)
})


// background.js
import c from 'chrome-pipe-plugin'

const bg = new c.BGClient()

bg.init()

// 添加监听
bg.addListener(data => {
  console.log(`BG get: ${JSON.stringify(data, null, 2)}`)
  // 向content发送消息
  setTimeout(() =>{
    bg.send("BG", {t: new Date().getTime(), msg: "I'm BG"})
  }, 1000)
  
})


```

> 具体例子可以查看 /example



### Skill 📎

##### 自定义配置通信元素或响应事件

> 配置详情参看 Config

```js
const c = new PGCLient({
    ELE: 'pip', // 通信元素id
    DATA_SAVE_KEY: 'PIP_MSG' // 页面通信时，数据sessionStorage缓存key
})
```

##### 链式调用

```js

const c = new PGCLient()

c.addListener(fn_1)
 .addListener(fn_2)
 .send("PG", {...})

```



### Config 📚

- Default 

  ```js
  /**
   * 默认配置
   */
  const DEFAULT_CONF = {
    ELE: 'page-pip', // content 通信元素ID
      
    PG_SEND_KEY: 'PG_TO_CONTENT', // 页面发送事件名
    CONTENT_SEND_KEY: 'CONTENT_TO_PG', // content发送事件名，既页面接受事件
    
    DATA_SAVE_KEY: 'CHROME_PLUGIN_PIP', // sessionStorage 数据缓存字段
  }
  ```

- PGClient

  ```js
  const defaultOptions = {
  	ELE: CONFIG.ELE,
  	SEND_KEY: CONFIG.PG_SEND_KEY,
  	LISTENER_KEY: CONFIG.CONTENT_SEND_KEY,
  	DATA_SAVE_KEY: CONFIG.DATA_SAVE_KEY,
  }
  ```

- CTClient

  ```js
  
  const defaultOptions = {
    ELE: CONFIG.ELE,
    SEND_TO_PG_KEY: CONFIG.CONTENT_SEND_KEY,
    LISTENER_PG_KEY: CONFIG.PG_SEND_KEY,
    DATA_SAVE_KEY: CONFIG.DATA_SAVE_KEY
  }
  ```





### API 📝

- PGClient 

  - init  初始化  `() => PGClient`

    > 主要用来获取通道元素,  清空监听函数, 元素绑定监听事件

  - updateEle  更新绑定元素 `(ele_id) => PGClient`

  - bindListener  元素绑定监听事件 `() => PGClient`

  - send  向content发送消息 `(type: string, data: Object) => PGClient`

  - addListener   添加消息监听回调 `(fn: (data: Object) => {}) => PGClient`

  - removeListener  移除消息监听 `(fn : (data: Object) => {}) => PGClient`

  - clearListener  清空监听 () => PGClient

    > 该函数也将解绑元素通信监听事件

  

- CTClient

  - init  初始化  `() => CTClient`

  - sendObjToPg  向页面发送对象类型数据  `( type: string,  data: Object ) => CTClient`

  - sendStrToPg  向页面发送字符类型数据  `( type: string,  data: string ) => CTClient`

    > 这个函数为基础的发送函数， sendObjToPg 只是 sendStrToPg 的包装函数, 数据格式都必须满足json要求

  - listenePgMsg  通过页面通信元素绑定通信监听  `() => CTClient`

  - addPGListener  添加页面消息回调  `(fn: (data: Object) => {}) => CTClient`

  - registerPort  项background注册通信 port  `() => {}`

    > 监听background时，需要保证该函数先与 background 发送消息前执行

  - sendToBgShortMsg   使用短链向background发送消息 `(data: Object) => CTClient`

  - sendToBgLongMsg  使用长链向background发送消息 `(data: Object) => CTClient`

  - addBgListener 添加background消息回调

  

- BGClinet

  - init  初始化 `() => BGClient`
  - bindListener 绑定监听 `() => BGClient`
  - addListener  添加消息回调  `(data: Object) => BGClient`
  - send 向content发送消息`( type: string,  data: string ) => BGClient`

