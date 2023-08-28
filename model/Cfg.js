import fs from 'node:fs'
import path from 'path'
import lodash from 'lodash'

class Cfg {
  constructor () {
    /** 默认设置 */
    this.defSetPath = `./plugins/${this.setname}/defSet/`

    /** 用户设置 */
    this.configPath = `./plugins/${this.setname}/config/`
    /** 初始化 **/
    this.initconfig()
    this.htmlPath('help', 'help')
  }

  /**
   * 读取package
   * @returns {any}
   */
  get package () {
    this.data = JSON.parse(fs.readFileSync(`${this._path}/plugins/yaya-plugin/package.json`, 'utf8'))
    return this.data
  }

  /**
   * 插件名
   * @returns {*}
   */
  get setname () {
    return this.package.name
  }

  /**
   * 获取BOT目录
   * @returns {string}
   * @private
   */
  get _path () {
    return process.cwd()
  }

  /**
   * 返回模板路径
   * @param app 功能
   * @param name 文件名
   * @returns {{css: string, html: string}}
   */
  htmlPath (app, name) {
    const html = path.join(this.getRoot('yaya'), `resources/html/${app}/${name}.html`)
    const css = path.join(this.getRoot('yaya'), `resources/html/${app}/${name}.css`)
    return {
      html,
      css
    }
  }

  /**
   *
   * @param root 目录
   * @returns {`${string}/`}
   */
  getRoot (root = '') {
    if (!root) {
      root = `${this._path}/`
    } else if (root === 'root' || root === 'yunzai') {
      root = `${this._path}/`
    } else if (root === 'yaya') {
      root = `${this._path}/plugins/yaya-plugin/`
    } else {
      root = `${this._path}/plugins/${root}/`
    }
    return root
  }

  /**
   * 根据指定的path依次检查与创建目录
   * @param path 路径
   * @param root 跟目录
   * @param includeFile
   */
  createDir (path = '', root = '', includeFile = false) {
    root = this.getRoot(root)
    const pathList = path.split('/')
    let nowPath = root
    pathList.forEach((name, idx) => {
      name = name.trim()
      if (!includeFile && idx <= pathList.length - 1) {
        nowPath += name + '/'
        if (name) {
          if (!fs.existsSync(nowPath)) {
            fs.mkdirSync(nowPath)
          }
        }
      }
    })
  }

  /**
   * 读取json
   * @param file
   * @param root
   * @returns {{}|any}
   */
  readJSON (file = '', root = '') {
    root = this.getRoot(root)
    if (fs.existsSync(`${root}/${file}`)) {
      try {
        return JSON.parse(fs.readFileSync(`${root}/${file}`, 'utf8'))
      } catch (e) {
        console.log(e)
      }
    }
    return {}
  }

  /**
   * 写入json
   * @param cfg
   * @param data
   * @param root
   * @param space
   * @returns {*|void}
   */
  writeJSON (cfg, data, root = '', space = 2) {
    if (arguments.length > 1) {
      return this.writeJSON({
        name: cfg,
        data,
        space,
        root
      })
    }
    // 检查并创建目录
    const name = cfg.path ? (cfg.path + '/' + cfg.name) : cfg.name
    this.createDir(name, cfg.root, true)
    root = this.getRoot(cfg.root)
    data = cfg.data
    delete data._res
    data = JSON.stringify(data, null, cfg.space || 2)
    if (cfg.rn) {
      data = data.replaceAll('\n', '\r\n')
    }
    return fs.writeFileSync(`${root}/${name}`, data)
  }

  /**
   * 删除文件
   * @param file 文件路径
   * @param root 根目录
   * @returns {boolean}
   */
  delFile (file, root = '') {
    root = this.getRoot(root)
    try {
      if (fs.existsSync(`${root}/${file}`)) {
        fs.unlinkSync(`${root}/${file}`)
      }
      return true
    } catch (error) {
      logger.error(`文件删除失败：${error}`)
    }
    return false
  }

  /**
   * 读取配置
   * @param app
   * @param key
   * @returns {Promise<{diyCfg: (*|{}), sysCfg: (*|{})}>}
   */
  async importCfg (app, key) {
    const sysCfg = await this.importModule(`defSet/${app}/${key}.js`)
    let diyCfg = await this.importModule(`config/${app}/${key}.js`)
    if (diyCfg === undefined) {
      console.error(this.setname, `: config/${app}/${key}.js无效，已忽略`)
      console.error(`如需配置请复制defSet/${app}/${key}.js为config/${app}/${key}.js`)
      diyCfg = {}
    }
    return lodash.extend({}, sysCfg, diyCfg)
  }

  /**
   * 返回配置
   * @param file
   * @returns {Promise<*|{}|{}>}
   */
  async importModule (file) {
    if (!/\.js$/.test(file)) {
      file = file + '.js'
    }
    if (fs.existsSync(`${this._path}/plugins/${this.setname}/${file}`)) {
      try {
        const data = await import(`file://${this._path}/plugins/${this.setname}/${file}`)
        return data || {}
      } catch (e) {
        console.log(e)
      }
    }
    return {}
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
