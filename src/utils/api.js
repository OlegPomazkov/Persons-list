import DATA from './mockData'

export default {
	getData(method, options) {
		let data = new Promise((res, rej) => {
			switch(method) {
				case 'list':
					res(DATA)
					break
				default:
					rej('Incorrect API method')
			}
		})

		return data
	}
}