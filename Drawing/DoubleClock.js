export class DoubleClock {
	constructor(canvas, settings) {
		this.canvas = canvas
		this.context = canvas.getContext('2d')
		this.settings = settings
		this.width = canvas.width
		this.height = canvas.height
		this.gradient = null
		this.isAnimated = false
		this.length = 100
		this.cellSize = 50
		this.angle = 0
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

	render() {
		for (let y = 0; y < this.height; y += this.cellSize) {
			for (let x = 0; x < this.width; x += this.cellSize) {
				this.context.beginPath()
				this.context.moveTo(x, y)
				const currentX = x + this.length * Math.cos(this.angle)
				const currentY = y + this.length * Math.sin(this.angle)
				this.context.lineTo(currentX, currentY)
				this.context.stroke()

				this.context.beginPath()
				this.context.moveTo(x, y)
				const currentX2 = x - this.length * Math.sin(this.angle)
				const currentY2 = y - this.length * Math.cos(this.angle)
				this.context.lineTo(currentX2, currentY2)
				this.context.stroke()
			}
		}
	}

	animate() {
		this.context.clearRect(0, 0, this.width, this.height)
		this.render()
		this.angle += 0.001
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