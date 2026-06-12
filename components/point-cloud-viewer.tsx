'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Stage } from '@/lib/stages'

type LoadState = 'loading' | 'ready' | 'error'

function loadObject(
  path: string,
  type: 'obj' | 'glb',
  color: string,
  pointSize: number,
  onDone: (g: THREE.Group) => void,
  onFail: (e: unknown) => void
): () => void {
  let cancelled = false

  const handle = (root: THREE.Object3D) => {
    if (cancelled) return
    const group = new THREE.Group()
    const c = new THREE.Color(color)
    root.updateMatrixWorld(true)
    root.traverse((child) => {
      const mesh = child as THREE.Mesh
      if ((mesh as any).isMesh && mesh.geometry) {
        const hasColor = !!mesh.geometry.attributes.color
        const material = new THREE.PointsMaterial({
          size: pointSize,
          sizeAttenuation: true,
          vertexColors: hasColor && color === 'vertex',
          color: hasColor && color === 'vertex' ? 0xffffff : c,
        })
        const points = new THREE.Points(mesh.geometry, material)
        points.applyMatrix4(mesh.matrixWorld)
        group.add(points)
      }
      const pts = child as THREE.Points
      if ((pts as any).isPoints && pts.geometry) {
        const clone = pts.clone()
        clone.material = new THREE.PointsMaterial({
          size: pointSize,
          sizeAttenuation: true,
          vertexColors: false,
          color: c,
        })
        group.add(clone)
      }
    })
    if (group.children.length === 0 && root.children.length > 0) group.add(root)
    if (!cancelled) onDone(group)
  }

  const fail = (e: unknown) => { if (!cancelled) onFail(e) }

  if (type === 'obj') {
    new OBJLoader().load(path, handle, undefined, fail)
  } else {
    new GLTFLoader().load(path, (gltf) => handle(gltf.scene), undefined, fail)
  }

  return () => { cancelled = true }
}

function SingleModel({
  stage,
  onState,
  resetSignal,
}: {
  stage: Extract<Stage, { type: 'obj' | 'glb' }>
  onState: (s: LoadState) => void
  resetSignal: number
}) {
  const { camera, controls } = useThree() as any
  const [object, setObject] = useState<THREE.Group | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    onState('loading')
    return loadObject(
      stage.path,
      stage.type,
      stage.pointColor,
      stage.pointSize,
      (g) => { setObject(g); onState('ready') },
      (e) => { console.log('[viewer] load failed:', e); onState('error') }
    )
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
    if (controls) { controls.target.set(0, 0, 0); controls.update() }
  }, [object, camera, controls, resetSignal])

  if (!object) return null
  return <primitive ref={groupRef} object={object} />
}

function DualModel({
  stage,
  onState,
  resetSignal,
  showA,
  showB,
}: {
  stage: Extract<Stage, { type: 'dual' }>
  onState: (s: LoadState) => void
  resetSignal: number
  showA: boolean
  showB: boolean
}) {
  const { camera, controls } = useThree() as any
  const [objectA, setObjectA] = useState<THREE.Group | null>(null)
  const [objectB, setObjectB] = useState<THREE.Group | null>(null)
  const [loadedA, setLoadedA] = useState(false)
  const [loadedB, setLoadedB] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    setLoadedA(false)
    setLoadedB(false)
    onState('loading')
    const cancelA = loadObject(stage.pathA, 'obj', stage.colorA, stage.pointSize,
      (g) => { setObjectA(g); setLoadedA(true) },
      (e) => { console.log('[viewer] loadA failed:', e); onState('error') }
    )
    const cancelB = loadObject(stage.pathB, 'obj', stage.colorB, stage.pointSize,
      (g) => { setObjectB(g); setLoadedB(true) },
      (e) => { console.log('[viewer] loadB failed:', e); onState('error') }
    )
    return () => { cancelA(); cancelB() }
  }, [stage, onState])

  useEffect(() => {
    if (loadedA && loadedB) onState('ready')
  }, [loadedA, loadedB, onState])

  useEffect(() => {
    if (!objectA || !objectB || !groupRef.current) return
    const combined = new THREE.Group()
    combined.add(objectA.clone())
    combined.add(objectB.clone())
    const box = new THREE.Box3().setFromObject(combined)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    objectA.position.sub(center)
    objectB.position.sub(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
    const dist = maxDim / (2 * Math.tan(fov / 2))
    camera.position.set(dist * 0.9, dist * 0.7, dist * 0.9)
    camera.near = maxDim / 100
    camera.far = maxDim * 100
    camera.updateProjectionMatrix()
    if (controls) { controls.target.set(0, 0, 0); controls.update() }
  }, [objectA, objectB, camera, controls, resetSignal])

  return (
    <group ref={groupRef}>
      {objectA && showA && <primitive object={objectA} />}
      {objectB && showB && <primitive object={objectB} />}
    </group>
  )
}

export function PointCloudViewer({ stage }: { stage: Stage }) {
  const [state, setState] = useState<LoadState>('loading')
  const [resetSignal, setResetSignal] = useState(0)
  const [showAxes, setShowAxes] = useState(false)
  const [showA, setShowA] = useState(true)
  const [showB, setShowB] = useState(true)

  const onState = useCallback((s: LoadState) => setState(s), [])
  const isDual = stage.type === 'dual'
  const loadingLabel = useMemo(() => `Loading ${stage.key.toUpperCase()} data…`, [stage.key])

  return (
    <div style={{ position: 'relative', width: '100%', height: '460px' }}>
      <Canvas
        key={stage.key}
        style={{ width: '100%', height: '100%' }}
        camera={{ fov: 45, near: 0.01, far: 1000, position: [2, 2, 2] }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 7]} intensity={0.6} />
        {showAxes && <axesHelper args={[1]} />}
        <Suspense fallback={null}>
          {isDual ? (
            <DualModel
              stage={stage as Extract<Stage, { type: 'dual' }>}
              onState={onState}
              resetSignal={resetSignal}
              showA={showA}
              showB={showB}
            />
          ) : (
            <SingleModel
              stage={stage as Extract<Stage, { type: 'obj' | 'glb' }>}
              onState={onState}
              resetSignal={resetSignal}
            />
          )}
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
                <span className="text-foreground">public{(stage as any).path ?? (stage as any).pathA}</span> and it will render here.
              </span>
            </>
          )}
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-10 flex-wrap justify-end">
        {isDual && (
          <>
            <button
              onClick={() => setShowA((v) => !v)}
              className="font-mono text-[0.7rem] px-3 py-1.5 rounded border transition-colors"
              style={{
                background: showA ? (stage as any).colorA + '22' : 'var(--panel)',
                borderColor: showA ? (stage as any).colorA : 'var(--line)',
                color: showA ? (stage as any).colorA : 'var(--foreground)',
              }}
            >
              {(stage as any).labelA}
            </button>
            <button
              onClick={() => setShowB((v) => !v)}
              className="font-mono text-[0.7rem] px-3 py-1.5 rounded border transition-colors"
              style={{
                background: showB ? (stage as any).colorB + '22' : 'var(--panel)',
                borderColor: showB ? (stage as any).colorB : 'var(--line)',
                color: showB ? (stage as any).colorB : 'var(--foreground)',
              }}
            >
              {(stage as any).labelB}
            </button>
          </>
        )}
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