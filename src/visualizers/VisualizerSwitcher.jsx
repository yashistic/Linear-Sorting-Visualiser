import BucketSortViz from './bucket/BucketSortViz'
import CountingSortViz from './counting/CountingSortViz'
import RadixSortViz from './radix/RadixSortViz'

export default function VisualizerSwitcher({algo,data,speed,playing,onFinish}){
  if (!data?.length) return <div className="text-sm text-white/60">Enter data to visualize.</div>
  if (algo==='bucket') return <BucketSortViz data={data} speed={speed} playing={playing} onFinish={onFinish} />
  if (algo==='counting') return <CountingSortViz data={data} speed={speed} playing={playing} onFinish={onFinish} />
  return <RadixSortViz data={data} speed={speed} playing={playing} onFinish={onFinish} />
}
