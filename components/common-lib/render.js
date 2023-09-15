import { Version,Plugin } from '../index.js'
import Cfg from '../Cfg.js'
export default async function (path, params, cfg) {
  let { e } = cfg
  console.log(params)
  if (!e.runtime) {
    console.log('未找到e.runtime，请升级至最新版Yunzai')
  }
  return e.runtime.render(Plugin.name, path, params, {
    retType: cfg.retMsgId ? 'msgId' : 'default',
    beforeRender ({ data }) {
      let resPath = data.pluResPath
      console.log(resPath)
      // console.log(data)
      const layoutPath = `${Plugin._path}/plugins/${Plugin.name}/resources/common/layout/`
      return {
        ...data,
        defaultLayout: layoutPath + 'default.html',
        sys: {
          scale: Cfg.scale(cfg.scale || 1),
          copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span> & ${Plugin.name}<span class="version">${Plugin.version}</span>`
        }
      }
    }
  })
}