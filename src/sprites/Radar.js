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
    this.body.setSize(16, 48)
    this.body.setOffset(32, 16)
  }

  update (time, delta) {
    super.update(time, delta)

    if (this.hasUser) {
      this._follower.applyStress(delta)
      this._follower.flipX = false
    }
  }

  onLoop (time, delta) {
    this.scene.makeContact(this)
  }

  takeFollower (follower) {
    super.takeFollower(
      follower,
      this.x,
      this.y + this.height / 2 - follower.height / 2 - 2
    )
  }
}

export default Radar
