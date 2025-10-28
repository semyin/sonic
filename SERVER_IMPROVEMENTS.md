# 后端优化记录

## 高优先级
- 在进入服务层前使用 `@hono/validator` + `drizzle-zod` 做请求体验证，避免将未经校验的 `req.json()` 直接传递下游（server/api/article.ts）。
- 将文章与标签的写入操作放入同一 drizzle 事务，防止标签插入失败时留下脏数据（database/services/article.ts）。
- 调整 `getDb()` 在 Cloudflare Worker 中的连接策略：Node 环境复用客户端，边缘环境改用 bindings/HTTP driver，避免连接泄露（database/client.ts）。
- 引入鉴权与角色控制，将创建/更新/删除路由置于受保护分组，区分管理与公开接口（server/api/index.ts）。
- 精简详细日志中间件，并通过环境开关控制请求/响应体的克隆与输出，削减边缘运行时开销（server/middleware/logger-detailed.ts）。
- 统一错误响应格式，返回领域错误码与 requestId，勿直接透出异常信息（server/utils/response.ts）。

## 中期优化
- 利用 drizzle relations 或 `db.query` 辅助函数，减少手写 select 字段，降低 schema 变更的维护成本（database/services/article.ts）。
- 为热门列表接口增加缓存层（KV/Redis/etag），降低数据库读取压力。
- 对点赞/浏览计数操作设计幂等或批量刷新策略，避免高并发下的锁竞争。
- 列表响应统一携带分页元信息（total/pageSize 等），便于前端准确分页。
- 将日志文本统一为英文 ASCII，规避多环境终端的编码问题（server/middleware/logger-detailed.ts）。

## 工程与开发体验
- 引入 Vitest + MSW 为服务层与路由流程编写自动化测试，恢复基础保障。
- 加强环境变量校验，并在维护脚本中提供兼容 Worker 的数据库驱动（scripts/check-db-stats.ts）。
- 集成 eslint + prettier（或 biome）并结合 husky/lint-staged 统一代码风格。
- 发布 OpenAPI 或类型安全的客户端包，为后续前端复用接口定义做准备。
