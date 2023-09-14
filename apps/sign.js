import plugin from "../../../lib/plugins/plugin.js";
import mihoyoapi from "../model/mihoyoapi.js";
import fs from "fs";
import YAML from "yaml";
import fetch from "node-fetch";
import Cfg from "../model/Cfg.js";

export default class sign extends plugin {
    constructor() {
        super({
            name: "米游社版块签到",
            dsc: "经验签到",
            event: "message",
            priority: 5000,
            rule: [{
                reg: '^#米游社版块签到',
                fnc: 'Check'
            }]
        });
    }

    async Check(e) {
        const mysapi = new mihoyoapi()
        const yamlDataUrl = `${Cfg.package._path}/plugins/xiaoyao-cvs-plugin/data/yaml`;
        let file = `${yamlDataUrl}/${e.user_id}.yaml`
        if(!fs.existsSync(file)) return false
        let ck = fs.readFileSync(file, 'utf-8')
        ck = YAML.parse(ck)
        if (!ck) return false
        const data = []
        for (const i in ck.valueOf()) {
            data.push(ck[i])
        }
        if (!data.some(() => true)) return false
        const token = `stuid=${data[0].stuid};stoken=${data[0].stoken};mid=${data[0].mid};`
        const gids = mysapi.getmystool()
        for (const v in gids) {
            const body = JSON.stringify(gids[v])
            const headers = mysapi.getHeaders('signIn', '', body, token)
            const url = mysapi.getUrl('signIn', body)
            const pamt = {
                method: 'POST',
                headers: {...headers},
                body: url.body
            }
            const response = await fetch(url.url, pamt)
            const json = await response.json()
            let msg = {}
            if (json) {
                if (json.message === 'OK') {
                    msg = this.gid(v) + ':' + '签到成功！！！'
                } else if ((json.message).match(/重复|已签到/)) {
                    msg = this.gid(v) + ':' + '旅行者，你已签到过了'
                } else if ((json.message).match(/登陆/)) {
                    msg = this.gid(v) + ':' + json.message
                } else {
                    msg = this.gid(v) + ':' + '米游社签到遇到验证码，请稍后再试'
                }
            } else {
                msg = this.gid(v) + ':' + '米游社签到遇到验证码，请稍后再试'
            }
            await e.reply(msg)
        }
    }

    gid(num) {
        switch (num) {
            case '1':
                return '崩坏三'
            case '2':
                return '原神'
            case '3':
                return '崩坏学园2'
            case '4':
                return '未定事件簿'
            case '5':
                return '大别野'
            case '6':
                return '崩坏星穹铁道'
            case '8':
                return '绝零区'
            default:
                return '社区版块'
        }
    }

}