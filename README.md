# 热夜之梦 GitHub Pages 网站

## 文件结构

```text
index.html        首页
atlas.html        地图志
chronicle.html    帝国五百年
library.html      弗菈明国立图书馆
archive.html      全文档案
styles.css        页面样式
script.js         页面交互
world-data.js     世界观数据
assets/map.jpg    世界地图
404.html          访问错误地址时显示的页面，可删除
.nojekyll         GitHub Pages 静态站点标记
```

## 发布到 GitHub Pages

1. 解压压缩包。
2. 打开解压后的文件夹。
3. 选中里面的所有文件和 `assets` 文件夹。
4. 上传到 GitHub repository 的根目录。
5. 打开 repository 的 Settings → Pages。
6. Source 选择 Deploy from a branch。
7. Branch 选择 main，Folder 选择 / (root)。
8. 保存，等待 GitHub Pages 生成网址。

## 本地预览

```bash
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```
