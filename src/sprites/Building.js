class Building extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.texture)
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this._approaching = null
    this._follower = null

    this.loading = this.scene.add.nineslice(
      this.x - this.width / 2, this.y + 4 + this.height / 2,
      this.width, 4,
      'loading',
      2,
    )
    this.loading.resize(4, 4)
    this.loading.setVisible(false)
    this.loading.setDepth(this.scene.depths.loadingBars)
    this.elapsed = 0

    this.overlapper = new Phaser.GameObjects.Zone(
      config.scene,
      config.x,
      config.y,
      this.width + 20,
      this.height + 10
    )
    config.scene.physics.world.enable(this.overlapper)
    this.overlapper.body.setImmovable(true)
    this.overlapper.building = this
    this.scene.buildingsOverlap.add(this.overlapper)
  }

  update (time, delta) {
    const TIME = this.WAITING_TIME

    if (this.hasUser && this.making) {
      this.elapsed += delta

      this._follower.applyStress(delta)

      this.loading.resize(
        Math.max(4, this.width * (this.elapsed / TIME)), 4
      )
      this.loading.setVisible(true)

      if (this.elapsed >= TIME) {
        const making = this.making
        this.making = null
        this.elapsed -= TIME

        this.onFinish(making)
      }
    }
    
    this.loading.setVisible(this.making && this.elapsed > 0)
  }

  onFinish () {
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
