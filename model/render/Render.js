import { Data, Plugin, Version } from '../index.js'

export default async function (path, params, cfg) {
  const { e } = cfg
  if (!e.runtime) {
    console.log('未找到e.runtime，请升级至最新版Yunzai')
  }

  path = (params.saveId || 'html') + '/' + path
  return e.runtime.render(Plugin.name, path, params, {
    retType: cfg.retMsgId ? 'msgId' : 'default',
    beforeRender ({ data }) {
      const layoutPath = `${Data._path('html')}/common/layout/`
      return {
        ...data,
        defaultLayout: layoutPath + 'default.html',
        sys: {
          copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span> & ${Plugin.name}<span class="version">${Plugin.version}</span>`
        }
      }
    }
  })
}
