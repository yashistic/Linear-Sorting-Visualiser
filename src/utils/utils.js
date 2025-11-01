export function parseNumberArray(input){
  if (!input || !input.trim()) return []
  const parts = input.split(/[,\s]+/).filter(Boolean)
  const arr = parts.map(Number).filter((x)=>!Number.isNaN(x))
  return arr
}

export function randomArray(type='float', n=12){
  const arr=[]
  if (type==='int'){
    const range = Math.random()<0.5 ? 20 : 400
    for(let i=0;i<n;i++) arr.push(Math.floor(Math.random()*range))
  } else {
    for(let i=0;i<n;i++) arr.push(parseFloat((Math.random()).toFixed(2)))
  }
  return arr
}

export function sleep(ms){
  return new Promise(r=>setTimeout(r, ms))
}
