#!/usr/bin/env bash
set -euo pipefail

PORT=${1:-5500}

if command -v python3 >/dev/null 2>&1; then
  echo "Serving on http://localhost:${PORT}"
  python3 -m http.server "$PORT"
else
  echo "python3 not found. Please install Python 3." >&2
  exit 1
fi
