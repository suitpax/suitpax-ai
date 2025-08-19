# Suitpax Public Cities Assets

This folder contains public city images used as fallbacks for flight cards and booking summary.

- File naming: lowercase city slug, e.g. `london.jpg`, `rome.jpg`, `paris.jpg`.
- Recommended format: WebP (`.webp`) with fallback `.jpg`.
- Suggested dimensions: 1280x800 (will be downscaled in UI).

CDN option: host the same images at `https://cdn.suitpax.com/cities/<slug>.webp` and keep a JSON mapping in `data/cities.json`.