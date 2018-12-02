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

    this.bubble = this.scene.add.sprite(config.x + this.width, config.y, 'bubble', 0)
    this.bubble.setDepth(99999)
    this.bubble.setOrigin(1)
    this.scene.add.tween({
      targets: this.bubble,
      y: this.bubble.y - 5,
      loop: -1,
      repeat: true,
      yoyo: true,
      duration: 500,
      ease: 'Linear'
    })

    this.WAITING_TIME = 5000
  }

  update (time, delta) {
    this.bubble.setVisible(this.canMake)
    super.update(time, delta)
  }

  get canMake () {
    return (this.hasUser && !this.making)
  }

  get hasUser () {
    return (this._follower && this._follower.active)
  }

  get isFilled () {
    return this._approaching && this._approaching.active
  }

  getTickScore () {
    return 5
  }

  make (making, time) {
    this.making = making
    this.WAITING_TIME = time || 300000
  }

  onFinish (making) {
    this.scene.addScience(this.getTickScore(), this)
    this.scene.deliver(this, making)
  }
}

export default Table
