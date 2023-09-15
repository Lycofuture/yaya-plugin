import {Plugin} from "../components/index.js";
import lodash from "lodash";
import fs from "fs";
import YAML from "yaml";

export default new class Data {
    constructor() {
    }

    get cfg() {
        let cfg = {}
        try {
            if (fs.existsSync(this._path('yml') + 'cfg.json')) {
                cfg = JSON.parse(fs.readFileSync(this._path('yml') + 'cfg.json', 'utf8')) || {}
                cfg.gachas = this.getConfig('dacha', 'gacha')
            }
        } catch (e) {
            // do nth
        }
        return cfg
    }

    getConfig(app, name) {
        let defp = `${this._path('def')}${app}/${name}.yaml`
        if (!fs.existsSync(`${this._path('cfg')}${app}.${name}.yaml`)) {
            fs.copyFileSync(defp, `${this._path('cfg')}${app}.${name}.yaml`)
        }
        let conf = `${this._path('cfg')}${app}.${name}.yaml`

        try {
            return YAML.parse(fs.readFileSync(conf, 'utf8'))
        } catch (error) {
            logger.error(`[${app}][${name}] 格式错误 ${error}`)
            return false
        }
    }

    get(rote, def) {
        return lodash.get(this.cfg, rote, def)
    }

    set(rote, val) {
        lodash.set(this.cfg, rote, val)
        let gachas = this.cfg.gachas
        delete this.cfg.gachas
        fs.writeFileSync(this._path('yml') + 'cfg.json', JSON.stringify(this.cfg, null, '\t'))
        this.cfg.gachas = gachas
    }

    del(rote) {
        lodash.set(this.cfg, rote, undefined)
        fs.writeFileSync(this._path('yml') + 'cfg.json', JSON.stringify(this.cfg, null, '\t'))
    }

    scale(pct = 1) {
        let scale = this.get('sys.scale', 100)
        scale = Math.min(2, Math.max(0.5, scale / 100))
        pct = pct * scale
        return `style=transform:scale(${pct})`
    }

    isDisable(e, rote) {
        if (this.get(rote, true)) {
            return false
        }
        return !/^#?丫丫/.test(e.msg || '')
    }

    _path(name) {
        const _path = process.cwd();
        if (!name) {
            name = `${_path}/`
        } else if (name === 'name' || name === 'yunzai') {
            name = this._path()
        } else if (name === 'yaya') {
            name = `${_path}/plugins/${Plugin.name}/`
        } else if (name === 'def') {
            name = `${this._path('yaya')}defSet/`
        } else if (name === 'cfg') {
            name = `${this._path('yaya')}config/`
        } else if (name === 'yml') {
            name = `${this._path('yaya')}components/`
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
    async deploy() {
        const yaya_path = `../../../../../../plugins/${Plugin.name}/resources/`
        const data = await import(`file://${this._path('def')}help/help.js`)
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