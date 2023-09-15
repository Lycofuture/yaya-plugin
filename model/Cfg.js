import {Plugin} from "../components/index.js";

class Cfg {
  constructor () {
    this.pluginPath = `${Plugin._path}/plugins/${Plugin.name}/`
    /** 默认设置 */
    this.defSetPath = `${this.pluginPath}defSet/`

    /** 用户设置 */
    this.configPath = `${this.pluginPath}config/`
    /** 初始化 **/
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
    const yaya_path = `../../../../../../plugins/${Plugin.name}/resources/`
    const data = await import(`file://${this.defSetPath}help/help.js`)
    const colCount = Math.min(5, Math.max(3, 2))
    const plugin = Plugin.name
    const version = Plugin.version
    return {
      yaya_path,
      ...data,
      colCount,
      plugin,
      version
    }
  }
}

export default new Cfg()
