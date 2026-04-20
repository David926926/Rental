# DormEx

一个面向学生租房和转租场景的 Next.js MVP。

## 已实现内容

- 首页、找房列表、房源详情
- 登录演示账号
- 发布房源 / 转租信息
- 收藏、联系、举报
- 管理员审核后台
- Prisma + Supabase PostgreSQL
- 数据库 seed 初始化脚本

## 本地运行

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

`.env` 中需要配置：

```env
DATABASE_URL="your-supabase-postgres-url"
ADMIN_EMAIL_WHITELIST="xz4052@nyu.edu"
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="listing-images"
```

图片上传前你还需要在 Supabase 里：

1. 创建一个 Storage bucket，名称默认用 `listing-images`
2. 将这个 bucket 设为 public
3. 在 `.env` 中填好 `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`SUPABASE_STORAGE_BUCKET`

默认访问：

- `/` 首页
- `/listings` 找房列表
- `/publish` 发布页
- `/profile` 个人中心
- `/admin/listings` 管理后台

## 默认测试账号

- `alice@nyu.edu`
- `bob@ucla.edu`
- `xz4052@nyu.edu`

默认密码：

- `David2004`

说明：

- 普通用户可直接用邮箱密码登录
- 管理员账号除了数据库角色是 `ADMIN`，邮箱还必须在 `ADMIN_EMAIL_WHITELIST` 中才能访问后台

## 后续建议

- 接入 NextAuth 或短信/邮箱验证码登录
- 接入对象存储图片上传
- 增加消息系统和学校管理后台
