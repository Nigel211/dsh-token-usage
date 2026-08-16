# dsh-token-usage

DeepSeek Harness (DSH) 的 **Token 用量与费用统计插件**:零第三方依赖,数据全部派生自 DSH 持久化会话日志,重启自动回填、不丢历史。

- **用量统计**:输入/ 输出 / 缓存命中 tokens,按模型、按会话、按时间范围(今天 / 近7天 / 近14天 / 近30天)聚合。
- **费用估算**:内置 DeepSeek 官方人民币价目表(元/百万 tokens),按生效日期分段计价 —— 8-17 前旧价、8-17 起峰谷价(北京时间 9:00–12:00、14:00–18:00 高峰,谷段半价);价目表可增删改并持久化,未知模型手动加价后立即出费用。
- **账户余额**:按已配置的模型路由自动枚举(DeepSeek 官方 / pi-ai 等),模板化查询 DeepSeek、OpenRouter、SiliconFlow、New-API 等平台的余额,keep-last-good 缓存与瞬时/确定性错误分类;DeepSeek 官方行带「充值」按钮,一键跳转开放平台充值页。
- **图表**:使用趋势(单图四曲线 + 双轴费用)、当月日历活跃热力图、模型占比环图(悬停联动)。
- **界面**:设置 →「Token 用量」现代简洁仪表盘 + 输入框下方常驻读数(本会话 tokens / 费用、今日费用)。

## 界面速览

仪表盘自上而下:

| 区块 | 说明 |
| --- | --- |
| 费用 Hero + 指标卡 | 范围内费用估算、调用次数、tokens、输入未命中/输出/缓存命中/推理 |
| 账户余额 | 每路由一张卡片,余额/赠送/充值/已用,手动刷新;DeepSeek 官方带充值按钮 |
| 使用趋势 | 今天(按小时)/ 近7天 / 近14天 / 近30天;输入(总)/输出/缓存命中/费用 四条曲线,图例可切换显隐,悬停看明细 |
| 活跃热力图 | 当月日历网格(周一~周日),蓝色深浅 = 当日 tokens,今天描边、未来虚线淡化,悬停看用量 |
| 模型占比 | 环形图按 tokens 汇总各模型占比,悬停分段/图例联动高亮,中心显示总 tokens 或所选模型占比 |
| 按模型 / 按会话 / 最近调用 | 三张明细表 |
| 价目表 | 内置官方分段价 + 自定义条目增删改、费用显示币种与汇率配置 |
| 导出 | 最近 5000 条用量记录 JSON |

## 安装

> ⚠️ **不要使用裸包名安装**:npm registry 上已存在另一个同名包(他人发布),`dsh plugin --profile web add dsh-token-usage` 会从 npm 拉取错误的包。本插件仅发布在 GitHub,请使用下面的 GitHub 源或 tarball 方式。

### 方式一:命令行(推荐)

从 GitHub 安装(pnpm 的 `github:` 依赖语法):

```bash
dsh plugin --profile web add github:Nigel211/dsh-token-usage
```

(指定版本:`github:Nigel211/dsh-token-usage#v0.1.13`)

或本地 tarball:`dsh plugin --profile web add ./dsh-token-usage-0.1.13.tgz`

装完**重启 dsh web 服务**后生效。

### 方式二:手动注册(本地包)

1. 在 `$DSH_HOME/profiles/web/package.json` 的 `dependencies` 中添加指向本目录的 link 依赖:

   ```json
   "dependencies": {
     "dsh-token-usage": "link:<本目录绝对路径>"
   }
   ```

2. 确认 `dsh.profile.bundles` 列表包含 `dsh-token-usage`(安装器会自动 reconcile;也可手动加入,与 `@deepseek-ai/dsh-base` 等同层)。

3. 重启 dsh web 服务,打开 **设置 → Token 用量**。

> 说明:bundle 挂载完全由 `dsh.profile.bundles` 声明驱动,无需在 `cordis.patch.yml` 手动 insert(重复注册会导致重复挂载)。

## 前置条件

- DSH(`dsh web`),模型路由与 API Key 与对话使用同一份凭证,无需额外配置。
- 余额查询需要:curl(Windows 10+ 自带;或 powershell 备用)与网络可达对应平台接口。

## API

Host 半通过 `webServer` 提供同源路由(浏览器端 fetch 调用,无需鉴权头):

| 路由 | 说明 |
| --- | --- |
| `GET /api/token-stats/summary?rangeDays=N` | 范围内汇总(1/7/14/30/0=全部) |
| `GET /api/token-stats/trends?days=D` | 趋势:`today`(按小时)/ 7 / 14 / 30 / 31 天 |
| `GET /api/token-stats/session?sessionId=` | 单会话统计 |
| `GET /api/token-stats/export` | 最近 5000 条记录 JSON |
| `GET /api/token-stats/pricing` | 价目表与显示配置 |
| `POST /api/token-stats/pricing` | 增/删/改/重置价目条目或显示配置 |
| `GET /api/token-stats/balance?force=1` | 各路由余额 |

## 数据与隐私

- 用量数据派生自 DSH 会话日志(`assistant/message.usage`),插件不做独立落盘;价目表与显示配置写入工作区根目录的 `.dsh-token-stats-pricing.json`。
- 余额查询仅在打开设置页时进行(60s 缓存),API Key 通过 DSH 凭证服务解析,只传给对应的平台接口,绝不写入日志。

## 已知限制

- 历史回填只认 `assistant/message` 中携带 `usage` 的调用;未上报 usage 的调用不计入。
- 更早的价格调整(8-17 之前的历史调价)未分段,统一按 8-17 前旧价估算。

## 开发

- `lib/index.js` — Host 半(标准 cordis 插件,`webServer` 路由)。
- `lib/client.js` — 浏览器半(`window.__ModuleLoader__` bundle,`exports.apply` 注册 `settings.section` 与 `conversation.composer.dock` 两个增量槽位;图表全部手写 SVG)。
- 修改后刷新页面即可生效(client bundle 随页面加载);host 半改动需重启 DSH。

## License

MIT
