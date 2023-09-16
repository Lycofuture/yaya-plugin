import {Common} from "../components/index.js"
import {Data} from '../model/index.js'

export default class help extends plugin {
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
        this.title = '#丫丫帮助'
    }

    async befriend(e) {
        await Data.help()
        try {
            const config = await Data.deploy()
            return await Common.render('help/index', {
                ...config,
                element: 'default'
            }, {e, scale: 1.2})
        } catch (error) {
            logger.info(error)
        }
    }
}
