import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import Cfg from '../model/Cfg.js'
import _ from 'lodash'
import { Data } from '../../StarRail-plugin/components/index.js'
import lodash from 'lodash'

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
    const helpGroup = []
    const {
      diyCfg,
      sysCfg
    } = await Cfg.importCfg('help')
    const helpConfig = lodash.defaults(diyCfg || {}, sysCfg)
    const helpList = diyCfg || sysCfg
    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, (help) => {
        const icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          const x = (icon - 1) % 10
          const y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })
    const data = {
      helpCfg: helpConfig,
      helpGroup,
      plugin: `./plugins/${Cfg.setname}/defSet/`,
      tplFile: `${Cfg.getRoot('yaya')}/resources/html/help/help.html`
    }
    const severity = await puppeteer.screenshot(Cfg.setname + '/help', data)
    console.log(severity)
  }
}
