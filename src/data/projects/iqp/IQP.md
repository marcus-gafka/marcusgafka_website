## Overview

**The Buildings of Venice** was my Interactive Qualifying Project, completed on site in Venice, Italy, in partnership with **SerenDPT** and the Venice Project Center. Working in a team of four (Robotics & Mechanical, Mechanical, Computer Science, and Chemical Engineering majors), we built **Venice's first building-by-building estimate** of residential units, tourist units, vacant units, and population for the historic city center.

<figure><img src="/assets/projects/iqp/residential-use-3d.jpg" alt="3D map of Venice buildings shaded green for residential use and pink for non-residential use"><figcaption>Estimated residential (green) vs. non-residential (pink) share of each building's height</figcaption></figure>

## The Problem

Venice's geography keeps it from expanding, so its existing buildings have to house full-time residents, second-home owners, and a year-round flood of tourists. As short-term rentals and hotels replace residential housing, availability shrinks, prices rise, and the city keeps losing residents.

To address depopulation, policymakers need to understand housing **at the building level**, but population data only existed per census tract, and a tract can contain anywhere from 1 to 100 buildings.

## Goals

- Organize SerenDPT's scattered city datasets into a single, usable GIS dataset
- Design a repeatable fieldwork method to verify the data on the ground
- Estimate floors, residential / non-residential / vacant units, and residents for every building
- Publish the methods and datasets so future teams and the city can update them

## Building a Unified GIS Dataset

The city's building data was often mislabeled or outdated, with hundreds of undocumented fields that had to be translated from Italian and cross-referenced. Most critically, the gutter-height field was unusable for **nearly 5,000 buildings**, about a third of the historic center.

<figure class="figure-inline"><img src="/assets/projects/iqp/alias-map.png" alt="Map of an island with every building labeled by its new alias"><figcaption>Building aliases on one island</figcaption></figure>

- Spatially joined addresses, census tracts, and water meters to buildings for the first time in ArcGIS Pro, so each meter links to an address, each address to a building, and each building to a tract
- Stripped irrelevant fields and renamed the rest so the layers are readable without insider knowledge
- Created a new **alias system** to replace the city's arbitrary numeric IDs: each alias encodes the sestiere, island, census tract, and building number, snaking the city from northwest to southeast, so a building's location can be read from its code alone

## Fieldwork in Venice

With **15,485 buildings** and eight weeks, visiting every building was impossible, so we designed an organized, efficient process that future Venice IQP teams can repeat.

- Built a **Survey123** building survey capturing photos, alias and island code, floor count, doorbell count, and shutter condition per floor
- Doorbells validated unit counts; closed, worn shutters validated vacancy estimates
- Walked islands with alias maps and an alias-to-address spreadsheet, so we always knew exactly which building we were surveying, even when neighbors shared a gutter line and color
- Ran nighttime fieldwork measuring building heights, primarily in San Polo

<div class="figure-row no-crop">
<figure><img src="/assets/projects/iqp/survey-form-1.png" alt="Survey123 form: building ID, date, photo, alias"><figcaption>Survey123 building survey</figcaption></figure>
<figure><img src="/assets/projects/iqp/survey-form-2.png" alt="Survey123 form: floors, doorbells, shutter condition per floor"><figcaption>Floors, doorbells, and shutters</figcaption></figure>
</div>

## Estimating Floors from Building Type

Venetian buildings vary enormously, so no single rule fits them all. We identified the most common architectural classifications and measured heights and floor counts for about **15 buildings in each of 13 types (239 data points)**.

<figure class="figure-inline"><img src="/assets/projects/iqp/building-types-map.jpg" alt="Map of an island with buildings colored by architectural classification"><figcaption>Buildings colored by architectural type</figcaption></figure>

- Fit a linear regression per building type to get its average floor height
- Estimated floors for any building as its height divided by its type's floor height
- For the ~5,000 buildings with no usable height, estimated height from the **5 nearest buildings of the same type**
- Implemented the full pipeline in **Python**, producing a floor estimate for every building in Venice

<div class="figure-row no-crop">
<figure><img src="/assets/projects/iqp/height-regression.png" alt="Scatter plot of floors vs. measured height with a regression line per building type"><figcaption>Floors vs. measured height, per building type</figcaption></figure>
<figure><img src="/assets/projects/iqp/floor-estimate-error.png" alt="Histogram of estimated minus actual floors, centered on zero"><figcaption>Estimated minus actual floors</figcaption></figure>
</div>

## Occupancy Model

The final model combines the 2021 census, water-meter records, building classifications, measured and estimated heights, short-term rental locations, and non-residential buildings:

- **Units:** each water meter generally corresponds to one unit, and residents, non-residents, and businesses pay different water rates, so meters also reveal how each unit is used
- **Vacancy:** residential units with zero water use in 2024 were marked vacant, and fieldwork showed a statistically significant link between closed shutters, zero-use meters, and vacancy
- **Population:** each tract's census population was distributed across its buildings by residential unit count and footprint, excluding hotels and tourist accommodations

<figure><img src="/assets/projects/iqp/vacancy-3d.jpg" alt="3D map of Venice with estimated vacant portions of buildings in gray"><figcaption>Estimated vacant share of each building's height</figcaption></figure>

## Results

- Delivered **Venice's first per-building population and unit estimation model**, updatable whenever new census or water-meter data is released and replicable in other cities facing over-tourism
- Showed that San Marco, San Polo, and Dorsoduro have lost the most residential use to tourism, while Santa Croce, Cannaregio, and Castello remain far more residential
- Published graphs, StoryMaps, ArcGIS layers, and datasets in a public repository for city officials, residents, and future IQP teams
- Documented every assumption so the estimates can be checked, refined, and extended

## My Role

I co-wrote the abstract, introduction, background on Venice's infrastructure history and geography, the methodology for building the unified GIS dataset and field data collection, ethical considerations, and the findings on the unified dataset and residential occupancy, and I helped edit every chapter of the final report.

**Tools:** ArcGIS Pro, ArcGIS Survey123, Python, spatial joins, linear regression

**Advisors:** Judith Nitsch and Luis Vidali · **Sponsor:** Dr. Fabio Carrera, SerenDPT
