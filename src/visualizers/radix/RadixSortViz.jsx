import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { sleep } from '../../utils/utils'

function getMaxDigits(arr){
  let m = 0
  for (const v of arr){
    const d = Math.floor(Math.log10(Math.abs(v)||1))+1
    if (d>m) m=d
  }
  return m
}

function digitAt(v, exp){
  return Math.floor(Math.abs(v)/exp) % 10
}

export default function RadixSortViz({data, speed, playing, onFinish}){
  const [stage, setStage] = useState('units')
  const [order, setOrder] = useState([...data])
  const [pass, setPass] = useState(0)
  const [highlight, setHighlight] = useState({})
  const playRef = useRef(playing)
  useEffect(()=>{ playRef.current = playing },[playing])

  const passes = useMemo(()=>getMaxDigits(data),[data])

  useEffect(()=>{
    let cancelled = false
    async function run(){
      let arr = [...data]
      let exp = 1
      for (let p=0;p<passes;p++){
        setPass(p)
        setStage(p===0?'units':p===1?'tens':p===2?'hundreds':`10^${p}`)
        const buckets = Array.from({length:10},()=>[])
        for (let i=0;i<arr.length;i++){
          const v = arr[i]
          const d = digitAt(v, exp)
          buckets[d].push(v)
          setHighlight({index:i, digit:d, exp})
          setOrder([...buckets.flat()])
          await waitIfPaused(180/speed)
          if (cancelled) return
        }
        arr = buckets.flat()
        setOrder([...arr])
        exp *= 10
        await waitIfPaused(400/speed)
        if (cancelled) return
      }
      setStage('done')
      if (onFinish) onFinish(arr)
    }
    run()
    return ()=>{ cancelled = true }
  },[data, passes, speed])

  async function waitIfPaused(ms){
    const step = 50
    let t = 0
    while (t < ms){
      if (playRef.current) {
        await sleep(step)
        t += step
      } else {
        await sleep(50)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/70 capitalize">Digit: {stage}</div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/5 p-3">
          <div className="text-xs text-white/60 mb-2">Numbers</div>
          <div className="flex flex-col gap-2">
            {order.map((v,i)=>{
              const d = digitAt(v, Math.pow(10,pass))
              const active = highlight.index===i
              return (
                <motion.div layout key={i} className={`flex items-center justify-between rounded-md px-3 py-2 ${active? 'bg-accent/20 text-accent':'bg-[#0b0b0b] text-white'}`}>
                  <div>{v}</div>
                  <div className="text-xs text-white/70">digit={d}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <div className="text-xs text-white/60 mb-2">Pass {pass+1} of {passes}</div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({length:10}).map((_,d)=> (
              <div key={d} className="rounded-md bg-[#0b0b0b] p-2">
                <div className="text-xs text-white/50 mb-1">Digit {d}</div>
                <div className="min-h-[40px] flex flex-col gap-1">
                  {order.filter(v=>digitAt(v, Math.pow(10,pass))===d).map((v,i)=>(
                    <motion.div layout key={`${d}-${v}-${i}`} className="rounded bg-accent/20 text-accent text-xs px-2 py-1">{v}</motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
