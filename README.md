# 天狗语录

一个简洁优雅的语录展示应用，每次刷新都是一次心动（或心碎）。

## 功能特性

- 随机语录展示
- 分类筛选（情话、舔狗语录、鸡汤等）
- 一键复制语录
- 暗色/亮色主题切换
- 流畅的动画效果
- 响应式设计，支持移动端

## 技术栈

- **前端**：Nuxt 3 + Vue 3
- **样式**：纯 CSS，无第三方 UI 库
- **数据**：文本文件存储，按文件名自动分类

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## API 接口

| 接口 | 说明 |
|------|------|
| `GET /api/random` | 随机获取一条语录 |
| `GET /api/random?category=情话` | 按分类随机获取语录 |
| `GET /api/categories` | 获取所有分类列表 |

## 添加新分类

在 `texts/` 目录下创建新的 `.txt` 文件，文件名即为分类名称。例如创建 `texts/笑话.txt`，即可在分类下拉菜单中选择"笑话"。

## 项目结构

```
tiangou_dev/
├── pages/
│   └── index.vue        # 主页面
├── server/
│   ├── api/             # API 接口
│   └── utils/           # 工具函数
├── texts/               # 语录数据
│   ├── 情话.txt
│   ├── 舔狗语录.txt
│   └── 鸡汤.txt
└── package.json
```

## 许可证

MIT
