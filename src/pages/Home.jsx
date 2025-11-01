import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ArrayInput from '../ui/ArrayInput'
import RecommendationCard from '../ui/RecommendationCard'
import Controls from '../ui/Controls'
import VisualizerSwitcher from '../visualizers/VisualizerSwitcher'
import { analyzeAndRecommend } from '../utils/recommend'
import { parseNumberArray, randomArray } from '../utils/utils'

export default function Home(){
  const [raw, setRaw] = useState('0.42, 0.32, 0.23, 0.52, 0.25')
  const [arr, setArr] = useState([0.42,0.32,0.23,0.52,0.25])
  const [algo, setAlgo] = useState('bucket')
  const [rec, setRec] = useState(null)
  const [speed, setSpeed] = useState(0.5)
  const [playing, setPlaying] = useState(true)
  const [started, setStarted] = useState(false)
  const [history, setHistory] = useState([])
  const vizKey = useRef(0)

  const stats = useMemo(()=>rec?.stats||null,[rec])

  const onAnalyze = () => {
    const a = parseNumberArray(raw)
    setArr(a)
    const r = analyzeAndRecommend(a)
    setRec(r)
    if (r.recommended) setAlgo(r.recommended)
    setStarted(false)
  }

  const onVisualize = () => {
    const a = parseNumberArray(raw)
    setArr(a)
    vizKey.current += 1
    setStarted(true)
  }

  const onRandom = (type='float') => {
    const a = randomArray(type)
    setRaw(a.join(', '))
    setArr(a)
    setRec(null)
    setStarted(false)
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-xl bg-panel p-4 shadow-soft">
          <div className="flex flex-col gap-3">
            <ArrayInput value={raw} onChange={setRaw} />
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={onAnalyze} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm">Analyze & Recommend</button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/60">Algorithm</span>
                <select value={algo} onChange={(e)=>{setAlgo(e.target.value); setStarted(false)}} className="bg-[#0b0b0b] border border-white/10 rounded-md px-2 py-1">
                  <option value="bucket">Bucket Sort</option>
                  <option value="counting">Counting Sort</option>
                  <option value="radix">Radix Sort</option>
                </select>
              </div>
              <button onClick={onVisualize} className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition text-sm">Execute</button>
              <div className="ml-auto flex gap-2">
                <button onClick={()=>onRandom('float')} className="px-3 py-2 rounded-lg bg-white/5 text-xs">Random Floats</button>
                <button onClick={()=>onRandom('int')} className="px-3 py-2 rounded-lg bg-white/5 text-xs">Random Ints</button>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-panel p-4 shadow-soft">
          <Controls speed={speed} setSpeed={setSpeed} playing={playing} setPlaying={setPlaying} />
          {rec && <RecommendationCard rec={rec} />}
          {!rec && (
            <div className="text-xs text-white/60">Analyze to get a recommendation. You can still pick any algorithm manually.</div>
          )}
        </div>
      </section>

      {started ? (
        <motion.section key={vizKey.current} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="rounded-xl bg-panel p-4 shadow-soft">
          <VisualizerSwitcher 
            algo={algo} 
            data={arr} 
            speed={speed} 
            playing={playing} 
            onFinish={(output)=>{
              setHistory(h=>[
                { id: Date.now(), algo, output: [...output] },
                ...h,
              ])
            }}
          />
        </motion.section>
      ) : (
        <div className="rounded-xl bg-panel p-8 text-center text-sm text-white/70 shadow-soft">
          Choose an algorithm and click <span className="text-accent">Execute</span> to start the animation.
        </div>
      )}

      {history.length>0 && (
        <div className="rounded-xl bg-panel p-4 shadow-soft">
          <div className="text-sm mb-2">Execution History</div>
          <div className="space-y-2 text-xs">
            {history.map(run=> (
              <div key={run.id} className="rounded bg-white/5 px-3 py-2">
                <span className="mr-2 uppercase">{run.algo}:</span>
                <span className="break-all">[{run.output.join(', ')}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-white/5 px-3 py-2"><div className="text-white/50">n</div><div className="text-white">{stats.n}</div></div>
          <div className="rounded-lg bg-white/5 px-3 py-2"><div className="text-white/50">range</div><div className="text-white">{Number(stats.range_val).toFixed(3)}</div></div>
          <div className="rounded-lg bg-white/5 px-3 py-2"><div className="text-white/50">uniformity</div><div className="text-white">{stats.uniformity_score==null?'—':Number(stats.uniformity_score).toFixed(3)}</div></div>
          <div className="rounded-lg bg-white/5 px-3 py-2"><div className="text-white/50">type</div><div className="text-white">{stats.data_type}</div></div>
        </div>
      )}
    </div>
  )
}
