import { Data, Render } from '../model/index.js'
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
        fnc: 'befriend'
      }]
    })
  }

  async befriend (e) {
    if (!fs.existsSync(Data.getFilePath('html', 'help'))) {
      await Data.help()
    }
    try {
      const config = await Data.deploy()
      return await Render('help/index', {
        ...config, element: 'default'
      }, { e, scale: 1.2 })
    } catch (error) {
      logger.info(error)
    }
  }
}
