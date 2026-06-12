'use client'

import { useState, useEffect } from 'react'
import { type Stage } from '@/lib/stages'
import { PointCloudViewer } from './point-cloud-viewer'

export function PipelineSection({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState<Stage>(stages[0])

  useEffect(() => {
    setActive(stages[0])
  }, [stages])

  return (
    <section className="px-[8vw] py-28">
      <div className="mb-12 max-w-2xl">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ice">
          <span className="inline-block h-2 w-2 rounded-full bg-ice shadow-[0_0_12px_var(--ice)]" />
          02 — Reconstruction Pipeline
        </div>
        <h2 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          From pixels to point clouds.
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Step through the pipeline stages for Dataset B, the AI-generated pressure-ridge mesh. Each
          stage loads its corresponding 3D output — rotate, zoom, and pan to inspect the geometry
          directly. DA3 estimates its own camera trajectory from the images alone.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:items-start">
        <div className="relative flex flex-col gap-2.5 lg:sticky lg:top-8">
          <div className="pointer-events-none absolute left-[35px] top-7 bottom-7 hidden w-px bg-line lg:block z-0" />
          {stages.map((stage) => {
            const isActive = stage.key === active.key
            return (
              <button
                key={stage.key}
                onClick={() => setActive(stage)}
                className={`relative z-10 flex w-full items-center gap-4 rounded-lg border px-5 py-4 text-left transition-all ${
                  isActive
                    ? 'border-ice bg-panel-light shadow-[0_0_0_1px_var(--ice),0_8px_24px_-8px_oklch(0.86_0.045_230/0.25)]'
                    : 'border-line bg-panel hover:border-ice-dim hover:bg-panel-light'
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-all ${
                    isActive
                      ? 'border-ice bg-ice text-background'
                      : 'border-line text-ice-dim'
                  }`}
                >
                  {stage.index}
                </span>
                <span>
                  <span className="block text-[0.95rem] font-medium text-foreground">
                    {stage.name}
                  </span>
                  <span className={`text-[0.78rem] ${isActive ? 'text-ice' : 'text-muted-foreground'}`}>
                    {stage.blurb}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-line bg-panel max-lg:min-h-[420px]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div className="max-w-[520px]">
              <h3 className="font-heading text-lg font-semibold">{active.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{active.desc}</p>
            </div>
            <div className="text-right font-mono text-[0.72rem] leading-relaxed text-ice">
              {active.meta.map((m) => (
                <div key={m.label}>
                  <span className="text-muted-foreground">{m.label}</span> {m.value}
                </div>
              ))}
            </div>
          </div>
          <PointCloudViewer stage={active} />
        </div>
      </div>
    </section>
  )
}