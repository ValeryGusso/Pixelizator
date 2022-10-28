import { Particle } from './Particle.js'

// Базовый объект настроек с дефолтными начениями для PixelImage
// const settings = {
// 	size: 4, Размер конкретного пикселя
// 	gap: 2, Расстояние в сетке / 0 - сплошное изображение
// 	speed: 7, Скорость анимации
// 	direction: -1, Направление движения частиц / -1 - отталкивание / 1 - притяжение
//  radius: 100, Радиус мыши, в котором происходит взоимодействие с частицами
// 	alpha: 0, Значение альфа-канала, чтобы ячейка прошла проверку и попала в итоговое изображение / 0 - проходят все ячейки / Макс. 254 т.к. строгое используется строгое неравенство
// 	forceGravity: 2, Множитель силы для притяжения к курсору
// 	forceDistance: 30 Множитель силы для отталкивания от курсора
// }

export class PixelImage {
	constructor(image, canvas, settings) {
		this.image = image
		this.canvas = canvas
		this.settings = settings
		this.pixelSize = settings.size
		this.context = canvas.getContext('2d', { willReadFrequently: true })
		this.width = canvas.width
		this.height = canvas.height
		this.particles = []
		this.isAnimate = false
		this.prevTimeStamp = 0
		this.counter = 0
		this.fps = 60
		this.mouse = {
			x: null,
			y: null,
			radius: settings.radius,
			isActive: false,
		}
	}

	init() {
		// Создание функций мыши

		const mouseMove = event => {
			this.mouse.x = event.x
			this.mouse.y = event.y
		}

		this.canvas.addEventListener('mousedown', event => {
			this.mouse.isActive = true
			this.mouse.x = event.x
			this.mouse.y = event.y
			this.canvas.addEventListener('mousemove', mouseMove)
		})

		this.canvas.addEventListener('mouseup', () => {
			this.mouse.isActive = false
			this.canvas.removeEventListener('mousemove', mouseMove)
		})

		// Создание пиксельного изображения

		this.context.font = '20px Verdana'

		const activeZone = 0.8
		let sizeX = this.image.width > this.width * activeZone ? this.width * activeZone : this.image.width
		let sizeY = this.image.height > this.height * activeZone ? this.height * activeZone : this.image.height

		const originalRatio = this.image.width / this.image.height
		const convertRatio = sizeX / sizeY

		let offsetX = (this.width - this.image.width) / 2
		let offsetY = (this.height - this.image.height) / 2
		let kfX = 1
		let kfY = 1

		if (originalRatio !== convertRatio) {
			const kf = originalRatio / convertRatio
			if (this.image.width > this.image.height) {
				kfX = kf
				offsetX = (this.width - sizeX * kfX) / 2
				offsetY = (this.height - sizeY) / 2
			} else {
				kfY = 1 / kf

				sizeX *= kf
				sizeY *= kf

				offsetX = (this.width - sizeX) / 2
				offsetY = (this.height - sizeY * kfY) / 2
			}
		}

		this.context.drawImage(this.image, offsetX, offsetY, sizeX * kfX, sizeY * kfY)
		const imageBase64 = this.context.getImageData(0, 0, this.width, this.height)

		for (let y = 0; y < this.height; y += this.pixelSize + this.settings.gap) {
			for (let x = 0; x < this.width; x += this.pixelSize + this.settings.gap) {
				const index = (y * this.width + x) * 4
				const alpha = imageBase64.data[index + 3]

				if (alpha > this.settings.alpha) {
					const color = `rgba(${imageBase64.data[index]},${imageBase64.data[index + 1]},${
						imageBase64.data[index + 2]
					},${alpha})`
					this.particles.push(new Particle(x, y, color, this.mouse, this.settings))
				}
			}
		}
	}

	render(timeStamp) {
		const dt = timeStamp - this.prevTimeStamp
		this.prevTimeStamp = timeStamp

		if (dt && this.counter > 1000) {
			this.fps = 1000 / dt
			this.counter = 0
		} else {
			this.counter += dt
		}

		this.context.clearRect(0, 0, this.width, this.height)
		this.context.fillStyle = '#cff'
		this.context.fillText(`FPS: ${Math.ceil(this.fps)}`, 5, 30)
		this.context.fillText(`Total pixels: ${this.particles.length}`, 5, 60)
		this.particles.forEach(pixel => pixel.render(this.context))
		this.particles.forEach(pixel => pixel.update())

		if (this.isAnimate) {
			requestAnimationFrame(this.render.bind(this))
		} else {
			this.context.clearRect(0, 0, this.width, this.height)
		}
	}

	start() {
		this.isAnimate = true
		this.render(0)
	}

	stop() {
		this.isAnimate = false
	}
}
