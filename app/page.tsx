import { Hero } from '@/components/hero'
import { PhotoGrid } from '@/components/photo-grid'
import { PipelineSection } from '@/components/pipeline-section'
import { ResultsSection } from '@/components/results-section'

export default function Page() {
  return (
    <main>
      <Hero />
      <PhotoGrid />
      <PipelineSection />
      <ResultsSection />
      <footer className="px-[8vw] py-16 text-center text-sm leading-relaxed text-muted-foreground">
        Benchmarking 3D Reconstruction for Aerial Freeboard Mapping in Arctic Environments —
        Bachelor&apos;s Thesis, Faculty of Mathematics &amp; Computer Science, Babeș-Bolyai
        University. Simulation built on <span className="font-mono text-ice-dim">HoloOcean</span>.
      </footer>
    </main>
  )
}
