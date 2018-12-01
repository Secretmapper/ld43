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
    this.buildings = this.add.group({ runChildUpdate: true })
    this.buildings.classType = Building
    for (let i = 0; i < 10; i++) {
      addToGroupAndKill(this.buildings, new Building({ scene: this, x: 0, y: 0 }))
    }
    const b = this.buildings.get(600, 100)
    b.resetAs(Building.PASTE_DISPENSER)
    const t = this.buildings.get(200, 400)
    t.resetAs(Building.TABLE)

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
      this.player.addFollower(obj)
    }

    this.add.existing(this.player)

    this.physics.add.overlap(this.followers, this.followers, this.onFollowerOverlap)
    this.physics.add.overlap(
      this.player.callZone,
      this.followers,
      this.onCallZoneFollowerOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.player,
      this.buildings,
      this.onPlayerBuildingOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.followers,
      this.buildings,
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

const addToGroupAndKill = (group, obj) => {
  group.add(obj, true)
  group.killAndHide(obj)
}

export default GameScene
