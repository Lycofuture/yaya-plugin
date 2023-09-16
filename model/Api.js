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
  }
}
