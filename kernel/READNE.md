# kernel

## build

```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
go build --tags "fts5" -o "../app/kernel/SiYuan-Kernel"
cd ../app/kernel
./SiYuan-Kernel --wd=.. --mode=dev
```