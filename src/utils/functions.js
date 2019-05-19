export function setNewId(idArr) {
	const nums = idArr.map( id => +id.split('_')[1])
	let max = nums[0] || 0

	nums.forEach( num => {
		if(num > max) max = num
	})

	return `ID_${max+1}`
}

export function normalizeDate(ms) {
	const fullDate = new Date(ms) 
	const year = fullDate.getFullYear()
	const month = fullDate.getMonth() + 1
	const date = fullDate.getDate()
	
	return +(new Date(`${year}-${month}-${date}`))
}