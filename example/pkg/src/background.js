import c from 'chrome-pipe-plugin'

const bg = new c.BGClient()

bg.init()

bg.addListener(data => {

  console.log(`BG get: ${JSON.stringify(data, null, 2)}`)
  
  setTimeout(() =>{
    bg.send("BG", {t: new Date().getTime(), msg: "I'm BG"})
  }, 1000)
  
})