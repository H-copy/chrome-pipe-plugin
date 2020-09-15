/**
 * 默认配置
 */
const DEFAULT_CONF = {
  ELE: 'page-pip', // content 通信元素ID
  PG_SEND_KEY: 'PG_TO_CONTENT', // 页面发送事件名
  CONTENT_SEND_KEY: 'CONTENT_TO_PG', // content发送事件名，既页面接受事件
  
  DATA_SAVE_KEY: 'CHROME_PLUGIN_PIP', // sessionStorage 数据缓存字段
}


export default DEFAULT_CONF