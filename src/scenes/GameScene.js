import Player from 'sprites/Player'
import Follower from 'sprites/Follower'
import Building from 'sprites/Building'
import PasteDispenser from 'sprites/PasteDispenser'
import Table from 'sprites/Table'
import Hunt from 'sprites/Hunt'
import Radar from 'sprites/Radar'
import Thing from 'sprites/Thing'
import Package from 'sprites/Package'
import GameUI from 'ui/Game'
import Tutorial from 'ui/Tutorial'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  preload () {}

  create () {
    var music = this.sound.add('theme')
    music.play({ loop: true })

    this.data = {
      food: 0,
      science: 0,
      progression: {
        stress: 30,
        radar: { time: 25 },
        paste_dispenser: { time: 10, food: 50 },
        hunt: { time: 120, food: 600 },
        craft: {
          radar: [10, 60, 120],
          paste_dispenser: [40, 80, 170, 250, 300],
          table: [80, 80, 80, 80],
          hunt: [200, 300, 500],
        },
        craftCount: {
          radar: 0,
          paste_dispenser: 0,
          table: 0,
          hunt: 0,
        },
        currNeedIdx: 0,
        needs: [
          [90, 50],
          [75, 150],
          [60, 250],
          [60, 600]
        ]
      }
    }
    this.sprites = {}
    this.depths = {
      follower: 90,
      player: 91,
      loadingBars: 93,
      bubble: 93,
      thing: 100,
      thingShadow: 92,
      ui: 1000
    }
    const controls = {
      action: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      moveTo: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      cancel: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      cursors: this.input.keyboard.createCursorKeys()
    }
    this.createGround()
    this.player = new Player({
      scene: this,
      controls,
      x: 400,
      y: 300,
    })
    this.packages = this.add.group({ runChildUpdate: true })
    this.buildings = this.add.group({ runChildUpdate: true })
    this.buildingsOverlap = this.physics.add.group({ runChildUpdate: true })
    
    const t = new Table({ scene: this, x: 100, y: 450 })
    this.buildings.add(t, true)
    this.buildings.add(new PasteDispenser({ scene: this, x: 600, y: 50 }), true)
    this.buildings.add(new Hunt({ scene: this, x: 100, y: 50 }), true)
    this.buildings.add(new Radar({ scene: this, x: 200, y: 380 }), true)

    this.followers = this.add.group({ runChildUpdate: true })
    this.followers.classType = Follower

    for (let i = 0; i < 2; i++) {
      const obj = new Follower({
        scene: this,
        x: 250 + (i % 5) * 24,
        y: 250 + (i / 5) * 24
      })
      this.followers.add(obj, true)
    }
    for (let i = 0; i < 50; i++) {
      const obj = new Follower({ scene: this })
      addToGroupAndKill(this.followers, obj)
    }

    this.add.existing(this.player)

    this.tutorial = new Tutorial(this)
    this.tutorial.tryToStart('controls', 'Use arrow keys to move')

    this.ui = new GameUI(this)
    this.ui.create(this, controls)

    this.addOverlapCollisionListeners()
    this._pressedAction = false

    this.thing = new Thing({ scene: this })
    this.thing.comeDown()
  }

  demandSacrifice (sacrifice) {
    this.data.food -= this.getCurrentProgression().food
    this.data.progression.currNeedIdx++
    this.thing.comeDown()
  }

  getCurrentProgression () {
    const prog = this.data.progression.needs[this.data.progression.currNeedIdx]
    return { time: prog[0], food: prog[1] }
  }

  update (time, delta) {
    this.player.update()
    this.thing.update()
    this.ui.update()
    this._pressedAction = this.player.controls.action.isDown
    this._alreadyCalled = false
  }

  showShoppingList (table) {
    this.data.shop = table
    this.ui.showShoppingList()
  }

  getCraftTime (k) {
    const times = this.data.progression.craft[k]
    const count = this.data.progression.craftCount[k]

    return times[count] * 1000
  }

  buyItem (item) {
    const key = item[0]
    this.data.shop.make(
      key,
      this.getCraftTime(key)
    )
    this.tutorial.complete('controlsShop')
  }

  deliver (builder, made) {
    if (made === 'CONTACT') {
      const follower = this.followers.get(50, 300)
      follower.reset()
    } else {
      this.tutorial.tryToStart(
        'controlsBuilding',
        [
          'Your worker has finished a building! Go to the item',
          "Drag it with the space key to the designated spots"
        ]
      )
      const x = builder.x - (32 + builder.width / 2)
      this.data.progression.craftCount[made]++
      this.ui.updateShoppingList()
      const item = new Package(this, x, builder.y, made)
      item.setActive(true)
      item.setVisible(true)
      this.packages.add(item, true)
    }
  }

  showSpots (carrying) {
    this.ui.showSpots(carrying.key)
  }

  hideSpots (carrying) {
    this.ui.hideSpots(carrying.key)
  }

  addFood (amount) {
    this.data.food += amount
    this.ui.setFood(this.data.food)
    this.tutorial.complete('sacrifice')
  }

  addScience (amount, building) {
    // this.data.science += amount
    // this.ui.setText('science', this.data.science)
    // this.ui.addFloatText(building.x, building.y, `+${amount}`)
  }

  makeContact (building) {
    this.ui.addFloatText(building.x, building.y, `Ping...`)
  }

  bothActive (a, b) {
    return a.active && b.active
  }

  onPlayerBuildingOverlap (player, overlap) {
    const building = overlap.building
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
      this.tutorial.complete('controlsBuilding')
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
    if (this.ui.shoppingListShown) {
      return
    }
    const player = callZone.player

    const pressedAction = (player.controls.action.isDown && !this._pressedAction)

    if (!this._alreadyCalled && !player.carrying && follower.target !== player && pressedAction) {
      if (follower.target && follower.target.approachedBy) {
        follower.target.approachedBy(null)
      }

      this.tutorial.complete('controls2')
      this._alreadyCalled = true
      follower.untake()
      follower.setTarget(player)
      player.addFollower(follower)
    }
  }

  onFollowerBuildingOverlap (follower, building) {
    if (follower.target === building && building._approaching === follower) {
      if (building instanceof Radar) {
        this.tutorial.complete('radar')
      }
      if (building instanceof Table) {
        this.tutorial.complete('controlsWorkbench')
      }
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
      null,
      this.bothActive
    )
    this.physics.add.overlap(
      this.player,
      this.buildingsOverlap,
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

  createGround () {
    const level = arrOf(500 / 24, arrOf(800 / 24, 0))
    const height = level.length
    const width = level[0].length

    const map = this.make.tilemap({ data: level, tileWidth: 24, tileHeight: 24 })
    const tiles = map.addTilesetImage('tile_bg')
    const layer = map.createBlankDynamicLayer('ground', tiles)
    layer.weightedRandomize(0, 0, width, height, [
        { index: 0, weight: 20 }, // 9/10 times, use index 6
        { index: [1, 2], weight: 1 } // 1/10 times, randomly pick 7, 8 or 26
      ]);
    layer.setDepth(-2)
  }
}

const addToGroupAndKill = (group, obj) => {
  group.add(obj, true)
  group.killAndHide(obj)
}

// lol
const arrOf = (n, item) => {
  const arr = []
  for (let i = 0; i < n + 1; i++) {
    arr.push(item)
  }
  return arr
}

export default GameScene
