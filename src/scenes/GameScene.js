import Player from 'sprites/Player'
import Follower from 'sprites/Follower'
import Building from 'sprites/Building'
import Table from 'sprites/Table'
import Package from 'sprites/Package'
import GameUI from 'ui/Game'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  preload () {}

  create () {
    this.data = {
      food: 0,
      science: 0
    }
    this.sprites = {}
    const controls = {
      action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      cancel: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      cursors: this.input.keyboard.createCursorKeys()
    }
    this.player = new Player({
      scene: this,
      controls,
      x: 400,
      y: 300,
    })
    this.packages = this.add.group({ runChildUpdate: true })
    this.buildings = this.add.group({ runChildUpdate: true })
    this.buildings.classType = Building
    for (let i = 0; i < 10; i++) {
      addToGroupAndKill(this.buildings, new Building({ scene: this, x: 0, y: 0 }))
    }
    const b = this.buildings.get(600, 50)
    b.resetAs(Building.PASTE_DISPENSER )

    const t = new Table({ scene: this, x: 200, y: 400 })
    this.buildings.add(t, true)

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

    this.ui = new GameUI(this)
    this.ui.create(this, controls)

    this.addOverlapCollisionListeners()
  }

  update (time, delta) {
    this.player.update()
    this.ui.update()
  }

  showShoppingList (table) {
    this.data.shop = table
    this.ui.showShoppingList()
  }

  buyItem () {
    this.data.shop.make('paste_dispenser')
  }

  deliver (builder, made) {
    if (made === 'paste_dispenser') {
      const x = builder.x + 32 + builder.width / 2
      const item = new Package(this, x, builder.y, made)
      item.setActive(true)
      item.setVisible(true)
      this.packages.add(item, true)
    }
  }

  addFood (amount) {
    this.data.food += amount
    this.ui.setText('food', this.data.food)
  }

  addScience (amount, building) {
    this.data.science += amount
    this.ui.setText('science', this.data.science)
    this.ui.addFloatText(building.x, building.y, `+${amount}`)
  }

  bothActive (a, b) {
    return a.active && b.active
  }

  onPlayerBuildingOverlap (player, building) {
    player.setHoveredBuilding(building)
  }

  onPlayerPackagesOverlap (player, itemPackage) {
    if (player.controls.action.isDown) {
      player.carry(itemPackage)
    }
  }

  onPackageSpotOverlap (item, spot) {
    // TODO: this is hacky
    if (
      item.key === spot.texture.key
      && !spot.taken
      && this.player.carrying !== item
    ) {
      spot.taken = true
      item.destroy()
      const b = this.buildings.get(spot.x, spot.y)
      b.resetAs(Building.PASTE_DISPENSER)
    }
  }

  onFollowerOverlap (follower, followerB) {
    if (follower.target === this.player || !follower.target) {
      follower.avoid(followerB)
    }
    if (follower.target === this.player || !followerB.target) {
      followerB.avoid(follower)
    }
  }

  onCallZoneFollowerOverlap (callZone, follower) {
    const player = callZone.player
    const pressedAction = (Phaser.Input.Keyboard.JustDown(player.controls.action))

    if (follower.target !== player && pressedAction) {
      if (follower.target && follower.target.approachedBy) {
        follower.target.approachedBy(null)
      }
      follower.setTarget(player)
      player.addFollower(follower)
    }
  }

  onFollowerBuildingOverlap (follower, building) {
    if (follower.target === building && building._approaching === follower) {
      building.takeFollower(follower)
    }
  }

  addOverlapCollisionListeners () {
    this.physics.add.overlap(this.followers, this.followers, this.onFollowerOverlap, null, this)
    this.physics.add.overlap(
      this.player.callZone,
      this.followers,
      this.onCallZoneFollowerOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.player,
      this.packages,
      this.onPlayerPackagesOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.player,
      this.buildings,
      this.onPlayerBuildingOverlap,
      this.bothActive
    )
    this.physics.add.overlap(
      this.packages,
      this.ui.spots.all,
      this.onPackageSpotOverlap,
      this.bothActive,
      this
    )
    this.physics.add.overlap(
      this.followers,
      this.buildings,
      this.onFollowerBuildingOverlap,
      this.bothActive,
      this
    )
  }
}

const addToGroupAndKill = (group, obj) => {
  group.add(obj, true)
  group.killAndHide(obj)
}

export default GameScene
