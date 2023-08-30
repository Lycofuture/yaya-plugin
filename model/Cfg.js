import fs from 'node:fs'

// import lodash from 'lodash'
class Cfg {
    constructor() {
        /** 默认设置 */
        this.defSetPath = `./plugins/${this.package.name}/defSet/`

        /** 用户设置 */
        this.configPath = `./plugins/${this.package.name}/config/`
        /** 初始化 **/
        console.log(this.package)
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
    get package() {
        const _path = process.cwd()
        const data = JSON.parse(fs.readFileSync(`../package.json`, 'utf8'))
        const name = data.name
        const version = data.version
        return {_path, name, version}
    }
}

export default new Cfg()
