import {Plugin, Version} from '../index.js'
import {Data} from '../../model/index.js'

export default async function (path, params, cfg) {
    let {e} = cfg
    if (!e.runtime) {
        console.log('未找到e.runtime，请升级至最新版Yunzai')
    }
    path = (params.saveId || 'html') + '/' + path
    return e.runtime.render(Plugin.name, path, params, {
        retType: cfg.retMsgId ? 'msgId' : 'default',
        beforeRender({data}) {
            const layoutPath = `${Data._path()}/plugins/${Plugin.name}/resources/common/layout/`
            return {
                ...data,
                defaultLayout: layoutPath + 'default.html',
                sys: {
                    scale: Data.scale(cfg.scale || 1),
                    copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span> & ${Plugin.name}<span class="version">${Plugin.version}</span>`
                }
            }
        }
    })
}