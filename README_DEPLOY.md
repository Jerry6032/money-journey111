# 部署指南 (Deployment Guide)

这个项目是一个标准的 React + Vite 应用，可以非常容易地部署到 Vercel。

## 准备工作

1. **API Key**: 你需要一个 Google Gemini API Key。
   - 环境变量名称: `GEMINI_API_KEY`

## 部署步骤 (Vercel)

### 方法 1: 使用 GitHub (推荐)

1. 将此项目推送到你的 GitHub 仓库。
2. 登录 [Vercel](https://vercel.com)。
3. 点击 "Add New..." -> "Project"。
4. 选择刚才推送的 GitHub 仓库并点击 "Import"。
5. 在 "Environment Variables" (环境变量) 部分，添加:
   - Key: `GEMINI_API_KEY`
   - Value: `你的_Gemini_API_Key`
6. 点击 "Deploy"。

### 方法 2: 使用 Vercel CLI

如果你本地安装了 Vercel CLI，可以在终端运行:

```bash
vercel
```

按照提示操作:
1. Set up and deploy? -> `Y`
2. Which scope? -> (选择你的账号)
3. Link to existing project? -> `N`
4. Project name? -> (默认或输入新名字)
5. In which directory? -> `./`
6. Auto-detect settings? -> `Y` (Vite 会被自动识别)
7. **重要**: 部署完成后，去 Vercel 仪表盘设置环境变量 `GEMINI_API_KEY`，然后重新部署 (Redeploy)。

## 注意事项

- 项目依赖 TailwindCSS (通过 CDN 引入) 和 Google GenAI SDK。
- 确保 API Key 有效且有额度。
