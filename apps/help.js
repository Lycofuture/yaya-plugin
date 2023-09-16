import { Data, Render } from '../model/index.js'

export default class help extends plugin {
  constructor () {
    super({
      name: '菜单',
      dsc: '功能查询',
      event: 'message',
      priority: 5000,
      rule: [{
        reg: '^#丫丫帮助$', fnc: 'befriend'
      }]
    })
    this.title = '#丫丫帮助'
  }

  async init () {
    await Data.help()
  }

  async befriend (e) {
    if (!Data.cfg('help')) {
      await this.init()
    }
    // await Data.getdefSet('app', 'name')
    console.log(await Data.getdefSet('app', 'name'))
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
