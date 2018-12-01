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
