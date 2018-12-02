const map = ['paste_dispenser', 'hunt', 'table', 'radar']

export default class Package extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, made) {
    super(scene, x, y, 'package', map.indexOf(made))
    scene.physics.world.enable(this)

    this.key = made
  }
}
