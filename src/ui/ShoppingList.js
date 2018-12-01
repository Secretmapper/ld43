class ShoppingList {
  constructor (scene, controls) {
    this.scene = scene
    this.controls = controls

    this.createUI()

    this.data = {
      curIdx: 0
    }
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
    const { controls: { cursors, action, cancel } } = this

    if (this.showing && this.toShow) {
      if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        this.data.curIdx = Math.max(0, this.data.curIdx++)
      } else if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        this.data.curIdx = Math.max(0, this.data.curIdx--)
      } else if (action.isDown && !this._pressedAction) {
        // buy
        this.scene.buyItem()
        this.hide()
      } else if (Phaser.Input.Keyboard.JustDown(cancel)) {
        this.hide()
      }
    }

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
      ...this.makeRow(
        tileBounds,
        'Nutrient Paste Dispenser',
        'Turns biomaterial into food'
      ),
      ...this.makeRow(
        tileBounds,
        'Workbench',
        'Allows humans to craft/research',
        1
      )
    ])

    container.y = 600

    this.tileBounds = tileBounds
    this.cursor = cursor
    this.container = container
  }

  makeRow (tileBounds, title, desc, i = 0) {
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
        title,
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
