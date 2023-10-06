import { Mys_api } from '../model/index.js'
import fs from "fs";
import YAML from "yaml";

export default class note extends plugin {
    constructor() {
        super({
            name: '丫丫：米游社签到',
            dsc: '功能列表',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: `^#过验证`,
                    fnc: 'note',
                }
            ]
        });

    }

    async note(e) {
        const yaml = `./data/MysCookie`
        const file = `${yaml}/${e.user_id}.yaml`
        if (!fs.existsSync(file)) return false
        let cookie = YAML.parse(fs.readFileSync(file, 'utf-8'))
        if (!cookie) return false
        let data = []
        for (const i in cookie.valueOf()) {
            data.push(cookie[i])
        }
        data = {
            cookie: data[0].ck,
        }
        const mys = new Mys_api(e, data)
        let json = await mys.getData('createVerification')
        data = {
            challenge: json.data.challenge,
            gt: json.data.gt
        }
        json = await mys.getData('validate', data)
        console.log(json)
    }
}