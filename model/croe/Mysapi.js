import _ from 'lodash'
import md5 from 'md5'
import Data from "./Data.js";

export default class Mys_api extends Data {
    constructor(e, data = {}) {
        super(e);
        this.api = this.get_Config('api')
        this.cookie = data.cookie
        this.uid = data.uid
    }

    /**
     *
     * @param type 版块
     * @param query 请求值
     * @param body 默认为空
     */
    getHeaders(type = 'sign', query, body) {
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
                    Cookie: this.cookie
                }
                break
            default:
                headers = {}
                break
        }
        return headers
    }

    getUrlMap(type, data = {}) {
        let hostList = {
            host: 'https://api-takumi.mihoyo.com/',
            bbs_api: `https://bbs-api.mihoyo.com/`,
            hostRecord: 'https://api-takumi-record.mihoyo.com/'
        }
        const urlMap = {
            createVerification: {
                url: `${hostList.hostRecord}game_record/app/card/wapi/createVerification`,
                query: 'is_high=true',
                types: 'signIn'
            },
            verifyVerification: {
                url: `${hostList.hostRecord}game_record/app/card/wapi/verifyVerification`,
                body: {
                    "geetest_challenge": data.challenge,
                    "geetest_validate": data.validate,
                    "geetest_seccode": `${data.validate}|jordan`
                }
            },
            validate: {
                url: `http://api.rrocr.com/api/recognize.html`,
                query: `appkey=${this.api.apikey}&gt=${data.gt}&challenge=${data.challenge}&referer=https://webstatic.mihoyo.com&ip=&host=`
            },
            signIn: {
                url: 'https://bbs-api.miyoushe.com/apihub/app/api/signIn',
                body: this.get_mys_tool(data.num)
            }
        }
        return urlMap[type]
    }

    /**
     *
     * @param type 版块
     * @param data
     * @property urlMap 返回url和请求信息
     */
    getUrl(type, data = {}) {
        let urlMap = this.getUrlMap(type, data)
        if (!urlMap) return false
        let {
            url,
            query = '',
            body = '',
            types = 'signIn'
        } = urlMap
        if (query) url += `?${query}`
        if (body) body = JSON.stringify(body)
        let headers = this.getHeaders(types, query, body)
        return {
            url,
            headers,
            body
        }
    }

    async getData(type, data = {}) {
        let {url, headers, body} = this.getUrl(type, data)
        if (!url) return false
        headers.Cookie = this.cookie
        if (data.headers) {
            headers = {...headers, ...data.headers}
            delete data.headers
        }
        let param = {
            headers,
            timeout: 10000
        }
        if (body) {
            param.method = 'post'
            param.body = body
        } else {
            param.method = 'get'
        }
        let response = {}
        try {
            response = await fetch(url, param)
        } catch (error) {
            logger.error(error.toString())
            return false
        }
        if (!response.ok) {
            logger.error(`[米游社接口][${type}]${response.status} ${response.statusText}`)
            return false
        }
        let res = await response.text()
        if (typeof res === 'string') {
            if (res.startsWith('(')) {
                res = JSON.parse((res).replace(/\(,\)/g, ""))
            } else {
                res = JSON.parse(res)
            }
        } else {
            return false
        }

        if (!res) {
            logger.mark('mys接口没有返回')
            return false
        }
        res.api = type
        return res
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
            1: {gids: '1'},
            2: {gids: '2'},
            3: {gids: '3'},
            4: {gids: '4'},
            5: {gids: '5'},
            6: {gids: '6'},
            8: {gids: '8'}
        }
        if (num) {
            return mys[num]
        } else {
            return mys
        }
    }

    gids(num) {
        switch (num) {
            case '1':
                return '崩坏三'
            case '2':
                return '原神'
            case '3':
                return '崩坏学园2'
            case '4':
                return '未定事件簿'
            case '5':
                return '大别野'
            case '6':
                return '崩坏星穹铁道'
            case '8':
                return '绝零区'
            default:
                return '社区版块'
        }
    }
}
