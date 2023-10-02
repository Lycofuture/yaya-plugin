import { Api } from './index.js'
import fs from 'fs'
import YAML from 'yaml'
import chokidar from 'chokidar'
import path from 'path'

export default new class Data {
	// 参考yunzai配置
	constructor() {
		this.defSet = {}
		this.config = {}
		this.package = JSON.parse(fs.readFileSync('./plugins/yaya-plugin/package.json', 'utf8'))
		this.package_root = JSON.parse(fs.readFileSync('package.json', 'utf8'))
		/** 监听文件 */
		this.watcher = {
			config: {},
			defSet: {}
		}
		this.init
	}

	// 初始化
	get init() {
		this.help().then()
		if (!fs.existsSync(this._path('cfg'))) {
			this.copyFolderRecursively(this._path('def'), this._path('cfg')).then()
		}
	}

	// bot名
	get root_name() {
		if (this.package_root.name === 'yunzai') return 'Yunzai-Bot'
		else this.package_root.name
	}

	// bot版本
	get root_version() {
		return this.package_root.version
	}

	// 插件名
	get name() {
		return this.package.name
	}

	// 插件版本
	get version() {
		return this.package.version
	}

	/**
	 * redis 保存路径
	 * @param app 功能
	 * @param name 名称
	 * @returns {string}
	 */
	redis_name(app, name = null) {
		if (!name && name !== 0) name = app
		return `${this.name}:${app}:${name}`
	}

	// 初始化指令
	async command() {
		const num = await redis.get(this.redis_name('help', 'num'))
		const data = []
		for (let i = 0; i < num; i++) {
			data.push(JSON.parse(await redis.get(this.redis_name('help', i))))
		}
		return data
	}

	// 初始化菜单
	async help() {
		const data = await this.command()
		const command_list = {}
		const ber = []
		for (const i of data) {
			if ((i.dsc).match(/菜单/)) continue
			command_list.group = i.dsc
			for (const v of i.rule) {
				const comm = {}
				if (v.title) {
					comm.title = v.title
					comm.desc = v.desc
					ber.push(comm)
				}
			}
			command_list.list = ber
		}
		const list = {
			helpCfg: {
				title: '丫丫帮助',
				subTitle: await Api.hitokoto()
			},
			helpList: [command_list]
		}
		this.setYaml(this.getFilePath('help', 'defSet'), list)
	}

	// 默认配置文件
	getDefSet(name) {
		return this.getYaml(name, 'defSet')
	}

	/** 用户配置
	 * @param name 配置文件名称
	 */
	getConfig(name) {
		return {...this.getDefSet(name), ...this.getYaml(name)}
	}

	/**
	 * 获取配置yaml
	 * @param name 名称
	 * @param type 默认配置-defSet，用户配置-config
	 */
	getYaml(name, type = 'config') {
		const file = this.getFilePath(name, type)
		// 检查目录是否存在
		if (!fs.existsSync(file)) return false
		const key = `${name}`

		if (this[type][key]) return this[type][key]

		try {
			this[type][key] = YAML.parse(
				fs.readFileSync(file, 'utf8')
			)
		} catch (error) {
			logger.error(`[${name}] 格式错误 ${error}`)
			return false
		}
		
		this.watch(file, name, type)

		return this[type][key]
	}

	/**
	 * 配置文件路径
	 * @param name 名称
	 * @param type 默认配置-defSet，用户配置-config
	 * @returns {string}
	 */
	getFilePath(name, type = '') {
		if (type === 'defSet') {
			return `${this._path('def')}${name}.yaml`
		} else {
			return `${this._path('cfg')}${name}.yaml`
		}
	}

	/** 监听配置文件 */
	watch(file, name, type = 'defSet') {
		const key = `${name}`

		if (this.watcher[type][key]) return

		const watcher = chokidar.watch(file)
		watcher.on('change', filename => {
			delete this[type][key]
			logger.mark(`[修改配置文件][${type}][${name}]`)
			if (this[`change_${name}`]) {
				this[`change_${name}`]()
			}
			if (this[`${filename}_${name}`]) {
				this[`${filename}_${name}`]()
			}
		})

		this.watcher[type][key] = watcher
	}

	/**
	 * can
	 * @param {string} name 文件名
	 * @returns {string} 默认BOT目录
	 * @example
	 * yaya
	 * def
	 * cfg
	 * html
	 */
	_path(name = '') {
		const _path = process.cwd()
		switch (name) {
			case 'yaya':
				name = `${_path}/plugins/${this.name}/`
				break
			case 'def':
				name = `${this._path('yaya')}config/default_config/`
				break
			case 'cfg':
				name = `${this._path('yaya')}config/config/`
				break
			case 'html':
				name = `${this._path('yaya')}resources/`
				break
			default :
				name = `${_path}/`
				break
		}
		return name
	}

	/**
	 * 检查和创建目录
	 * @param _path 路径
	 */
	createDir(_path = '') {
		const nowPath = path.dirname(_path)
		if (!fs.existsSync(nowPath)) {
			fs.mkdirSync(nowPath, {recursive: true})
		}
		return path.basename(_path)
	}

	/**
	 * 写入YAMl
	 * @param _path 路径
	 * @param data 储存数据
	 */
	setYaml(_path = '', data) {
		const ending = this.createDir(_path)
		if (ending.match(/.yaml/)) {
			fs.writeFileSync(_path, YAML.stringify(data), 'utf-8')
		}
	}

	/**
	 * 递归复制文件夹
	 * @param src 源路径
	 * @param dest 目标路径
	 * @returns {Promise<void>}
	 */
	async copyFolderRecursively(src, dest) {
		// 判断目标文件夹是否存在，如果不存在则创建
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		// 读取源文件夹中的所有文件和文件夹
		const files = fs.readdirSync(src);
		// 遍历源文件夹中的每个文件和文件夹
		for (const file of files) {
			// 拼接源文件/文件夹的完整路径
			const srcPath = path.join(src, file);
			// 拼接目标文件/文件夹的完整路径
			const destPath = path.join(dest, file);
			// 获取源文件/文件夹的状态信息
			const stat = fs.lstatSync(srcPath);
			// 判断当前文件/文件夹是否为文件夹
			if (stat.isDirectory()) {
				// 如果是文件夹，则递归调用copyFolderRecursively函数复制文件夹
				await this.copyFolderRecursively(srcPath, destPath);
			} else {
				// 如果是文件，则直接复制文件
				fs.copyFileSync(srcPath, destPath);
			}
		}
	}
}
