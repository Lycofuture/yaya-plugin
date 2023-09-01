import plugin from '../../../lib/plugins/plugin.js'
import Cfg from '../model/Cfg.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'

export default class help extends plugin {
  constructor () {
    super({
      name: '菜单',
      dsc: '功能查询',
      event: 'message',
      priority: 5000,
      rule: [{
        reg: '^#丫丫帮助$',
        fnc: 'befriend'
      }]
    })
  }

  async befriend (e) {
    try {
      const config = await Cfg.deploy()
      const data = {
        ...config,
        saveId: 'html',
        tplFile: config.html,
        path: './help.png'
      }
      const severity = await puppeteer.screenshot(Cfg.package.name, data)
      e.reply(severity)
      return true
    } catch (error) {
      logger.info(error)
      return false
    }
  }
}
