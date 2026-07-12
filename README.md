# FIN//SIGHT — Fin-height inspection digital twin

An executive-friendly interactive demonstrator for a radiator-fin measurement project. It explains why a contact LVDT can introduce false variation, then compares laser triangulation and stereo vision with the same digital measurement pipeline described in the provided HMI deck.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Blender asset

Open `blender/fin_height_twin.py` in Blender's Scripting workspace and run it. It creates a scene with a 10-fin radiator core, machine bridge, laser head and beam. For web use, export the collection as `public/models/fin-height-station.glb`; later it can replace the illustrative SVG model with Three.js / React Three Fiber.

## Best way to present it

Start in **Contact LVDT**, point out the red noisy trace and lower repeatability, then switch to **Laser triangulation**. The experience ties directly to the existing 1 kHz acquisition → DSP filter → peak/geometry → SPC/anomaly pipeline.
