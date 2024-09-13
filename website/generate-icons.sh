#!/usr/bin/env bash

pwa-asset-generator "../assets/logo-dove-orange.svg" "./assets" \
    --index "./assets/index.html" \
    --manifest "./manifest.webmanifest" \
    --favicon \
    --padding "0%" \
    --path-override "/assets" \
    --quality "100" \
    --opaque "false"

pwa-asset-generator "../assets/logo-dove-light.svg" "./assets" \
    --index "./assets/index.html" \
    --manifest "./manifest.webmanifest" \
    --icon-only \
    --background "#f26610" \
    --padding "5%" \
    --path-override "/assets" \
    --quality "100"

pwa-asset-generator "../assets/logo-dove-light.svg" "./assets" \
    --index "./assets/index.html" \
    --splash-only \
    --background "#f26610" \
    --padding "min(35vh, 35vw)" \
    --path-override "/assets" \
    --quality "100"

# pwa-asset-generator "../assets/logo-icon.svg" "./assets" \
#     --index "./assets/index.html" \
#     --splash-only \
#     --background "#fffaf6" \
#     --padding "min(40vh, 40vw)" \
#     --path-override "/assets" \
#     --quality "100"

# pwa-asset-generator "../assets/logo-icon.svg" "./assets" \
#     --index "./assets/index.html" \
#     --splash-only \
#     --dark-mode \
#     --background "#110f0e" \
#     --padding "min(40vh, 40vw)" \
#     --path-override "/assets" \
#     --quality "100"
