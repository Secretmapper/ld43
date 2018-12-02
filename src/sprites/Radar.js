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
    this.overlapper.body.setSize(16 + 30, 48 + 20)
    this.overlapper.body.setOffset(22, 8)
    this.WAITING_TIME = this.scene.data.progression.radar.time * 1000
    this.making = 'CONTACT'
  }

  update (time, delta) {
    super.update(time, delta)

    if (this.hasUser && this._follower) {
      this._follower.flipX = false
    }
  }

  onFinish (making) {
    this.making = 'CONTACT'
    this.scene.deliver(this, making)
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
