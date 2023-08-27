import fs from 'node:fs'
import YAML from 'yaml'

// import YAML from 'yaml'

class Cfg {
  constructor () {
    /** 默认设置 */
    this.defSetPath = `./plugins/${this.setname}/defSet/`

    /** 用户设置 */
    this.configPath = `./plugins/${this.setname}/config/`
  }

  get package () {
    if (this._package) return this._package
    this._package = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    return this._package
  }

  get setname () {
    return new Cfg().package.name
  }

  get _path () {
    return process.cwd()
  }

  getConfig (app, name) {
    const defp = `${this.defSetPath}${app}/${name}.yaml`
    if (!fs.existsSync(`${this.configPath}${app}/${name}.yaml`)) {
      fs.copyFileSync(defp, `${this.configPath}${app}/${name}.yaml`)
    }
    const conf = `${this.configPath}${app}/${name}.yaml`

    try {
      return YAML.parse(fs.readFileSync(conf, 'utf8'))
    } catch (error) {
      logger.error(`[${app}][${name}] 格式错误 ${error}`)
      return false
    }
  }
}

export default new Cfg()
