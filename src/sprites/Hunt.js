import Building from 'sprites/Building'

class Hunt extends Building {
  constructor (config) {
    super({ ...config, texture: 'hunt' })
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this.elapsed = 0
    this.followerMoveElapsed = 0
    this.followerToLeft = false
    this.FOLLOWER_POS = (this.x + this.width - this.width / 2)

    this.WAITING_TIME = this.scene.data.progression.hunt.time * 1000
    this.making = 'COW'
  }

  onFinish () {
    this.making = 'COW'
  }

  takeFollower (follower) {
    super.takeFollower(
      follower,
      this.FOLLOWER_POS,
      this.y + this.height / 2
    )
  }
}

export default Hunt
