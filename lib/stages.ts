export type StageKey = 'da3' | 'lidar' | 'sfm' | 'icp'

export type Stage = {
  key: StageKey
  index: string
  name: string
  blurb: string
  title: string
  desc: string
  meta: { label: string; value: string }[]
  pointSize: number
  pointColor: string
} & (
  | { type: 'glb' | 'obj'; path: string }
  | { type: 'dual'; pathA: string; pathB: string; colorA: string; colorB: string; labelA: string; labelB: string }
)

export const STAGES: Stage[] = [
  {
    key: 'da3',
    index: '01',
    name: 'DA3 Reconstruction',
    blurb: 'Monocular depth → dense point cloud + camera poses',
    title: 'DA3 Reconstruction — Dataset B',
    desc: "Dense point cloud back-projected from per-frame monocular depth estimates, using Depth Anything V3's self-estimated camera intrinsics and extrinsics. Colored by RGB, with recovered camera frustums baked into the GLB.",
    meta: [
      { label: 'RMSE', value: '0.2387 m' },
      { label: 'CHAMFER', value: '0.3749 m' },
      { label: 'HAUSDORFF', value: '1.8791 m' },
    ],
    type: 'glb',
    path: '/assets/scene.glb',
    // pointColor: '#bfe0ea',
    pointColor: 'vertex',
    pointSize: 0.02,
  },
  {
    key: 'lidar',
    index: '02',
    name: 'LiDAR Ground Truth',
    blurb: 'Simulated airborne ray-cast LiDAR, noise-free',
    title: 'LiDAR Ground Truth — Dataset B',
    desc: 'Simulated airborne ray-cast LiDAR scan used as the absolute geometric reference for all co-registration and error metrics. Built in the HoloOcean simulator.',
    meta: [
      { label: 'SOURCE', value: 'SIMULATED' },
      { label: 'NOISE σ', value: '0.0' },
      { label: 'VOXEL RES', value: '0.15 m' },
    ],
    type: 'obj',
    path: '/assets/lidar3.obj',
    pointColor: '#ffff00',
    pointSize: 0.015,
  },
  {
    key: 'sfm',
    index: '03',
    name: 'SfM Reconstruction',
    blurb: 'Photogrammetric multi-view stereo (Metashape)',
    title: 'SfM Reconstruction — Dataset B',
    desc: 'Photogrammetric dense point cloud from Agisoft Metashape, generated via feature matching, bundle adjustment, and Patch-Match multi-view stereo over the same image set.',
    meta: [
      { label: 'RMSE', value: '1.3779 m' },
      { label: 'CHAMFER', value: '0.8476 m' },
      { label: 'HAUSDORFF', value: '18.5472 m' },
    ],
    type: 'obj',
    path: '/assets/optical3.obj',
    pointColor: '#ff0000',
    pointSize: 0.02,
  },
  {
    key: 'icp',
    index: '04',
    name: 'ICP Co-Registration',
    blurb: 'Cloud-to-cloud distance after alignment to LiDAR',
    title: 'ICP Co-Registration — Dataset B',
    desc: 'DA3 reconstruction aligned to the LiDAR reference frame via Iterative Closest Point. Both clouds are rendered overlaid in the same scene — cyan is SfM, yellow is LiDAR.',
    meta: [
      { label: 'ALGORITHM', value: 'ICP' },
      { label: 'METRIC', value: 'C2C DIST' },
      { label: 'RESULT', value: 'FIG. coreg' },
    ],
    type: 'dual',
    pathA: '/assets/optical3.obj',
    pathB: '/assets/lidar3.obj',
    colorA: '#ff0000',
    colorB: '#ffff00',
    labelA: 'SfM',
    labelB: 'LiDAR',
    pointColor: '#ff0000',
    pointSize: 0.02,
  },
]
export const STAGES_REAL: Stage[] = [
  {
    key: 'da3',
    index: '01',
    name: 'DA3 Reconstruction',
    blurb: 'Monocular depth → dense point cloud + camera poses',
    title: 'DA3 Reconstruction — Real Dataset',
    desc: "Dense point cloud back-projected from per-frame monocular depth estimates over real UAV footage, using Depth Anything V3's self-estimated camera intrinsics and extrinsics.",
    meta: [
      { label: 'RMSE', value: '— m' },
      { label: 'CHAMFER', value: '— m' },
      { label: 'HAUSDORFF', value: '— m' },
    ],
    type: 'glb',
    path: '/assets/real/scene.glb',
    pointColor: 'vertex',
    pointSize: 0.02,
  },
  {
    key: 'lidar',
    index: '02',
    name: 'LiDAR Ground Truth',
    blurb: 'Real airborne LiDAR scan',
    title: 'LiDAR Ground Truth — Real Dataset',
    desc: 'Real airborne LiDAR scan used as the geometric reference for co-registration and error metrics.',
    meta: [
      { label: 'SOURCE', value: 'REAL' },
      { label: 'NOISE σ', value: '—' },
      { label: 'VOXEL RES', value: '— m' },
    ],
    type: 'obj',
    path: '/assets/real/lidar.obj',
    pointColor: '#ffff00',
    pointSize: 0.015,
  },
  {
    key: 'sfm',
    index: '03',
    name: 'SfM Reconstruction',
    blurb: 'Photogrammetric multi-view stereo (Metashape)',
    title: 'SfM Reconstruction — Real Dataset',
    desc: 'Photogrammetric dense point cloud from Agisoft Metashape over real UAV imagery.',
    meta: [
      { label: 'RMSE', value: '— m' },
      { label: 'CHAMFER', value: '— m' },
      { label: 'HAUSDORFF', value: '— m' },
    ],
    type: 'obj',
    path: '/assets/real/metashape.obj',
    pointColor: '#ff0000',
    pointSize: 0.02,
  },
  {
    key: 'icp',
    index: '04',
    name: 'ICP Co-Registration',
    blurb: 'Cloud-to-cloud distance after alignment to LiDAR',
    title: 'ICP Co-Registration — Real Dataset',
    desc: 'SfM reconstruction aligned to the real LiDAR reference frame via Iterative Closest Point.',
    meta: [
      { label: 'ALGORITHM', value: 'ICP' },
      { label: 'METRIC', value: 'C2C DIST' },
      { label: 'RESULT', value: 'FIG. coreg' },
    ],
    type: 'dual',
    pathA: '/assets/real/metashape.obj',
    pathB: '/assets/real/lidar.obj',
    colorA: '#ff0000',
    colorB: '#ffff00',
    labelA: 'SfM',
    labelB: 'LiDAR',
    pointColor: '#ff0000',
    pointSize: 0.02,
  },
]