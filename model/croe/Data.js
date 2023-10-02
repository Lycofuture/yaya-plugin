import {Api} from '../index.js'
import fs from 'fs'
import YAML from 'yaml'
// import chokidar from 'chokidar'
import path from 'path'

export default class Data {
    // 参考yunzai配置
    constructor(e = {}) {
        this.defSet = {}
        this.config = {}
        this.package = JSON.parse(fs.readFileSync('./plugins/yaya-plugin/package.json', 'utf8'))
        this.package_root = JSON.parse(fs.readFileSync('package.json', 'utf8'))
        /** 监听文件 */
        // this.watcher = {
        //     config: {},
        //     defSet: {}
        // }
        this.userId = e?.user_id
    }

    // bot名
    get root_name() {
        if (this.package_root.name === 'yunzai') return 'Yunzai-Bot'
        else this.package_root.name
    }

    // bot版本
    get root_version() {
        return this.package_root.version
    }

    // 插件名
    get name() {
        return this.package.name
    }

    // 插件版本
    get version() {
        return this.package.version
    }

    /**
     * redis 保存路径
     * @param app 功能
     * @param name 名称
     * @returns {string}
     */
    redis_name(app, name = null) {
        if (!name && name !== 0) name = app
        return `${this.name}:${app}:${name}`
    }

    // 初始化指令
    async command() {
        const num = await redis.get(this.redis_name('help', 'num'))
        const data = []
        for (let i = 0; i < num; i++) {
            data.push(JSON.parse(await redis.get(this.redis_name('help', i))))
        }
        return data
    }

    // 初始化菜单
    async help() {
        const data = await this.command()
        const command_list = {}
        const ber = []
        for (const i of data) {
            if ((i.dsc).match(/菜单/)) continue
            command_list.group = i.dsc
            for (const v of i.rule) {
                const comm = {}
                if (v.title) {
                    comm.title = v.title
                    comm.desc = v.desc
                    ber.push(comm)
                }
            }
            command_list.list = ber
        }
        const list = {
            helpCfg: {
                title: '丫丫帮助',
                subTitle: await Api.hitokoto()
            },
            helpList: [command_list]
        }
        this.setYaml(this.get_FilePath('help', 'defSet'), list)
    }

    /**
     * 默认配置文件
     * @param name 配置文件名称
     */
    get_DefSet(name) {
        return this.get_Yaml(name, 'defSet')
    }

    /** 用户配置
     * @param name 配置文件名称
     */
    get_Config(name) {
        return {...this.get_DefSet(name), ...this.get_Yaml(name)}
    }

    /**
     * 获取配置yaml
     * @param name 名称
     * @param type 默认配置-defSet，用户配置-config
     */
    get_Yaml(name, type = 'config') {
        const file = this.get_FilePath(name, type)
        // 检查目录是否存在
        if (!fs.existsSync(file)) return false
        const key = `${name}`

        if (this[type][key]) return this[type][key]

        try {
            this[type][key] = YAML.parse(
                fs.readFileSync(file, 'utf8')
            )
        } catch (error) {
            logger.error(`[${name}] 格式错误 ${error}`)
            return false
        }

        // this.watch(file, name, type)

        return this[type][key]
    }

    /**
     * 配置文件路径
     * @param name 名称
     * @param type 默认配置-defSet，用户配置-config
     * @returns {string}
     */
    get_FilePath(name, type = '') {
        if (type === 'defSet') {
            return `${this.get_path('def')}${name}.yaml`
        } else {
            return `${this.get_path('cfg')}${name}.yaml`
        }
    }

    // /** 监听配置文件 */
    // watch(file, name, type = 'defSet') {
    //     const key = `${name}`
    //
    //     if (this.watcher[type][key]) return
    //
    //     const watcher = chokidar.watch(file)
    //     watcher.on('change', filename => {
    //         delete this[type][key]
    //         logger.mark(`[修改配置文件][${type}][${name}]`)
    //         if (this[`change_${name}`]) {
    //             this[`change_${name}`]()
    //         }
    //         if (this[`${filename}_${name}`]) {
    //             this[`${filename}_${name}`]()
    //         }
    //     })
    //
    //     this.watcher[type][key] = watcher
    // }

    /**
     * 路径
     * @param {string} name 路径
     * * yaya
     * * def
     * * cfg
     * * html
     * @returns {string} 默认BOT目录
     */
    get_path(name = '') {
        const _path = process.cwd()
        switch (name) {
            case 'yaya':
                name = `${_path}/plugins/${this.name}/`
                break
            case 'def':
                name = `${this.get_path('yaya')}config/default_config/`
                break
            case 'cfg':
                name = `${this.get_path('yaya')}config/config/`
                break
            case 'html':
                name = `${this.get_path('yaya')}resources/`
                break
            default :
                name = `${_path}/`
                break
        }
        return name
    }

    /**
     * 检查和创建目录
     * @param _path 路径
     */
    createDir(_path = '') {
        const nowPath = path.dirname(_path)
        if (!fs.existsSync(nowPath)) {
            fs.mkdirSync(nowPath, {recursive: true})
        }
        return path.basename(_path)
    }

    /**
     * 写入YAMl
     * @param _path 路径
     * @param data 储存数据
     */
    setYaml(_path = '', data) {
        const ending = this.createDir(_path)
        if (ending.match(/.yaml/)) {
            fs.writeFileSync(_path, YAML.stringify(data), 'utf-8')
        }
    }
}
