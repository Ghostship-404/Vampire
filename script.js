# 热夜之梦 GitHub Pages 静态网站

这是从 `热夜之梦.docx` 转换出来的 GitHub Pages 版本，适合直接上传到 GitHub 仓库根目录发布。

## 文件结构

```text
index.html        网页入口
styles.css        视觉样式
script.js         搜索、筛选、年表、导航交互
world-data.js     从 Word 文档提取的世界观文本数据
.nojekyll         禁用 Jekyll 处理，避免静态资源路径问题
README.md         部署说明
404.html          简单错误页
```

## 本地预览

直接双击 `index.html` 可以查看。若浏览器限制本地脚本，打开命令行进入本文件夹后运行：

```bash
python -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000
```

## 上传到 GitHub Pages

1. 在 GitHub 新建一个 repository，例如 `reyedream`。
2. 把本文件夹里的所有文件上传到仓库根目录。
3. 进入仓库的 `Settings` → `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，Folder 选择 `/root`。
6. 保存后等待 GitHub Pages 自动发布。

GitHub Pages 会寻找仓库发布源顶层的 `index.html`、`index.md` 或 `README.md` 作为入口文件。本模板已经把 `index.html` 放在根目录。

## 后续修改内容

- 修改世界观正文：编辑 `world-data.js` 中的 `sections`。
- 修改视觉风格：编辑 `styles.css`。
- 修改首页、导航或模块顺序：编辑 `index.html`。
- 修改搜索、筛选、年表逻辑：编辑 `script.js`。

## 已转换内容统计

- 条目数：150
- 估算字符数：48199
- 地点条目：37
- 年表事件：61
