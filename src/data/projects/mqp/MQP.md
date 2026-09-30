> **Work in progress.** FloorJet is my year-long Major Qualifying Project (senior capstone), running from August 2026 through spring 2027. This page covers the first five weeks, research, requirements, and system design, and will grow as we build.

## Overview

FloorJet is a mobile robot that paints images directly onto floors. A user uploads an image, chooses the colors loaded on the robot, and places the design in the room; software turns the image into paint strokes and a driving path, and the robot drives and sprays to reproduce it, from logos on gym floors to wayfinding lines, hazard markings, and convention booth footprints.

It's a multidisciplinary team project spanning mechanical, electrical, and software design.

## Research

We started with a literature review of floor-marking robots, robotic painting, and printing technology, plus a comparison of existing commercial systems (like HP SitePrint, Dusty Robotics FieldPrinter, and August Robotics' Lionel). A few findings shaped our direction:

- Nearly every high-resolution floor printer uses a **differential drive**, and most drive at a constant speed while printing
- Most painting robots are **limited to a fixed canvas**; the ones that paint continuously mostly draw lines or single colors
- **Mixing paint on the robot** causes frequent clogs and complexity, so we chose separate, pre-mixed colors
- **Multi-robot painting** adds coordination and localization problems without clear benefit for precise images
- Varying **spray distance and speed** controls stroke size and paint density, letting large strokes cover big areas and small ones handle detail

## Design Requirements

| | |
|---|---|
| **Locomotion** | Compact, portable, differential-drive mobile robot |
| **Localization** | Absolute external positioning (ViCon motion capture), nozzle accuracy within ±0.25 in |
| **Workspace** | Continuous: no fixed maximum print area; indoor, clean, hard, flat floors |
| **Nozzle** | Sprays paint with an adjustable footprint from ≤1 in to ≥3 in |
| **Color** | At least two independent paint reservoirs, no paint mixing on the robot |
| **Coverage** | One pass for full coverage; runs autonomously until it needs more paint |
| **Safety** | Paint and robot safe to be near while operating |
| **Software** | Accepts SVG (and common image formats), scales pixels to real-world inches, previews the path and final result, never drives over wet paint, and exports robot instructions |

## Painting Strategy

We chose a two-step approach: **raster** strokes fill each shape, then **vector** strokes trace the outlines for clean edges.

<div class="figure-row no-crop">
<figure><img src="/assets/projects/mqp/raster-concept.jpg" alt="Raster diagram: the robot paints the image in vertical columns"><figcaption>Raster: fill shapes column by column</figcaption></figure>
<figure><img src="/assets/projects/mqp/vector-concept.jpg" alt="Vector diagram: the robot traces the image outline"><figcaption>Vector: trace contours with continuous strokes</figcaption></figure>
</div>

## System Architecture

We broke the system into functional blocks, each with defined inputs, actions, and outputs: user input, image handling, stroke generation, path generation, painting, localization and navigation, locomotion, and a central computer that coordinates them.

<figure class="figure-inline"><img src="/assets/projects/mqp/pipeline-image-to-path.png" alt="Flow diagram from image handling through stroke generation to path generation"><figcaption>Image to robot path</figcaption></figure>

- **Image handling:** color filtering and edge detection split the image by paint color
- **Stroke generation:** raster fill strokes and vector outline strokes for each color
- **Path generation:** strokes are ordered so the robot never drives over wet paint, converted to robot paths, connected, and exported in a robot-readable format

On the robot, the central computer takes the generated instructions, the robot's pose, and paint and nozzle status, and turns them into drive commands and nozzle position and flow, pausing if paint runs low or the nozzle clogs.

<figure><img src="/assets/projects/mqp/robot-systems.png" alt="Block diagram of the robot's painting, localization, navigation, and locomotion systems around a central computer"><figcaption>Robot systems</figcaption></figure>

We're also applying **axiomatic design**, mapping each functional requirement to the design parameters that satisfy it, to keep subsystems as independent as possible.

## Airbrush Path Simulation

To test the idea before building hardware, we simulated an airbrush-equipped robot painting an image: raster columns first, then the outer contour, while checking how airbrush size affects print quality.

<figure class="video-clip"><video src="/assets/projects/mqp/airbrush-sim.mp4" poster="/assets/projects/mqp/airbrush-sim-poster.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Simulated airbrush robot painting an image"></video><figcaption>Simulated airbrush robot painting the image</figcaption></figure>

<div class="figure-row no-crop">
<figure><img src="/assets/projects/mqp/airbrush-sim-strokes.jpg" alt="Simulation: robot partway through filling the image with raster columns"><figcaption>Raster pass in progress</figcaption></figure>
<figure><img src="/assets/projects/mqp/airbrush-sim-raster.jpg" alt="Simulation: image fully filled, with the outline strokes traced around it"><figcaption>Finished fill with the outline pass</figcaption></figure>
</div>

<figure><img src="/assets/projects/mqp/airbrush-size-study.png" alt="Row of simulated results for increasing airbrush sizes"><figcaption>Simulated output across airbrush sizes</figcaption></figure>

## Concept Generation

<figure><img src="/assets/projects/mqp/concept-whiteboard.jpg" alt="Whiteboard sketches of subsystem concepts"><figcaption>Brainstorming concepts for each subsystem</figcaption></figure>

## Next Steps

- Screen and score concepts on feasibility, cost, and risk, then finalize a proposal
- Complete the A-Term report and plan B-Term
- Mechanical, electrical, and software design through B-Term, followed by purchasing, prototyping, paint and localization testing, a second build, and a final demonstration
