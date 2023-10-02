import Data from "./Data.js";

export default class Common extends Data {
    /**
     * 等待时间
     * @param ms
     * @returns {Promise<unknown>}
     */
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

