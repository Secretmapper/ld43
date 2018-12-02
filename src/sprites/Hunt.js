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

  }

  update (time, delta) {
    const TIME = 5000

    if (this.hasUser) {
      this.elapsed += delta

      if (this.elapsed >= TIME) {
        this.elapsed -= TIME
      }
    }
  }

  takeFollower (follower) {
    super.takeFollower(
      follower,
      this.FOLLOWER_POS,
      this.y + this.height / 2
    )
  }

  untakeFollower (follower) {
    super.untakeFollower(follower)
  }
}

export default Hunt
