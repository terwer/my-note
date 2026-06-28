---
name: my-note-rebrand
description: |
  将上游 siyuan-note/siyuan 构建脚本中的 "siyuan" 品牌名替换为 "my-note"。
  每次从 upstream 拉取合并后运行，恢复自定义命名。只修改构建/Docker 脚本，不动运行时代码。
category: software-development
---

# my-note 品牌重命名

项目根目录：`D:\Users\Administrator\Documents\myproject\my-note`

## 触发条件
- 用户说 "改回 my-note"、"恢复品牌名"、"rename to my-note"
- 用户从 upstream (siyuan-note/siyuan) 拉取代码后品牌被覆盖
- 用户说 "upstream 覆盖了，改回来"

## 原则：只改构建/Docker 脚本，不碰运行时代码

以下文件 **不动**：
- `app/electron/main.js` — siyuan:// 协议处理、IPC、窗口管理等运行时逻辑
- `app/package.json` — name/homepage 影响 npm 解析
- `app/appearance/` — UI 资源
- `app/stage/service-worker.js` — runtime
- **内核二进制名 `SiYuan-Kernel` / `SiYuan-Kernel.exe`** — 运行时代码硬编码，不可改名

以下文件 **要改**：
- `Dockerfile`
- `kernel/entrypoint.sh`
- `app/electron-builder*.yml` (6个)
- `app/.npmrc` — 检查 `electron_custom_dir` 是否与 `package.json` electron 版本一致

## 要改的文件

### 1. Dockerfile（项目根目录）
`siyuan` → `my-note`：
```
ENV HOME=/home/my-note
WORKDIR /opt/my-note/
ENTRYPOINT ["/opt/my-note/entrypoint.sh"]
CMD ["/opt/my-note/kernel", "serve"]
```
注意：上游 Dockerfile 已演变为多阶段构建，CMD 可能包含 `"serve"` 子命令，
必须先 read_file 确认当前结构再 patch。

### 2. kernel/entrypoint.sh
全部替换：
- `USER_NAME=${USER_NAME:-mynote}` / `GROUP_NAME=${GROUP_NAME:-mynote}`
- `WORKSPACE_DIR="/my-note/workspace"`
- `SIYUAN_WORKSPACE_PATH` → `MYNOTE_WORKSPACE_PATH`
- 所有 `/opt/siyuan` → `/opt/my-note`、`/home/siyuan/` → `/home/my-note/`
- `echo "Starting Siyuan..."` → `echo "Starting MyNote..."`

### 3-8. 6 个 electron-builder YAML（`app/` 目录下）
统一替换：
- `productName: "SiYuan"` → `productName: "MyNote"`
- `appId: "org.b3log.siyuan"` → `appId: "com.terwer.mynote"`
- `artifactName: "siyuan-..."` → `artifactName: "my-note-..."`
- Windows：`shortcutName: "SiYuan"` → `shortcutName: "MyNote"`
- Linux：`executableName: "siyuan"` → `executableName: "my-note"`，桌面入口 `Name: "SiYuan"` → `Name: "MyNote"`
- macOS：协议 display `name: "SiYuan"` → `name: "MyNote"`，但 scheme `"siyuan"` **保留不动**

文件：
- `app/electron-builder.yml`
- `app/electron-builder-arm64.yml`
- `app/electron-builder-linux.yml`
- `app/electron-builder-linux-arm64.yml`
- `app/electron-builder-darwin.yml`
- `app/electron-builder-darwin-arm64.yml`

### 9. app/.npmrc — Electron 版本同步

这是用户自己维护的文件，**upstream 不管**。
`electron_custom_dir` 必须与 `app/package.json` 中 `devDependencies.electron` 版本一致。

每次 pull 后：
1. 读取 `app/package.json` → 找到 `"electron": "X.Y.Z"`
2. 读取 `app/.npmrc` → 检查 `electron_custom_dir=X.Y.Z`
3. 不一致就更新 `.npmrc`

示例：
```
# package.json: "electron": "42.5.0"
# .npmrc: electron_custom_dir=40.9.1  ← 过期，改为 42.5.0
```

完整 `.npmrc` 参考：
```
shell-emulator=true
virtual-store-dir-max-length=80
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_custom_dir=<version from package.json>
```

## 执行流程

1. 先用 `search_files(pattern="siyuan")` 扫描，看哪些文件实际被覆盖了
2. 用 `patch` 逐文件替换，每文件可能需要 1-3 次调用
3. 检查 `.npmrc` electron 版本是否与 `package.json` 一致
4. 用 `search_files` 验证无 `siyuan` 残留（darwin scheme 除外）
5. 不做 git commit
