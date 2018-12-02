import Building from 'sprites/Building'

class PasteDispenser extends Building {
  constructor (config) {
    super({ ...config, texture: 'paste_dispenser' })

    this._isKilling = false
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

  get hasUser () {
    return (this._follower && this._follower.active)
  }
}

export default PasteDispenser
