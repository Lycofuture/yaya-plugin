import fs from 'node:fs'
import path from 'path'

class Cfg {
  constructor () {
    /** 默认设置 */
    this.defSetPath = `./plugins/${this.setname}/defSet/`

    /** 用户设置 */
    this.configPath = `./plugins/${this.setname}/config/`
    /** 初始化 **/
    this.initconfig()
  }

  get package () {
    // if (this._path) return this._path
    this.data = JSON.parse(fs.readFileSync(`${this._path}/plugins/yaya-plugin/package.json`, 'utf8'))
    return this.data
  }

  get setname () {
    return this.package.name
  }

  get _path () {
    return process.cwd()
  }

  /**
   *
   * @param app 插件名
   * @param name 文件名
   * @returns {any|boolean}
   */
  getConfig (app, name) {
    const defaultConfig = JSON.parse(fs.readFileSync(this.defSetPath + app + `/${name}.js`, 'utf8'))
    let userConfig = {}
    try {
      userConfig = JSON.parse(fs.readFileSync(this.configPath + app + `/${name}.js`, 'utf8'))
    } catch (error) {
      logger.error(`[${app}][${name}] 格式错误 ${error}`)
      return false
    }
    return { ...defaultConfig, ...userConfig }
  }

  // 初始化配置
  initconfig () {
    fs.mkdirSync(this.configPath, { recursive: true })
    const files = fs.readdirSync(this.defSetPath)
    for (const file of files) {
      const defSetPathPath = path.join(this.defSetPath, file)
      const configPathPath = path.join(this.configPath, file)
      if (!fs.existsSync(configPathPath)) {
        fs.cpSync(defSetPathPath, configPathPath, { recursive: true })
      } else {
        const leke = fs.readdirSync(defSetPathPath)
        fs.copyFileSync(defSetPathPath + '/' + leke, configPathPath + '/' + leke)
      }
    }
  }
}

export default new Cfg()
