import {Api} from '../model/index.js'

export default class Like extends plugin {
  constructor () {
    super({
      name: '丫丫：点赞',
      dsc: '功能列表',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#(点赞|赞我|点zan)$',
          fnc: 'thuMUp',
          title: '#赞我',
          desc: '给我点赞'
        }
      ]
    })
  }

  async thuMUp (e) {
    /** 判断是否为好友 */
    const isFriend = Array.from(await Bot.fl.values()).some(obj => obj.user_id === e.user_id)
    const successImg = segment.image(Api.like(e.user_id))
    /** 点赞失败图片**/
    const faildsImg = segment.image(Api.like('pass'))
    if ((e.bot ?? Bot).config.platform === 3) {
      return logger.error(`${e.logFnc}手表协议暂不支持点赞请更换协议后重试`)
    } else if (!isFriend) {
      await e.reply(['不加好友不点🙄', segment.image(Api.like())], true)
    } else {
      /** 开始执行点赞**/
      const failsmsg = '今天已经点过了，还搁这讨赞呢！！！'
      /** 点赞记录 **/
      let n = 0
      while (true) {
        // 好友点赞
        const res = await Bot.sendLike(e.user_id, 1)
        logger.debug(`${e.logFnc}好友点赞`, res)
        if (res) {
          n++
        } else break
      }
      /** 回复的消息 */
      const successResult = [
        '\n',
        `赞了${n}下噢喵~,可以..可以回我一下嘛o(*////▽////*)q~`,
        successImg
      ]
      const faildsResult = ['\n', failsmsg, faildsImg]
      /** 判断点赞是否成功 */
      const msg = n > 0 ? successResult : faildsResult
      /** 回复 */
      await e.reply(msg, true, {
        at: true
      })
    }
    return true
  }
}
