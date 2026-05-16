# 热夜之梦｜GitHub Pages 静态站点

这是一个可直接部署到 GitHub Pages 的静态网页版本。文件必须放在仓库根目录，不要再套一层外层文件夹。

## 文件结构

```text
index.html
styles.css
script.js
world-data.js
404.html
.nojekyll
README.md
```

## 正确上传方式

1. 解压压缩包。
2. 打开解压后的文件夹。
3. 选中里面的 `index.html`、`styles.css`、`script.js`、`world-data.js`、`404.html`、`.nojekyll`、`README.md`。
4. 把这些文件直接上传到 GitHub repository 的根目录。
5. 不要把整个 `reyedream-pages-v2` 文件夹作为一个子文件夹上传。

## GitHub Pages 设置

1. 进入仓库 `Settings`。
2. 点击 `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`。
5. Folder 选择 `/ (root)`。
6. 保存后等待 GitHub 完成部署。

## 本地预览

```bash
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

## 修改内容

主要内容集中在 `world-data.js`。样式集中在 `styles.css`。页面结构集中在 `index.html`。
