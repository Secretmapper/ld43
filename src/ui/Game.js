import ShoppingList from 'ui/ShoppingList'
class GameUI {
  create (scene, controls) {
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

    this.shoppingList = new ShoppingList(scene, controls)

    this.spots = {
      paste_dispenser: scene.physics.add.group({ key: 'paste_dispenser', repeat: 5, setXY: { x: 600, y: 50, stepY: 80 } }),
      radar: scene.physics.add.group({ key: 'radar', repeat: 3, setXY: { x: 300, y: 550, stepX: 80 } }),
      hunt: scene.physics.add.group({ key: 'hunt', repeat: 3, setXY: { x: 100, y: 50, stepX: 100 } }),
      table: scene.physics.add.group({ key: 'table', repeat: 3, setXY: { x: 100, y: 400, stepY: 50 } }),
    }

    this.spots.all = scene.physics.add.group()
      .addMultiple(this.spots.paste_dispenser.getChildren())
      .addMultiple(this.spots.radar.getChildren())
      .addMultiple(this.spots.hunt.getChildren())
      .addMultiple(this.spots.table.getChildren())

    this.spots.all.getChildren().map(c => {
      c.setVisible(false)
      c.setDepth(-1)
    })
  }

  update () {
    this.shoppingList.update()
  }

  showSpots (key) {
    this.spots[key].getChildren().map(
      c => c.setVisible(true)
    )
  }

  hideSpots (key) {
    this.spots[key].getChildren().map(
      c => c.setVisible(false)
    )
  }

  setText(key, num) {
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

  showShoppingList () {
    this.shoppingList.show()
  }
}

export default GameUI
