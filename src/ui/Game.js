import ShoppingList from 'ui/ShoppingList'
class GameUI {
  create (scene, controls) {
    this.scene = scene
    const { width, height } = this.scene.sys.canvas

    this.food = scene.add.text(
      width - 140,
      height - 60,
      '',
      { font: '20px Arial', fill: 'white' }
    )

    this.currTime = this.scene.getCurrentProgression().time + 1
    this.timer = scene.add.text(
      width - 140,
      height - 30,
      '',
      { font: '20px Arial', fill: 'white' }
    )
    this.timedEvent = scene.time.addEvent({
      delay: 1000,
      callback: this.onLoop,
      callbackScope: this,
      loop: true
    })

    // set food
    this.setFood(0)
    // set time
    this.onLoop()

    this.shoppingList = new ShoppingList(scene, controls)

    this.spots = {
      paste_dispenser: scene.physics.add.group({ key: 'paste_dispenser', repeat: 5, setXY: { x: 600, y: 130, stepY: 80 } }),
      radar: scene.physics.add.group({ key: 'radar', repeat: 2, setXY: { x: 280, y: 450, stepX: 80 } }),
      hunt: scene.physics.add.group({ key: 'hunt', repeat: 2, setXY: { x: 200, y: 50, stepX: 100 } }),
      table: scene.physics.add.group({ key: 'table', repeat: 2, setXY: { x: 100, y: 400, stepY: -50 } }),
    }

    this.spots.all = scene.physics.add.group()
      .addMultiple(this.spots.paste_dispenser.getChildren())
      .addMultiple(this.spots.radar.getChildren())
      .addMultiple(this.spots.hunt.getChildren())
      .addMultiple(this.spots.table.getChildren())

    this.spots.all.getChildren().map(c => {
      c.tint = 0x888888
      c.setVisible(false)
      c.setDepth(-1)
    })
  }

  onLoop () {
    this.currTime--

    var date = new Date(null);
    date.setSeconds(this.currTime)
    const result = date.toISOString().substr(14, 5)
    this.timer.setText(`Time: ${result}`)

    if (this.currTime <= 0) {
      this.scene.demandSacrifice()

      const level = this.scene.getCurrentProgression()
      this.currTime = level.time
      this.setFood(this.scene.data.food)
    }
  }

  update () {
    this.shoppingList.update()
  }

  showSpots (key) {
    this.spots[key].getChildren().map(
      c => { if (!c.taken) c.setVisible(true) }
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

  setFood(num) {
    this.food.setText(`Food: ${num}/${this.scene.getCurrentProgression().food}`)
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

  get shoppingListShown () {
    return this.shoppingList.toShow || this.shoppingList.showing
  }
}

export default GameUI
