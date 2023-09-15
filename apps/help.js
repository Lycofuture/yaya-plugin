import plugin from '../../../lib/plugins/plugin.js'
import Cfg from '../model/Cfg.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import Common from "../components/Common.js";

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
      const path = 'html/help/index'
     return  await Common.render(path, {
       ...config,
       // saveId: 'html',
       // tplFile: config.html,
       element: 'default'
     }, { e, scale: 1.2 })
    } catch (error) {
      logger.info(error)
    }
  }
}
