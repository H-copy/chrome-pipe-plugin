/**
 * 页面注入端 
 */
import CONFIG from './config'
import {createMSg, createEvent} from './utils'


const defaultOptions = {
  ELE: CONFIG.ELE,
  SEND_TO_PG_KEY: CONFIG.CONTENT_SEND_KEY,
  LISTENER_PG_KEY: CONFIG.PG_SEND_KEY,
  DATA_SAVE_KEY: CONFIG.DATA_SAVE_KEY,
  
  SEND_TO_BG_KEY: CONFIG.BG_SEND_KEY,
  LISTENER_BG_KEY: CONFIG.BG_LISTENER_KEY,
}

/**
 * content 注入端
 * @param { object } options
 */
export default class CTClient{
  static instance = null  
  constructor(options){  
    if(CTClient.instance){
      return CTClient.instance
    }  
    this.setting = Object.assign({}, defaultOptions, options)
    this.ele = document.querySelector(`#${this.setting.ELE}`)
    
    this.listenePGFn = new Set() 
    this.listeneBGFn = new Set()
    this.port = null
    this.tabName = `${new Date().getTime()}`  
    this.listenePgMsg()  
    CTClient.instance = this
  }  
  init(){
    this.listenePGFn = new Set() 
    this.listeneBGFn = new Set()
    this.port = null
    this.tabName = `${new Date().getTime()}`  
    this.ele = document.querySelector(`#${this.setting.ELE}`)
    this.listenePgMsg()  
    return this
  }  
  sendObjToPg(type , data){  
    const [msgStr, err] = createMSg(type, data)  
    if(err){return err}
    
    this.sendStrToPg(msgStr)  
    return this
  }
  
  sendStrToPg(msgStr){
    sessionStorage.setItem(this.setting.DATA_SAVE_KEY, msgStr)
    const event = createEvent(this.setting.SEND_TO_PG_KEY, false, false)
    this.ele.dispatchEvent(event)  
    return this
  }  
  listenePgMsg(){
    const { ele, setting, listenePGFn } = this  
    ele.addEventListener(setting.LISTENER_PG_KEY, e => {
      const data = JSON.parse(sessionStorage.getItem(setting.DATA_SAVE_KEY))
      listenePGFn.forEach(callback => callback(data, e))
    })
    
    return this
  }  
  addPGListener(fn){  
    if(typeof fn !== 'function'){
      throw new Error(`listener fn must be a function: ${fn}`) 
    }  
    this.listenePGFn.add(fn)  
    return this
  }
  
  registerPort(){
    const _this = this
    const msg = { type: 'REGISTER_PORT', data:{ name: _this.tabName } }  
    chrome.runtime.onConnect.addListener(port =>{
      _this.port = port
      
      port.onMessage.addListener(data =>{ 
        if(!_this.port){return}
        _this.listeneBGFn.forEach(callback => callback(data))
      })
    })
    
    // 发起注册
    this.sendToBgShortMsg(msg, backMsg =>{
      console.log(backMsg)
    })
    
    return this
  }  
  sendToBgShortMsg(data){
    chrome.runtime.sendMessage(data)
    return this
  }  
  sendToBgLongMsg(data){
    if(!this.port){return false}
    this.port.postMessage(data)
    return true
  }  
  addBgListener(fn){
    if(typeof fn !== 'function'){
      throw `listener fn must be a function: ${fn}`
    }
    this.listeneBGFn.add(fn)  
    return this
  }

    

}
