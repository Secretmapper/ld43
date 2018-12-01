class TitleScene extends Phaser.Scene {
  constructor () {
    super({ key: 'TitleScene' })
  }

  preload () {}

  create () {
    this.scene.start('GameScene')
  }

  update (time, delta) {}
}

export default TitleScene
