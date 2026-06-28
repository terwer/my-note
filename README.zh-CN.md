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
| <a href="README.ja.md">日本語</a>
| <a href="README.tr.md">Türkçe</a>
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