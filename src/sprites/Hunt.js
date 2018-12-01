import Building from 'sprites/Building'

class Hunt extends Building {
  constructor (config) {
    super({ ...config, texture: 'hunt' })
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
    this.elapsed = 0
  }

  update (time, delta) {
    const TIME = 500
    this.making = 'cow'
    super.update(time, delta)
  }
}

export default Hunt
