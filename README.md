# 个人技术笔记

基于 Astro 的静态 Markdown 博客，适合部署到 Cloudflare Pages。

## 本地运行

```powershell
npm.cmd install
npm.cmd run dev
```

## 新增文章

在 `src/content/posts/` 创建 Markdown 文件，并添加以下 frontmatter：

```md
---
title: "文章标题"
description: "一两句摘要"
publishedAt: 2026-07-21
tags: ["Vibe Coding", "随笔"]
---

正文从这里开始。
```

## 公开仓库安全

这是一个静态博客，目前不需要 API Key、数据库密码或任何私密环境变量。不要把密钥、Cookie、个人资料、聊天记录、终端输出或本机配置写进文章或提交到 Git。

`.env*`、私钥证书、部署工具本地状态和编辑器配置已被 `.gitignore` 排除。若未来增加需要环境变量的功能，只提交脱敏的 `.env.example`，真实值仅在 Cloudflare Pages 的环境变量设置中填写。

## Cloudflare Pages 部署

1. 将本目录推送到新的 GitHub 仓库。
2. Cloudflare Dashboard -> Workers & Pages -> Create application -> Pages -> Connect to Git。
3. 选择 GitHub 仓库，构建命令填写 `npm run build`，输出目录填写 `dist`。
4. 部署完成后，在 Pages 项目的 `Custom domains` 添加 `439952066.xyz` 和 `www.439952066.xyz`。
5. 当域名 DNS 已托管到 Cloudflare 时，Cloudflare 会自动创建所需记录并签发 HTTPS 证书。
