# Drop your files here

This site loads your real survey photos and 3D point clouds from `public/assets/`.
Everything below renders automatically once the files exist at these exact paths.

## Survey photos (the 3x3 grid)

Put 9 images here, named exactly:

    public/assets/survey/frame_01.jpg
    public/assets/survey/frame_02.jpg
    ...
    public/assets/survey/frame_09.jpg

(From: E:\Research\ArctiCodev2\DA3\above_water\meshyC — pick any 9 of the 30.)

Until you add them, three generated Arctic sample images stand in so the grid
is never broken. Delete `sample-1.png`, `sample-2.png`, `sample-3.png` once your
real frames are in place.

## 3D models (the pipeline viewer)

Put your point clouds / GLB here, named exactly:

    public/assets/models/optical3.glb   <- DA3 colored cloud + camera poses (GLB)
    public/assets/models/lidar3.obj     <- LiDAR ground-truth point cloud
    public/assets/models/sfm3.obj       <- Metashape SfM point cloud
    public/assets/models/icp3.obj       <- ICP co-registration (c2c distance colored)

Source files on your machine:
- optical3.obj  -> export/convert to optical3.glb (keeps vertex color + camera poses)
- lidar3.obj    -> C:\...\meshy\lidar3.obj
- sfm3.obj      -> your Metashape export
- icp3.obj      -> your ICP result

Notes:
- OBJ files with vertex colors render with those colors; without them they use the
  accent color set per-stage in `lib/stages.ts`.
- To rename files, swap labels, or add more stages, edit `lib/stages.ts`.
