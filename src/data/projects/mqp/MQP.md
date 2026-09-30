> **Work in progress.** FloorJet is my year-long Major Qualifying Project (senior capstone), August 2026 – spring 2027. So far: research, requirements, and system design; next come detailed design, prototyping, testing, and a final demonstration.

## Overview

FloorJet is a mobile robot that paints images directly onto floors: logos on gym floors, wayfinding lines, hazard markings, booth footprints. A user uploads an image and places it in the room; software turns it into paint strokes and a driving path, and the robot drives and sprays to reproduce it.

## Design Direction

Research into floor-marking robots, robotic painting, and commercial systems shaped the requirements:

- A compact **differential-drive** robot with external motion-capture localization, holding the nozzle within ±0.25 in
- An adjustable spray footprint (about 1–3 in), **two or more pre-mixed colors** with no mixing on the robot, and one-pass coverage
- No fixed canvas size, and software that **never drives over wet paint**


## Simulation

Each shape is painted in two passes: **raster** strokes fill it, then **vector** strokes trace the outline for clean edges. Before building hardware, we simulated an airbrush robot doing exactly that to study how spray size affects print quality.

<figure class="video-clip"><video src="/assets/projects/mqp/airbrush-sim.mp4" poster="/assets/projects/mqp/airbrush-sim-poster.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Simulated airbrush robot painting an image"></video><figcaption>Simulated airbrush robot painting the image</figcaption></figure>

