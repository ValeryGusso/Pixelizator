import { ParticleLetter } from './ParticleLetter.js'

export class PixelText {
	constructor(canvas, settings) {
		this.canvas = canvas
		this.settings = settings
		this.pixelSize = settings.size
		this.context = canvas.getContext('2d')
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

		// Создание пиксельного Текста

		this.context.font = `${this.settings.fontSize}px ${this.settings.font}`

		const textArray = this.settings.text.split('/')

		for (let i = 0; i < textArray.length; i++) {
			this.context.fillText(textArray[i], 0, this.settings.fontSize * (i + 1))
		}

		const imageBase64 = this.context.getImageData(0, 0, this.width, this.height)

		for (let y = 0; y < this.height; y += this.pixelSize + this.settings.gap) {
			for (let x = 0; x < this.width; x += this.pixelSize + this.settings.gap) {
				const index = (y * this.width + x) * 4
				const alpha = imageBase64.data[index + 3]

				if (alpha > this.settings.alpha) {
					this.particles.push(
						new ParticleLetter(
							x * this.settings.scale + this.settings.fontSize * 1.5,
							y * this.settings.scale,
							this.mouse,
							this.settings
						)
					)
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
		this.context.font = '20px ' + this.settings.font
		this.context.fillStyle = '#cff'
		this.context.fillText(`FPS: ${Math.ceil(this.fps)}`, 5, 30)
		this.context.fillText(`Total pixels: ${this.particles.length}`, 5, 60)
		this.particles.forEach(pixel => pixel.render(this.context))
		this.particles.forEach(pixel => pixel.update())
		if (this.isAnimate) {
			requestAnimationFrame(this.render.bind(this))
		}
	}

	start() {
		this.isAnimate = true
		this.render(0)
	}

	stop() {
		this.context.clearRect(0, 0, this.width, this.height)
		this.isAnimate = false
	}
}
