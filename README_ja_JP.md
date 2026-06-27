<p align="center">
<img alt="SiYuan" src="https://b3log.org/images/brand/siyuan-128.png">
<br>
あなたの永遠のデジタルガーデンを構築
<br><br>
<a title="Releases" target="_blank" href="https://github.com/siyuan-note/siyuan/releases"><img src="https://img.shields.io/github/release/siyuan-note/siyuan.svg?style=flat-square&color=FF9900"></a>
<a title="Downloads" target="_blank" href="https://github.com/siyuan-note/siyuan/releases"><img src="https://img.shields.io/github/downloads/siyuan-note/siyuan/total.svg?style=flat-square&color=blueviolet"></a>
<a title="Docker Pulls" target="_blank" href="https://hub.docker.com/r/b3log/siyuan"><img src="https://img.shields.io/docker/pulls/b3log/siyuan.svg?style=flat-square&color=99CCFF"></a>
<a title="Hits" target="_blank" href="https://github.com/siyuan-note/siyuan"><img src="https://hits.b3log.org/siyuan-note/siyuan.svg"></a>
</p>

<p align="center">
<a href="README.md">English</a>
| <a href="README_zh_CN.md">中文</a>
| <b>日本語</b>
| <a href="README_tr_TR.md">Türkçe</a>
</p>

## 💡 紹介

SiYuan からフォークした、ローカルファーストの個人ナレッジ管理システム。

## 🚀 リリース

まずブランチからタグを作成し、タグをプッシュして CI ビルドと Docker イメージビルドをトリガーします。タグ例: v0.0.0

```bash
git tag v0.0.0
git push origin dev v0.0.0
```

次に、dev を main にマージするか、main にプッシュします。

## Docker イメージの公開

```
docker login
docker buildx build --push -t terwer/my-note:latest -t terwer/my-note:v0.0.0 .
```

## ビルド

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

ビルド後、インストールファイルは `build` フォルダーにあります。

## 開発

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
