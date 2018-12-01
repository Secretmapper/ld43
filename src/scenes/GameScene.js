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
      controls: {
        action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        cancel: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
        cursors: this.input.keyboard.createCursorKeys()
      },
      x: 200,
      y: 50,
    })
    this.building = new Building({
      scene: this,
      x: 600,
      y: 100,
      texture: 'paste_dispenser'
    })
    this.add.existing(
      new Building({
        scene: this,
        x: 100,
        y: 550,
        texture: 'table'
      })
    )
    this.buildings = this.add.group({ runChildUpdate: true })
    this.buildings.classType = Building

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
      this.player.callZone,
      this.followers,
      this.onCallZoneFollowerOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.player,
      [this.building],
      this.onPlayerBuildingOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.followers,
      [this.building],
      this.onFollowerBuildingOverlap,
      this.bothActive,
      this
    )
  }

  update (time, delta) {
    this.player.update()
  }

  bothActive (a, b) {
    return a.active && b.active
  }

  onPlayerBuildingOverlap (player, building) {
    player.setHoveredBuilding(building)
  }

  onFollowerOverlap (follower, followerB) {
    follower.avoid(followerB)
    followerB.avoid(follower)
  }

  onCallZoneFollowerOverlap (callZone, follower) {
    const player = callZone.player

    if (follower.target !== player && player.controls.action.isDown) {
      follower.setTarget(player)
      player.addFollower(follower)
    }
  }

  onFollowerBuildingOverlap (follower, building) {
    if (!building.isFilled) {
      this.followers.killAndHide(follower)
      building.takeFollower(follower)
    }
  }
}

export default GameScene
