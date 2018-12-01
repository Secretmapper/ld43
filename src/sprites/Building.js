class Building extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.texture)
    config.scene.physics.world.enable(this)
    this.body.setImmovable(true)
  }
}

export default Building
