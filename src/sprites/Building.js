class Building extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.texture)
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this._approaching = null
    this._follower = null

    this._isKilling = false
  }

  approachedBy (follower) {
    this._approaching = follower
  }

  get isFilled () {
    return (this._approaching && this._approaching.active) || this._isKilling
  }

  takeFollower (follower) {
    this._isKilling = true
    this._follower = follower

    follower.setActive(false)
    follower.setVisible(false)

    this.scene.tweens.add({
      targets: this,
      y: this.y + 5,
      duration: 200,
      ease: 'Power2.easeInOut',
      yoyo: true,
      repeat: 4,
      onComplete: this.onFinishTakingFollower,
      onCompleteScope: this
    })
  }

  onFinishTakingFollower (tween, target) {
    this._isKilling = false
    this.scene.addFood(10)
  }

  resetAs (type) {
    this.setTexture(type.texture)
    this.setActive(true)
    this.setVisible(true)
  }
}

Building.TABLE = {
  texture: 'table'
}

Building.PASTE_DISPENSER = {
  texture: 'paste_dispenser'
}

export default Building
