class GameUI {
  create (scene) {
    this.scene = scene
    const { width, height } = this.scene.sys.canvas

    this.science = scene.add.text(
      10,
      height - 30,
      'Science: 0',
      { font: '20px Arial', fill: 'white' }
    )

    this.food = scene.add.text(
      width - 100,
      height - 30,
      'Food: 0',
      { font: '20px Arial', fill: 'white' }
    )

    this.shoppingList = this.createShoppingList()
    this.shoppingList.y = 600
  }

  update (key, num) {
    this[key].setText(`${key}: ${num}`)
  }

  addFloatText (x, y, message) {
    const text = this.scene.add.text(
      x,
      y,
      message,
      { font: '12px Arial', fill: 'white' }
    )

    this.scene.tweens.add({
      targets: text,
      y: y - 20,
      onComplete: text.destroy,
      onCompleteScope: text
    })
  }

  createShoppingList () {
    const { scene } = this
    const container = scene.add.container(200, 50)
    const dlg = scene.add.nineslice(
      0, 0,
      340, 240,
      'tile',
      18,
    )

    const tile = scene.add.nineslice(32, 18, 48, 48, 'tile', 18)
    tile.setOrigin(0)
    const tileBounds = tile.getBounds()

    container.add([
      dlg,
      tile,
      scene.add.text(
        tileBounds.x + tileBounds.width + 4,
        tileBounds.y + 4,
        'Nutrient Paste Dispenser',
        { font: '18px Arial', fill: 'white' }
      ),
      scene.add.text(
        tileBounds.x + tileBounds.width + 4,
        tileBounds.y + tileBounds.height / 2 + 4,
        'Turns biomaterial into food',
        { font: '14px Arial', fill: 'white' }
      )
    ])

    return container
  }
}

export default GameUI
