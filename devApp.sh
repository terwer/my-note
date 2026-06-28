#!/bin/bash
# my-note app dev
# webpack production mode ensures build completes before starting Electron
set -e
cd "$(dirname "$0")/app"
pnpm install
pnpm run build:app
# Use domestic mirror to avoid official Electron download issues
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ pnpm run start
