import _ from 'lodash'
import md5 from 'md5'
import Data from "./Data.js";

export default class Mys_api extends Data {
    /**
     *
     * @param type 版块
     * @param query 请求值
     * @param body 默认为空
     * @param ck cookie值
     */
    getHeaders(type = 'sign', query = '', body, ck) {
        let headers
        switch (type) {
            case 'signIn':
                headers = {
                    'x-rpc-app_version': '2.58.2',
                    'x-rpc-client_type': '2',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; M2012K11AC Build/TQ3A.230705.001.B4; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 miHoYoBBS/2.58.2',
                    'x-rpc-device_id': '425ddf3c-02c8-38e4-8886-37451c8d8852',
                    Referer: 'https://webstatic.mihoyo.com',
                    'X-Requested-With': 'com.mihoyo.hyperion',
                    'x-rpc-platform': 'android',
                    'x-rpc-device_model': 'Mi 10',
                    'x-rpc-device_name': 'Xiaomi M2012K11AC',
                    'x-rpc-channel': 'miyousheluodi',
                    'x-rpc-sys_version': '6.0.1',
                    DS: this.bbsDs(query, body),
                    Cookie: ck
                }
                break
            default:
                headers = {}
                break
        }
        return headers
    }

    /**
     *
     * @param type 版块
     * @param body 请求信息
     * @property urlMap 返回url和请求信息
     */
    getUrl(type, body) {
        const urlMap = {
            signIn: {
                url: 'https://bbs-api.miyoushe.com/apihub/app/api/signIn', body
            }
        }
        return urlMap[type]
    }

    /**
     *
     * @param b 同mihoyoapi.getUrl中的请求信息
     * @param q 默认为空
     * @returns {string}
     */
    bbsDs(q = '', b = '') {
        const salt = 't0qEgfub6cvueAPgR5m9aQWWVciEer7v'
        const t = Math.floor(Date.now() / 1000)
        const r = _.random(100001, 200000)
        const DS = md5(`salt=${salt}&t=${t}&r=${r}&b=${b}&q=${q}`)
        return `${t},${r},${DS}`
    }

    /**
     *
     * @param num
     * @returns {*}
     */
    get_mys_tool(num = null) {
        const mys = {
            1: {gids: '1'}, // 崩坏三
            2: {gids: '2'}, // 原神
            3: {gids: '3'}, // 崩坏学园2
            4: {gids: '4'}, // 未定事件簿
            5: {gids: '5'}, // 大别野
            6: {gids: '6'}, // 崩坏星穹铁道
            8: {gids: '8'}// 绝零区
        }
        if (num) {
            return mys[num]
        } else {
            return mys
        }
    }
}
