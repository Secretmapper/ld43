export default class Package extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, made) {
    super(scene, x, y, 'package')
    scene.physics.world.enable(this)

    this.key = made
  }
}
