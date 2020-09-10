 
/**
 * 创建消息
 * @param {string} type 消息类型标识 
 * @param {object} data 消息体
 */
export const createMSg = (type, data) => {

  try {
    JSON.stringify(data)        
  } catch (error) {
    return [ null, error ]
  }

  const msg = JSON.stringify({ type, data, time: new Date().getTime() })
  
  return [ msg, null ]
  
}

/**
 * 创建自定义事件
 * @param  {any} args 自定义事件参数 
 */
export const createEvent = (...args) => {
  const event = document.createEvent("HTMLEvents")
  event.initEvent(...args)
  return event
}