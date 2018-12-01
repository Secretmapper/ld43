import Building from 'sprites/Building'

class Radar extends Building {
  constructor (config) {
    super({ ...config, texture: 'radar' })
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this.timedEvent = config.scene.time.addEvent({
      delay: 1000,
      callback: this.onLoop,
      callbackScope: this,
      loop: true
    })
}

  onLoop (time, delta) {
    this.scene.makeContact(this)
  }
}

export default Radar
