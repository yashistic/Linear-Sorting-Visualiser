import { motion } from 'framer-motion'

export default function TheoryCard({title, points}){
  return (
    <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.4}} className="rounded-xl bg-panel p-4 shadow-soft border border-white/10">
      <h2 className="text-lg font-semibold mb-2 text-accent">{title}</h2>
      <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
        {points.map((p,i)=>(<li key={i}>{p}</li>))}
      </ul>
    </motion.div>
  )
}
