import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sleep } from '../../utils/utils'

export default function BucketSortViz({data, speed, playing, onFinish}){
  const [stage, setStage] = useState('drop')
  const [buckets, setBuckets] = useState([])
  const [sorted, setSorted] = useState([])
  const playRef = useRef(playing)
  useEffect(()=>{ playRef.current = playing },[playing])

  const normalized = useMemo(()=>{
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    return { min, max, range }
  },[data])

  const k = Math.max(1, Math.floor(Math.sqrt(data.length||1)))

  useEffect(()=>{
    let cancelled = false
    async function run(){
      const bs = new Array(k).fill(0).map(()=>[])
      for (let i=0;i<data.length;i++){
        const v = data[i]
        let idx = Math.floor(((v - normalized.min)/normalized.range) * k)
        if (idx===k) idx = k-1
        bs[idx].push(v)
        setBuckets(bs.map(x=>[...x]))
        await waitIfPaused(350/speed)
        if (cancelled) return
      }
      setStage('sort')
      for (let i=0;i<k;i++){
        bs[i].sort((a,b)=>a-b)
        setBuckets(bs.map(x=>[...x]))
        await waitIfPaused(500/speed)
        if (cancelled) return
      }
      setStage('merge')
      const out=[]
      for (let i=0;i<k;i++){
        for (let v of bs[i]){
          out.push(v)
          setSorted([...out])
          await waitIfPaused(200/speed)
          if (cancelled) return
        }
      }
      setStage('done')
      if (onFinish) onFinish(out)
    }
    run()
    return ()=>{ cancelled = true }
  },[data, k, normalized.min, normalized.range, speed])

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

  const labels = Array.from({length:k}).map((_,i)=>{
    const a = normalized.min + (i/ k) * normalized.range
    const b = normalized.min + ((i+1)/ k) * normalized.range
    return `${a.toFixed(2)} – ${b.toFixed(2)}`
  })

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/70 capitalize">Stage: {stage}</div>
      <div className="space-y-3">
        {buckets.map((bucket, i)=> (
          <div key={i} className="rounded-lg bg-white/5 p-2">
            <div className="text-xs text-white/60 mb-1">Bucket {i+1} • {labels[i]}</div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence initial={false}>
                {bucket.map((v, idx)=> (
                  <motion.div layout initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} exit={{opacity:0}} key={`${v}-${idx}`} className="px-2 py-1 rounded-md bg-accent/20 text-accent text-xs">
                    {Number(v).toFixed(2)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      {sorted.length>0 && (
        <div className="rounded-lg bg-white/5 p-3">
          <div className="text-xs text-white/60 mb-1">Output</div>
          <div className="flex flex-wrap gap-2">
            {sorted.map((v,i)=>(
              <motion.div layout key={i} className="px-2 py-1 rounded-md bg-accent/20 text-accent text-xs">{Number(v).toFixed(2)}</motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
