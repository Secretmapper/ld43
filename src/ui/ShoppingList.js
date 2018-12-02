class ShoppingList {
  constructor (scene, controls) {
    this.scene = scene
    this.controls = controls

    this.data = {
      curIdx: 0,
      items: [
        [
          'radar',
          'Propaganda Tower',
          'Attract other humans to the camp',
          this.scene.data.progression.craft.radar * 1000
        ],
        [
          'table',
          'Workbench',
          'Allows humans to craft/research',
          this.scene.data.progression.craft.table * 1000
        ],
        [
          'paste_dispenser',
          'Bioessence Converter',
          'Turns biomaterial into food',
          this.scene.data.progression.craft.dispenser * 1000
        ],
        [
          'hunt',
          'Farm',
          'Allows humans to produce livestock',
          this.scene.data.progression.craft.hunt * 1000
        ]
      ]
    }
    this.createUI()

    this.toShow = false
    this.showing = false

    this._pressedAction = false
  }

  show () {
    if (!this.toShow && !this.showing) {
      this.toShow = true
      this.scene.tweens.add({
        targets: this.container,
        y: 50,
        duration: 200,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.showing = true
        }
      })
    }
  }

  hide () {
    if (this.toShow) {
      this.toShow = false
      this.scene.tweens.add({
        targets: this.container,
        y: 600,
        duration: 200,
        ease: 'Sine.easeIn',
        onComplete: () => {
          this.showing = false
        }
      })
    }
  }

  update () {
    const { controls: { cursors, action, cancel, enter } } = this

    if (this.showing && this.toShow) {
      if (cursors.down.isDown && !this._pressedDown) {
        this.data.curIdx = Math.min(
          this.data.items.length - 1, this.data.curIdx + 1
        )
      } else if (cursors.up.isDown && !this._pressedUp) {
        this.data.curIdx = Math.max(0, this.data.curIdx - 1)
      } else if ((action.isDown && !this._pressedAction) || Phaser.Input.Keyboard.JustDown(enter)) {
        // buy
        this.scene.buyItem(this.data.items[this.data.curIdx])
        this.hide()
      } else if (Phaser.Input.Keyboard.JustDown(cancel)) {
        this.hide()
      }
    }

    this._pressedUp = cursors.up.isDown
    this._pressedDown = cursors.down.isDown
    this._pressedAction = action.isDown
    this.cursor.y = (this.data.curIdx + 1) * (this.tileBounds.height)
  }

  createUI () {
    const { scene } = this
    const container = scene.add.container(200, 50)
    const dlg = scene.add.nineslice(
      0, 0,
      340, 240,
      'tile',
      18,
    )

    const tileBounds = scene.make.nineslice(32, 18, 48, 48, 'tile', 18).getBounds()

    const cursor = scene.add.sprite(
      tileBounds.x - 18,
      tileBounds.y + tileBounds.height / 2,
      'picker'
    )
    this.scene.tweens.add({
      targets: cursor,
      x: cursor.x + 5,
      loop: -1,
      repeat: true,
      yoyo: true,
      duration: 250,
      ease: 'Sine.easeInOut'
    })

    container.add([
      dlg,
      cursor,
      ...this.data.items.reduce((arr, item, i) => (
        arr.concat(this.makeRow(tileBounds, item[1], item[2], item[3], i))
      ), [])
    ])

    container.y = 600
    container.setDepth(this.scene.depths.ui)

    this.tileBounds = tileBounds
    this.cursor = cursor
    this.container = container
  }

  makeRow (tileBounds, title, desc, time, i = 0) {
    const scene = this.scene
    const tile = scene.add.nineslice(
      32, 18 + ((tileBounds.height + 4) * i),
      48, 48,
      'tile', 18
    )
    tile.setOrigin(0)

    return [
      tile,
      scene.add.text(
        tile.x + tileBounds.width + 4,
        tile.y + 4,
        `${title} (${time / 1000}s)`,
        { font: '18px Arial', fill: 'white' }
      ),
      scene.add.text(
        tile.x + tileBounds.width + 4,
        tile.y + tileBounds.height / 2 + 4,
        desc,
        { font: '14px Arial', fill: 'white' }
      )
    ]
  }
}

export default ShoppingList
