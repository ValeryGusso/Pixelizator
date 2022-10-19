export function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

export async function fetchUrl(url) {
	const request = JSON.stringify({ image: url })
	// const res = await fetch('http://localhost:666/url', {
	const res = await fetch('https://image-to-base64-server.herokuapp.com/url', {
		method: 'POST',
		body: request,
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json; charset=utf-8',
		},
	})
	const data = await res.json()
	return data
}

export async function fetchImage(formData) {
	// const res = await fetch('http://localhost:666/image', {
	const res = await fetch('https://image-to-base64-server.herokuapp.com/image', {
		method: 'POST',
		body: formData,
		mode: 'cors',
	})
	const data = await res.json()
	return data
}
