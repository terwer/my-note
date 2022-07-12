# app

## build

```bash
npm install -g pnpm
pnpm config set registry https://registry.npmmirror.com/

pnpm config set electron_mirror=https://cdn.npmmirror.com/binaries/electron/ 
pnpm config set electron_custom_dir=14.2.5

pnpm install
pnpm run dev
pnpm run start
```