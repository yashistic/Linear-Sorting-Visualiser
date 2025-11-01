import { motion } from 'framer-motion'

export default function RecommendationCard({ rec }){
  if (!rec) return null
  return (
    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="mt-3 rounded-xl bg-white/5 p-4 border border-white/10">
      <div className="text-sm"><span className="text-white/60">Recommended:</span> <span className="text-accent font-medium capitalize">{rec.recommended}</span></div>
      <div className="text-xs text-white/80 mt-1">{rec.explanation}</div>
    </motion.div>
  )
}
