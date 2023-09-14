import fs from 'fs'
import {segment} from 'icqq'
import Cfg from "./model/Cfg.js";

global.segment = segment
const files = fs.readdirSync(`./plugins/${Cfg.package.name}/apps`).filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

const apps = {}
for (const i in files) {
    const name = files[i].replace('.js', '')

    if (ret[i].status !== 'fulfilled') {
        logger.error(`载入插件错误：${logger.red(name)}`)
        logger.error(ret[i].reason)
        continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
logger.info(Cfg.package.name, '初始化完成~~~')
export {apps}
