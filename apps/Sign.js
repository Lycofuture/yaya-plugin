import fs from 'fs'
import YAML from 'yaml'
import { Mys_api } from '../model/index.js'

export default class Mys_sign extends plugin {
    constructor() {
        super({
            name: '丫丫：米游社签到',
            dsc: '功能列表',
            event: 'message',
            priority: 1,
            rule: [
                {
                    reg: `^#米游社版块签到`,
                    fnc: 'sign',
                }
            ]
        })
    }

    async sign(e) {
        const yamlDataUrl = `./plugins/xiaoyao-cvs-plugin/data/yaml`
        const file = `${yamlDataUrl}/${e.user_id}.yaml`
        if (!fs.existsSync(file)) return false
        let ck = YAML.parse(fs.readFileSync(file, 'utf-8'))
        if (!ck) return false
        let data = []
        for (const i in ck.valueOf()) {
            data.push(ck[i])
        }
        if (!data.some(() => true)) return false
        const token = `stuid=${data[0].stuid};stoken=${data[0].stoken};mid=${data[0].mid};`
        data = {
            cookie: token,
            uid: data[0].uid
        }
        const mys = new Mys_api(e, data)

        for (const v in mys.get_mys_tool()) {
            let msg
            let json = await mys.getData('signIn', data = {num: v})
            if (json) {
                if (json.message === 'OK') {
                    msg = mys.gids(v) + ':' + '签到成功！！！'
                } else if ((json.message).match(/重复|已签到/)) {
                    msg = mys.gids(v) + ':' + '旅行者，你已签到过了'
                } else if ((json.message).match(/登陆/)) {
                    msg = mys.gids(v) + ':' + json.message
                } else {
                    msg = mys.gids(v) + ':' + '米游社签到遇到验证码，请稍后再试'
                }
            } else {
                msg = json.error
            }
            await e.reply([segment.at(e.user_id), msg])
        }
    }
}
