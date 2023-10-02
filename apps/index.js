import fs from 'fs'
import {Data} from '../model/index.js'

const cfg = new Data()
const files = fs.readdirSync(`${cfg.get_path('yaya')}apps`).filter(file => file.endsWith('.js') && file !== 'index.js')

let ret = []

files.forEach((file) => {
	ret.push(import(`./${file}`))
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
	await redis.set(cfg.redis_name('help', i), JSON.stringify(new apps[name]()))
	num++
}
await redis.set(cfg.redis_name('help', 'num'), num)

logger.info(cfg.name, '初始化完成~~~')
export {apps, ret}
