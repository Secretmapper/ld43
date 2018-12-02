class Tip {
  constructor (scene, key, msg) {
    const container = scene.add.container(180, 550)
    const slice = scene.add.nineslice(
      0, 0,
      400, 60,
      'tile',
      18,
    )
    const txt = scene.add.text(
      18, 16,
      msg.toUpperCase
        ? msg.toUpperCase()
        : msg.map(m => m.toUpperCase())
      ,
      { font: '12px Kremlin', fill: 'white' }
    )

    container.add(slice)
    container.add(txt)
    container.setDepth(scene.depths.ui)

    this.scene = scene
    this.key = key
    this.txt = txt
    this.slice = slice
    this.container = container

    this.scene.tweens.add({
      targets: this.container,
      y: 430,
      delay: 300,
      duration: 200,
      ease: 'Sine.easeOut'
    })
  }

  close (cb) {
    this.scene.tweens.add({
      targets: this.container,
      y: 550,
      duration: 1000,
      ease: 'Sine.easeOut',
      onComplete: cb
    })
  }
}

export default class Tutorial {
  constructor (scene) {
    this.scene = scene
    this.done = {}
  }

  update () {
  }

  forceStart (key, msg) {
    if (!this.done[key]) {
      if (this.tip) {
        this.tip.close()
      }
      this.done[key] = true
      this.key = key
      this.tip = new Tip(this.scene, key, msg)
    }
  }

  tryToStart (key, msg, seconds = null) {
    if (!this.tip && !this.done[key]) {
      this.done[key] = true
      this.key = key
      this.tip = new Tip(this.scene, key, msg)

      if (seconds) {
        this.scene.time.delayedCall(seconds, this.selfRemove, [this.tip, key], this)
      }
    }
  }

  selfRemove (tip, key) {
    tip.close()
    this.cb(key)
  }

  complete (key, cb) {
    this.done[key] = true
    if (this.tip && this.tip.key === key) {
      this.tip.close(cb)
      this.cb(key)
    }
  }

  cb (key) {
    this.tip = null
    if (key === 'controls') {
      this.tryToStart(
        'controls2',
        [
          'Go near someone and use the space key',
          'to make them follow you'
        ]
      )
    } else if (key === 'controls2') {
      this.tryToStart(
        'controlsWorkbench',
        ['Use the Z key to assign followers to a building.',
          'Assign someone to the workbench on the left']
      )
    } else if (key === 'controlsWorkbench') {
      this.tryToStart(
        'controlsShop',
        ['Assign a task to the workbench by pressing Z',
          'and build an item with SPACE']
      )
    } else if (key === 'controlsShop') {
      this.tryToStart(
        'radar',
        ['Assign someone to the radar tower',
          'This will help find people to join you']
      )
    }
  }
}
