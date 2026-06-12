'use client'

const FRAMES = [
  { src: '/assets/survey/frame_00030.jpg', tag: 'FRAME_00030' },
  { src: '/assets/survey/frame_00045.jpg', tag: 'FRAME_00045' },
  { src: '/assets/survey/frame_00050.jpg', tag: 'FRAME_00050' },
  { src: '/assets/survey/frame_00061.jpg', tag: 'FRAME_00061' },
  { src: '/assets/survey/frame_00067.jpg', tag: 'FRAME_00067' },
  { src: '/assets/survey/frame_00080.jpg', tag: 'FRAME_00080' },
  { src: '/assets/survey/frame_00099.jpg', tag: 'FRAME_00099' },
  { src: '/assets/survey/frame_00109.jpg', tag: 'FRAME_00109' },
  { src: '/assets/survey/frame_00124.jpg', tag: 'FRAME_00124' },
]

export function PhotoGrid() {
  return (
    <section className="border-y border-line bg-panel px-[8vw] py-28">
      <div className="mb-12 max-w-2xl">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ice">
          <span className="inline-block h-2 w-2 rounded-full bg-ice shadow-[0_0_12px_var(--ice)]" />
          01 — Survey Imagery
        </div>
        <h2 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          What the UAV actually saw.
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          A sample of frames captured during the simulated multi-tiered orbital survey over the
          pressure-ridge mesh. These RGB images are the only input the Structure-from-Motion and
          Depth Anything V3 pipelines receive — no calibration, no depth, no GPS.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {FRAMES.map((frame) => (
          <figure
            key={frame.tag}
            className="group relative aspect-[4/3] overflow-hidden rounded border border-line bg-background"
          >
            <img
              src={frame.src}
              alt={`Survey ${frame.tag}`}
              className="h-full w-full object-cover brightness-90 saturate-[0.85] transition-all duration-500 group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-100"
            />
            <figcaption className="absolute bottom-2.5 left-2.5 rounded bg-background/75 px-2 py-0.5 font-mono text-[0.7rem] tracking-wide text-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {frame.tag}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}