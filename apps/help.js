import plugin from '../../../lib/plugins/plugin.js'
import Cfg from '../model/Cfg.js'
import fs from 'node:fs'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'

export default class help extends plugin {
  constructor (e) {
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
    this.help(e)
  }

  async help (e) {
    const dir = `./data/html/${Cfg.package.name}/help`
    const colCount = Math.min(5, Math.max(3, 2))
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const help = await Cfg.importCfg('help', 'help')
    const {
      html,
      css
    } = Cfg.htmlPath('help', 'help')
    const data = {
      ...help,
      css,
      colCount,
      saveId: 'help',
      tplFile: html,
      path: './help.png'
    }
    console.log(JSON.stringify(data, null, 2))
    const severity = await puppeteer.screenshot(Cfg.setname + '/help', data)
    console.log(severity)
  }
}
