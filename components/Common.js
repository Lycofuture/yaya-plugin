import {Data} from '../model/index.js'
import render from './common-lib/render.js'

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export default {
    render,
    cfg: Data.get,
    isDisable: Data.isDisable,
    sleep
}
