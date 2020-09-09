/**
 * chrome 插件通信管道
 */
import CONFIG from './config'
import {createMSg, createEvent} from './utils'


const defaultOptions = {
    ELE: CONFIG.ELE,
    SEND_KEY: CONFIG.PG_SEND_KEY,
    LISTENER_KEY: CONFIG.CONTENT_SEND_KEY,
    DATA_SAVE_KEY: CONFIG.DATA_SAVE_KEY,
}


export default class PGClient{

    static instance = null

    constructor(options={}){

        // 单例模式
        if(PageClient.instance){
            return PageClient.instance
        }

        this.setting = Object.assign({}, defaultOptions, options)
        
        this.ele = document.querySelector(`#${this.setting.ELE}`)
        this.listener = new Set()
        this.bindListener()

        PageClient.instance = this
                
    }

    // 重绑定通信元素
    updateEle(){
        this.ele = document.querySelector(`#${this.setting.ELE}`)
        this.bindListener()
    }
    
    // 绑定通信事件
    bindListener(){

        const { ele, setting, listener } = this
        
        ele.addEventListener(setting.LISTENER_KEY, e => {

            const data = JSON.parse(sessionStorage.getItem(setting.DATA_SAVE_KEY))
            listener.forEach(callback => callback(data, e))
            
        })
    }
    
    // 发送
    send(type, data={}){   
        
        const { ele, setting } = this
        const [msgStr, err] = createMSg(type, data)

        if(err){
            return err
        }
      
        sessionStorage.setItem(setting.DATA_SAVE_KEY, msgStr)
        const event = createEvent(setting.SEND_KEY, false, false)
        ele.dispatchEvent(event)
                
    }

    // 添加接收
    addListener(fn){

        if(typeof fn !== 'function'){
            throw `listener fn must be a function: ${fn}`
        }

        this.listener.add(fn)
        
    }
    
    // 移除接收
    removeListener(fn){
        const { listener } = this
        
        if(!listener.has(fn)){return}
        listener.delete(fn)
    }

    // 清空接收
    clearListener(){
        this.listener.clear()
    }
    
}



