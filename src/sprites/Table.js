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

    this.bubble = this.scene.add.sprite(config.x + this.width, config.y, 'bubble')
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

  make (making) {
    this.making = making
  }

  update (time, delta) {
    const TIME = 500

    this.bubble.setVisible(this.canMake)

    if (this.hasUser && this.making) {
      this.elapsed += delta

      if (this.elapsed >= TIME) {
        this.scene.addScience(this.getTickScore(), this)
        this.scene.deliver(this, this.making)

        this.elapsed -= TIME
        this.making = null
      }
    }
  }

  takeFollower (follower) {
    const x = this.x + this.width / 2
    const y = this.y

    follower.x = x
    follower.y = y 
    follower.taken({x, y})

    this._follower = follower
  }
}

export default Table
