import { Help_mold, Render } from '../model/index.js'

export default class Help extends plugin {
	constructor() {
		super({
			name: '丫丫：菜单',
			dsc: '菜单列表',
			event: 'message',
			priority: 5000,
			rule: [{
				reg: '^#丫丫帮助$',
				fnc: 'befriend'
			}]
		})
	}
	
	async befriend(e) {
			const config = await Help_mold.deploy()
		return await Render('help', {
				...config, element: 'default'
			}, {e, scale: 1.2})
	}
	
	async help() {
		return await Help_mold.deploy()
	}
}
