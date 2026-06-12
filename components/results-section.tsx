'use client'

import { useEffect, useRef, useState } from 'react'

type Bar = { label: string; method: 'sfm' | 'da3'; value: string; width: number }

const DATASETS: { title: string; bars: Bar[] }[] = [
  {
    title: 'Dataset A — Real LiDAR Flat Ice',
    bars: [
      { label: 'RMSE (m)', method: 'sfm', value: 'SfM 0.6208', width: 100 },
      { label: 'RMSE (m)', method: 'da3', value: 'DA3 0.2531', width: 40.8 },
      { label: 'Hausdorff (m)', method: 'sfm', value: 'SfM 21.44', width: 100 },
      { label: 'Hausdorff (m)', method: 'da3', value: 'DA3 4.35', width: 20.3 },
    ],
  },
  {
    title: 'Dataset B — AI-Generated Pressure Ridge',
    bars: [
      { label: 'RMSE (m)', method: 'sfm', value: 'SfM 1.3779', width: 100 },
      { label: 'RMSE (m)', method: 'da3', value: 'DA3 0.2387', width: 17.3 },
      { label: 'Hausdorff (m)', method: 'sfm', value: 'SfM 18.55', width: 100 },
      { label: 'Hausdorff (m)', method: 'da3', value: 'DA3 1.88', width: 10.1 },
    ],
  },
]

function MetricCard({ title, bars }: { title: string; bars: Bar[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-lg border border-line bg-background p-6">
      <h4 className="mb-5 font-mono text-sm uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      {bars.map((bar, i) => (
        <div key={i} className="mb-3.5 last:mb-0">
          <div className="mb-1.5 flex justify-between text-[0.82rem]">
            <span>{bar.label}</span>
            <span className="font-mono text-ice">{bar.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-panel-light">
            <div
              className={`h-full rounded ${bar.method === 'da3' ? 'bg-ice' : 'bg-rust'}`}
              style={{
                width: visible ? `${bar.width}%` : '0%',
                transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ResultsSection() {
  return (
    <section className="border-y border-line bg-panel px-[8vw] py-28">
      <div className="mb-12 max-w-2xl">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ice">
          <span className="inline-block h-2 w-2 rounded-full bg-ice shadow-[0_0_12px_var(--ice)]" />
          03 — Quantitative Results
        </div>
        <h2 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Texture density decides everything.
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Across both surface datasets, Depth Anything V3 consistently outperforms classical
          photogrammetry — and the gap widens as surface texture becomes sparser.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {DATASETS.map((d) => (
          <MetricCard key={d.title} title={d.title} bars={d.bars} />
        ))}
      </div>

      <div className="flex gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rust" />
          Structure-from-Motion
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-ice" />
          Depth Anything V3
        </span>
      </div>
    </section>
  )
}
