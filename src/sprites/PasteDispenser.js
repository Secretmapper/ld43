import Building from 'sprites/Building'

class PasteDispenser extends Building {
  constructor (config) {
    super({ ...config, texture: 'paste_dispenser' })

    this._isKilling = false
    this.WAITING_TIME = this.scene.data.progression.paste_dispenser.time * 1000

    this.sfx = this.scene.sound.add('dispenser_sfx')
  }

  get isFilled () {
    return (this._approaching && this._approaching.active) || this._isKilling
  }

  update () {
  }

  takeFollower (follower) {
    this._isKilling = true

    this.untakeFollower()
    follower.setActive(false)
    follower.setVisible(false)
    follower.untake()

    this.scene.tweens.add({
      targets: this,
      y: this.y + 5,
      duration: 200,
      ease: 'Power2.easeInOut',
      yoyo: true,
      repeat: (this.WAITING_TIME / 400),
      onUpdate: this.onUpdate,
      onUpdateScope: this,
      onStart: () => {
        this.sfx.play()
      },
      onComplete: this.onFinishTakingFollower,
      onCompleteScope: this
    })
  }

  onUpdate (tween) {
    this.loading.setVisible(true)
    this.loading.resize(
      Math.max(4, this.width * (tween.elapsed / tween.duration)),
      4
    )
  }

  onFinishTakingFollower (tween, target) {
    this.loading.setVisible(false)
    this._isKilling = false
    this.scene.addFood(this.scene.data.progression.paste_dispenser.food)
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
