# 个人财富系统 · 20 章在线课程

从「财富是什么」开始，逐步学习现金流、债务、应急金、保险、投资工具、资产配置，最后建立自己的个人财富系统。

## 直接开始学习

**[打开在线课程 →](https://hajimi-tomato.github.io/personal-wealth-course/)**

网页采用书页式排版，把 20 章放在同一个阅读入口。正文可以连续滚动，支持目录检索、书签跳转、上一章／下一章、字号调节和本地学习进度。每章原有的计算器与互动练习也可以在阅读区直接使用。手机上可使用「目录」按钮，或单独打开当前章节。

章末参考资料以资料名称直接链接到原始网页或文件，外部资料会在新标签页打开；没有对应网页的课程方法说明仍以文字保留。

GitHub 的 README 用来介绍和进入课程；可交互的网页由仓库根目录的 `index.html` 通过 GitHub Pages 提供。

## 学习路线

| 章节 | 主题 |
| --- | --- |
| 1–3 | 财富、金钱行为、目标与选择 |
| 4–7 | 财务体检、支出系统、账户与债务 |
| 8–10 | 应急金、保险与消费者保护 |
| 11–13 | 时间价值、真实收益与风险 |
| 14–17 | 资产地图、债券、股票、基金与 ETF |
| 18–19 | 资产配置与投资行为 |
| 20 | 个人财富系统与长期复盘 |

建议从第一章开始；需要查某个知识点时，可以在网页左侧搜索。

## 20 章目录

| 章节 | 点击进入在线阅读 |
| --- | --- |
| 01 | [财富是什么？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=1) |
| 02 | [钱为什么会影响我们的决定？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=2) |
| 03 | [钱究竟应该服务什么？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=3) |
| 04 | [给自己做一次完整财务体检](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=4) |
| 05 | [钱为什么总是在不知不觉中消失？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=5) |
| 06 | [银行、账户、支付和信用到底是什么系统？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=6) |
| 07 | [借钱为什么会改变未来？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=7) |
| 08 | [为什么有一部分钱永远不应该拿去投资？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=8) |
| 09 | [保险究竟在买什么？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=9) |
| 10 | [金融世界如何保护自己？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=10) |
| 11 | [时间为什么可以让钱增长？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=11) |
| 12 | [通胀、费用和税为什么会悄悄吃掉收益？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=12) |
| 13 | [风险和收益到底是什么关系？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=13) |
| 14 | [一张图看懂所有主要资产](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=14) |
| 15 | [债券：为什么“借钱给别人”能成为资产？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=15) |
| 16 | [股票：你买下的到底是什么？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=16) |
| 17 | [基金、指数和 ETF：为什么普通人不一定需要选股票？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=17) |
| 18 | [为什么资产配置比寻找“神基”更重要？](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=18) |
| 19 | [最大的投资风险可能是你自己](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=19) |
| 20 | [把所有东西变成你的个人财富系统](https://hajimi-tomato.github.io/personal-wealth-course/#chapter=20) |

## 仓库结构

- `chapters/`：20 个原始章节 HTML。正文和章节内互动保持原样。
- `index.html`、`styles.css`、`app.js`：统一阅读网页。
- `reader-mode.css`：在统一网页中呈现章节的书页样式，不修改原章正文。
- `citation-links.js`：把章末参考资料显示为可点击的原始来源，并在新标签页打开外部链接。
- `course-data.js`：从各章标题和小节生成的导航数据。
- `scripts/build_manifest.py`：章节标题变化后重新生成导航数据。

网页无需账号。完成状态保存在当前浏览器的本地存储；章节内若使用个人财务数字，请留意对应章节说明的数据保存方式。课程中的示例及计算工具用于教育，不构成个性化投资、保险、法律或税务建议；各章末尾列有参考资料和方法边界。

本课程仍会继续整理和改进。发现错字、失效链接或概念问题，可以在仓库中提交 Issue。
