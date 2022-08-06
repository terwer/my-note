# kernel

## build

```bash
go env -w GO111MODULE=on
# go env -w GOPROXY=https://goproxy.cn,direct
# go env -w GOPROXY=https://proxy.golang.com.cn
go env -w GOPROXY=https://goproxy.cn
go build --tags "fts5" -o "../app/kernel/SiYuan_Kernel"
cd ../app/kernel
./SiYuan_Kernel --wd=.. --mode=dev
```