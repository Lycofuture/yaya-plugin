import {sleep} from '../index.js'

export default new class fish {
	constructor() {
		console.log(this.list())
	}

	get arr() {
		return [{
			id: 1,
			name: '小丑鱼',
			coin: 30
		}, {
			id: 2,
			name: '小丑鱼',
			coin: 50
		}, {
			id: 3,
			name: '小丑鱼',
			coin: 80
		}, {
			id: 4,
			name: '小丑鱼',
			coin: 100
		}, {
			id: 5,
			name: '小丑鱼',
			coin: 130
		}, {
			id: 6,
			name: '小丑鱼',
			coin: 150
		}, {
			id: 7,
			name: '小丑鱼',
			coin: 200
		}, {
			id: 8,
			name: '小丑鱼',
			coin: 230
		}, {
			id: 9,
			name: '小丑鱼',
			coin: 260
		}, {
			id: 10,
			name: '小丑鱼',
			coin: 300
		}, {
			id: 11,
			name: '小丑鱼',
			coin: 500
		}, {
			id: 12,
			name: '小丑鱼',
			coin: 650
		}, {
			id: 13,
			name: '小丑鱼',
			coin: 700
		}, {
			id: 14,
			name: '小丑鱼',
			coin: 820
		}, {
			id: 15,
			name: '小丑鱼',
			coin: 930
		}, {
			id: 16,
			name: '小丑鱼',
			coin: 1120
		}, {
			id: 17,
			name: '小丑鱼',
			coin: 1240
		}, {
			id: 18,
			name: '小丑鱼',
			coin: 1380
		}, {
			id: 19,
			name: '小丑鱼',
			coin: 1430
		}, {
			id: 20,
			name: '小丑鱼',
			coin: 2000
		}]
	}

	/**
	 * 获取物品
	 * @param isAristocrat 是否超级
	 * @returns {Promise<*>}
	 */
	async list(isAristocrat = false) {
		let arr = []
		if (isAristocrat) {
			arr = this.arr.slice(10, 20)
		} else {
			arr = this.arr.slice(0, 10)
		}
		let id = Math.floor(Math.random() * arr.length)
		await sleep(20)
		return arr[id];
	}

}