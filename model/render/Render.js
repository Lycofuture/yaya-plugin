import {Data} from '../index.js'

export default async function (path, params, cfg) {
    const {e} = cfg
    if (!e.runtime) {
        logger.warn('未找到e.runtime，请升级至最新版Yunzai')
    }
    const key = new Data()
    return e.runtime.render(key.name, path, params, {
        beforeRender({data}) {
            const layoutPath = `${key.get_path('res')}/common/layout/`
            return {
                ...data,
                cssPath: `../../../../plugins/${key.name}/resources/handlebars/${path}/${path}.css`,
                tplFile: `./plugins/${key.name}/resources/handlebars/${path}/${path}.hbs`,
                defaultLayout: layoutPath + 'default.hbs',
                sys: {
                    copyright: `Created By ${key.root_name}<span class="version">${key.root_version}</span> & ${key.name}<span class="version">${key.version}</span>`
                }
            }
        }
    })
}
