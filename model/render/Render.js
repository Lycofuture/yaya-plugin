import {Data} from '../index.js'

export default async function (path, params, cfg) {
	const {e} = cfg
	if (!e.runtime) {
		console.log('未找到e.runtime，请升级至最新版Yunzai')
	}
	return e.runtime.render(Data.name, path, params, {
		retType: cfg.retMsgId ? 'msgId' : 'default',
		beforeRender({data}) {
			const layoutPath = `${Data._path('html')}/common/layout/`
			return {
				...data,
				_plugin: Data.name,
				_htmlPath: path,
				tplFile: `./plugins/${Data.name}/resources/${path}/index.html`,
				defaultLayout: layoutPath + 'default.html',
				sys: {
					copyright: `Created By ${Data.root_name}<span class="version">${Data.root_version}</span> & ${Data.name}<span class="version">${Data.version}</span>`
				}
			}
		}
	})
}
