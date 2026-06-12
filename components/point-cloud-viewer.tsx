'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Stage } from '@/lib/stages'

type LoadState = 'loading' | 'ready' | 'error'

function CloudModel({
  stage,
  onState,
  resetSignal,
}: {
  stage: Stage
  onState: (s: LoadState) => void
  resetSignal: number
}) {
  const { camera, controls } = useThree() as any
  const [object, setObject] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    let cancelled = false
    onState('loading')

    const handle = (root: THREE.Object3D) => {
      if (cancelled) return
      const group = new THREE.Group()
      const color = new THREE.Color(stage.pointColor)

      root.updateMatrixWorld(true)
      root.traverse((child) => {
        const mesh = child as THREE.Mesh
        if ((mesh as any).isMesh && mesh.geometry) {
          const hasColor = !!mesh.geometry.attributes.color
          const material = new THREE.PointsMaterial({
            size: stage.pointSize,
            sizeAttenuation: true,
            vertexColors: hasColor,
            color: hasColor ? 0xffffff : color,
          })
          const points = new THREE.Points(mesh.geometry, material)
          points.applyMatrix4(mesh.matrixWorld)
          group.add(points)
        }
        const pts = child as THREE.Points
        if ((pts as any).isPoints && pts.geometry) {
          group.add(pts.clone())
        }
      })

      if (group.children.length === 0 && root.children.length > 0) {
        group.add(root)
      }
      setObject(group)
      onState('ready')
    }

    const fail = (e: unknown) => {
      if (cancelled) return
      console.log('[v0] failed to load model:', stage.path, e)
      onState('error')
    }

    if (stage.type === 'obj') {
      new OBJLoader().load(stage.path, handle, undefined, fail)
    } else {
      new GLTFLoader().load(stage.path, (gltf) => handle(gltf.scene), undefined, fail)
    }

    return () => {
      cancelled = true
    }
  }, [stage, onState])

  useEffect(() => {
    if (!object || !groupRef.current) return
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    object.position.sub(center)

    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
    const dist = maxDim / (2 * Math.tan(fov / 2))

    camera.position.set(dist * 0.9, dist * 0.7, dist * 0.9)
    camera.near = maxDim / 100
    camera.far = maxDim * 100
    camera.updateProjectionMatrix()
    if (controls) {
      controls.target.set(0, 0, 0)
      controls.update()
    }
  }, [object, camera, controls, resetSignal])

  if (!object) return null
  return <primitive ref={groupRef} object={object} />
}

export function PointCloudViewer({ stage }: { stage: Stage }) {
  const [state, setState] = useState<LoadState>('loading')
  const [resetSignal, setResetSignal] = useState(0)
  const [showAxes, setShowAxes] = useState(false)

  const loadingLabel = useMemo(() => `Loading ${stage.key.toUpperCase()} data…`, [stage.key])

  return (
    <div className="relative flex-1 min-h-[460px] max-lg:min-h-[340px] [background:radial-gradient(ellipse_at_center,oklch(0.86_0.045_230/0.07)_0%,transparent_70%),var(--background)]">
      <Canvas
        key={stage.key}
        camera={{ fov: 45, near: 0.01, far: 1000, position: [2, 2, 2] }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 7]} intensity={0.6} />
        {showAxes && <axesHelper args={[1]} />}
        <Suspense fallback={null}>
          <CloudModel stage={stage} onState={setState} resetSignal={resetSignal} />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.08} makeDefault />
      </Canvas>

      {state !== 'ready' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 text-center px-6">
          {state === 'loading' ? (
            <>
              <div
                className="h-7 w-7 rounded-full border-2 border-line border-t-ice"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              <span className="font-mono text-sm text-muted-foreground">{loadingLabel}</span>
            </>
          ) : (
            <>
              <span className="font-mono text-sm text-ice">FILE NOT FOUND</span>
              <span className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
                Drop your model at{' '}
                <span className="text-foreground">public{stage.path}</span> and it will render here.
              </span>
            </>
          )}
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => setResetSignal((s) => s + 1)}
          className="font-mono text-[0.7rem] bg-panel border border-line text-foreground px-3 py-1.5 rounded transition-colors hover:border-ice hover:text-ice"
        >
          RESET VIEW
        </button>
        <button
          onClick={() => setShowAxes((a) => !a)}
          className="font-mono text-[0.7rem] bg-panel border border-line text-foreground px-3 py-1.5 rounded transition-colors hover:border-ice hover:text-ice"
        >
          TOGGLE AXES
        </button>
      </div>

      <div className="absolute bottom-4 left-4 font-mono text-[0.7rem] text-muted-foreground bg-background/60 border border-line px-3 py-1.5 rounded z-10 max-sm:hidden">
        DRAG TO ROTATE · SCROLL TO ZOOM · RIGHT-DRAG TO PAN
      </div>
    </div>
  )
}
