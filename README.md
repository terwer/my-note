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
<b>English</b>
| <a href="README.zh-CN.md">中文</a>
| <a href="README.ja.md">日本語</a>
| <a href="README.tr.md">Türkçe</a>
</p>

## 💡 Introduction

A fork of SiYuan, a local-first personal knowledge management system

## 🚀 Release

first, create a tag from a branch, then push the tag to trigger ci build and docker image build.tag example:v0.0.0

```bash
git tag v0.0.0
git push origin dev v0.0.0
```

then, merge dev to main or push to main

## Publish docker image

```
docker login
docker buildx build --push -t terwer/my-note:latest -t terwer/my-note:v0.0.0 .
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

内核二进制名 `SiYuan-Kernel` 由运行时代码硬编码，不可改名。

```bash
# Linux / macOS
./dev.sh

# Windows (PowerShell)
.\dev.ps1
```

### app

```bash
# Linux / macOS
./devApp.sh

# Windows (PowerShell)
.\devApp.ps1
```

注意：app 脚本使用 webpack production 模式构建并通过国内镜像下载 Electron，
构建完成后自动启动。
