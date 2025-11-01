import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sleep } from '../../utils/utils'

export default function CountingSortViz({data, speed, playing, onFinish}){
  const [count, setCount] = useState([])
  const [prefix, setPrefix] = useState([])
  const [output, setOutput] = useState([])
  const [active, setActive] = useState(null)
  const [stage, setStage] = useState('count')
  const playRef = useRef(playing)
  useEffect(()=>{ playRef.current = playing },[playing])

  const min = useMemo(()=>Math.min(...data),[data])
  const max = useMemo(()=>Math.max(...data),[data])
  const k = max - min + 1

  useEffect(()=>{
    let cancelled = false
    async function run(){
      const c = new Array(k).fill(0)
      for (let i=0;i<data.length;i++){
        const v = data[i]
        c[v - min]++
        setActive({section:'input', index:i})
        setCount([...c])
        await waitIfPaused(250/speed)
        if (cancelled) return
      }
      setStage('prefix')
      const p = [...c]
      for (let i=1;i<p.length;i++){
        p[i] = p[i] + p[i-1]
        setActive({section:'count', index:i})
        setPrefix([...p])
        await waitIfPaused(250/speed)
        if (cancelled) return
      }
      setStage('place')
      const out = new Array(data.length)
      for (let i=data.length-1;i>=0;i--){
        const v = data[i]
        const idx = v - min
        p[idx]--
        const pos = p[idx]
        out[pos] = v
        setActive({section:'place', index:i})
        setPrefix([...p])
        setOutput([...out])
        await waitIfPaused(300/speed)
        if (cancelled) return
      }
      setStage('done')
      if (onFinish) onFinish(out)
    }
    run()
    return ()=>{ cancelled = true }
  },[data, k, min, speed])

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

  const cell = (v, key, highlight=false) => (
    <div key={key} className={`min-w-8 px-2 py-1 rounded-md text-xs text-center ${highlight? 'bg-accent/30 text-accent':'bg-white/5 text-white'}`}>{v ?? ''}</div>
  )

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/70 capitalize">Stage: {stage}</div>
      <div className="rounded-lg bg-white/5 p-3">
        <div className="text-xs text-white/60 mb-2">Input Array</div>
        <div className="flex flex-wrap gap-2">
          {data.map((v,i)=>cell(v,`in-${i}`, active?.section==='input' && active.index===i))}
        </div>
      </div>
      <div className="rounded-lg bg-white/5 p-3">
        <div className="text-xs text-white/60 mb-2">Count Array (min={min}, max={max})</div>
        <div className="flex flex-wrap gap-2">
          {new Array(k).fill(0).map((_,i)=>cell(count[i]??0,`c-${i}`, active?.section==='count' && active.index===i))}
        </div>
      </div>
      <div className="rounded-lg bg-white/5 p-3">
        <div className="text-xs text-white/60 mb-2">Prefix Sum Array</div>
        <div className="flex flex-wrap gap-2">
          {new Array(k).fill(0).map((_,i)=>cell(prefix[i]??count[i]??0,`p-${i}`, active?.section==='prefix' && active.index===i))}
        </div>
      </div>
      <div className="rounded-lg bg-white/5 p-3">
        <div className="text-xs text-white/60 mb-2">Output (stable placement)</div>
        <div className="flex flex-wrap gap-2">
          {new Array(data.length).fill(0).map((_,i)=>cell(output[i],`o-${i}`))}
        </div>
      </div>
    </div>
  )
}
