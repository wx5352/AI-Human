# HumanizeAI: Research Prototype for LLM Text Trace Adversarial Analysis
An open-source research prototype for studying adversarial behaviors against LLM text detection algorithms. This project explores the technical loopholes of mainstream AI content detectors, analyzes how linguistic rewriting distorts AI-generated text features, and provides experimental support for building robust AI traceability and content governance mechanisms.

本开源原型用于研究大模型文本检测算法的对抗行为，探究主流AI内容识别工具存在的技术缺陷，分析语言改写对AI生成文本特征的扰动逻辑，为构建可靠的AI内容溯源、合规治理体系提供实验依据。


## Features / 功能特性

- **Two linguistic perturbation modes for adversarial testing
  - **Formal academic style perturbation** — Simulate formal academic text feature distortion
  - **Daily natural style perturbation** — Simulate casual humanized text feature distortion
- **Built-in heuristic LLM trace analyzer** -  Quantify text features identified by mainstream AI detectors
- **Google OAuth / Google 登录** — One-click sign in / 一键登录
- **i18n / 双语** — English & Chinese / 中英文界面
- **Dark Mode / 深色模式** — Full theme support / 完整主题支持

## Pages & Functions / 页面与功能

### Rewrite / 改写 (`/rewrite`)

Core feature: paste text, select Ghost 4.0 or 4.1, get rewritten result with AI detection score.

核心功能：粘贴文本，选择模型，获取改写结果和 AI 检测评分。

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


<!-- screenshot -->

### Profile / 个人资料 (`/profile`)

User profile and account info.

用户资料和账户信息。
<img width="2890" height="1294" alt="image" src="https://github.com/user-attachments/assets/bc79dac3-4cce-4227-9a5c-a1ebdae5d797" />


<!-- screenshot -->

### Feedback / 反馈 (`/feedback`)

Submit feedback to the team.

向团队提交反馈。
<img width="2876" height="1266" alt="image" src="https://github.com/user-attachments/assets/4e7007f5-1b50-4fdf-abed-d0e04540c9e1" />


<!-- screenshot -->

### Cooperation / 合作 (`/cooperation`)

Business partnership contact.

商务合作联系。
<img width="2884" height="1248" alt="image" src="https://github.com/user-attachments/assets/a8374723-8502-4934-8fc7-9a73663ff7d2" />


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

This prototype serves as an experimental platform to analyze the vulnerability of existing LLM text detection systems:
Input text materials (10–2,000 words, including AI-generated and human-written samples)
Select linguistic perturbation strategy to adjust sentence structure, word choice and discourse logic
Invoke LLM to generate perturbed text with controlled rewriting prompts
Heuristic analyzer extracts text statistical features and outputs trace risk score
Output comparison data of original text vs perturbed text for security research
Research purpose: Expose the weak robustness of current AI trace detection tools, and provide data support for designing anti-adversarial detection solutions in financial and academic compliance scenarios.

## Rewrite Modes / 改写模式

### Ghost 4.0 — Formal Academic Perturbation

1. Formal vocabulary substitution to alter statistical word distribution
2. Academic logical conjunctions restructuring
3. Nominalization transformation to change sentence syntactic features
4. Standard academic discourse template adjustment

### Ghost 4.1 — Natural Humanized Perturbation

1. Active/passive sentence switching and clause reordering
2. Colloquial logical transition injection
3. Abstract concept concretization to eliminate rigid AI writing patterns
4. Flexible punctuation adjustment to break machine text features

## Research Background
With the wide application of LLM, hidden text traces embedded in AI-generated content bring severe risks to compliance audit, academic integrity and financial document traceability. Existing AI text detectors lack stable resistance against linguistic adversarial rewriting.

This self-developed open-source prototype implements controllable text perturbation experiments. Combined with my years of engineering experience in financial risk control systems, this project helps me summarize the failure modes of mainstream trace detection algorithms, laying the foundation for my follow-up research on robust AI content governance in regulated financial scenarios.

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
