import plugin from '../../../lib/plugins/plugin.js'
import Cfg from '../model/Cfg.js'
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
     return  await Common.render('html/help/index', {
       ...config,
       element: 'default'
     }, { e, scale: 1.2 })
    } catch (error) {
      logger.info(error)
    }
  }
}
