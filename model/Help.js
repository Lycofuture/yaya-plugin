import { Data } from "./index.js";

export default new class Help_mold {
	/**
	 * html模板配置文件
	 */
	async deploy() {
		const yaya_path = `../../../../plugins/${Data.name}/resources/`
		const data = Data.getConfig('help')
		const plugin = Data.name
		const version = Data.version
		return {
			yaya_path,
			...data,
			plugin,
			version
		}
	}
}()
