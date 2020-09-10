/**
 * chrome 插件通信管道
 */
import CONFIG from './config'
import {createMSg, createEvent} from './utils'

// 默认配置
const defaultOptions = {
    ELE: CONFIG.ELE,
    SEND_KEY: CONFIG.PG_SEND_KEY,
    LISTENER_KEY: CONFIG.CONTENT_SEND_KEY,
    DATA_SAVE_KEY: CONFIG.DATA_SAVE_KEY,
}

/**
 * 页面端
 * 
 * @param { object } options 配置项
 *  - ELE: 通信元素 ID
 *  - SEND_KEY: 发送事件名
 *  - LISTENER_KEY: 接收事件名
 *  - DATA_SAVE_KEY: 缓存字段名
 * 
 */
export default class PGClient{

    static instance = null

    constructor(options={}){

        // 单例模式
        if(PGClient.instance){
            return PGClient.instance
        }

        this.setting = Object.assign({}, defaultOptions, options)
        
        this.ele = null
        this.listener = new Set()

        PGClient.instance = this
                
    }

    init(){
        this.listener = new Set()
        this.ele = document.querySelector(`#${this.setting.ELE}`)
        this.bindListener()

        return this
    }

    // 重绑定通信元素
    updateEle(){
        this.ele = document.querySelector(`#${this.setting.ELE}`)
        this.bindListener()

        return this
    }
    
    // 绑定通信事件
    bindListener(){

        const { ele, setting, listener } = this
        
        ele.addEventListener(setting.LISTENER_KEY, e => {

            const data = JSON.parse(sessionStorage.getItem(setting.DATA_SAVE_KEY))
            listener.forEach(callback => callback(data, e))
            
        })

        return this
    }
    
    //  发送
    send(type, data={}){   
        
        const { ele, setting } = this
        const [msgStr, err] = createMSg(type, data)

        if(err){
            return err
        }
      
        sessionStorage.setItem(setting.DATA_SAVE_KEY, msgStr)
        const event = createEvent(setting.SEND_KEY, false, false)
        ele.dispatchEvent(event)
        
        return this
    }

    // 添加接收
    addListener(fn){

        if(typeof fn !== 'function'){
            throw `listener fn must be a function: ${fn}`
        }

        this.listener.add(fn)
        
        return this
    }
    
    // 移除接收
    removeListener(fn){
        const { listener } = this
        
        if(!listener.has(fn)){return}
        listener.delete(fn)

        return this
    }

    // 清空接收
    clearListener(){
        this.listener.clear()

        return this
    }
    
}



