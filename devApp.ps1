# my-note app dev (Windows PowerShell)
# webpack production mode ensures build completes before starting Electron
Set-Location "$PSScriptRoot\app"
pnpm install
pnpm run build:app
# Use domestic mirror to avoid official Electron download issues
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
pnpm run start
