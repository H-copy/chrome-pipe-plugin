export default class BGClient{

	constructor(){

		this.portPool = new Map()
		this.listener = new Set()
		
		this.bindListener()
	}

	bindListener(){
		const _this = this
		
		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			const { type, data } = msg
			
			console.log( 'sort msg: ', msg )
			
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
				console.log(error)
				sendResponse({ msg: 'register fail !', status: false })
			}
		
			
		})
	}

	addListener(fn){
		if(typeof fn !== 'function'){
            throw `listener fn must be a function: ${fn}`
		}
		
		this.listener.add(fn)
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
	}
	
}


