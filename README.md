# 王满宁学术主页手动发布指南

本指南对应已经制作好的中英文学术主页。全程使用浏览器和 Windows 文件资源管理器，不需要安装开发工具，也不需要输入命令。

目标仓库：[manningWang/homepage](https://github.com/manningWang/homepage)

发布成功后的预期地址：[https://manningwang.github.io/homepage/](https://manningwang.github.io/homepage/)。最终以 GitHub Pages 设置页面显示的地址为准。

## 一、下载和解压网站文件

### 第 1 步：解压完整网站包

找到下载的 **王满宁-双语学术主页.zip**，右键选择 **全部解压缩**，再点击 **提取**。解压后打开里面的 **academic-homepage** 文件夹。

本次发布使用完整网站包中的文件；单独的“王满宁-网站预览.html”仅用于本地查看效果。

### 第 2 步：确认所在文件夹正确

打开 `academic-homepage` 后，应直接看到：

```text
academic-homepage
├─ index.html
├─ content.js
├─ app.js
├─ styles.css
├─ editor.html
├─ editor.js
├─ editor.css
├─ README.md
├─ .nojekyll
└─ assets
   ├─ portrait.png
   └─ favicon.svg
```

`index.html` 是首页，`content.js` 存放个人信息和论文，`assets` 存放照片及图标。可以先双击 `index.html`，用 Edge 或 Chrome 查看效果。

**检查结果：当前文件夹直接可见 index.html，而不是还需要再打开一层文件夹。**

## 二、上传到 GitHub 仓库

### 第 3 步：确认浏览器登录账号

打开 [GitHub](https://github.com/)，点击右上角头像，确认登录账号为 **manningWang**。本次手动操作以浏览器里的账号为准，不需要处理聊天应用中的 GitHub 连接。

如果显示其他账号，请切换至 `manningWang`，或使用确实拥有该仓库写入与设置权限的账号。

### 第 4 步：打开已有仓库

打开：[https://github.com/manningWang/homepage](https://github.com/manningWang/homepage)

确认页面左上方显示 **manningWang / homepage**，处于 **Code** 页面，分支下拉框选择 **main**。继续使用这个仓库即可，无需新建或改名。

### 第 5 步：进入上传页面

在仓库文件列表上方，点击 **Add file → Upload files**。

也可以直接打开：[上传到 homepage 的 main 分支](https://github.com/manningWang/homepage/upload/main)。

### 第 6 步：上传文件夹里面的全部内容

回到文件资源管理器，进入 `academic-homepage` 文件夹，按 **Ctrl+A**，将里面的文件和 `assets` 文件夹一起拖入 GitHub 上传区域。

请上传这一层的全部内容，保留 `assets` 文件夹及其中的文件。最关键的区别是：

```text
正确：homepage 仓库 / index.html
错误：homepage 仓库 / academic-homepage / index.html
```

GitHub 的仓库首页应该直接显示 `index.html`。不要把 ZIP 压缩包直接上传，也不要把外层 `academic-homepage` 文件夹整体上传。

等待所有文件上传完成。GitHub 支持在上传界面拖入文件或文件夹。[上传文件的官方说明](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

### 第 7 步：提交保存

在页面底部填写提交说明，例如：**Publish bilingual academic homepage**。

如果出现提交方式选项，选择 **Commit directly to the main branch**，点击 **Commit changes**。如果随后还有确认窗口，继续确认。

“提交”就是把上传内容正式保存到仓库，完成后才算上传成功。如果只允许向新分支提议修改，或提示没有权限，请先核对账号和分支权限。

### 第 8 步：检查文件位置

返回 **Code** 页面，确认根目录直接显示 `index.html`、`content.js`、`app.js`、`styles.css`、三个 `editor` 文件以及 `assets` 文件夹。

点击 `assets`，确认有 `portrait.png` 和 `favicon.svg`。

如果所有文件都位于仓库里的 `academic-homepage` 子文件夹中，请重新从本地该文件夹内部上传，让 `index.html` 位于仓库根目录；不需要删除整个仓库。

## 三、设置 GitHub Pages

### 第 9 步：进入 Pages 设置

在仓库顶部点击 **Settings**，再在左侧点击 **Pages**。如果顶部没有直接显示 Settings，可检查顶部折叠菜单。

也可以直接打开：[本仓库的 Pages 设置](https://github.com/manningWang/homepage/settings/pages)。

无法进入时，请确认账号是仓库所有者，或拥有管理员、维护者权限。配置发布来源需要相应权限。[发布设置的官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

### 第 10 步：选择发布位置并保存

在 **Build and deployment** 区域按表格设置：

| 设置项 | 选择内容 |
| --- | --- |
| Source | Deploy from a branch |
| Branch | main |
| 文件夹 | / (root) |

点击 **Save**。

这表示使用 `main` 分支根目录中的网站文件进行发布。此网站已经包含所需静态文件，按该方式发布即可。[发布来源设置的官方步骤](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

如果原本就设置正确，保持即可。如果 Branch 下拉框没有 `main`，先返回 Code 确认上传已经提交，再刷新设置页。

### 第 11 步：查看部署是否完成

打开仓库顶部的 **Actions**，查看最新的 Pages 发布任务，常见名称为 **pages build and deployment**。

- 黄色圆点或旋转图标：排队或运行中，继续等待。
- 绿色对勾：发布成功。
- 红色叉号：发布失败，点进任务查看失败步骤和错误信息。

即使选择从分支发布，GitHub Pages 仍通过 Actions 任务完成部署，这是正常现象。GitHub 官方说明，提交后的变化可能需要约 10 分钟才能发布；以任务状态和实际访问结果为准。[部署与查看结果的官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## 四、打开正式网站并检查

### 第 12 步：访问 Pages 提供的地址

返回 **Settings → Pages**，在发布成功提示附近点击 **Visit site**。

预期网址：[https://manningwang.github.io/homepage/](https://manningwang.github.io/homepage/)

请保留地址末尾的 `/homepage/`。GitHub 仓库地址用于管理文件，`github.io` 地址才是访客浏览的网站。[查看已发布网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

### 第 13 步：逐项验证页面

1. 照片正常显示，页面排版完整。
2. 右上角能切换中英文。
3. “经历与学术服务”导航能跳到第二项。
4. 两个研究方向及三个制药研究主题正确。
5. 代表作有 Drug-TTA 和 TALK，TALK 标明 Oral。
6. 论文可以按方向、年份及关键词筛选。
7. 实习招募信息正确，邮箱为 `mnwang@fudan.edu.cn`。

检查完成后，即可将正式 `github.io` 地址发给学生和同行。

## 五、以后如何更新内容

### 第 14 步：打开表单编辑器

在网站页脚点击 **内容编辑 / Content editor**。上线后也可以直接访问：[网站内容编辑页](https://manningwang.github.io/homepage/editor.html)。

在对应分类中修改简介、添加论文、更换照片或调整实习要求。中文和英文分别填写；新照片会随导出的内容文件保存，不需要另传照片文件。

### 第 15 步：预览并导出

点击 **预览修改**，确认效果后点击 **导出 content.js**。

确认下载文件名为 **content.js**。如果被自动命名为 `content (1).js` 或 `content (2).js`，上传前请改回 `content.js`。

编辑器中的内容和预览是浏览器草稿。导出本身不会更新正式网站，还要完成下一步。

### 第 16 步：上传新的内容文件

打开：[上传到 homepage 的 main 分支](https://github.com/manningWang/homepage/upload/main)。

将新导出的 **content.js** 上传到仓库根目录，替换同名文件，填写更新说明并提交到 `main`。

仅更新个人信息或论文时，一般只需上传这个文件，无需重新上传全部网站，也不需要重新设置 Pages。提交到发布分支后，GitHub 会自动重新发布。[分支更新与自动发布](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

等待发布任务成功，再打开正式网站；Windows 下可以按 **Ctrl+F5** 刷新，也可以用新的无痕窗口查看。

请保留导出文件作备份。恢复旧内容时，在编辑器中点击 **导入内容文件**，选取此前保存的 `content.js`。如果编辑器显示旧草稿，先导出草稿备份，再点击 **恢复为已发布内容** 载入网站当前内容。

## 六、常见问题对照

| 看到的情况 | 检查和处理 |
| --- | --- |
| 找不到 Settings，或设置页面无权限 | 确认浏览器登录 `manningWang`，或由仓库所有者处理发布设置 |
| 上传后没有保存成功 | 确认完成提交及后续确认；回 Code 页面检查文件是否出现 |
| 网站只显示 README 文字 | 检查 `index.html` 是否在 `main` 分支根目录 |
| 网站出现 404 | 使用完整 `/homepage/` 地址；核对 `main`、`/ (root)`，再检查 Actions 状态 |
| 页面无排版，或语言按钮无反应 | 核对 `styles.css`、`app.js`、`content.js` 是否在根目录，文件名大小写是否正确 |
| 照片不显示 | 保留 `assets` 文件夹结构，核对 `assets/portrait.png` |
| 编辑器改了内容，正式网站没变 | 完成导出、上传并提交 `content.js`，等待部署后刷新 |
| 仓库出现 `content (1).js` | 将下载文件改名为 `content.js`，再上传替换正确文件 |
| 提交后仍显示旧内容 | 等待 Actions 成功，然后 Ctrl+F5 或用无痕窗口查看 |
| Actions 显示红叉 | 打开失败任务，将错误文字或截图发来以便定位 |

## 七、内容来源与维护说明

个人简介、照片、经历、奖励、任职和成果转化信息来自用户提供的简历及后续补充。初始论文来自按复旦单位和邮箱域名匹配的 [个人 Google Scholar 主页](https://scholar.google.com/citations?user=6I8hSp8AAAAJ&hl=en)，并结合会议论文页面和用户提供的信息补充。

论文精选共 37 篇。引用数据仍为 **2026-10-29** 的人工核对快照，不会自动变化；更新引用次数、h 指数等数据时，请同时调整查询日期。

[Drug-TTA](https://proceedings.mlr.press/v267/shen25n.html) 使用 ICML 官方论文集信息。[TALK](https://openreview.net/forum?id=3DiNfT64V7) 的链接、标题和 NeurIPS 2026 Oral 信息由用户提供；当时该页要求浏览器验证，作者列表和引用次数未补写。

## 本次交付状态

本指南用于手动发布。是否成功上线，以 GitHub Pages 显示的正式地址、部署任务结果及实际访问效果为准。
