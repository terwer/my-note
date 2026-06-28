#!/bin/bash
# my-note kernel dev
set -e
cd "$(dirname "$0")/kernel"
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn

case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)  BIN=SiYuan-Kernel.exe ;;
    *)                     BIN=SiYuan-Kernel ;;
esac

go build --tags "fts5" -o "../app/kernel/$BIN"
cd ../app/kernel
./$BIN serve --workspace=..
