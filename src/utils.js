 
export const createMSg = (type, data) => {

  try {
    JSON.stringify(data)        
  } catch (error) {
    return [ null, error ]
  }

  const msg = JSON.stringify({ type, data, time: new Date().getTime() })
  
  return [ msg, null ]
  
}

export const createEvent = (...args) => {
  const event = document.createEvent("HTMLEvents")
  event.initEvent(...args)
  return event
}