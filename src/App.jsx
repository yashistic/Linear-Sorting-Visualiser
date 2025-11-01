import { Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-base text-accent">
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0b]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-center">
          <div className="text-lg font-semibold tracking-wide text-accent">Linear Sorting Visualiser</div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex items-center justify-center gap-6 text-sm text-white/80">
          <NavLink to="/" end className={({isActive})=>`px-2 py-1 rounded-md hover:text-accent ${isActive?'text-accent':''}`}>Visualize</NavLink>
          <NavLink to="/learn" className={({isActive})=>`px-2 py-1 rounded-md hover:text-accent ${isActive?'text-accent':''}`}>Learn</NavLink>
        </div>
        <div className="mt-3 text-center text-xs text-white/60">Submitted by: <span className="text-white">Yash Mittal (2024UCD2113)</span></div>
      </footer>
    </div>
  )
}

