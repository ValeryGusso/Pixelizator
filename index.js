import { DoubleClock } from './Drawing/DoubleClock.js'
import { SpiningLines } from './Drawing/SpiningLines.js'
import { imageSRC } from './imageSRC.js'
import { PixelImage } from './PixelImage/PixelImage.js'
import { PixelText } from './PixelText/PixelText.js'
import { settings, TextSettings } from './settings.js'
import { fetchImage, fetchUrl } from './utils.js'

const $canvas = document.getElementById('canvas')
const $options = document.getElementById('options')
const $arrow = document.getElementById('arrow')
const $pixelSize = document.getElementById('size')
const $pixelSizeLabel = document.getElementById('sizeLabel')
const $gap = document.getElementById('gap')
const $gapLabel = document.getElementById('gapLabel')
const $speed = document.getElementById('speed')
const $speedLabel = document.getElementById('speedLabel')
const $radius = document.getElementById('radius')
const $radiusLabel = document.getElementById('radiusLabel')
const $forceDistance = document.getElementById('forceDistance')
const $forceDistanceLabel = document.getElementById('forceDistanceLabel')
const $forceGravity = document.getElementById('forceGravity')
const $forceGravityLabel = document.getElementById('forceGravityLabel')
const $direction = document.getElementById('direction')
const $directionLabel = document.getElementById('directionLabel')
const $img = document.getElementById('img')
const $modal = document.getElementById('modal')
const $button = document.getElementById('button')
const $imageLink = document.getElementById('imageLink')
const $file = document.getElementById('file')
const $modalText = document.getElementById('modalText')
const $inputText = document.getElementById('inputText')
const $scale = document.getElementById('scale')
const $scaleLabel = document.getElementById('scaleLabel')
const $fontSize = document.getElementById('fontSize')
const $fontSizeLabel = document.getElementById('fontSizeLabel')
const $color = document.getElementById('color')
const $colorLabel = document.getElementById('colorLabel')
const $font = document.getElementById('font')
const $fontLabel = document.getElementById('fontLabel')
const $loader = document.getElementById('loader')

$canvas.width = window.innerWidth
$canvas.height = window.innerHeight

window.addEventListener('load', () => {
	new Promise(res => {
		$img.src = imageSRC
		res()
	}).then(() => {
		init(currentType)
	})
})

// События меню настроек и модального окнв
let isShow = false
$arrow.addEventListener('click', () => {
	if (isShow) {
		$options.style = '--x: -17vmax'
		$arrow.style = '--angle: 0'
	} else {
		$options.style = '--x: 0'
		$arrow.style = '--angle: 180deg'
	}
	isShow = !isShow
})

window.addEventListener('click', e => {
	if (e.target.dataset.image || e.target.dataset.close) {
		$modal.classList.toggle('show')
		$modalText.classList.remove('show-text')
	}

	if (e.target.dataset.text || e.target.dataset.closetext) {
		$modalText.classList.toggle('show-text')
		$modal.classList.remove('show')
	}
})

// Загрузка пользовательских картинок
$button.addEventListener('click', () => {
	$loader.classList.toggle('show-loader')
	$inputText.value = ''
	currentType = 'image'

	try {
		const text = $imageLink.value
		const file = $file.files[0]

		if (text.trim() && !text.includes('.svg')) {
			setImageUrl(text)
			$modal.classList.toggle('show')
		}

		if (file) {
			const formData = new FormData()
			formData.append('image', file)
			setImagePicture(formData)
			$modal.classList.toggle('show')
		}
	} catch (err) {
		console.log(err)
	}
})

// Создание и загрузка картинки
let currentType = 'image'
let currentImage = null
let currentText = null
function init(type) {
	switch (type) {
		case 'image':
			currentText?.stop()
			currentImage?.stop()
			currentImage = new PixelImage($img, $canvas, settings)
			currentImage.init()
			currentImage.start()
			break
		case 'text':
			currentImage?.stop()
			currentText?.stop()
			currentText = new PixelText($canvas, TextSettings)
			currentText.init()
			currentText.start()
			break

		default:
			break
	}
}

async function setImageUrl(url) {
	currentImage?.stop()
	currentText?.stop()
	const data = await fetchUrl(url)
	new Promise(res => {
		$img.src = 'data:image/png;base64,' + data
		res()
	})
		.then(() => {
			init(currentType)
			$imageLink.value = ''
		})
		.finally(() => {
			$loader.classList.toggle('show-loader')
		})
}

async function setImagePicture(formData) {
	currentImage?.stop()
	currentText?.stop()
	const data = await fetchImage(formData)
	new Promise(res => {
		currentImage?.stop()
		$img.src = 'data:image/png;base64,' + data
		res()
	})
		.then(() => {
			init(currentType)
			$file.value = null
		})
		.finally(() => {
			$loader.classList.toggle('show-loader')
		})
}

// Обработка вводных данных
$pixelSize.addEventListener('change', e => {
	settings.size = +e.target.value
	TextSettings.size = +e.target.value
	$pixelSizeLabel.textContent = `Pixel size: ${e.target.value}`
	init(currentType)
})

$gap.addEventListener('change', e => {
	settings.gap = +e.target.value
	TextSettings.gap = +e.target.value
	$gapLabel.textContent = `Grid gap: ${e.target.value}`
	init(currentType)
})

$speed.addEventListener('change', e => {
	settings.speed = +e.target.value
	TextSettings.speed = +e.target.value
	$speedLabel.textContent = `Speed: ${e.target.value}`
	init(currentType)
})

$radius.addEventListener('change', e => {
	settings.radius = +e.target.value
	TextSettings.radius = +e.target.value
	$radiusLabel.textContent = `Mouse radius: ${e.target.value}`
	init(currentType)
})

$forceDistance.addEventListener('change', e => {
	settings.forceDistance = +e.target.value
	TextSettings.forceDistance = +e.target.value
	$forceDistanceLabel.textContent = `Distance force: ${e.target.value}`
	init(currentType)
})

$forceGravity.addEventListener('change', e => {
	settings.forceGravity = +e.target.value
	TextSettings.forceGravity = +e.target.value
	$forceGravityLabel.textContent = `Gravity force: ${e.target.value}`
	init(currentType)
})

$direction.addEventListener('change', e => {
	settings.direction = +e.target.value
	TextSettings.direction = +e.target.value
	$directionLabel.textContent = +e.target.value === -1 ? 'Distance' : 'Gravity'
	init(currentType)
})

$inputText.addEventListener('change', e => {
	TextSettings.text = e.target.value
	currentType = 'text'
	init(currentType)
})

$scale.addEventListener('change', e => {
	TextSettings.scale = +e.target.value
	$scaleLabel.textContent = 'Scale: ' + e.target.value
	currentType = 'text'
	init(currentType)
})

$fontSize.addEventListener('change', e => {
	TextSettings.fontSize = +e.target.value
	$fontSizeLabel.textContent = 'Font size: ' + e.target.value
	currentType = 'text'
	init(currentType)
})

$color.addEventListener('change', e => {
	TextSettings.color = e.target.value
	$colorLabel.textContent = 'Color: ' + e.target.value
	currentType = 'text'
	init(currentType)
})

$font.addEventListener('change', e => {
	TextSettings.font = +e.target.value
	$fontLabel.textContent = e.target.value
	currentType = 'text'
	init(currentType)
})

// Пиксельная картинка
// init(currentType)

// Фрактальные линии
// const lines = n SpiningLines($canvas)
// lines.start()ew

// Вращение линий в противоположные стороны
// const clock = new DoubleClock($canvas)
// clock.render()
// clock.start()
