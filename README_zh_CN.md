<p align="center">
<img alt="SiYuan" src="https://b3log.org/images/brand/siyuan-128.png">
<br>
构建你永恒的数字花园
<br><br>
<a title="Releases" target="_blank" href="https://github.com/siyuan-note/siyuan/releases"><img src="https://img.shields.io/github/release/siyuan-note/siyuan.svg?style=flat-square&color=FF9900"></a>
<a title="Downloads" target="_blank" href="https://github.com/siyuan-note/siyuan/releases"><img src="https://img.shields.io/github/downloads/siyuan-note/siyuan/total.svg?style=flat-square&color=blueviolet"></a>
<a title="Docker Pulls" target="_blank" href="https://hub.docker.com/r/b3log/siyuan"><img src="https://img.shields.io/docker/pulls/b3log/siyuan.svg?style=flat-square&color=99CCFF"></a>
<a title="Hits" target="_blank" href="https://github.com/siyuan-note/siyuan"><img src="https://hits.b3log.org/siyuan-note/siyuan.svg"></a>
</p>

<p align="center">
<a href="README.md">English</a>
| <b>中文</b>
| <a href="README_ja_JP.md">日本語</a>
| <a href="README_tr_TR.md">Türkçe</a>
</p>

## 💡 简介

基于思源笔记修改而来的个人笔记软件，一款本地优先的个人知识管理系统， 支持细粒度块级引用和 Markdown 所见即所得。

## 🚀 发布

1、新建 tag

```bash
git tag v0.0.0
git push origin dev v0.0.0
```

2、合并请求到 main ， 或者直接提交

## 发布 docker 镜像

```
docker login
docker buildx build --push -t terwer/my-note:latest -t terwer/my-note:v0.0.0 .
```

## 构建

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

然后，安装文件就在 `build` 目录

## 开发

### kernel

**Linux / macOS**

```bash
cd kernel
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn
go build --tags "fts5" -o "../app/kernel/my-note-kernel"
cd ../app/kernel
./my-note-kernel --wd=.. --mode=dev
```

**Windows**

```bash
cd kernel
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn
go build --tags "fts5" -o "../app/kernel/my-note-kernel.exe"
cd ../app/kernel
./my-note-kernel.exe --wd=.. --mode=dev
```

### app

```bash
cd app
npm install -g pnpm
pnpm config set registry https://registry.npmmirror.com/

pnpm install
pnpm run dev
pnpm run start
```