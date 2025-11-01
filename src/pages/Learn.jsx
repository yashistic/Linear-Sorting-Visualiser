import TheoryCard from '../ui/TheoryCard'

export default function Learn(){
  return (
    <div className="grid gap-4">
      <TheoryCard title="Bucket Sort" points={[
        'Distribute elements into buckets by value range, sort each bucket, then concatenate.',
        'Works best for uniformly distributed floats in [0,1).',
        'Best O(n+k), Avg O(n+k), Worst O(n²), Space O(n+k), Stability depends on inner sort.',
        'Applications: Uniform floats, probability data, graphics, parallel processing.',
        'Example: [0.42, 0.32, 0.23, 0.52, 0.25] → Buckets → Sort each → Merge.'
      ]} />
      <TheoryCard title="Counting Sort" points={[
        'Count occurrences of each integer, build prefix sums, place elements stably.',
        'Only for integers or small integer ranges.',
        'Best/Avg/Worst O(n+k), Space O(k), Stable if placing in reverse.',
        'Applications: Small-range integers, characters, frequency-based data.',
        'Example: [4,2,2,8,3,3,1] → Count → Prefix → Output.'
      ]} />
      <TheoryCard title="Radix Sort" points={[
        'Sort numbers digit by digit using a stable sub-sort from least significant digit.',
        'Suitable for integers or fixed-length strings.',
        'O(d*(n+k)), Stable and non-comparative.',
        'Applications: Large integers, IDs, zip codes, equal-length words.',
        'Example: [170,45,75,90,802,24,2,66] → units → tens → hundreds → result.'
      ]} />
    </div>
  )
}

