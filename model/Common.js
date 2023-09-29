/**
 * 等待时间
 * @param ms
 * @returns {Promise<unknown>}
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export {sleep}
