import Player from 'sprites/Player'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

  }

  preload () {}

  create () {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = new Player({ scene: this, x: 200, y: 50, cursors: this.cursors })

    this.add.existing(this.player)
  }

  update (time, delta) {
    this.player.update()
  }
}

export default GameScene
