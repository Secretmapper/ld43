import Building from 'sprites/Building'

class Table extends Building {
  constructor (config) {
    super({ ...config, texture: 'table' })
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this._approaching = null
    this._follower = null
    this.elapsed = 0
    this.making = null
  }

  get isIdle () {
    return (this._follower && this._follower.active)
  }

  get isFilled () {
    return this._approaching && this._approaching.active
  }

  getTickScore () {
    return 5
  }

  update (time, delta) {
    if (this._follower) {
      this.elapsed += delta
      if (this.elapsed >= 5000) {
        this.scene.addScience(this.getTickScore(), this)

        this.elapsed -= 5000
      }
    }
  }

  takeFollower (follower) {
    const x = this.x - this.width / 2
    const y = this.y

    follower.x = x
    follower.y = y 
    follower.taken({x, y})

    this._follower = follower
  }
}

export default Table
