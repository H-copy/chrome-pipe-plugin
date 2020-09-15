<template>
<div>
  <div id='pip'></div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import pkg from 'chrome-pipe-plugin'


export default {
  setup(){
    const p = ref( new pkg.PGClient({ELE: 'pip'}) )
    
    onMounted(() =>{

      const client = p.value
      
      client.init()

      client.addListener(data => {
        console.log(`PG get: ${JSON.stringify(data, null, 2)}`)
      })

      setTimeout(() => {
        client.send('PG', {t: new Date().getTime()})
      }, 1000)
      
    })
    
  }
}
</script>
