export default function ArrayInput({value,onChange}){
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70">Enter array values (comma or space separated)</label>
      <textarea value={value} onChange={(e)=>onChange(e.target.value)} rows={3} className="w-full rounded-lg bg-[#0b0b0b] border border-white/10 px-3 py-2 text-sm outline-none focus:border-accent/60" />
    </div>
  )
}
