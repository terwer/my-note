---
name: my-note-rebrand
description: |
  将上游 siyuan-note/siyuan 构建脚本中的 "siyuan" 品牌名替换为 "my-note"。
  每次从 upstream 拉取合并后运行，恢复自定义命名。只修改构建/Docker 脚本，不动运行时代码。
category: software-development
---

# my-note 品牌重命名

## 触发条件
- 用户说 "改回 my-note"、"恢复品牌名"、"rename to my-note"
- 用户从 upstream (siyuan-note/siyuan) 拉取代码后品牌被覆盖
- 用户说 "upstream 覆盖了，改回来"

## 原则
- **只改构建脚本和 Docker 脚本**，不修改运行时 JS 代码
- `app/electron/main.js` —— 不动（包含 siyuan:// 协议处理、IPC 通道等运行逻辑）
- `app/package.json` —— 不动（name/homepage 影响 npm 依赖解析）
- `app/appearance/` —— 不动（UI 资源）
- `app/stage/service-worker.js` —— 不动（运行时 service worker）
- macOS `schemes: - "siyuan"` 保留不动（与 main.js 的 siyuan:// 协议处理配套）

## 需修改的文件（共 8 个）

### 1. Dockerfile
将 `siyuan` → `my-note`（4 处路径引用）：
```
ENV HOME=/home/my-note
WORKDIR /opt/my-note/
ENTRYPOINT ["/opt/my-note/entrypoint.sh"]
CMD ["/opt/my-note/kernel"]
```

### 2. kernel/entrypoint.sh
全部 `siyuan` → `my-note`（用户、组、路径、环境变量、echo 信息）：
- `USER_NAME=${USER_NAME:-mynote}`
- `GROUP_NAME=${GROUP_NAME:-mynote}`
- `WORKSPACE_DIR="/my-note/workspace"`
- `MYNOTE_WORKSPACE_PATH`（原 `SIYUAN_WORKSPACE_PATH`）
- `/opt/my-note`、`/home/my-note/`
- `echo "Starting MyNote with ..."`
- `exec su-exec ... /opt/my-note/kernel`

### 3-8. 6 个 electron-builder YAML 文件
统一替换：
- `productName: "SiYuan"` → `productName: "MyNote"`
- `appId: "org.b3log.siyuan"` → `appId: "com.terwer.mynote"`
- `artifactName: "siyuan-${version}..."` → `artifactName: "my-note-${version}..."`
- Windows 额外：`shortcutName: "SiYuan"` → `shortcutName: "MyNote"`
- Linux 额外：`executableName: "siyuan"` → `executableName: "my-note"`, `Name: "SiYuan"` → `Name: "MyNote"`
- macOS 额外：`protocols.name: "SiYuan"` → `protocols.name: "MyNote"`（scheme `siyuan://` 保留）

文件列表：
1. `app/electron-builder.yml`（Windows x64 + NSIS）
2. `app/electron-builder-arm64.yml`（Windows arm64 + NSIS）
3. `app/electron-builder-linux.yml`（Linux x64）
4. `app/electron-builder-linux-arm64.yml`（Linux arm64）
5. `app/electron-builder-darwin.yml`（macOS x64）
6. `app/electron-builder-darwin-arm64.yml`（macOS arm64）

## 执行步骤

1. 逐文件用 patch 工具替换，每文件可能需要 1-3 次 patch 调用
2. 改完后用 search_files 验证各文件无 `siyuan` 残留（darwin scheme 除外）
3. 不用 git commit（留给用户自己决定何时提交）