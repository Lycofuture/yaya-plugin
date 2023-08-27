import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import Cfg from '../model/Cfg.js'
import lodash from 'lodash'
import fs from 'fs'

export default class help extends plugin {
  constructor () {
    super({
      name: '菜单',
      dsc: '功能查询',
      event: 'message',
      priority: 5000,
      rule: [{
        reg: '^#丫丫帮助$',
        fnc: 'help'
      }]
    })
  }

  async help (e) {
    const helpGroup = []
    const config = await this.importCfg(help)
    lodash.forEach(config.helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return false
      }
      helpGroup.push(group)
    })
    console.log(helpGroup)
    const data = {
      helpCfg: helpGroup,
      plugin: `./plugins/${Cfg.setname}/defSet/`,
      tplFile: `./resources/${Cfg.setname}/resources/html/help/help.html`
    }
    await puppeteer.screenshot(Cfg.setname + '/help', data)
    console.log('ce-hsi')
  }

  async importCfg (key) {
    const sysCfg = await this.importModule(`defSet/help/${key}.js`)
    let diyCfg = await this.importModule(`config/help/${key}.js`)
    if (diyCfg === undefined) {
      console.error(Cfg.setname, `: config/${key}.js无效，已忽略`)
      console.error(`如需配置请复制config/${key}_default.js为config/${key}.js，请勿复制config/system下的系统文件`)
      diyCfg = {}
    }
    return config = {
      sysCfg,
      diyCfg
    }
  }

  async importModule (file) {
    if (!/\.js$/.test(file)) {
      file = file + '.js'
    }
    if (fs.existsSync(`${Cfg._path}/plugins/${Cfg.setname}/${file}`)) {
      try {
        const data = await import(`file://${Cfg._path}/plugins/${Cfg.setname}/${file}`)
        return data || {}
      } catch (e) {
        console.log(e)
      }
    }
    return {}
  }
}
