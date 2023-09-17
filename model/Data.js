import { Api, app, Plugin } from './index.js'
import fs from 'fs'
import YAML from 'yaml'
import chokidar from 'chokidar'
import path from 'path'

export default new class Data {
  // 参考yunzai配置
  constructor () {
    this.defSet = {}
    this.config = {}
    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }
    // this.init()
  }

  init () {
    if (!fs.existsSync(this._path('cfg'))) {
      fs.copyFileSync(this._path('def'), this._path('cfg'))
    }
  }

  // 初始化指令
  async command () {
    const num = await redis.get(app + 'num')
    const data = []
    for (let i = 0; i < num; i++) {
      data.push(JSON.parse(await redis.get(app + i)))
    }
    return data
  }

  // 初始化菜单
  async help () {
    const data = await this.command()
    const ber = []
    for (const i of data) {
      for (const v of i.rule) {
        const comm = {}
        if (v.title) {
          comm.title = v.title
          comm.desc = v.desc
          ber.push(comm)
        }
      }
    }
    const list = {
      helpCfg: {
        title: '丫丫帮助',
        subTitle: await Api.hitokoto()
      },
      helpList: [{
        group: '指令列表', list: ber
      }]
    }
    this.setYaml(this.getFilePath('html', 'help', 'config'), list)
  }

  // 默认配置文件
  getdefSet (app, name) {
    return this.getYaml(app, name, 'defSet')
  }

  /** 用户配置
   * @param app  功能
   * @param name 配置文件名称
   */
  getConfig (app, name) {
    return { ...this.getdefSet(app, name), ...this.getYaml(app, name) }
  }

  /**
   * 获取配置yaml
   * @param app 功能
   * @param name 名称
   * @param type 默认配置-defSet，用户配置-config
   */
  getYaml (app, name, type = 'config') {
    const file = this.getFilePath(app, name, type)
    // 检查目录是否存在
    if (!fs.existsSync(file)) return false
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
  getFilePath (app, name, type = '') {
    if (type === 'defSet') return `${this._path('def')}${app}/${name}.yaml`
    else return `${this._path('cfg')}${app}/${name}.yaml`
  }

  /** 监听配置文件 */
  watch (file, app, name, type = 'defSet') {
    const key = `${app}.${name}`

    if (this.watcher[type][key]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', filename => {
      delete this[type][key]
      logger.mark(`[修改配置文件][${type}][${app}][${name}]`)
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]()
      }
      if (this[`${filename}_${app}${name}`]) {
        this[`${filename}_${app}${name}`]()
      }
    })

    this.watcher[type][key] = watcher
  }

  /**
   * can
   * @param name 文件名
   * @returns {string} 默认BOT目录
   * @example
   * yaya
   * def
   * cfg
   * html
   */
  _path (name = null) {
    const _path = process.cwd()
    switch (name) {
      case 'yaya':
        name = `${_path}/plugins/${Plugin.name}/`
        break
      case 'def':
        name = `${this._path('yaya')}config/default_config/`
        break
      case 'cfg':
        name = `${this._path('yaya')}config/config/`
        break
      case 'html':
        name = `${this._path('yaya')}resources/`
        break
      default :
        name = `${_path}/`
        break
    }
    return name
  }

  /**
   * html模板配置文件
   */
  async deploy () {
    const yaya_path = `../../../../../../plugins/${Plugin.name}/resources/`
    const data = this.getConfig('html', 'help')
    const colCount = Math.min(5, Math.max(3, 2))
    const plugin = Plugin.name
    const version = Plugin.version
    return {
      yaya_path, ...data, colCount, plugin, version
    }
  }

  /**
   * 检查和创建目录
   * @param _path 路径
   */
  createDir (_path = '') {
    const nowPath = path.dirname(_path)
    if (!fs.existsSync(nowPath)) {
      fs.mkdirSync(nowPath, { recursive: true })
    }
    return path.basename(_path)
  }

  /**
   * 写入YAMl
   * @param _path 路径
   * @param data 储存数据
   */
  setYaml (_path = '', data) {
    const ending = this.createDir(_path)
    if (ending.match(/.yaml/)) {
      fs.writeFileSync(_path, YAML.stringify(data), 'utf-8')
    }
  }
}()
