import Player from 'sprites/Player'
import Follower from 'sprites/Follower'
import Building from 'sprites/Building'
import PasteDispenser from 'sprites/PasteDispenser'
import Table from 'sprites/Table'
import Hunt from 'sprites/Hunt'
import Radar from 'sprites/Radar'
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
    this.depths = {
      follower: 90,
      player: 91,
      loadingBars: 93,
      bubble: 93,
      ui: 1000
    }
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
    
    const t = new Table({ scene: this, x: 100, y: 400 })
    this.buildings.add(t, true)
    this.buildings.add(new PasteDispenser({ scene: this, x: 600, y: 50 }), true)
    this.buildings.add(new Hunt({ scene: this, x: 100, y: 50 }), true)
    this.buildings.add(new Radar({ scene: this, x: 300, y: 550 }), true)

    this.followers = this.add.group({ runChildUpdate: true })
    this.followers.classType = Follower

    for (let i = 0; i < 5; i++) {
      const obj = new Follower({
        scene: this,
        x: 250 + (i % 5) * 24,
        y: 250 + (i / 5) * 24
      })
      this.followers.add(obj, true)
    }

    this.add.existing(this.player)

    this.ui = new GameUI(this)
    this.ui.create(this, controls)

    this.addOverlapCollisionListeners()
    this._pressedAction = false
  }

  update (time, delta) {
    this.player.update()
    this.ui.update()
    this._pressedAction = this.player.controls.action.isDown
    this._alreadyCalled = false
  }

  showShoppingList (table) {
    this.data.shop = table
    this.ui.showShoppingList()
  }

  buyItem (key) {
    this.data.shop.make(key)
  }

  deliver (builder, made) {
    const x = builder.x - (32 + builder.width / 2)
    const item = new Package(this, x, builder.y, made)
    item.setActive(true)
    item.setVisible(true)
    this.packages.add(item, true)
  }

  showSpots (carrying) {
    this.ui.showSpots(carrying.key)
  }

  hideSpots (carrying) {
    this.ui.hideSpots(carrying.key)
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

  makeContact (building) {
    this.ui.addFloatText(building.x, building.y, `+${10}`)
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
      if (item.key === 'paste_dispenser') {
        this.buildings.add(new PasteDispenser({ scene: this, x: spot.x, y: spot.y }), true)
      } else if (item.key === 'table') {
        this.buildings.add(new Table({ scene: this, x: spot.x, y: spot.y }), true)
      } else if (item.key === 'hunt') {
        this.buildings.add(new Hunt({ scene: this, x: spot.x, y: spot.y }), true)
      } else if (item.key === 'radar') {
        this.buildings.add(new Radar({ scene: this, x: spot.x, y: spot.y }), true)
      }
    }
  }

  onFollowerOverlap (follower, followerB) {
    // if (follower.target === this.player || !follower.target) {
      follower.avoid(followerB)
    // }
    // if (follower.target === this.player || !followerB.target) {
      followerB.avoid(follower)
    // }
  }

  onCallZoneFollowerOverlap (callZone, follower) {
    const player = callZone.player

    const pressedAction = (player.controls.action.isDown && !this._pressedAction)

    if (!this._alreadyCalled && !player.carrying && follower.target !== player && pressedAction) {
      if (follower.target && follower.target.approachedBy) {
        follower.target.approachedBy(null)
      }
      this._alreadyCalled = true
      follower.untake()
      follower.setTarget(player)
      player.addFollower(follower)
    }
  }

  onFollowerBuildingOverlap (follower, building) {
    if (follower.target === building && building._approaching === follower) {
      building.takeFollower(follower)
    } else {
      follower.avoid(building)
    }
  }

  addOverlapCollisionListeners () {
    this.physics.add.overlap(this.followers, this.followers, this.onFollowerOverlap, null, this)
    this.physics.add.overlap(
      this.player.callZone,
      this.followers,
      this.onCallZoneFollowerOverlap,
      this.bothActive,
      this
    )
    this.physics.add.overlap(
      this.player,
      this.packages,
      this.onPlayerPackagesOverlap,
      this.bothActive
    )
    this.physics.add.collider(
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
