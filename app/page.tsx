'use client'

import { useState } from 'react'
import { Hero } from '@/components/hero'
import { PhotoGrid } from '@/components/photo-grid'
import { PipelineSection } from '@/components/pipeline-section'
import { ResultsSection } from '@/components/results-section'
import { STAGES, STAGES_REAL } from '@/lib/stages'

export default function Page() {
  const [dataset, setDataset] = useState<'simulated' | 'real'>('simulated')
  const stages = dataset === 'simulated' ? STAGES : STAGES_REAL

  return (
    <main>
      <Hero dataset={dataset} onDatasetChange={setDataset} />
      <PhotoGrid dataset={dataset} />
      <PipelineSection stages={stages} dataset={dataset} />
      <ResultsSection />
      <footer className="px-[8vw] py-16 text-center text-sm leading-relaxed text-muted-foreground">
        Benchmarking 3D Reconstruction for Aerial Freeboard Mapping in Arctic Environments —
        Bachelor&apos;s Thesis, Faculty of Mathematics &amp; Computer Science, Babeș-Bolyai
        University. Simulation built on <span className="font-mono text-ice-dim">HoloOcean</span>.
      </footer>
    </main>
  )
}