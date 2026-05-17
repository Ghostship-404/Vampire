# 热夜之梦 GitHub Pages 静态网站

## 文件结构

- `index.html`：首页
- `atlas.html`：地图志，只显示地点索引，不放地图图片
- `chronicle.html`：帝国五百年年表
- `library.html`：弗菈明国立图书馆
- `archive.html`：档案索引
- `detail.html`：所有详细条目的阅读页
- `world-data.js`：世界观数据
- `script.js`：交互逻辑
- `styles.css`：页面样式
- `.nojekyll`：防止 GitHub Pages 对静态文件做 Jekyll 处理
- `404.html`：错误路径页面

## 部署

把本文件夹内所有文件直接上传到 GitHub repository 根目录，不要只上传外层文件夹。

GitHub Pages 设置：

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

## 本地预览

在本文件夹内运行：

```bash
python -m http.server 8000
```

浏览器打开：

```text
http://localhost:8000
```
