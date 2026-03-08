# HumanizeAI

An open-source AI text rewriting tool that transforms AI-generated academic text into natural, human-like writing.

一款开源的 AI 文本改写工具，将 AI 生成的学术文本转化为自然的人类写作风格。

---

## Features / 功能特性

- **Two Rewrite Modes / 两种改写模式**
  - **Ghost 4.0** — Formal academic paraphrase / 正式学术改写
  - **Ghost 4.1** — Natural human-like rewrite / 自然人类风格
- **AI Detection Score / AI 检测评分** — Built-in heuristic analyzer / 内置启发式分析器
- **Google OAuth / Google 登录** — One-click sign in / 一键登录
- **Usage Control / 用量控制** — Daily limits with plan-based quotas / 按套餐每日限制
- **Referral System / 推荐系统** — Share links to earn bonus rewrites / 分享链接获取额外次数
- **i18n / 双语** — English & Chinese / 中英文界面
- **Dark Mode / 深色模式** — Full theme support / 完整主题支持

## Pages & Functions / 页面与功能

### Rewrite / 改写 (`/rewrite`)

Core feature: paste text, select Ghost 4.0 or 4.1, get rewritten result with AI detection score.

<img width="2876" height="1618" alt="7fba1a7b90d3a6825eae4f761384d680" src="https://github.com/user-attachments/assets/45d311e4-4a06-4c3d-890e-4ed645a8a1ac" />


<!-- screenshot -->

### AI Detect / AI 检测 (`/detect`)

Paste any text to get an AI detection score (vocabulary, structure, flow, voice).

粘贴文本获取 AI 检测评分（词汇、结构、流畅度、语态）。
<img width="2850" height="1290" alt="4a80eef1019016f2151c65872941c7f8" src="https://github.com/user-attachments/assets/92d3c203-e01f-4d14-8001-41930d59505b" />


<!-- screenshot -->

### Dashboard / 仪表盘 (`/dashboard`)

View usage statistics and recent rewrite results.

查看使用统计和最近改写结果。
<img width="2898" height="1380" alt="image" src="https://github.com/user-attachments/assets/08c9745c-f478-476a-a536-f5dc02681910" />


<!-- screenshot -->

### Plans / 套餐 (`/plans`)

Free / Week / Pro subscription plans.

免费 / 周卡 / 专业版套餐。

<!-- screenshot -->

### Profile / 个人资料 (`/profile`)

User profile and account info.

用户资料和账户信息。

<!-- screenshot -->

### Share / 推荐 (`/share`)

Generate referral link & QR code, earn +3 bonus rewrites per referral.

生成推荐链接和二维码，每次推荐 +3 次改写。

<!-- screenshot -->

### Feedback / 反馈 (`/feedback`)

Submit feedback to the team.

向团队提交反馈。

<!-- screenshot -->

### Cooperation / 合作 (`/cooperation`)

Business partnership contact.

商务合作联系。

<!-- screenshot -->

## Tech Stack / 技术栈

| Layer / 层级 | Technology / 技术 |
|---|---|
| Framework / 框架 | Next.js 16 (App Router, Turbopack) |
| Language / 语言 | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Auth / 认证 | NextAuth.js v5 (Google OAuth) |
| Database / 数据库 | Prisma 7 + SQLite (dev) / PostgreSQL (prod) |
| AI | OpenAI API (GPT-4o-mini) |

## Getting Started / 快速开始

### Prerequisites / 环境要求

- Node.js 18+
- npm or pnpm
- OpenAI API Key
- Google OAuth credentials / Google OAuth 凭据

### Install / 安装

```bash
git clone https://github.com/wx5352/AI-Human.git
cd AI-Human
npm install
```

### Environment / 环境变量

```bash
cp .env.example .env
```

Edit `.env` / 编辑 `.env`：

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET=""          # Run / 运行: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""    # Google Cloud Console
GOOGLE_CLIENT_SECRET=""
OPENAI_API_KEY=""      # OpenAI Platform
```

### Database / 数据库

```bash
npx prisma migrate dev
```

### Run / 启动

```bash
npm run dev
```

Open / 打开 [http://localhost:3000](http://localhost:3000)

## Project Structure / 项目结构

```
src/
├── app/
│   ├── (app)/              # Protected routes / 需登录的路由
│   │   ├── rewrite/        # Rewrite page / 改写页面
│   │   ├── detect/         # AI detection / AI 检测
│   │   ├── dashboard/      # Usage stats / 使用统计
│   │   ├── profile/        # User profile / 用户资料
│   │   ├── plans/          # Plans / 套餐计划
│   │   ├── share/          # Referral / 推荐系统
│   │   └── feedback/       # Feedback / 用户反馈
│   ├── api/
│   │   ├── rewrite/        # Rewrite API / 改写接口
│   │   ├── detect/         # Detection API / 检测接口
│   │   ├── auth/           # NextAuth
│   │   └── usage/          # Usage API / 用量接口
│   └── login/              # Login / 登录
├── components/
│   ├── ui/                 # shadcn/ui
│   ├── TextEditor.tsx      # Input editor / 输入编辑器
│   ├── ResultDisplay.tsx   # Output + AI score / 结果 + 评分
│   └── AppSidebar.tsx      # Sidebar / 侧边栏
├── lib/
│   ├── prompts.ts          # Ghost 4.0/4.1 prompts / 系统指令
│   ├── ai-detector.ts      # Heuristic detection / 启发式检测
│   ├── auth.ts             # NextAuth config / 认证配置
│   ├── db.ts               # Prisma client / 数据库客户端
│   ├── openai.ts           # OpenAI client
│   └── i18n.tsx            # i18n / 国际化
└── types/
    └── next-auth.d.ts
```

## How It Works / 工作原理

1. User pastes text (10–2,000 words) / 用户粘贴文本（10–2,000 词）
2. Selects Ghost 4.0 (formal) or Ghost 4.1 (natural) / 选择改写模式
3. Backend sends text to GPT-4o-mini with mode-specific prompts / 后端发送到 GPT-4o-mini
4. AI rewrites following prompt instructions / AI 按指令改写
5. Heuristic analyzer scores AI detection likelihood / 启发式分析器评分
6. Returns rewritten text + detection breakdown / 返回改写文本 + 检测明细

## Rewrite Modes / 改写模式

### Ghost 4.0 — Formal Academic / 正式学术

- Synonym replacement / 同义词替换（simple → formal）
- Academic connectors / 学术连接词（Moreover, Furthermore...）
- Nominalization / 名词化（improve services → enhancement of service quality）
- Academic sentence templates / 学术句式模板

### Ghost 4.1 — Natural Human / 自然人类

- Syntax restructuring / 句法重排（swap clauses, passive ↔ active）
- Natural transitions / 自然转折（That said, Building on this...）
- Ground abstract concepts / 抽象词落地（risk → specific risks）
- Hedging / 限定条件（depends on, in practice...）
- Clear punctuation / 清晰标点

## Deploy / 部署

### Vercel

1. Push to GitHub / 推送到 GitHub
2. Import in [Vercel](https://vercel.com) / 在 Vercel 导入
3. Set environment variables / 设置环境变量
4. Use PostgreSQL for production / 生产环境用 PostgreSQL

## Contributing / 参与贡献

1. Fork the repo / Fork 仓库
2. Create branch / 创建分支 (`git checkout -b feature/xxx`)
3. Commit / 提交 (`git commit -m 'Add xxx'`)
4. Push / 推送 (`git push origin feature/xxx`)
5. Open Pull Request / 发起 PR

## License / 许可证

MIT
