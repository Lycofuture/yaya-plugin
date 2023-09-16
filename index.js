import fs from 'fs'
import { app, Plugin } from './model/index.js'
const files = fs.readdirSync(`./plugins/${Plugin.name}/apps`).filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

const apps = {}
let num = 0
for (const i in files) {
  const name = files[i].replace('.js', '')

  if (ret[i].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
  await redis.set(app + i, JSON.stringify(new apps[name]()))
  num++
}
await redis.set(`${app}num`, num)

logger.info(Plugin.name, '初始化完成~~~')
export { apps }
