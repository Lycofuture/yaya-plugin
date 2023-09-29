import {Help_mold, Render} from '../model/index.js'

export default class Help extends plugin {
	constructor() {
		super({
			name: '菜单',
			dsc: '功能查询',
			event: 'message',
			priority: 5000,
			rule: [{
				reg: '^#丫丫帮助$',
				fnc: 'befriend'
			}]
		})
	}

	async befriend(e) {
		try {
			const config = await Help_mold.deploy()
			return await Render('html/help', {
				...config, element: 'default'
			}, {e, scale: 1.2})
		} catch (error) {
			logger.info(error)
		}
	}
}
