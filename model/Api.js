import fetch from 'node-fetch'

export const Api = {
  like (qq) {
    let url
    if (qq === 'pass') {
      url = `https://api.andeer.top/API/img_crawl.php?qq=${qq}`
    } else if (qq) {
      url = `https://api.andeer.top/API/img_good.php?qq=${qq}`
    } else {
      url = 'https://api.andeer.top/API/word_pic1.php'
    }
    return url
  },
  async hitokoto () {
    const url = 'https://v1.hitokoto.cn/'
    let Response = await fetch(url).catch((v) => logger.debug(v))
    if (!Response) {
      return '当你准备做一件事时，请坚定地开始，不要把时间浪费在犹豫上'
    }
    Response = await Response.json()
    return Response.hitokoto
  }
}
