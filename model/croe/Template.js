import Data from "./Data.js";

export default class Template extends Data {
    constructor(e = {}) {
        super(e)
        this.userId = e?.user_id
    }

    /**
     * html模板配置文件
     * @returns {{pluResPath: string, saveId}}
     */
    get screenData() {
        const key = new Data()
        const path = '../../../../'
        return {
            pluResPath: `${path}plugins/${key.name}/resources/`,
            saveId: this.userId,
        }
    }

    static async get(e) {
        let html = new Template(e)
        return await html.getData()
    }

    /**
     * help模板配置文件
     * @returns {Promise<*&{saveId: string}>}
     */
    async getData() {
        await this.help()
        let helpData = this.get_DefSet('help')
        return {
            ...this.screenData,
            saveId: 'help',
            ...helpData
        }
    }
}
