import {Render, Template} from '../model/index.js'

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
        const data = await Template.get(e)
        return await Render('help', {
            ...data, element: 'default'
        }, {e, scale: 1.2})
    }
}
