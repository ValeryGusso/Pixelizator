import { getRandom } from "../utils.js"

export class SpiningLines {
	constructor(canvas, settings) {
		this.canvas = canvas
		this.context = canvas.getContext('2d')
		this.settings = settings
		this.width = canvas.width
		this.height = canvas.height
		this.gradient = null
		this.isAnimated = false
		this.length = 30
		this.cellSize = 10
		this.angle = 0.005
		this.radius = 0
	}
  
	createGradient() {
		this.gradient = this.context.createLinearGradient(0, 0, this.width, this.height)
		this.gradient.addColorStop('0', '#fF5c33')
		this.gradient.addColorStop('0.2', '#ff66b3')
		this.gradient.addColorStop('0.4', '#ccccff')
		this.gradient.addColorStop('0.6', '#b3ffff')
		this.gradient.addColorStop('0.8', '#80ff80')
		this.gradient.addColorStop('1', '#ffff33')

	}

	render(x, y, angle) {
		this.context.beginPath()
		this.context.moveTo(x, y)
		const currentX = x + Math.cos(angle) * this.length
		const currentY = y + Math.sin(angle) * this.length
		this.context.lineTo(currentX, currentY)
		this.context.stroke()
	}

	animate() {
		this.context.clearRect(0, 0, this.width, this.height)

		this.radius += 0.01

		if (Math.abs(this.radius > 20)) {
			this.radius * -1
		}

		for (let y = 0; y < this.height; y += this.cellSize) {
			for (let x = 0; x < this.width; x += this.cellSize) {
				const angle = (Math.cos(x * this.angle) + Math.sin(y * this.angle)) * this.radius
				this.render(x, y, angle)
			}
		}

		this.isAnimated && requestAnimationFrame(this.animate.bind(this))
	}

	start() {
		this.isAnimated = true
		this.createGradient()
		this.context.strokeStyle = this.gradient
		this.animate()
	}

	stop() {
		this.animate = false
	}
}