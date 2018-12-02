import ShoppingList from 'ui/ShoppingList'

class GameUI {
  create (scene, controls) {
    this.scene = scene
    const { width, height } = this.scene.sys.canvas

    const dlg = scene.add.nineslice(
      width - 160, height - 110,
      160, 240,
      'tile',
      18,
    )
    this.food = scene.add.text(
      width - 140,
      height - 90,
      '',
      { font: '20px Kremlin', fill: 'white' }
    )
    this.foodNeeded = scene.add.text(
      width - 140,
      height - 60,
      '',
      { font: '20px Kremlin', fill: 'white' }
    )

    this.currTime = this.scene.getCurrentProgression().time + 1
    this.timer = scene.add.text(
      width - 140,
      height - 30,
      '',
      { font: '20px Kremlin', fill: 'white' }
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
      paste_dispenser: scene.physics.add.group([
        {
          key: 'paste_dispenser',
          repeat: 0,
          setXY: { x: 520, y: 130, stepX: 120 }
        },
        {
          key: 'paste_dispenser',
          repeat: 1,
          setXY: { x: 400, y: 210, stepX: 120 }
        },
        {
          key: 'paste_dispenser',
          repeat: 1,
          setXY: { x: 400, y: 210 + 80, stepX: 120 }
        }
      ]),
      radar: scene.physics.add.group({ key: 'radar', repeat: 2, setXY: { x: 280, y: 380, stepX: 80 } }),
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

    if (
      this.scene.data.progression.currNeedIdx === 0
      && this.scene.data.food === 0
      && this.currTime <= 30
    ) {
      this.scene.tutorial.forceStart(
        'sacrifice',
        [
          'You have no food! Sacrifices must be made! Turn Humans',
          'To Food Paste through the dispenser on the top center!'
        ]
      )
    }

    this.updateFoodColor()
    if (this.currTime <= 0) {
      this.scene.demandSacrifice()

      const level = this.scene.getCurrentProgression()
      this.currTime = level.time
      this.setFood(this.scene.data.food)
    }
  }

  update () {
    this.shoppingList.update()
    this.updateFoodColor()
  }

  updateFoodColor () {
    const need = this.scene.getCurrentProgression().food
    if (this.scene.data.food < need && this.currTime <= 30) {
      this.food.setTint(0xff0000)
    } else if (this.scene.data.food >= need) {
      this.food.setTint(0x00ff00)
    } else {
      this.food.setTint(0xffffff)
    }
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
    this.food.setText(`Food: ${num}`)
    this.foodNeeded.setText(`NEED: ${this.scene.getCurrentProgression().food}`)
  }

  addFloatText (x, y, message) {
    const text = this.scene.add.text(
      x,
      y,
      message,
      { font: '12px Kremlin', fill: 'white' }
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

  updateShoppingList () {
    this.shoppingList.updateCosts()
  }
}

export default GameUI
