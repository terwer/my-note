# my-note kernel dev (Windows PowerShell)
Set-Location "$PSScriptRoot\kernel"
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn
go build --tags "fts5" -o "..\app\kernel\SiYuan-Kernel.exe"
Set-Location ..\app\kernel
# .\SiYuan-Kernel.exe serve --workspace=..
.\SiYuan-Kernel.exe serve --workspace=D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\public
