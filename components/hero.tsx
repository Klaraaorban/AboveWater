export function Hero() {
  const stats = [
    { num: '2', label: 'Surface Datasets' },
    { num: '3', label: 'Reconstruction Methods' },
    { num: '0.24m', label: 'Best RMSE (DA3)' },
    { num: '7', label: 'Evaluation Metrics' },
  ]

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden border-b border-line px-[8vw] py-[6vh]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 70% 35%, var(--ice) 0, var(--ice) 1px, transparent 1px, transparent 46px)',
          maskImage: 'linear-gradient(to bottom, black, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 80%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-3xl">
        <div className="mb-5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ice">
          <span className="inline-block h-2 w-2 rounded-full bg-ice shadow-[0_0_12px_var(--ice)]" />
          Bachelor&apos;s Thesis — Companion Site
        </div>
        <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Mapping the <span className="text-ice">Arctic canopy</span> from above, one reconstruction
          at a time.
        </h1>
        <p className="mb-9 max-w-xl leading-relaxed text-muted-foreground">
          A benchmark for vision-based 3D reconstruction of Arctic sea ice from UAV imagery —
          comparing classical photogrammetry, monocular depth foundation models, and 3D Gaussian
          Splatting against simulated LiDAR ground truth. Explore the pipeline below, dataset by
          dataset, reconstruction by reconstruction.
        </p>
        <div className="flex flex-wrap gap-10">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-heading text-3xl font-bold">{s.num}</div>
              <div className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-[8vw] z-10 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-wide text-muted-foreground">
        <span>Scroll to explore</span>
        <span className="relative h-px w-10 overflow-hidden bg-muted-foreground/40">
          <span
            className="absolute left-0 h-px w-10 bg-ice"
            style={{ animation: 'travel 2.2s ease-in-out infinite' }}
          />
        </span>
      </div>
    </section>
  )
}
