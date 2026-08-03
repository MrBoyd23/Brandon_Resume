#!/usr/bin/env bash
# scripts/gen_qr.sh — Generate QR code assets for the resume site.
# Requires: qrencode (apt install qrencode)
set -euo pipefail

SITE="https://resume.brandonaboyd.com"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/qr"

mkdir -p "$OUT_DIR"

# Main resume QR (screen-quality PNG)
qrencode -o "$OUT_DIR/resume-screen.png" -s 8 -m 2 -l Q "$SITE"

# Print-quality PNG (2048px)
qrencode -o "$OUT_DIR/resume-print-2048.png" -s 32 -m 2 -l H "$SITE"

# Print SVG
qrencode -o "$OUT_DIR/resume-print.svg" -t SVG -m 2 -l H "$SITE"

# Tracking QR codes
qrencode -o "$OUT_DIR/track-linkedin.svg" -t SVG -m 2 -l H "$SITE/q/linkedin"
qrencode -o "$OUT_DIR/track-card.svg"     -t SVG -m 2 -l H "$SITE/q/card"

echo "QR assets written to $OUT_DIR"
