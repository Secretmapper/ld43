import Player from 'sprites/Player'
import Follower from 'sprites/Follower'
import Building from 'sprites/Building'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

  }

  preload () {}

  create () {
    this.player = new Player({
      scene: this,
      x: 200,
      y: 50,
      controls: {
        action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        cursors: this.input.keyboard.createCursorKeys()
      }
    })
    this.building = new Building({ scene: this, x: 200, y: 300, texture: 'paste_dispenser' })

    this.followers = this.add.group({ runChildUpdate: true })
    this.followers.classType = Follower

    for (let i = 0; i < 25; i++) {
      const obj = new Follower({
        scene: this,
        x: 250 + i,
        y: 250 + i,
        target: this.player
      })
      this.followers.add(obj, true)
      // obj.kill()
      this.player.addFollower(obj)
    }

    this.add.existing(this.player)
    this.add.existing(this.building)

    this.physics.add.overlap(this.followers, this.followers, this.onFollowerOverlap)
    this.physics.add.overlap(
      this.player,
      [this.building],
      this.onPlayerBuildingOverlap
    )
  }

  update (time, delta) {
    this.player.update()
  }

  onPlayerBuildingOverlap (player, building) {
    player.setHoveredBuilding(building)
  }

  onFollowerOverlap (follower, followerB) {
    follower.avoid(followerB)
    followerB.avoid(follower)
  }
}

export default GameScene
