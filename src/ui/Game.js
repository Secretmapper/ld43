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

    const tile = scene.add.sprite(
      300,
      100,
      'tile'
    )
    scene.add.text(
      tile.x + tile.width / 2 + 8,
      tile.y - tile.height / 2 + 4,
      'Nutrient Paste Dispenser',
      { font: '18px Arial', fill: 'white' }
    )

    scene.add.text(
      tile.x + tile.width / 2 + 8,
      tile.y + 4,
      'Turns biomaterial into food',
      { font: '14px Arial', fill: 'white' }
    )
  }

  update (key, num) {
    this[key].setText(`${key}: ${num}`)
  }

  createShoppingList () {
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
}

export default GameUI
