import Building from 'sprites/Building'

class Radar extends Building {
  constructor (config) {
    super({ ...config, texture: 'radar' })
    config.scene.physics.world.enable(this)

    this.body.setImmovable(true)
  }
}

export default Radar
