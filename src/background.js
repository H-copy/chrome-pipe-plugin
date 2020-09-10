
/**
 * background 插件端
 */
export default class BGClient{
	static instance = null

	constructor(){

		if(BGClient.instance){
			return BGClient.instance
		}

		this.setting = Object.assign({}, defaultOptions, options)
		this.portPool = new Map()
		this.listener = new Set()
		
		BGClient.instance = this
	}

	init(){
		this.portPool = new Map()
		this.listener = new Set()
		
		this.bindListener()

		return this
	}

	bindListener(){
		const _this = this
		
		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			const { type, data } = msg
			
			if(type !== 'REGISTER_PORT'){
				_this.listener.forEach(callback => callback( 'common', msg, sender, sendResponse))
				return
			}
			
			try {
				const port = chrome.tabs.connect(sender.tab.id, {name: data.name})

				port.onMessage.addListener(data =>{
					_this.listener.forEach(callback => callback( 'port', data, port))
				})
				
				_this.portPool.set(data.name, port)
				sendResponse({ msg: 'register success !', status: true })
			} catch (error) {
				console.error(error)
				sendResponse({ msg: 'register fail !', status: false })
			}
			
		})

		return this
	}

	addListener(fn){
		if(typeof fn !== 'function'){
      throw `listener fn must be a function: ${fn}`
		}
		
		this.listener.add(fn)

		return this
	}
	
	send(type, data){
		const _this = this

		_this.portPool.forEach((port, key) => {
			try {
				port.postMessage({type, data})
			} catch (error) {
				_this.portPool.delete(key)
				console.log('port err: ', error)
			}
		})

		return this
	}
	
}


