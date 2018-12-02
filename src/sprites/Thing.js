
export default class Thing extends Phaser.GameObjects.Sprite {
  constructor ({ scene }) {
    super(scene, 0, 0, 'thing')

    this.setScale(6)

    const container = scene.add.container(400, -140)
    container.add(this)
    container.setDepth(scene.depths.thing)
    this.shadow = this.scene.add.sprite(400, 300, 'shadow')
    this.shadow.setScale(8)
    this.shadow.setDepth(scene.depths.thingShadow)
    this.container = container

    this.msg = new Msg(this.scene, 0, 0)
    this.scene.add.existing(this.msg)

    this.scene.tweens.add({
      targets: container,
      props: {
        y: {
          value: "-=10",
          duration: 250,
        },
      },
      loop: -1,
      repeat: true,
      yoyo: true,
      ease: 'Sine.easeInOut'
    })
  }

  update () {
    this.shadow.setScale(
      10 * ((-this.container.y-10) / -120)
      - (3 * (this.y / 240))
    )
  }

  comeDown () {
    this.msg.show()
    this.scene.tweens.add({
      targets: this,
      y: 240,
      duration: 200,
      ease: 'Bounce.easeOut',
      onComplete: () => {
        this.comeUp()
      }
    })
  }

  comeUp () {
    this.scene.tweens.add({
      targets: this,
      y: 0,
      delay: 500,
      duration: 200,
      ease: 'Bounce.easeOut'
    })
  }
}

class Msg extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, 0, 0)

    this.msg = scene.add.text(
      400,
      200,
      'Satiated!',
      { font: '80px Kremlin', fill: 'white', stroke: '#000', strokeThickness: 10 }
    )
    this.msg.x = 400 - this.msg.width / 2

    this.setDepth(this.scene.depths.ui)

    this.add(this.msg)
    this.alpha = 0
  }

  show () {
    this.scene.tweens.add({
      targets: this,
      props: {
        alpha: 1
      },
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: this.hide,
      onCompleteScope: this
    })
  }

  hide () {
    this.scene.tweens.add({
      targets: this,
      props: {
        alpha: 0
      },
      delay: 1000,
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: this.hide,
      onCompleteScope: this
    })
  }
}
