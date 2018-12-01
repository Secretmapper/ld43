class Building extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.texture)
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this._isFilled = false
  }

  get isFilled () {
    return this._isFilled
  }

  takeFollower (follower) {
    if (!this.isFilled) {
      this._isFilled = true
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
  }

  onFinishTakingFollower (tween, target) {
    this._isFilled = false
  }
}

export default Building
