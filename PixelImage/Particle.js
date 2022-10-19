import { getRandom } from "../utils.js"

export class Particle {
	constructor(x, y, color, mouse, settings) {
		this.x = x
		this.y = y
		this.currentX = x + getRandom(-100, 100)
		this.currentY = y + getRandom(-100, 100)
		this.size = settings.size
		this.gap = settings.gap
		this.color = color
		this.mouse = mouse
		this.speed = settings.speed
		this.direction = settings.direction
		this.force = this.direction > 0 ? settings.forceGravity : settings.forceDistance
		this.weight = getRandom(40, 100) / 100
	}

	update() {
		const dx = this.mouse.x - this.currentX
		const dy = this.mouse.y - this.currentY
		const distance = Math.sqrt(dx ** 2 + dy ** 2)
		const forceX = dx / distance
		const forceY = dy / distance

		if (distance < this.mouse.radius && this.mouse.isActive) {
			this.currentX += Math.floor(forceX * this.speed * this.direction * this.weight * this.force)
			this.currentY += Math.floor(forceY * this.speed * this.direction * this.weight * this.force)
		} else {
			const dx = this.x - this.currentX
			const dy = this.y - this.currentY
			const distance = Math.sqrt(dx ** 2 + dy ** 2)
			const forceX = dx / distance
			const forceY = dy / distance

			if (Math.abs(this.currentX - this.x) > (this.size + this.gap) * 3) {
				this.currentX += Math.floor(forceX * this.speed * this.weight)
			} else {
				this.currentX = this.x
			}

			if (Math.abs(this.currentY - this.y) > (this.size + this.gap) * 3) {
				this.currentY += Math.floor(forceY * this.speed * this.weight)
			} else {
				this.currentY = this.y
			}
		}
	}

	render(context) {
		context.fillStyle = this.color
		context.fillRect(this.currentX, this.currentY, this.size, this.size)
	}
}