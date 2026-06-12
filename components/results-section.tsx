'use client'

import { useEffect, useRef, useState } from 'react'

type Bar = { label: string; method: 'sfm' | 'da3'; value: string; width: number }

const DATASETS: { title: string; bars: Bar[] }[] = [
  {
    title: 'Dataset A — Real LiDAR Flat Ice',
    bars: [
      { label: 'RMSE (m)', method: 'sfm', value: 'SfM 0.6208', width: 100 },
      { label: 'RMSE (m)', method: 'da3', value: 'DA3 0.2531', width: 40.8 },
      
      { label: 'MAE (m)', method: 'sfm', value: 'SfM 0.2847', width: 100 },
      { label: 'MAE (m)', method: 'da3', value: 'DA3 0.1871', width: 65.7 },
      
      { label: 'ARE (-)', method: 'sfm', value: 'SfM 0.0078', width: 100 },
      { label: 'ARE (-)', method: 'da3', value: 'DA3 0.0051', width: 65.4 },
      
      { label: 'W-RMSE (m)', method: 'sfm', value: 'SfM 0.6002', width: 100 },
      { label: 'W-RMSE (m)', method: 'da3', value: 'DA3 0.2349', width: 39.1 },
      
      { label: 'Chamfer (m)', method: 'sfm', value: 'SfM 1.8276', width: 100 },
      { label: 'Chamfer (m)', method: 'da3', value: 'DA3 0.6505', width: 35.6 },
      
      { label: 'Hausdorff (m)', method: 'sfm', value: 'SfM 21.4443', width: 100 },
      { label: 'Hausdorff (m)', method: 'da3', value: 'DA3 4.3537', width: 20.3 },
      
      { label: 'DA-Ch. (m)', method: 'sfm', value: 'SfM 1.8303', width: 100 },
      { label: 'DA-Ch. (m)', method: 'da3', value: 'DA3 0.6368', width: 34.8 },
    ],
  },
  {
    title: 'Dataset B — AI-Generated Pressure Ridge',
    bars: [
      { label: 'RMSE (m)', method: 'sfm', value: 'SfM 1.3779', width: 100 },
      { label: 'RMSE (m)', method: 'da3', value: 'DA3 0.2387', width: 17.3 },
      
      { label: 'MAE (m)', method: 'sfm', value: 'SfM 0.6801', width: 100 },
      { label: 'MAE (m)', method: 'da3', value: 'DA3 0.1773', width: 26.1 },
      
      { label: 'ARE (-)', method: 'sfm', value: 'SfM 0.0150', width: 100 },
      { label: 'ARE (-)', method: 'da3', value: 'DA3 0.0049', width: 32.7 },
      
      { label: 'W-RMSE (m)', method: 'sfm', value: 'SfM 0.3793', width: 100 },
      { label: 'W-RMSE (m)', method: 'da3', value: 'DA3 0.2276', width: 60.0 },
      
      { label: 'Chamfer (m)', method: 'sfm', value: 'SfM 0.8476', width: 100 },
      { label: 'Chamfer (m)', method: 'da3', value: 'DA3 0.3749', width: 44.2 },
      
      { label: 'Hausdorff (m)', method: 'sfm', value: 'SfM 18.5472', width: 100 },
      { label: 'Hausdorff (m)', method: 'da3', value: 'DA3 1.8791', width: 10.1 },
      
      { label: 'DA-Ch. (m)', method: 'sfm', value: 'SfM 0.5431', width: 100 },
      { label: 'DA-Ch. (m)', method: 'da3', value: 'DA3 0.3662', width: 67.4 },
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
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-lg border border-line bg-background p-6">
      <h4 className="mb-5 font-mono text-sm uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {bars.map((bar, i) => (
          <div key={i} className="flex flex-col justify-end">
            <div className="mb-1.5 flex justify-between text-[0.82rem]">
              <span className="font-medium text-foreground">{bar.label}</span>
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

      <div className="mb-12 flex flex-col gap-6">
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