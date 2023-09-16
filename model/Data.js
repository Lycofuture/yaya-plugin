import { app, Plugin } from './index.js'
import fs from 'fs'
import YAML from 'yaml'
import chokidar from 'chokidar'

export default new class Data {
  constructor () {
    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }
  }

  // 初始化指令
  async command () {
    const num = await redis.get(app + 'num')
    const data = []
    for (let i = 0; i < num; i++) {
      data.push(await redis.get(app + i))
    }
    return data
  }

  // 初始化菜单
  async help () {
    const data = await this.command()
    const ber = []
    for (const i of data) {
      const comm = {}
      const list = JSON.parse(i)
      if (list.title.match(/帮助/)) continue
      comm.title = list.title
      comm.desc = list.dsc
      ber.push(comm)
    }
    const list = {
      helpCfg: {
        title: '丫丫帮助',
        subTitle: '当你准备做一件事时，请坚定地开始，不要把时间浪费在犹豫上'
      },
      helpList: [{
        group: '指令列表', list: ber
      }]
    }
    fs.writeFileSync(this._path('cfg') + 'help.yaml', YAML.stringify(list))
  }

  /**
   * 默认配置文件
   * @param app  功能
   * @param name 配置文件名称
   */
  getdefSet (app, name) {
    return this.getYaml(app, name, 'defSet')
  }

  /** 用户配置
   * @param app  功能
   * @param name 配置文件名称
   */
  getConfig (app, name) {
    return { ...this.getdefSet(app, name), ...this.getYaml(app, name, 'config') }
  }

  /**
   * 获取配置yaml
   * @param app 功能
   * @param name 名称
   * @param type 默认跑配置-defSet，用户配置-config
   */
  getYaml (app, name, type) {
    const file = this.getFilePath(app, name, type)
    console.log(file)
    const key = `${app}.${name}`

    if (this[type][key]) return this[type][key]

    try {
      this[type][key] = YAML.parse(
        fs.readFileSync(file, 'utf8')
      )
    } catch (error) {
      logger.error(`[${app}][${name}] 格式错误 ${error}`)
      return false
    }

    this.watch(file, app, name, type)

    return this[type][key]
  }

  /**
   * 配置文件路径
   * @param app 功能
   * @param name 名称
   * @param type 默认配置-defSet，用户配置-config
   * @returns {string}
   */
  getFilePath (app, name, type) {
    if (type === 'defSet') return `${this._path('def')}${app}/${name}.yaml`
    else return `${this._path('cfg')}${app}/${name}.yaml`
  }

  /** 监听配置文件 */
  watch (file, app, name, type = 'defSet') {
    const key = `${app}.${name}`

    if (this.watcher[type][key]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', path => {
      delete this[type][key]
      logger.mark(`[修改配置文件][${type}][${app}][${name}]`)
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]()
      }
    })

    this.watcher[type][key] = watcher
  }

  /**
   * 配置文件
   * @param name 文件名
   * @returns {string}
   */
  cfg (name) {
    return this._path('cfg') + name + '.yaml'
  }

  /**
   * 文件路径
   * @param name 文件名
   * @returns {string}
   */
  _path (name = null) {
    const _path = process.cwd()
    if (!name || name === 'name' || name === 'yunzai') {
      name = `${_path}/`
    } else if (name === 'yaya') {
      name = `${_path}/plugins/${Plugin.name}/`
    } else if (name === 'def') {
      name = `${this._path('yaya')}config/default_config/`
    } else if (name === 'cfg') {
      name = `${this._path('yaya')}config/config/`
    } else if (name === 'html') {
      name = `${this._path('yaya')}resources/`
    } else {
      name = `${_path}/plugins/${name}/`
    }
    return name
  }

  /**
   * 模板配置文件
   */
  async deploy () {
    const yaya_path = `../../../../../../plugins/${Plugin.name}/resources/`
    const data = YAML.parse(fs.readFileSync(this._path('cfg') + 'help.yaml', 'utf-8'))
    const colCount = Math.min(5, Math.max(3, 2))
    const plugin = Plugin.name
    const version = Plugin.version
    return {
      yaya_path, ...data, colCount, plugin, version
    }
  }
}()
