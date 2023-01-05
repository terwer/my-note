<p align="center">
<img alt="SiYuan" src="https://b3log.org/images/brand/siyuan-128.png">
<br>
Build Your Eternal Digital Garden
<br><br>
<a title="Releases" target="_blank" href="https://github.com/siyuan-note/siyuan/releases"><img src="https://img.shields.io/github/release/siyuan-note/siyuan.svg?style=flat-square&color=FF9900"></a>
<a title="Downloads" target="_blank" href="https://github.com/siyuan-note/siyuan/releases"><img src="https://img.shields.io/github/downloads/siyuan-note/siyuan/total.svg?style=flat-square&color=blueviolet"></a>
<a title="Docker Pulls" target="_blank" href="https://hub.docker.com/r/b3log/siyuan"><img src="https://img.shields.io/docker/pulls/b3log/siyuan.svg?style=flat-square&color=99CCFF"></a>
<a title="Hits" target="_blank" href="https://github.com/siyuan-note/siyuan"><img src="https://hits.b3log.org/siyuan-note/siyuan.svg"></a>
</p>

<p align="center">
<a href="README_zh_CN.md">中文</a>
</p>

## 💡 Introduction

A fork of SiYuan, a local-first personal knowledge management system

## 🚀 Release

first, create a tag from a branch, then push the tag to trigger ci build and docker image build.tag example:v0.0.0

```bash
git tag v0.0.0
git push origin v0.0.0
```

## Build

### macOS

```bash
python3 scripts/build.py mac
```

### Windows

```bash
python3 scripts/build.py win
```

### Linux

```bash
python3 scripts/build.py linux
```

Then, setup file is under `build` forder

## Dev

### kernel

```bash
cd kernel
go env -w GO111MODULE=on
# go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOPROXY=https://proxy.golang.com.cn
# go env -w GOPROXY=https://goproxy.cn
go build --tags "fts5" -o "../app/kernel/SiYuan-Kernel"
cd ../app/kernel
./SiYuan-Kernel --wd=.. --mode=dev
```

### app

```bash
cd app
npm install -g pnpm
pnpm config set registry https://registry.npmmirror.com/

pnpm config set electron_mirror=https://cdn.npmmirror.com/binaries/electron/
pnpm config set electron_custom_dir=22.0.0

pnpm install
pnpm run dev
pnpm run start
```
