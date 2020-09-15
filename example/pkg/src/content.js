import pkg from 'chrome-pipe-plugin'

const c = new pkg.CTClient({ELE: 'pip'})

c.init()
c.registerPort()


c.addPGListener(data => {
  console.log(`CT get msg from PG: ${JSON.stringify(data, null,2)}`)

  setTimeout(() =>{
    c.sendObjToPg("CT", {t: new Date().getTime()})
  }, 1000)

  setTimeout(() =>{
    c.sendToBgLongMsg({msg: 'is BG ?'})
  }, 2000)
  
})

c.addBgListener(data => {
  console.log(`CT get msg from BG: ${JSON.stringify(data, null,2)}`)
 
})

