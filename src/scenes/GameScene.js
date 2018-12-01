import Player from 'sprites/Player'
import Follower from 'sprites/Follower'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

  }

  preload () {}

  create () {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = new Player({ scene: this, x: 200, y: 50, cursors: this.cursors })

    this.followers = this.add.group({ runChildUpdate: true })
    this.followers.classType = Follower

    for (let i = 0; i < 1; i++) {
      const obj = new Follower({
        scene: this,
        x: 250,
        y: 250,
        target: this.player
      })
      this.followers.add(obj, true)
      // obj.kill()
    }

    this.add.existing(this.player)
  }

  update (time, delta) {
    this.player.update()
  }
}

export default GameScene
