import fs from 'fs'
import _ from 'lodash'
import {Data} from '../index.js'

const data = JSON.parse(fs.readFileSync('plugins/yaya-plugin/package.json', 'utf8'))

const _logPath = `${Data._path}/plugins/${data.name}/CHANGELOG.md`

export let logs = {}
const changelogs = []
let currentVersion
let versionCount = 4

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const getLine = function (line) {
  line = line.replace(/(^\s*\*|\r)/g, '')
  line = line.replace(/\s*`([^`]+`)/g, '<span class="cmd">$1')
  line = line.replace(/`\s*/g, '</span>')
  line = line.replace(/\s*\*\*([^\\*]+\*\*)/g, '<span class="strong">$1')
  line = line.replace(/\*\*\s*/g, '</span>')
  line = line.replace(/ⁿᵉʷ/g, '<span class="new"></span>')
  return line
}

try {
  if (fs.existsSync(_logPath)) {
    logs = fs.readFileSync(_logPath, 'utf8') || ''
    logs = logs.split('\n')

    let temp = {}
    let lastLine = {}
    _.forEach(logs, (line) => {
      if (versionCount <= -1) {
        return false
      }
      const versionRet = /^#\s*([0-9a-zA-Z\\.~\s]+?)\s*$/.exec(line)
      if (versionRet && versionRet[1]) {
        const v = versionRet[1].trim()
        if (!currentVersion) {
          currentVersion = v
        } else {
          changelogs.push(temp)
          if (/0\s*$/.test(v) && versionCount > 0) {
            versionCount = 0
          } else {
            versionCount--
          }
        }

        temp = {
          version: v,
          logs: []
        }
      } else {
        if (!line.trim()) {
          return
        }
        if (/^\*/.test(line)) {
          lastLine = {
            title: getLine(line),
            logs: []
          }
          temp.logs.push(lastLine)
        } else if (/^\s{2,}\*/.test(line)) {
          lastLine.logs.push(getLine(line))
        }
      }
    })
  }
} catch (e) {
  // do nth
}

const yunzaiVersion = packageJson.version
const yunzainame = packageJson.name
const isV3 = yunzaiVersion[0] === '3'
const Version = {
  isV3,
  get version () {
    return currentVersion
  },
  get name () {
    if (yunzainame === 'yunzai') { return 'Yunzai-Bot' }
  },
  get yunzai () {
    return yunzaiVersion
  },
  get changelogs () {
    return changelogs
  }
}
const Plugin = {
  get name () {
    return data.name
  },
  get version () {
    return data.version
  }
}
const app = `${Plugin.name}:command:`
export { Version, Plugin, app }
