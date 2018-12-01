class Table extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, 'table')
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this.followerA = null
    this.followerB = null
  }

  get isFilled () {
    return (this.followerA && this.followerB)
  }

  takeFollower (follower) {
    if (!this.isFilled) {
      let x, y
      if (this.followerA && this.followerA !== follower) {
        this.followerB = follower
        x = this.x + this.width / 2
      } else {
        this.followerA = follower
        x = this.x - this.width / 2
      }
      y = this.y

      follower.x = x
      follower.y = y 
      follower.taken({x, y})
    }
  }
}

export default Table
