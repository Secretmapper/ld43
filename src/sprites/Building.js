class Building extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.texture)
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this._approaching = null
    this._follower = null
  }

  approachedBy (follower) {
    this._approaching = follower
  }

  get isFilled () {
    return (this._approaching && this._approaching.active) || this._isKilling
  }

  resetAs (type) {
    this.setTexture(type.texture)
    this.setActive(true)
    this.setVisible(true)
  }

  get hasUser () {
    return (this._follower && this._follower.active)
  }

  takeFollower (follower, x, y) {
    if (x == null) x = this.x + this.width / 2
    if (y == null) y = this.y

    follower.x = x
    follower.y = y 
    follower.taken(this, {x, y})

    this._follower = follower
  }

  untakeFollower (follower) {
    this._follower = null
    this._approaching = null
  }
}

Building.TABLE = {
  texture: 'table'
}

Building.PASTE_DISPENSER = {
  texture: 'paste_dispenser'
}

export default Building
