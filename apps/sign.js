import fs from 'fs'
import YAML from 'yaml'
import fetch from 'node-fetch'
import {Data, Gids, Mys_api} from '../model/index.js'

const name = '米游社'
export default class Mys_sign extends plugin {
	constructor() {
		super({
			name: '丫丫：米游社签到',
			dsc: '功能列表',
			event: 'message',
			priority: 5000,
			rule: [
				{
					reg: `^#${name}版块签到`,
					fnc: 'sign',
					desc: '米游社社区版块签到,获取经验'
				}
			]
		})
	}

	async sign(e) {
		const yamlDataUrl = `${Data._path()}plugins/xiaoyao-cvs-plugin/data/yaml`
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
		const gids = Mys_api.getmystool()
		for (const v in gids) {
			const body = JSON.stringify(gids[v])
			const headers = Mys_api.getHeaders('signIn', '', body, token)
			const url = Mys_api.getUrl('signIn', body)
			const pamt = {
				method: 'POST',
				headers,
				body: url.body
			}
			const response = await fetch(url.url, pamt)
			const json = await response.json()
			let msg = {}
			if (json) {
				if (json.message === 'OK') {
					msg = Gids.gid(v) + ':' + '签到成功！！！'
				} else if ((json.message).match(/重复|已签到/)) {
					msg = Gids.gid(v) + ':' + '旅行者，你已签到过了'
				} else if ((json.message).match(/登陆/)) {
					msg = Gids.gid(v) + ':' + json.message
				} else {
					msg = Gids.gid(v) + ':' + '米游社签到遇到验证码，请稍后再试'
				}
			} else {
				msg = '米游社接口请求失败'
			}
			await e.reply([segment.at(e.user_id), msg])
		}
	}
}
