export default function Controls({speed,setSpeed,playing,setPlaying}){
  return (
    <div className="flex items-center gap-3 text-sm">
      <button onClick={()=>setPlaying(p=>!p)} className="px-3 py-2 rounded-lg bg-white/5">{playing?'Pause':'Resume'}</button>
      <div className="flex items-center gap-2">
        <span className="text-white/60">Speed</span>
        <input type="range" min={0.25} max={2} step={0.25} value={speed} onChange={(e)=>setSpeed(parseFloat(e.target.value))} />
        <span className="w-10 text-right text-white/70">{speed.toFixed(2)}x</span>
      </div>
    </div>
  )
}
