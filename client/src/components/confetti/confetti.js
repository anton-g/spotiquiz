import * as utils from './utils'

/**
 * Based on https://github.com/alampros/react-confetti &  http://codepen.io/Gthibaud/pen/BoaBZK
 */
function confetti (canvas) {
  let numberOfPieces = 200
  let confettiSource = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: 0
  }
  let friction = 0.99
  let wind = 0
  let gravity = 0.1
  let colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548'
  ]
  let opacity = 1.0
  let recycle = true
  let run = true

  function self () {
    const context = canvas.getContext('2d')

    function Particle (x, y) {
      this.radius = utils.randomRange(0.1, 1)
      this.x = x
      this.y = y
      this.vx = utils.randomRange(-4, 4)
      this.vy = utils.randomRange(-10, -0)
      this.type = utils.randomInt(0, 1)

      this.w = utils.randomRange(5, 20)
      this.h = utils.randomRange(5, 20)

      this.r = utils.randomRange(5, 10)

      this.angle = utils.degreesToRads(utils.randomRange(0, 360))
      this.anglespin = utils.randomRange(-0.2, 0.2)
      this.color = colors[Math.floor(Math.random() * colors.length)]

      this.rotateY = utils.randomRange(0, 1)
    }

    Particle.prototype.update = function updateParticle () {
      this.x += this.vx
      this.y += this.vy
      this.vy += gravity
      this.vx += wind
      this.vx *= friction
      this.vy *= friction
      this.radius -= 0.02
      if (this.rotateY < 1) {
        this.rotateY += 0.1
      } else {
        this.rotateY = -1
      }
      this.angle += this.anglespin
      context.save()
      context.translate(this.x, this.y)
      context.rotate(this.angle)
      context.scale(1, this.rotateY)
      context.rotate(this.angle)
      context.beginPath()
      context.fillStyle = this.color
      context.strokeStyle = this.color
      context.globalAlpha = opacity
      context.lineCap = 'round'
      context.lineWidth = 2
      if (this.type === 0) {
        context.beginPath()
        context.arc(0, 0, this.r, 0, 2 * Math.PI)
        context.fill()
      } else if (this.type === 2) {
        context.beginPath()
        for (let i = 0; i < 22; i++) {
          const angle = 0.5 * i
          const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
          const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
          context.lineTo(x, y)
        }
        context.stroke()
      } else if (this.type === 1) {
        context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
      }
      context.closePath()
      context.restore()
    }

    function ParticleGenerator (source, number, text) {
      // particle will spawn in this aera
      this.x = source.x
      this.y = source.y
      this.w = source.w
      this.h = source.h
      this.number = number
      this.particles = []
      this.particlesGenerated = 0
      this.text = text
      this.recycle = recycle
    }
    ParticleGenerator.prototype.removeParticleAt = function removeParticleAt (i) {
      this.particles.splice(i, 1)
    }
    ParticleGenerator.prototype.getParticle = function addParticle () {
      const newParticleX = utils.randomRange(this.x, this.w + this.x)
      const newParticleY = utils.randomRange(this.y, this.h + this.y)
      return new Particle(newParticleX, newParticleY, this.text)
    }
    ParticleGenerator.prototype.animate = function animateParticle () {
      if (!run) {
        return false
      }
      const nP = this.particles.length
      const limit = this.recycle ? nP : this.particlesGenerated
      if (limit < this.number) {
        this.particles.push(this.getParticle())
        this.particlesGenerated += 1
      }

      this.particles.forEach((p, i) => {
        p.update()
        if (p.y > canvas.height || p.y < -100 || p.x > canvas.width + 100 || p.x < -100) {
          if (recycle && limit <= this.number) {
            // a brand new particle replacing the dead one
            this.particles[i] = this.getParticle()
          } else {
            this.removeParticleAt(i)
          }
        }
      })
      return nP > 0 || limit < this.number
    }

    self.particleGenerator = new ParticleGenerator(confettiSource, numberOfPieces)

    self.update = () => {
      if (run) {
        self.particleGenerator.number = numberOfPieces
        // context.globalAlpha=.5;
        context.fillStyle = 'white'
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
      if (self.particleGenerator.animate()) {
        requestAnimationFrame(self.update)
      } else {
        run = false
      }
    }

    self.update()

    return self
  }

  self.numberOfPieces = (...args) => {
    if (!args.length) { return numberOfPieces }
    [numberOfPieces] = args
    if (self.particleGenerator) {
      self.particleGenerator.number = numberOfPieces
    }
    return self
  }

  self.friction = (...args) => {
    if (!args.length) { return friction }
    [friction] = args
    return self
  }

  self.wind = (...args) => {
    if (!args.length) { return wind }
    [wind] = args
    return self
  }

  self.gravity = (...args) => {
    if (!args.length) { return gravity }
    [gravity] = args
    return self
  }

  self.colors = (...args) => {
    if (!args.length) { return colors }
    [colors] = args
    return self
  }

  self.opacity = (...args) => {
    if (!args.length) { return opacity }
    [opacity] = args
    return self
  }

  self.recycle = (...args) => {
    if (!args.length) { return recycle }
    [recycle] = args
    if (self.particleGenerator) {
      self.particleGenerator.recycle = recycle
    }
    return self
  }

  self.confettiSource = (...args) => {
    if (!args.length) { return confettiSource }
    confettiSource = Object.assign(confettiSource, args[0])
    return self
  }

  self.run = (...args) => {
    if (!args.length) { return run }
    const wasRunning = run
    const [isRunning] = args
    run = isRunning
    if (!wasRunning && run) {
      self.update()
    }
    return self
  }

  return self
}

export default confetti
