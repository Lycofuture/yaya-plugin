import fs from 'node:fs'

class Cfg {
  constructor () {
    this.pluginPath = `${this.package._path}/plugins/${this.package.name}/`
    /** 默认设置 */
    this.defSetPath = `${this.pluginPath}defSet/`

    /** 用户设置 */
    this.configPath = `${this.pluginPath}config/`
    /** 初始化 **/
  }

  /**
     * 获取包信息
     * @property {string} _path - BOT根目录
     * @property {string} name - 插件名字
     * @property {string} version - 插件版本
     * @returns {{
     * _path: string,
     * name: string,
     * version: string
     * }}
     */
  get package () {
    const _path = process.cwd()
    const data = JSON.parse(fs.readFileSync('plugins/yaya-plugin/package.json', 'utf8'))
    const name = data.name
    const version = data.version
    return {
      _path,
      name,
      version
    }
  }

  /**
     * 模板配置文件
     * @property {string} _path - 资源
     * @property {string} helpCfg - 标题
     * @property {string} helpList - 指令列表
     * @property {string} css - css
     * @property {string} html 模板路径
     */
  async deploy () {
    const yaya_path = `plugins/${this.package.name}/resources/`
    const defaultLayout = `${yaya_path}common/layout/default.html`
    const html = `${yaya_path}html/help/help.html`
    const data = await import(`file://${this.defSetPath}help/help.js`)
    const css = `${yaya_path}html/help/help.css`
    const colCount = Math.min(5, Math.max(3, 2))
    const plugin = this.package.name
    const version = this.package.version
    return {
      defaultLayout,
      yaya_path,
      css,
      ...data,
      colCount,
      html,
      plugin,
      version
    }
  }
}

export default new Cfg()
