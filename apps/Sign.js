import fs from 'fs'
import YAML from 'yaml'
import fetch from 'node-fetch'
import {Gids, Mys_api} from '../model/index.js'

export default class Mys_sign extends plugin {
    constructor() {
        super({
            name: '丫丫：米游社签到',
            dsc: '功能列表',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: `^#米游社版块签到`,
                    fnc: 'sign',
                }
            ]
        })
    }

    async sign(e) {
        const key = new Gids()
        const yamlDataUrl = `${key.get_path()}plugins/xiaoyao-cvs-plugin/data/yaml`
        const file = `${yamlDataUrl}/${e.user_id}.yaml`
        if (!fs.existsSync(file)) return false
        let ck = fs.readFileSync(file, 'utf-8')
        ck = YAML.parse(ck)
        if (!ck) return false
        const data = []
        for (const i in ck.valueOf()) {
            data.push(ck[i])
        }
        if (!data.some(() => true)) return false
        const token = `stuid=${data[0].stuid};stoken=${data[0].stoken};mid=${data[0].mid};`
        const mys = await new Mys_api()
        const gids = mys.get_mys_tool()
        for (const v in gids) {
            const body = JSON.stringify(gids[v])
            const headers = mys.getHeaders('signIn', '', body, token)
            const url = mys.getUrl('signIn', body)
            const past = {
                method: 'POST',
                headers,
                body: url.body
            }
            const response = await fetch(url.url, past)
            const json = await response.json()
            let msg = {}
            if (json) {
                if (json.message === 'OK') {
                    msg = key.gids(v) + ':' + '签到成功！！！'
                } else if ((json.message).match(/重复|已签到/)) {
                    msg = key.gids(v) + ':' + '旅行者，你已签到过了'
                } else if ((json.message).match(/登陆/)) {
                    msg = key.gids(v) + ':' + json.message
                } else {
                    msg = key.gids(v) + ':' + '米游社签到遇到验证码，请稍后再试'
                }
            } else {
                msg = '米游社接口请求失败'
            }
            await e.reply([segment.at(e.user_id), msg])
        }
    }
}
