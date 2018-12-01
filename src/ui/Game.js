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
    }
    this.spots.paste_dispenser.getChildren().map(c => c.setDepth(-1))

    this.spots.all = scene.physics.add.group()
      .addMultiple(this.spots.paste_dispenser.getChildren())
  }

  update () {
    this.shoppingList.update()
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
